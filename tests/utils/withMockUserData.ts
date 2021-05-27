import { UD, defaultUD } from '@lib/provider/useProvideUserData'
const useUserData = jest.spyOn(require('@h/useUserData'), 'useUserData')

type OptionalUD = Partial<UD>

export const withMockUserData = ({
  getFullData = defaultUD.getFullData,
  getSavedTemplates = defaultUD.getSavedTemplates,
  getSavedLogs = defaultUD.getSavedLogs,
  getSavedExercises = defaultUD.getSavedExercises,
  getUserBands = defaultUD.getUserBands,
}: OptionalUD) => {
  const implementationData = {
    getFullData,
    getSavedTemplates,
    getSavedLogs,
    getSavedExercises,
    getUserBands,
  }

  useUserData.mockImplementationOnce(() => implementationData)
  return implementationData
}
