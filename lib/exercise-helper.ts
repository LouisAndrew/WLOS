import { ExerciseModelWithId } from '@t/Exercise'
import { TemplateExerciseTable } from '@t/tables/Template'
import { stringToRange } from './range-helper'

export const convertExerciseTableToModel = (
  exercise: TemplateExerciseTable
): ExerciseModelWithId => {
  const {
    reps,
    sets,
    exerciseData: { name, id },
  } = exercise
  const repsRange = stringToRange(reps)
  const setsRange = stringToRange(sets)

  return {
    name,
    reps: repsRange,
    sets: setsRange,
    exerciseId: id.toString(),
  }
}
