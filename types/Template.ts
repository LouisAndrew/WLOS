import { DocumentReference } from '@lib/API/firebase'
import { ExerciseDBSchema } from './Exercise'
import { UserDBSChema } from './User'

/**
 * type of the template
 * @value 0 for workout template
 * @value 1 for warmup template
 */
export type TemplateType = 0 | 1

type TemplateBase = {
  /**
   * type of the template
   * @value 0 for workout template
   * @value 1 for warmup template
   */
  type: TemplateType
  /**
   * tag ids of the template
   * ! WIP
   */
  tags: string[] // todo
  /**
   * name of the template
   */
  name: string
  /**
   * color code of the template.
   * TODO: decide if this should be editable
   */
  color: string
  createdBy: any
  exercises: any
}

export type TemplateDBSchema = TemplateBase & {
  templateId: string
  /**
   * reference to user
   */
  createdBy: DocumentReference<UserDBSChema>
  /**
   * DB schema for exercises
   */
  exercises: DocumentReference<ExerciseDBSchema>[]
}

export type Template = TemplateBase & {
  /**
   * id of the user who created the template
   */
  createdBy: string
  /**
   * exercises type that has been converted
   */
  exercises: TemplateExercise[]
}

export type TemplateExercise = {
  /**
   * data of the exercise
   * @see ExerciseTable
   */
  exerciseData: { name: string; exerciseId: string }
  /**
   * nums of sets of the exercise in `Range` type
   * @see Range
   */
  sets: string
  /**
   * nums of reps of the exercise in `Range` type
   * @see Range
   */
  reps: string
  /**
   * order of the exercise within the template
   */
  order: number
}
