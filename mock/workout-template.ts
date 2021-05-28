import { TemplateTableWithData } from '@t/tables/Template'
import { colorCodes } from '@c/color-picker'
import { mockExerciseTable, mockExerciseTable2 } from './exercise'
import { mockExerciseSetWithoutReview } from './exercise-set'

export const defaultTemplateTableWithData: TemplateTableWithData = {
  id: -1,
  type: 0,
  created_by: -1,
  name: '',
  color: colorCodes.black,
  exercises: [],
}

export const filledTemplateTableWithData: TemplateTableWithData = {
  id: 12,
  type: 0,
  created_by: -1,
  name: 'PRESET WORKOUT',
  color: colorCodes.red,
  exercises: [
    {
      exerciseData: mockExerciseTable,
      sets: '3-4',
      reps: '12',
      order: 1,
    },
    {
      exerciseData: mockExerciseTable2,
      sets: '2-3',
      reps: '19',
      order: 0,
    },
  ],
}
