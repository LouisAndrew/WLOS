import { ExerciseSet } from '@t/ExerciseSet'
import { Metric } from '@t/Metric'
import { Review } from '@t/Review'

const mockExerciseSet: ExerciseSet = {
  setNumber: 1,
  repsCount: 12,
  weightValue: 20,
  weightMetric: Metric.KG,
  review: Review.UP,
}

const mockExerciseSetWithoutReview: ExerciseSet = {
  ...mockExerciseSet,
  review: undefined,
}

export { mockExerciseSet, mockExerciseSetWithoutReview }
