import { mockUserData } from '@/mock/mock-user-data'
import { defaultWorkoutLog, filledWorkoutLog } from '@/mock/workout-log'
import { Band } from '@t/Band'
import { ExerciseTable } from '@t/tables/Exercise'
import { SavedLogsTable } from '@t/tables/Log'
import { TemplateTable } from '@t/tables/Template'
import { UserData } from '@t/UserData'
import { WorkoutLog } from '@t/WorkoutLog'

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
  getSavedLogs: () => WorkoutLog[]
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
  getSavedLogs: () => [
    defaultWorkoutLog,
    filledWorkoutLog,
    { ...defaultWorkoutLog, date: new Date(Date.parse('12-21-2021')), templateId: 12 },
    { ...filledWorkoutLog, date: new Date(Date.parse('12-15-2021')), templateId: 12 },
  ],
  getSavedExercises: () => mockUserData.savedExercises,
  getUserBands: () => mockUserData.settings.bands,
}

export const useProvideUserData = () => defaultUD
export const useMockUserData = () => defaultUD
