import { render, cleanup } from '@testing-library/react'
import LogList, { Props } from '@c/list/log-list/log-list'
import { defaultTemplateTableWithData, filledTemplateTableWithData } from '@/mock/workout-template'
import { defaultWorkoutLog, filledWorkoutLog } from '@/mock/workout-log'
import { getInputValue } from '@tests/utils/changeEvent'
import { convertExerciseTableToModel } from '@lib/exercise-helper'
import { defaultRange } from '@t/Range'
import { ExerciseModelWithId } from '@t/Exercise'

afterEach(cleanup)

// ! component is first rendered with empty template and empty workout log.
const component = (args: Partial<Props> = {}) =>
  render(
    <LogList
      template={defaultTemplateTableWithData}
      workoutLog={defaultWorkoutLog}
      isEditable={true}
      {...args}
    />
  )

describe('Log list component', () => {
  it('renders the component', () => {
    expect(component().getByTestId('log-list-wrapper')).toBeInTheDocument()
  })

  it('renders all of the exercises from from the template if the workout log entries are empty', () => {
    const value = filledTemplateTableWithData
    const { getAllByLabelText: al } = component({ template: value })

    const exerciseInputs = al('Exercise Name')
    exerciseInputs.forEach((el) => {
      expect(
        value.exercises.map((e) => e.exerciseData.name).indexOf(getInputValue(el)) > -1
      ).toBeTruthy()
    })
  })

  it('renders all of the exercises from log entry if it is not empty even though the exercises are not in the template', () => {
    const value = filledWorkoutLog
    const { getAllByLabelText: al } = component({ workoutLog: filledWorkoutLog })

    const exerciseInputs = al('Exercise Name')
    exerciseInputs.forEach((el) => {
      expect(value.entries.map((e) => e.exercise.name).indexOf(getInputValue(el)) > -1).toBeTruthy()
    })
  })

  it('should not allow user to edit the exercise input if it is in the template', () => {
    const value = filledTemplateTableWithData
    const { getAllByLabelText: al } = component({ template: value })

    const exerciseInputs = al('Exercise Name')

    exerciseInputs.forEach((el) => {
      expect(el.getAttribute('data-iseditable') === 'false').toBeTruthy()
    })
  })

  it('should allow user to edit the exercise input that is not in the template', () => {
    const additionalExercise: ExerciseModelWithId = {
      name: 'Test',
      sets: defaultRange,
      reps: defaultRange,
      exerciseId: '12',
    }

    const exercises = filledTemplateTableWithData.exercises
    const workoutLog = {
      ...defaultWorkoutLog,
      entries: [
        ...exercises.map((e) => ({ exercise: convertExerciseTableToModel(e), sets: [] })),
        { exercise: additionalExercise, sets: [] },
      ],
    }

    const { getAllByLabelText: al } = component({
      template: filledTemplateTableWithData,
      workoutLog,
    })

    const exerciseInputs = al('Exercise Name')
    const additionalExerciseInput = exerciseInputs.filter(
      (el) => getInputValue(el) === additionalExercise.name
    )[0]

    expect(additionalExerciseInput.getAttribute('data-iseditable') === 'true').toBeTruthy()
  })
})
