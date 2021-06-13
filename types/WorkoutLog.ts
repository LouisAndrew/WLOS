import { DocumentReference, FirestoreTimestamp } from '@lib/API/firebase'
import { ExerciseDBSchema, ExerciseModelWithId } from './Exercise'
import { ExerciseSet } from './ExerciseSet'

export type LogBase = {
  /**
   * Id of the template for the workout.
   */
  templateId: string
  /**
   * Timestamp of when the workout log is created.
   */
  date: any
}

export type WorkoutLogDBSChema = LogBase & {
  date: FirestoreTimestamp
  entries: {
    exercise: DocumentReference<ExerciseDBSchema>
    sets: ExerciseSet[]
  }[]
}

export type LogEntry = {
  /**
   * Data of the exercise (model) of the log entry.
   */
  exercise: ExerciseModelWithId
  /**
   * Actual exercise sets that are inputted.
   */
  sets: ExerciseSet[]
}

export type WorkoutLog = LogBase & {
  date: Date
  /**
   * Entries for the current workout log.
   * ! empty on default (when e.g. the workout log is just being created)
   */
  entries: LogEntry[]
}
