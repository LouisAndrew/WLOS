import React, { FC, useRef, useState } from 'react'
import { RiCloseFill } from 'react-icons/ri'

import { ExerciseModel, ExerciseModelWithId } from '@t/Exercise'
import { RangedInput } from '../ranged-input'
import styles from './exercise-input.module.css'

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
   * Additional styling classes.
   */
  className?: string
  /**
   * Handler function to handle changes within the input
   */
  onChange?: (exercise: ExerciseModel) => void
}

const ExerciseInput: FC<Props> = ({ onChange, defaultExercise, isEditable, className }) => {
  const [exerciseName, setExerciseName] = useState(defaultExercise?.name || '')
  const exerciseSets = useRef(defaultExercise?.sets || { start: -1 })
  const exerciseReps = useRef(defaultExercise?.reps || { start: -1 })

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEditable) {
      setExerciseName(e.target.value.toUpperCase())
    }
  }

  const handleSetsChange = (start: number, end?: number) => {
    exerciseSets.current = {
      start,
      end,
    }
  }

  const handleRepsChange = (start: number, end?: number) => {
    exerciseReps.current = {
      start,
      end,
    }
  }

  const getCurrentExerciseModel = (): ExerciseModel => {
    return {
      name: exerciseName,
      reps: exerciseReps.current,
      sets: exerciseSets.current,
    }
  }

  const handleBlur = () => {
    if (isEditable) {
      onChange(getCurrentExerciseModel())
    }
  }

  return (
    <div
      data-testid="exercise-input-wrapper"
      className={`${styles.wrapper} ${className}`}
      onBlur={handleBlur}
    >
      <input
        className={styles['name-input']}
        placeholder="Exercise Name"
        type="text"
        aria-label="Exercise Name"
        value={exerciseName}
        onChange={handleNameChange}
      />
      <div className={styles.ranges}>
        <RangedInput
          maxDigit={1}
          testId="sets"
          placeholder="SETS"
          isEditable={isEditable}
          defaultStart={defaultExercise?.sets.start}
          defaultEnd={defaultExercise?.sets.end}
          onChange={handleSetsChange}
        />
        <RiCloseFill className={styles['ranges-separator']} />
        <RangedInput
          maxDigit={2}
          testId="reps"
          placeholder="REPS"
          isEditable={isEditable}
          defaultStart={defaultExercise?.reps.start}
          defaultEnd={defaultExercise?.reps.end}
          onChange={handleRepsChange}
        />
      </div>
    </div>
  )
}

export default ExerciseInput
