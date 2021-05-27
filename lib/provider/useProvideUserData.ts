import { mockUserData } from '@/mock/mock-user-data'
import { Band } from '@t/Band'
import { ExerciseTable } from '@t/tables/Exercise'
import { SavedLogsTable } from '@t/tables/Log'
import { TemplateTable } from '@t/tables/Template'
import { UserData } from '@t/UserData'

export type UD = {
  /**
   * Retrieve full data of the user.
   */
  getFullData: () => UserData
  /**
   * Retrieve list of user's saved templates.
   */
  getSavedTemplates: () => TemplateTable[]
  /**
   * Retrieve list of user's saved workout logs.
   */
  getSavedLogs: () => SavedLogsTable[]
  /**
   * Retrieve list of user's saved exercises (including preset exercises).
   */
  getSavedExercises: () => ExerciseTable[]
  /**
   * Retrieve list of user's created bands.
   */
  getUserBands: () => Band[]
}

export const defaultUD: UD = {
  getFullData: () => mockUserData,
  getSavedTemplates: () => mockUserData.savedTemplates,
  getSavedLogs: () => mockUserData.savedLogs,
  getSavedExercises: () => mockUserData.savedExercises,
  getUserBands: () => mockUserData.settings.bands,
}

export const useProvideUserData = () => defaultUD
export const useMockUserData = () => defaultUD
