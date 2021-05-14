import { Metric } from './Metric'
import { Review } from './Review'

export type ExerciseSet = {
  /**
   * Set's count number
   */
  setNumber: number
  /**
   * value for the rep count
   */
  repsCount: number
  /**
   * value of weight used during the set
   */
  weightValue: number
  /**
   * metrics of the weight value
   */
  weightMetric: Metric
  /**
   * review of the set
   */
  review?: Review
}
