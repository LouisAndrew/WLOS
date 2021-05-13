import { Metric } from '@t/Metric'
import { UserData } from '@t/UserData'

export const mockUserData: UserData = {
  name: 'John Doe',
  uuid: '1234567',
  email: 'johndoe@gmail.com',
  settings: {
    bands: [
      {
        id: 1,
        weight: 12,
        metric: Metric.KG,
      },
    ],
  },
  savedTemplates: [], // TODO: add saved templates
  savedLogs: [], // TODO: add saved logs
  savedExercises: [], // TODO: add saved exercises
}
