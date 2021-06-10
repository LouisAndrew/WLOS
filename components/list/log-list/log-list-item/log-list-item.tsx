import React, { FC, useEffect, useRef, useState } from 'react'

import { ExerciseModelWithId } from '@t/Exercise'
import { ExerciseSet, defaultExerciseSet } from '@t/ExerciseSet'
import { ExerciseListItem } from '@c/list/exercise-list/exercise-list-item'
import { SetInput } from '@c/input/set-input'
import uniqid from 'uniqid'
import { RiDeleteBin6Line, RiEyeFill, RiEyeOffFill, RiMoreFill } from 'react-icons/ri'

import style from './log-list-item.module.css'
import classnames from 'classnames/bind'
import { BiDumbbell } from 'react-icons/bi'
import { Tooltip } from '@c/tooltip'

const cx = classnames.bind(style)

export type Props = {
  /**
   * Base model of the exercise.
   */
  exerciseModel: ExerciseModelWithId
  /**
   * Current exercise sets.
   */
  exerciseSets: ExerciseSet[]
  /**
   * Sets to compare with.
   */
  comparisonSets?: ExerciseSet[]
  /**
   * Sets whether the list-item should be editable.
   */
  isEditable?: boolean
  /**
   * Sets whether any new log could be added.
   */
  isLoggable?: boolean
  /**
   * Function to handle if user clicks on the delete exercise button.
   */
  onDelete?: (exerciseId: string) => void
  /**
   * Function to handle if anything regarding exercise set within the component changes.
   */
  onChange?: (sets: ExerciseSet[]) => void
}

type ExerciseSetWithListId = ExerciseSet & { listId: string }

// todo [] create option for log-list-item
const LogListItem: FC<Props> = ({
  exerciseModel,
  exerciseSets: defaultExerciseSets,
  isEditable,
  isLoggable,
  onDelete,
  onChange,
  comparisonSets = [],
}) => {
  const createUniq = () => uniqid(exerciseModel.name.split(' ').join('_') + '-')

  const [exerciseSets, setExerciseSets] = useState<ExerciseSetWithListId[]>(
    defaultExerciseSets.map((e) => ({ ...e, listId: createUniq() }))
  )
  const [showComparison, setShowComparison] = useState(false)
  const firstRender = useRef(true)

  const handleSetDataChange = (listId: string, set: ExerciseSet) => {
    if (isLoggable) {
      setExerciseSets(
        exerciseSets.map((s) => {
          if (s.listId === listId) {
            return {
              ...set,
              listId,
            }
          }

          return s
        })
      )
    }
  }
  const handleDeleteSet = (listId: string) => {
    setExerciseSets(
      exerciseSets
        .filter((s) => s.listId !== listId)
        .map((s, index) => ({
          ...s,
          setNumber: index + 1,
        }))
    )
  }

  const handleNewSet = () => {
    const lastSetIndex = exerciseSets.length - 1

    const newSet: ExerciseSetWithListId = {
      listId: createUniq(),
      weightMetric:
        lastSetIndex > -1
          ? exerciseSets[lastSetIndex].weightMetric
          : defaultExerciseSet.weightMetric,
      weightValue:
        lastSetIndex > -1 ? exerciseSets[lastSetIndex].weightValue : defaultExerciseSet.weightValue,
      setNumber: lastSetIndex > -1 ? exerciseSets[lastSetIndex].setNumber + 1 : 1,
      repsCount: defaultExerciseSet.repsCount,
      review: defaultExerciseSet.review,
    }

    setExerciseSets([...exerciseSets, newSet])
  }

  useEffect(() => {
    if (!firstRender.current) {
      onChange?.(exerciseSets)
      return
    }

    firstRender.current = false
  }, [exerciseSets])

  return (
    <div data-testid="log-list-item-wrapper" className={style.wrapper}>
      <ExerciseListItem
        defaultExercise={exerciseModel}
        isEditable={isEditable}
        className={style.set}
      />
      <div className={style.exercise_sets}>
        <div className={cx({ exercise_set_container: true, comparison_active: showComparison })}>
          {exerciseSets.map(
            ({ setNumber, weightMetric, weightValue, repsCount, review, listId }) => {
              return (
                <div key={listId} className={style.set_wrapper}>
                  <SetInput
                    setNumber={setNumber}
                    defaultWeightValue={weightValue}
                    defaultRepsCount={repsCount}
                    defaultReview={review}
                    defaultMetric={weightMetric}
                    inputIds={listId}
                    isEditable={isLoggable}
                    onSetChange={(s) => handleSetDataChange(listId, s)}
                  />
                  <Tooltip
                    trigger={
                      <button
                        className={`btn btn--icon btn--xs btn--ghost ${style.delete_set_btn}`}
                        onClick={() => handleDeleteSet(listId)}
                      >
                        <RiDeleteBin6Line />
                      </button>
                    }
                    content="delete set log"
                  />
                </div>
              )
            }
          )}
          {showComparison && comparisonSets.length > exerciseSets.length ? (
            <div className={style.comparison_sets_todo}>
              {comparisonSets.length - exerciseSets.length} sets behind.
            </div>
          ) : null}
        </div>
        {showComparison && (
          <div
            className={cx({
              exercise_set_container: true,
              comparison_active: true,
              comparison_set_container: true,
            })}
          >
            {comparisonSets.map(({ setNumber, weightMetric, weightValue, repsCount, review }) => {
              const id = uniqid()
              return (
                <div
                  key={id}
                  className={cx({
                    set_wrapper: true,
                    comparison_set_wrapper: true,
                  })}
                >
                  <SetInput
                    setNumber={setNumber}
                    defaultWeightValue={weightValue}
                    defaultRepsCount={repsCount}
                    defaultReview={review}
                    defaultMetric={weightMetric}
                    inputIds={id}
                    isEditable={false}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className="flex items-center flex-wrap">
        <button
          className={`btn btn--s btn--ghost ${style.button_group_item}`}
          data-testid="add-set"
          onClick={handleNewSet}
        >
          <BiDumbbell />
          ADD SET
        </button>
        {comparisonSets.length > 0 && (
          <button
            className={`btn btn--ghost btn--s ${style.button_group_item}`}
            onClick={() => setShowComparison((prev) => !prev)}
          >
            {showComparison ? <RiEyeOffFill /> : <RiEyeFill />}
            {showComparison ? 'HIDE' : 'SHOW'} COMPARISON
          </button>
        )}
        <button
          className={`btn btn--s btn--ghost ${style.button_group_item}`}
          onClick={() => onDelete?.(exerciseModel.exerciseId)}
        >
          <RiDeleteBin6Line />
          REMOVE
        </button>
      </div>
    </div>
  )
}

export default LogListItem
