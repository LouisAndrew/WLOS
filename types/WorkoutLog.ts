import { ExerciseSet } from './ExerciseSet'
import { TemplateExerciseTable } from './tables/Template'

export type LogEntry = {
  /**
   * Data of the exercise (model) of the log entry.
   */
  exercise: TemplateExerciseTable
  /**
   * Actual exercise sets that are inputted.
   */
  sets: ExerciseSet[]
}

export type WorkoutLog = {
  /**
   * Id of the template for the workout.
   */
  templateId: number
  /**
   * Timestamp of when the workout log is created.
   */
  date: Date
  /**
   * Entries for the current workout log.
   * ! empty on default (when e.g. the workout log is just being created)
   */
  entries: LogEntry[]
}