import React, { FC, useRef, useState, useEffect } from 'react'
import classname from 'classnames/bind'

import { ExerciseInput } from '@c/input/exercise-input'
import { useUserData } from '@h/useUserData'
import { ExerciseModel, ExerciseModelWithId } from '@t/Exercise'
import { ExerciseTable } from '@t/tables/Exercise'

import style from './exercise-list-item.module.css'
import Popup from 'reactjs-popup'
import { Tooltip } from '@c/tooltip'
import { SavedExerciseList } from '@c/list/saved-exercise-list'
import { defaultRange } from '@t/Range'

const cx = classname.bind(style)
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
   * Additional class names for styling.
   */
  className?: string
  /**
   * Inline styles for custom styling
   */
  customStyle?: React.CSSProperties
  /**
   * Handler function to handle changes within the component.
   */
  onChange?: (exerciseModel: ExerciseModelWithId) => void
  /**
   * Handle function to handle when new exercise is created
   */
  onNewExercise?: (exerciseTableData?: { name: string; id: number }) => void
}

// Todo create list to show exercise(s)
// todo create page to display exercise details
const ExerciseListItem: FC<Props> = ({
  defaultExercise,
  isEditable,
  className,
  customStyle,
  onChange,
  onNewExercise,
}) => {
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

  const handleSelectExerciseFromList = async ({ name, id }: ExerciseTable) => {
    if (!createNew && !exercise) {
      onNewExercise?.({ name, id })
    }

    setExercise((prev) => ({
      sets: prev?.sets || defaultRange,
      reps: prev?.sets || defaultRange,
      exerciseId: id.toString(),
      name,
    }))
    setPopupState((prev) => ({
      ...prev,
      LIST_POPUP: false,
    }))
  }

  // * function is going to be called only if exercise-list-item is not part of exercise-list
  const handleNewExercise = () => {
    setCreateNew(true)
    setExercise({
      name: '',
      exerciseId: '-1',
      sets: defaultRange,
      reps: defaultRange,
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

  const wrapperClass = cx({
    wrapper: true,
    buttons: !createNew && !exercise,
  })

  return (
    <div
      data-testid="exercise-list-item-wrapper"
      className={`${wrapperClass} ${className}`}
      style={customStyle}
    >
      {!createNew && !exercise ? (
        <>
          <button
            data-testid="new-exercise"
            className={`btn btn--s btn--secondary btn--s`}
            onClick={() => {
              onNewExercise?.()
              handleNewExercise()
            }}
          >
            CREATE NEW EXERCISE
          </button>
          {savedExercises && (
            <button
              className={`btn btn--s btn--primary btn--s ${style['list-button']}`}
              onClick={() => setPopupState((prev) => ({ ...prev, LIST_POPUP: true }))}
            >
              PICK FROM LIST
            </button>
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
        <Tooltip
          trigger={
            <button
              onClick={() => setPopupState((prev) => ({ ...prev, LIST_POPUP: true }))}
              className={`btn btn--ghost-yellow btn--xs ${style['list-more-button']}`}
            >
              MY LIST
            </button>
          }
          content="Show Exercises on my list"
        />
      )}
      {displayValidExercise && (
        <Tooltip
          trigger={
            <button
              onClick={() => setPopupState((prev) => ({ ...prev, DETAILS_POPUP: true }))}
              className={`btn btn--xs btn--ghost-yellow ${style['list-more-button']}`}
            >
              DETAILS
            </button>
          }
          content="Show Exercise Details"
        />
      )}
      <Popup
        open={popupState.DETAILS_POPUP}
        onClose={() => setPopupState((prev) => ({ ...prev, DETAILS_POPUP: false }))}
        modal
        className="modal"
      >
        <h3>Exercsise Detail</h3>
      </Popup>
      <Popup
        open={popupState.LIST_POPUP}
        onClose={() => setPopupState((prev) => ({ ...prev, LIST_POPUP: false }))}
        modal
        className="modal"
      >
        <SavedExerciseList onSelect={handleSelectExerciseFromList} />
      </Popup>
    </div>
  )
}

export default ExerciseListItem
