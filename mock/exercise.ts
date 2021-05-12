import { ExerciseModel, ExerciseModelWithId } from '@t/Exercise'

export const mockModel: ExerciseModel = {
  name: 'Push up',
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
