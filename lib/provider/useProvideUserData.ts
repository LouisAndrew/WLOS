import { mockUserData } from '@/mock/mock-user-data'
import { Band } from '@t/Band'
import { ExerciseTable } from '@t/tables/Exercise'
import { SavedLogsTable } from '@t/tables/Log'
import { TemplateTable } from '@t/tables/Template'
import { UserData } from '@t/UserData'

export type UD = {
  getFullData: () => UserData
  getSavedTemplates: () => TemplateTable[]
  getSavedLogs: () => SavedLogsTable[]
  getSavedExercises: () => ExerciseTable[]
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
