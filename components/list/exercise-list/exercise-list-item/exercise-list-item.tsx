import React, { FC, useRef, useState, useEffect } from 'react'

import { ExerciseInput } from '@c/input/exercise-input'
import { useUserData } from '@h/useUserData'
import { ExerciseModel, ExerciseModelWithId } from '@t/Exercise'
import { ExerciseTable } from '@t/tables/Exercise'

import style from './exercise-list-item.module.css'

export type Props = {
  /**
   * Default value of the exercise
   */
  defaultExercise?: ExerciseModelWithId
  /**
   * Sets if the input is editable
   */
  isEditable?: boolean
  /**
   * Handler function to handle changes within the component.
   */
  onChange?: (exerciseModel: ExerciseModelWithId) => void
}

const ExerciseListItem: FC<Props> = ({ defaultExercise, isEditable, onChange }) => {
  const { getSavedExercises } = useUserData()
  const savedExercises = useRef<ExerciseTable[]>(getSavedExercises())
  const [exercise, setExercise] = useState<ExerciseModelWithId | undefined>(defaultExercise)
  const [createNew, setCreateNew] = useState(false)

  const handleChangeExercise = (e: ExerciseModel) => {
    const { name } = e
    // todo handle error.
    if (!name) {
      return
    }

    const index = savedExercises.current.map((item) => item.name).indexOf(name)
    setExercise({
      ...e,
      exerciseId: index > -1 ? savedExercises.current[index].id.toString() : '-1',
    })
  }

  useEffect(() => {
    if (exercise?.name && createNew) {
      setCreateNew(false)
    }

    if (exercise?.name) {
      onChange?.(exercise)
    }
  }, [exercise])

  return (
    <div data-testid="exercise-list-item-wrapper" className={style.wrapper}>
      {!createNew && !exercise ? (
        <>
          <button
            data-testid="new-exercise"
            className={`btn btn--secondary btn--s`}
            onClick={() => setCreateNew(true)}
          >
            CREATE NEW EXERCISE
          </button>
          {savedExercises && (
            <>
              <span className={style.separator}>OR</span>
              <button className={`btn btn--primary btn--s ${style['list-button']}`}>
                PICK FROM LIST
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <ExerciseInput
            isEditable={isEditable}
            defaultExercise={exercise}
            onChange={handleChangeExercise}
          />
          {createNew && <div className="">new</div>}
        </>
      )}
    </div>
  )
}

export default ExerciseListItem
