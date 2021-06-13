import { colorCodes } from '@c/color-picker'
import { rangeToString } from '@lib/range-helper'
import { TemplateDBSchema, Template, TemplateExercise } from '@t/Template'
import { mockModel, mockModel2 } from './exercise'

export const defaultTemplate: Template = {
  name: '',
  type: 0,
  color: colorCodes.black,
  createdBy: '1',
  exercises: [] as TemplateExercise[],
  tags: [],
}

export const mockFilledTemplate: Template = {
  name: 'Preset Workout',
  type: 0,
  color: colorCodes.red,
  createdBy: '1',
  tags: [],
  exercises: [
    {
      exerciseData: {
        name: mockModel.name,
        exerciseId: '0',
      },
      sets: rangeToString(mockModel.reps),
      reps: rangeToString(mockModel.sets),
      order: 0,
    },
    {
      exerciseData: {
        name: mockModel2.name,
        exerciseId: '1',
      },
      sets: rangeToString(mockModel2.reps),
      reps: rangeToString(mockModel2.sets),
      order: 0,
    },
  ],
}
