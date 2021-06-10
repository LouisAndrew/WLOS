import React, { FC, useEffect, useState } from 'react'
import { isEqual } from 'lodash'
import uniqid from 'uniqid'

import { TemplateExerciseTable, TemplateTableWithData } from '@t/tables/Template'
import { LogEntry, WorkoutLog } from '@t/WorkoutLog'
import { LogListItem } from './log-list-item'
import { convertExerciseTableToModel } from '@lib/exercise-helper'

import style from './log-list.module.css'
import LogListProgress from './log-list-progress'
import { ExerciseSet } from '@t/ExerciseSet'
import { RiAddFill, RiInformationLine } from 'react-icons/ri'
import { ExerciseModelWithId } from '@t/Exercise'
import { defaultRange } from '@t/Range'

export type Props = {
  /**
   * Default exercises that has to be rendered.
   * ! Exercise should not be editable
   * ! Exercise could be deleted
   */
  template: TemplateTableWithData
  /**
   * Workout log (could contain exercises other than those in the template).
   */
  workoutLog: WorkoutLog
  /**
   * Workout log that should be compared to the log-list
   */
  comparisonLog?: WorkoutLog
  /**
   * Sets if the log-list should be editable
   */
  isEditable?: boolean
}

// todo [] Restore deleted exercise from template
const LogList: FC<Props> = ({ template, workoutLog, comparisonLog, isEditable }) => {
  const [entries, setEntries] = useState<(LogEntry & { listId: string })[]>([])
  const [deletedList, setDeletedList] = useState<LogEntry[]>([])

  const getDefaultEntries = (): LogEntry[] =>
    template.exercises.map((e) => ({ exercise: convertExerciseTableToModel(e), sets: [] }))

  const shouldEditable = (exercise: ExerciseModelWithId) => {
    if (!isEditable) {
      return false
    }

    return (
      template.exercises.findIndex(
        (e) => e.exerciseData.id === Number.parseInt(exercise.exerciseId)
      ) === -1
    )
  }

  const isExerciseDone = (exercise: ExerciseModelWithId) => {
    const exerciseEntry = entries.find((es) => es.exercise.exerciseId === exercise.exerciseId)

    if (!exerciseEntry) {
      return false
    }

    const { sets, reps } = exercise

    const entrySets = exerciseEntry.sets
    if (entrySets.length + 1 <= sets.start) {
      return false
    }
    return entrySets.filter((set) => set.repsCount >= reps.start).length >= sets.start
  }

  const handleChangeExerciseSet = (sets: ExerciseSet[], listId: string) => {
    const exerciseEntryIndex = entries.findIndex((es) => es.listId === listId)

    if (exerciseEntryIndex === -1) {
      return
    }

    setEntries((prev) =>
      prev.map((entry, index) => {
        if (index === exerciseEntryIndex) {
          return {
            ...entry,
            sets,
          }
        }

        return entry
      })
    )
  }

  const handleAddExercise = () => {
    const exercise: ExerciseModelWithId = {
      exerciseId: '-1',
      name: '',
      reps: defaultRange,
      sets: defaultRange,
    }

    setEntries((prev) => [...prev, { exercise, sets: [], listId: uniqid() }])
  }

  const handleDelete = (listId: string) => {
    const exerciseEntryIndex = entries.findIndex((es) => es.listId === listId)

    if (exerciseEntryIndex === -1) {
      return
    }

    const newList = entries.filter((entry) => entry.listId !== listId)
    getDeletedList(newList)
    setEntries(newList)
  }

  const getDeletedList = (list: LogEntry[]) => {
    const defaultList = getDefaultEntries()
    const deleted = defaultList
      .map((item) => {
        const index = list.findIndex((defaultItem) => isEqual(defaultItem.exercise, item.exercise))

        console.log({ item, index })

        return {
          item,
          isEqual: index > -1,
        }
      })
      .filter((listItem) => !listItem.isEqual)

    setDeletedList(deleted.map(({ item }) => item))
  }

  const getComparison = (exerciseId: string, index: number): ExerciseSet[] | undefined => {
    if (!comparisonLog) {
      return undefined
    }
    const comparisonList = comparisonLog.entries.filter(
      (entry, i) => entry.exercise.exerciseId === exerciseId && i === index
    )

    return comparisonList.length > 0 ? comparisonList[0].sets : undefined
  }

  useEffect(() => {
    if (workoutLog.entries.length === 0) {
      setEntries(getDefaultEntries().map((entry) => ({ ...entry, listId: uniqid() })))
      return
    }

    const list = workoutLog.entries.map((entry) => ({ ...entry, listId: uniqid() }))
    setEntries(list)
    getDeletedList(list)
  }, [])

  return (
    <div data-testid="log-list-wrapper">
      <div>
        {entries.map((entry, index) => (
          <div key={entry.listId} className={style.log_list_item}>
            <LogListProgress isDone={isExerciseDone(entry.exercise)} />
            <LogListItem
              exerciseModel={entry.exercise}
              exerciseSets={entry.sets}
              isEditable={shouldEditable(entry.exercise)}
              isLoggable={isEditable}
              onChange={(sets) => handleChangeExerciseSet(sets, entry.listId)}
              comparisonSets={getComparison(entry.exercise.exerciseId, index)}
              onDelete={() => handleDelete(entry.listId)}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <button
          className={`btn btn--xs btn--secondary ${style.button_group} ${style.add_exercise_btn}`}
          onClick={handleAddExercise}
        >
          <RiAddFill />
          ADD EXERCISE
        </button>
        {deletedList.length > 0 && (
          <button className={`btn btn--xs btn--ghost ${style.button_group} ${style.info_btn}`}>
            <RiInformationLine />
            {deletedList.length} {deletedList.length === 1 ? 'EXERCISE IS' : 'EXERCISES ARE'}{' '}
            DELETED
          </button>
        )}
      </div>
    </div>
  )
}

export default LogList
