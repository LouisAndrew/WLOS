import { Band } from './Band'
import { ExerciseTable } from './tables/Exercise'
import { SavedLogsTable } from './tables/Log'
import { TemplateTable } from './tables/Template'

export type UserData = {
  /**
   * name of the user
   */
  name: string
  /**
   * user id
   */
  uuid: string
  /**
   * user email
   */
  email: string
  /**
   * Settings of the user
   */
  settings: UserSettings
  /**
   * user saved templates
   */
  savedTemplates: TemplateTable[]
  /**
   * user saved logs
   */
  savedLogs: SavedLogsTable[]
  /**
   * user saved exercises
   */
  savedExercises: ExerciseTable[]
}

// TODO: Settings API.
// TODO: https://www.notion.so/Lyf-5e8f6d06a5be446db9888ec44b9a290a?p=9c220db5069a4827ae24012db9e3b717
export type UserSettings = {
  bands: Band[]
}
