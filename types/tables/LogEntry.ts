import { ExerciseTable } from './Exercise'
import { LogTable } from './Log'
import { Table } from './Table'

export type LogEntryTable = Table & {
  /**
   * id of the exercise logged or its
   */
  id: number | ExerciseTable
  /**
   * stringified version of a LogEntry object
   * @see LogEntry
   */
  log: string
}

export type EntriesTable = Table & {
  /**
   * id of the exercise log / its data
   */
  log_id: number | LogTable
  /**
   * id of the entry / its data
   */
  entry_id: number | LogEntryTable
  /**
   * order of the log entry within an exercise log
   * ! Starts with 0
   */
  order: number
}

export type CompleteLogTable = LogTable & {
  entries: LogEntryTable[]
}
