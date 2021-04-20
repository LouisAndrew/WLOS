import { UserDataTable } from './UserData'
import { Table } from './Table'

export type ExerciseTable = Table & {
  /**
   * name of the exercise
   */
  name: string
  /**
   * tag ids of the exercise
   */
  tags: number[]
  /**
   * id of the exercise-creator or his/her user-data-table
   */
  created_by: number | UserDataTable
}

export type SavedExercisesTable = Table & {
  id: number
  /**
   * id of the user who's saving the exercise / his/her user-data table
   */
  user_id: number | UserDataTable
  /**
   * id of the saved exercise or its table data
   */
  exercise_id: number | ExerciseTable
}
