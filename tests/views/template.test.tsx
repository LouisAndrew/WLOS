import { defaultTemplateTableWithData, filledTemplateTableWithData } from '@/mock/workout-template'
import { colorCodes } from '@c/color-picker'
import { render, cleanup, fireEvent } from '@testing-library/react'
import { changeEvent } from '@tests/utils/changeEvent'
import Template, { PageState, Props } from '@v/template/template'

afterEach(cleanup)

const component = (args: Partial<Props> = {}) =>
  render(
    <Template defaultState={PageState.EDIT} template={defaultTemplateTableWithData} {...args} />
  )

describe('Template page', () => {
  it('renders the component', () => {
    expect(component().getByTestId('template-wrapper')).toBeInTheDocument()
  })

  it('matches the snapshot', () => {
    expect(component()).toMatchSnapshot()
  })

  it('renders the color picker and change the template color based on the color user picks', () => {
    const { getByText: txt, getByTestId: tid, getByLabelText: l } = component({})
    fireEvent.click(txt('CHANGE COLOR'))
    expect(tid('color-picker-wrapper')).toBeInTheDocument()

    const value = colorCodes.indigo
    fireEvent.click(l(value))
    expect(l('Template Color')).toHaveStyle(`background-color: ${value}`)
  })

  it('renders the save button if any changes is made on the component', () => {
    const { getAllByLabelText: altxt, getByTestId: t, queryByTestId: qt } = component({
      template: filledTemplateTableWithData,
    })
    const exerciseNameInputs = altxt('Exercise Name')
    expect(qt('save-btn')).not.toBeInTheDocument() // should not be displayed at first

    fireEvent.change(exerciseNameInputs[0], changeEvent('Random name'))

    expect(t('save-btn')).toBeInTheDocument()
  })

  it('allows user to change the page state', () => {
    const { queryAllByTestId: qat, getByTestId: t } = component()
    fireEvent.click(t('change-state-btn'))
    expect(qat('state-btn').length).toBe(Object.keys(PageState).length - 2) // minus current state and "creating" state
  })

  it('displays a modal when any changes are not saved', () => {
    const {
      getAllByLabelText: altxt,
      getByTestId: t,
      queryAllByTestId: qat,
      queryByTestId: qt,
    } = component({
      template: filledTemplateTableWithData,
    })
    const exerciseNameInputs = altxt('Exercise Name')
    fireEvent.change(exerciseNameInputs[0], changeEvent('Random name'))

    fireEvent.click(t('change-state-btn'))
    fireEvent.click(qat('state-btn')[0])

    expect(qt('modal-wrapper')).toBeInTheDocument()
  })

  it('discard the changes if discard button on modal is clicked', () => {
    const {
      getAllByLabelText: altxt,
      getByTestId: t,
      queryAllByTestId: qat,
      queryByText: qtxt,
    } = component({
      template: filledTemplateTableWithData,
    })
    const exerciseNameInputs = altxt('Exercise Name')
    fireEvent.change(exerciseNameInputs[0], changeEvent('Random name'))

    fireEvent.click(t('change-state-btn'))
    fireEvent.click(qat('state-btn')[0])

    fireEvent.click(qtxt('Discard Changes'))
    filledTemplateTableWithData.exercises.forEach((e) => {
      // expect(t('exercise-list-wrapper').textContent).toContain(e.exerciseData.name)
      expect(
        altxt('Exercise Name').findIndex((el) => {
          return (el as HTMLInputElement).value === e.exerciseData.name
        })
      ).not.toBe(-1)
    })
  })

  it('saves the changes if save button on modal is clicked', () => {
    const handleSave = jest.fn()

    const {
      getAllByLabelText: altxt,
      getByTestId: t,
      queryAllByTestId: qat,
      queryByText: qtxt,
    } = component({
      template: filledTemplateTableWithData,
      handleSave,
    })
    const exerciseNameInputs = altxt('Exercise Name')
    const newVal = 'Random name'
    const oldVal = (exerciseNameInputs[0] as HTMLInputElement).value

    fireEvent.change(exerciseNameInputs[0], changeEvent(newVal))

    fireEvent.click(t('change-state-btn'))
    fireEvent.click(qat('state-btn')[0])

    fireEvent.click(qtxt('Save Changes'))

    const { exercises, ...rest } = filledTemplateTableWithData

    const changedIndex = exercises.findIndex((e) => e.exerciseData.name === oldVal)

    expect(handleSave).toBeCalled()
    expect(handleSave).toBeCalledWith(
      {
        ...rest,
        exercises: exercises
          .map((e) => {
            const {
              exerciseData: { created_by, ...exerciseData },
              ...rest
            } = e

            return {
              ...rest,
              exerciseData,
            }
          })
          .map((e, i) => {
            if (i !== changedIndex) {
              return e
            }

            const { exerciseData, ...rest } = e

            return {
              ...rest,
              exerciseData: {
                ...exerciseData,
                name: newVal.toUpperCase(),
                id: -1,
              },
            }
          }),
      },
      true
    )
  })

  it('renders a modal if delete button is clicked', () => {
    const { getByLabelText: l, getByTestId: t } = component()
    fireEvent.click(t('change-state-btn'))
    fireEvent.click(l('delete template'))

    expect(t('modal-wrapper')).toBeInTheDocument()
  })

  it('calls the provided handler function when delete button is clicked', () => {
    const handleDelete = jest.fn()
    const { getByLabelText: l, getByTestId: t, getByText: txt } = component({ handleDelete })
    fireEvent.click(t('change-state-btn'))
    fireEvent.click(l('delete template'))
    fireEvent.click(txt('Delete'))

    expect(handleDelete).toBeCalled()
    expect(handleDelete).toBeCalledWith(defaultTemplateTableWithData.id)
  })

  describe('Default creating behavior.', () => {
    const create = (args: Partial<Props> = {}) =>
      component({ defaultState: PageState.CREATE, ...args })

    it('renders the name input with an empty value and exercise list with empty children', () => {
      const { getByLabelText: l, queryAllByTestId: qat } = create()
      expect((l('TEMPLATE NAME') as HTMLInputElement).value).toBe('')
      expect(qat('exercise-list-item-wrapper').length).toBe(1) // just render the add button.
    })

    it('should disallow user to change the page state', () => {
      const { queryAllByTestId: qat, getByTestId: t } = create()
      fireEvent.click(t('change-state-btn'))
      expect(qat('state-btn').length).toBe(0)
    })
  })

  describe('View state', () => {
    it('hides the color picker', () => {
      const { queryByText: qtxt } = component({ defaultState: PageState.VIEW })
      expect(qtxt('CHANGE COLOR')).not.toBeInTheDocument()
    })
  })
})
