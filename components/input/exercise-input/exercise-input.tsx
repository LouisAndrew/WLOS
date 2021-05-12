import React, { FC } from 'react'
import { RiCloseFill } from 'react-icons/ri'

import { ExerciseModel, ExerciseModelWithId } from '@t/Exercise'
import { RangedInput } from '../ranged-input'
import styles from './exercise-input.module.css'
import { mockModel } from '@/mock/exercise'

export type Props = {
  /**
   * Sets if the input should be editable.
   */
  isEditable?: boolean
  /**
   * Default value of the input
   */
  defaultExercise?: ExerciseModelWithId
  /**
   * Handler function to handle changes within the input
   */
  onChange?: (exercise: ExerciseModel) => void
  /**
   * Handler function to handle if the provided exercise from list should be removed
   * ! Could only be called IF the `defaultExercise` prop has an `id` other than -1
   */
  onRemoveListedExercise?: () => void
  /**
   * Handler function if `SavedExerciseList` should be displayed
   */
  onShowSavedList?: () => void
}

const ExerciseInput: FC<Props> = ({ onChange }) => {
  return (
    <div data-testid="exercise-input-wrapper" onBlur={() => onChange(mockModel)}>
      <input
        className={styles['name-input']}
        placeholder="Exercise Name"
        type="text"
        aria-label="Exercise Name"
      />
      <div className={styles.ranges}>
        <RangedInput
          maxDigit={1}
          testId="sets"
          placeholder="SETS"
          isEditable={true}
          onChange={(v) => console.log(v)}
        />
        <RiCloseFill className={styles['ranges-separator']} />
        <RangedInput
          maxDigit={2}
          testId="reps"
          placeholder="REPS"
          isEditable={true}
          onChange={(v) => console.log(v)}
        />
      </div>
    </div>
  )
}

export default ExerciseInput
