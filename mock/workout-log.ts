import { convertExerciseTableToModel } from '@lib/exercise-helper'
import { ExerciseModelWithId } from '@t/Exercise'
import { WorkoutLog } from '@t/WorkoutLog'
import { mockExerciseSet } from './exercise-set'
import { defaultTemplateTableWithData, filledTemplateTableWithData } from './workout-template'

const mockDate = new Date(Date.parse('10-10-2000'))

export const defaultWorkoutLog: WorkoutLog = {
  templateId: defaultTemplateTableWithData.id.toString(),
  date: mockDate,
  entries: [],
}

export const filledWorkoutLog: WorkoutLog = {
  templateId: filledTemplateTableWithData.id.toString(),
  date: mockDate,
  entries: [
    {
      exercise: convertExerciseTableToModel(filledTemplateTableWithData.exercises[0]),
      sets: [mockExerciseSet],
    },
    {
      exercise: convertExerciseTableToModel(filledTemplateTableWithData.exercises[1]),
      sets: [mockExerciseSet, { ...mockExerciseSet, setNumber: 2 }],
    },
  ],
}
