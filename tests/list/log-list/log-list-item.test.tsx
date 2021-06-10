import { render, cleanup, fireEvent, Matcher, MatcherOptions } from '@testing-library/react'
import LogListItem, { Props } from '@c/list/log-list/log-list-item/log-list-item'
import { mockModelWithId } from '@/mock/exercise'
import { changeEvent, getInputValue } from '@tests/utils/changeEvent'
import { ExerciseSet } from '@t/ExerciseSet'
import { mockExerciseSet } from '@/mock/exercise-set'

afterEach(cleanup)
type Fn = (text: Matcher, options?: MatcherOptions, waitForElementOptions?: unknown) => HTMLElement
const component = (args: Partial<Props> = {}) =>
  render(
    <LogListItem
      exerciseModel={mockModelWithId}
      exerciseSets={[]}
      isLoggable
      isEditable
      {...args}
    />
  )

const inputSet = (l: Fn, value: ExerciseSet) => {
  const { repsCount, weightValue } = value
  fireEvent.change(l('REPS'), changeEvent(repsCount))
  fireEvent.change(l('WEIGHT'), changeEvent(weightValue))
}

describe('Log list item', () => {
  it('renders the component', () => {
    expect(component().getByTestId('log-list-item-wrapper')).toBeInTheDocument()
  })

  it('renders all of the necessary details about the exercise model', () => {
    const value = mockModelWithId
    const { getByLabelText: l } = component({ exerciseModel: value })
    expect(getInputValue(l('Exercise Name'))).toBe(value.name)
  })

  it('does not allow user to edit the exercise model', () => {
    const { getByLabelText: l } = component()
    const nameInput = l('Exercise Name')
    const changeValue = 'Test'
    fireEvent.change(nameInput, changeEvent(changeValue))
    expect(getInputValue(nameInput)).not.toBe(changeValue)
  })

  it('allows user to edit the exercise model when `isEditable` prop is set', () => {
    const { getByLabelText: l } = component({ isEditable: true })
    const nameInput = l('Exercise Name')
    const changeValue = 'Test'
    fireEvent.change(nameInput, changeEvent(changeValue))
    expect(getInputValue(nameInput)).toBe(changeValue.toUpperCase())
  })

  it('renders a button to add new set log', () => {
    const { getByTestId: t } = component()
    expect(t('add-set')).toBeInTheDocument()
  })

  it('adds a new set if the add new set button is clicked', () => {
    const { getByTestId: t, queryByTestId: qt } = component()
    expect(qt('set-input-wrapper')).not.toBeInTheDocument()

    fireEvent.click(t('add-set'))
    expect(qt('set-input-wrapper')).toBeInTheDocument()
  })

  it('applies changes when a new set is added', () => {
    const value = mockExerciseSet
    const { getByLabelText: l, getByTestId: t } = component()
    fireEvent.click(t('add-set'))
    inputSet(l, value)

    expect(t('set-number')).toHaveTextContent('#1')
    expect(getInputValue(l('REPS'))).toBe(value.repsCount.toString())
    expect(getInputValue(l('WEIGHT'))).toBe(value.weightValue.toString())
  })

  it('applies weight value of its ancestor when a second set is added on default', () => {
    const value = mockExerciseSet
    const {
      getAllByLabelText: al,
      getByLabelText: l,
      getByTestId: t,
      getAllByTestId: at,
    } = component()
    fireEvent.click(t('add-set'))

    inputSet(l, value)

    fireEvent.click(t('add-set'))
    expect(at('set-number')[1]).toHaveTextContent('#2')
    expect(getInputValue(al('REPS')[1])).toBe('')
    expect(getInputValue(al('WEIGHT')[1])).toBe(value.weightValue.toString())
  })
})
