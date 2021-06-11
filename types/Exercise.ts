import { Range } from '@t/Range'
import { DocumentReference } from '@lib/API/firebase'
import { UserDBSChema } from './User'

export type ExerciseName = string
export type ExerciseSets = Range
export type ExerciseReps = Range

export type ExerciseDBSchema = {
  name: string
  exerciseId: string
  tags: string[] // ! WIP
  /**
   * reference to user
   */
  createdBy?: DocumentReference<UserDBSChema> | string
}

/**
 * Substype of exercise used just for presentation purposes
 */
export type ExerciseModel = {
  /**
   * Name of the exercise.
   */
  name: ExerciseName
  /**
   * Number of sets specified for the exercise (in range)
   */
  sets: ExerciseSets
  /**
   * Number of reps specified for the exercise (in range)
   */
  reps: ExerciseReps
}

/**
 * Extended type of the exercise but with its id.
 * If the id is -1, it means that the exercise should be created.
 */
export type ExerciseModelWithId = ExerciseModel & {
  /**
   * Id of the exercise
   * @see /lib/api
   */
  exerciseId: string
}

export type Exercise = ExerciseModel & {
  /**
   * Order of the exercise within a template
   */
  order: number
}
