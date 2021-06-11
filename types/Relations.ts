import { DocumentReference } from '@lib/API/firebase'
import { Band } from './Band'
import { ExerciseDBSchema } from './Exercise'
import { TemplateDBSchema } from './Template'
import { WorkoutLogDBSChema } from './WorkoutLog'

export enum RelationCollectionNames {
  SAVED_EXERCISES = 'SavedExercises',
  SAVED_TEMPLATES = 'SavedTemplates',
  SAVED_LOGS = 'SavedLogs',
  USER_BANDS = 'UserBands',
}

export enum CollectionNames {
  USER = 'User',
  EXERCISE = 'Exercise',
  TEMPLATE = 'Template',
  WORKOUT_LOG = 'WorkoutLog',
}

export type SavedExercises = {
  exercises: {
    exerciseId: DocumentReference<ExerciseDBSchema>
    tags: string[] // todo
  }[]
}

export type SavedTemplates = {
  templates: {
    templateId: DocumentReference<TemplateDBSchema>
    tags: string[] // todo
  }[]
}

export type SavedLogs = {
  logs: DocumentReference<WorkoutLogDBSChema>[]
}

export type UserBands = {
  bands: Band[]
}
