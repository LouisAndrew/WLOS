import { filledWorkoutLog } from '@/mock/workout-log'
import { filledTemplateTableWithData } from '@/mock/workout-template'
import { PageState } from '@c/view-header/view-header'
import { render, cleanup } from '@testing-library/react'
import Log, { Props } from '@v/log/log'

// import * as uniqid from 'uniqid'
jest.mock('uniqid', () => () => 's')

afterEach(cleanup)

const component = (args: Partial<Props> = {}) =>
  render(
    <Log
      template={filledTemplateTableWithData}
      workoutLog={filledWorkoutLog}
      defaultState={PageState.EDIT}
      {...args}
    />
  )

describe('Log View', () => {
  it('render the component', () => {
    expect(component().getByTestId('log-wrapper')).toBeInTheDocument()
  })
  it('matches the snapshot', () => {
    expect(component()).toMatchSnapshot()
  })
  it('renders the view-header', () => {
    expect(component().getByTestId('view-header-wrapper')).toBeInTheDocument()
  })

  it('hides the change-color button', () => {
    expect(component().queryByTestId('change-color-button')).not.toBeInTheDocument()
  })

  it('disables the exercise-name-input', () => {
    expect(
      component().getByLabelText('TEMPLATE NAME').getAttribute('data-iseditable') === 'false'
    ).toBeTruthy()
  })

  it('renders a button to pick an exercise log', () => {
    expect(component().getByTestId('comparison-log')).toBeInTheDocument()
  })
})
