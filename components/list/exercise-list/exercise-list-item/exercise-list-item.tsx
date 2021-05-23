import React, { FC, useRef, useState, useEffect } from 'react'

import { ExerciseInput } from '@c/input/exercise-input'
import { useUserData } from '@h/useUserData'
import { ExerciseModel, ExerciseModelWithId } from '@t/Exercise'
import { ExerciseTable } from '@t/tables/Exercise'

import style from './exercise-list-item.module.css'
import Popup from 'reactjs-popup'

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

// Todo create list to show exercise(s)
// todo create page to display exercise details
const ExerciseListItem: FC<Props> = ({ defaultExercise, isEditable, onChange }) => {
  const { getSavedExercises } = useUserData()
  const savedExercises = useRef<ExerciseTable[]>(getSavedExercises())
  const [exercise, setExercise] = useState<ExerciseModelWithId | undefined>(defaultExercise)
  const [createNew, setCreateNew] = useState(false)
  const [displayListPicker, setDisplayListPicker] = useState(false)
  const [displayValidExercise, setDisplayValidExercise] = useState(false)

  const [popupState, setPopupState] = useState({ LIST_POPUP: false, DETAILS_POPUP: false })

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
    if (exercise?.name) {
      onChange?.(exercise)
    }

    if (exercise?.exerciseId === '-1' || (!exercise && createNew)) {
      setDisplayListPicker(true)
      setDisplayValidExercise(false)
    } else {
      setDisplayListPicker(false)
    }

    if (exercise && exercise.exerciseId !== '-1') {
      setDisplayValidExercise(true)
    }
  }, [exercise, createNew])

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
              <button
                className={`btn btn--primary btn--s ${style['list-button']}`}
                onClick={() => setPopupState((prev) => ({ ...prev, LIST_POPUP: true }))}
              >
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
        </>
      )}
      {displayListPicker && (
        <Popup
          trigger={
            <button
              onClick={() => setPopupState((prev) => ({ ...prev, LIST_POPUP: true }))}
              className={`btn btn--ghost-yellow btn--xs ${style['list-more-button']}`}
            >
              MY LIST
            </button>
          }
          arrow={false}
          on="hover"
          position="right center"
          className="tooltip"
          offsetX={8}
        >
          <figcaption>Show Exercises on my list</figcaption>
        </Popup>
      )}
      {displayValidExercise && (
        <Popup
          trigger={
            <button
              onClick={() => setPopupState((prev) => ({ ...prev, DETAILS_POPUP: true }))}
              className={`btn btn--xs btn--ghost-yellow ${style['list-more-button']}`}
            >
              DETAILS
            </button>
          }
          arrow={false}
          on="hover"
          position="right center"
          className="tooltip"
          offsetX={8}
        >
          <figcaption>Show Exercise Details</figcaption>
        </Popup>
      )}
      <Popup
        open={popupState.DETAILS_POPUP}
        onClose={() => setPopupState((prev) => ({ ...prev, DETAILS_POPUP: false }))}
        modal
      >
        <h3>Exercsise Detail</h3>
      </Popup>
      <Popup
        open={popupState.LIST_POPUP}
        onClose={() => setPopupState((prev) => ({ ...prev, LIST_POPUP: false }))}
        modal
      >
        <h3>List</h3>
      </Popup>
    </div>
  )
}

export default ExerciseListItem
