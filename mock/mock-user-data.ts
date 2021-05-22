import { colorCodes } from '@c/color-picker'
import { Metric } from '@t/Metric'
import { UserData } from '@t/UserData'
import { mockExerciseTable, mockExerciseTable2 } from './exercise'

export const mockUserData: UserData = {
  name: 'John Doe',
  uuid: '1234567',
  email: 'johndoe@gmail.com',
  settings: {
    bands: [
      {
        id: 1,
        weight: 10,
        metric: Metric.KG,
        color: colorCodes.yellow,
      },
      {
        id: 2,
        weight: 20,
        metric: Metric.KG,
        color: colorCodes.blue,
      },
      {
        id: 3,
        weight: 30,
        metric: Metric.KG,
        color: colorCodes.red,
      },
    ],
  },
  savedTemplates: [], // TODO: add saved templates
  savedLogs: [], // TODO: add saved logs
  savedExercises: [mockExerciseTable, mockExerciseTable2], // TODO: add saved exercises
}
