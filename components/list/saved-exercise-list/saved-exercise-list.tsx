import { useUserData } from '@h/useUserData'
import { ExerciseTable } from '@t/tables/Exercise'
import React, { FC } from 'react'

import style from './saved-exercise-list.module.css'

export type Props = {
  /**
   * Function to handle if one of the option is clicked.
   */
  onSelect?: (exercise: ExerciseTable) => void
}

// todo render tags and more details.
const SavedExerciseList: FC<Props> = ({ onSelect }) => {
  const { getSavedExercises } = useUserData()
  const exercises = getSavedExercises()

  return (
    <div data-testid="saved-exercise-list-wrapper" className={style.wrapper}>
      <h3>SAVED EXERCISES</h3>
      <div className={style['saved-list-wrapper']}>
        {exercises.map((exercise) => {
          const { id, name } = exercise

          return (
            <button
              id={`${id}-saved-list`}
              onClick={() => onSelect?.(exercise)}
              className={style['saved-list-btn']}
            >
              <span>{name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SavedExerciseList
