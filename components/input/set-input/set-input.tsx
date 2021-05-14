import React, { FC, useEffect, useRef, useState } from 'react'
import { Metric } from '@t/Metric'
import { Review } from '@t/Review'
import { ExerciseSet } from '@t/ExerciseSet'

import styles from './set-input.module.css'
import { MetricInput } from './metric-input'
import { ReviewSelect } from './review-select'

export type Props = {
  /**
   * Ids for the input
   */
  inputIds: string
  /**
   * Number of the current set.
   */
  setNumber: number
  /**
   * Default value for the rep count.
   */
  defaultRepsCount?: number
  /**
   * Default value for the weight field.
   */
  defaultWeightValue?: number
  /**
   * Default value for the metric field.
   */
  defaultMetric?: Metric
  /**
   * Default value for the review field.
   */
  defaultReview?: Review
  /**
   * Sets if the fields are editable
   */
  isEditable?: boolean
  /**
   * additional styling with tailwind
   */
  className?: string
  /**
   * Function to be called if value is changed
   */
  onSetChange?: (set: ExerciseSet) => void
}

const SetInput: FC<Props> = ({
  setNumber,
  inputIds,
  defaultRepsCount,
  defaultWeightValue,
  defaultMetric,
  defaultReview,
  isEditable,
  onSetChange,
}) => {
  const [repsCount, setRepsCount] = useState(defaultRepsCount || -1)
  const [weightValue, setWeightValue] = useState(defaultWeightValue || -1)
  const [weightMetric, setWeightMetric] = useState(defaultMetric || Metric.KG)
  const [review, setReview] = useState<Review | undefined>(defaultReview)

  const shouldRenderReviewSelect = () => repsCount !== -1 && weightValue !== -1

  useEffect(() => {
    onSetChange?.({
      weightMetric,
      setNumber,
      repsCount,
      weightValue,
      review,
    })
  }, [repsCount, weightValue, weightMetric, review])

  return (
    <div data-testid="set-input-wrapper">
      <div className={styles['set-number-wrapper']}>
        SET
        <span className="ml-3" data-testid="set-number">
          #{setNumber}
        </span>
        {shouldRenderReviewSelect() && (
          <ReviewSelect
            defaultReview={review}
            isEditable={isEditable}
            onChange={(r) => setReview(r)}
          />
        )}
      </div>
      <div className={styles['input-wrapper']}>
        <label htmlFor={`${inputIds}-reps`}>
          REPS
          <input
            data-char-count={repsCount.toString().length}
            className={styles['input']}
            type="number"
            id={`${inputIds}-reps`}
            value={repsCount === -1 ? '' : repsCount}
            placeholder="##"
            onChange={(e) => {
              if (isEditable) {
                setRepsCount((prev) => {
                  if (e.target.value === '') {
                    return -1
                  }
                  const val = parseInt(e.target.value)
                  if (Number.isNaN(val) || val < 1) {
                    return prev
                  }

                  return val
                })
              }
            }}
          />
        </label>
        <label htmlFor={`${inputIds}-weight`} className="ml-4">
          WEIGHT
          <input
            data-char-count={weightValue.toString().length}
            type="number"
            className={styles['input']}
            id={`${inputIds}-weight`}
            value={weightValue === -1 ? '' : weightValue}
            placeholder="##"
            onChange={(e) => {
              if (isEditable) {
                setWeightValue((prev) => {
                  if (e.target.value === '') {
                    return -1
                  }

                  const val = parseFloat(e.target.value)
                  if (Number.isNaN(val) || val < 1) {
                    return prev
                  }

                  return val
                })
              }
            }}
          />
        </label>
        <MetricInput
          defaultMetric={weightMetric}
          onChange={(m) => setWeightMetric(m)}
          isEditable={isEditable}
        />
      </div>
    </div>
  )
}

export default SetInput
