import { ExerciseModel, ExerciseModelWithId } from '@t/Exercise'
import { ExerciseTable } from '@t/tables/Exercise'

export const mockModel: ExerciseModel = {
  name: 'PUSH UP',
  sets: {
    start: 3,
    end: 4,
  },
  reps: {
    start: 12,
  },
}

export const mockModelWithId: ExerciseModelWithId = {
  ...mockModel,
  exerciseId: '0',
}

export const mockExerciseTable: ExerciseTable = {
  name: mockModel.name,
  tags: [],
  created_by: 1,
  id: 0,
}

export const mockExerciseTable2: ExerciseTable = {
  name: 'PULL UP',
  tags: [],
  created_by: 0,
  id: 1,
}
