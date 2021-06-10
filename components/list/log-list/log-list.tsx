import React, { FC, useEffect, useState } from 'react'
import { isEqual } from 'lodash'
import uniqid from 'uniqid'

import { TemplateExerciseTable, TemplateTableWithData } from '@t/tables/Template'
import { LogEntry, WorkoutLog } from '@t/WorkoutLog'
import { LogListItem } from './log-list-item'
import { convertExerciseTableToModel } from '@lib/exercise-helper'

import style from './log-list.module.css'
import { stringToRange } from '@lib/range-helper'
import LogListProgress from './log-list-progress'
import { ExerciseSet } from '@t/ExerciseSet'
import { RiAddFill } from 'react-icons/ri'

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
   * Sets if the log-list should be editable
   */
  isEditable?: boolean
}

const LogList: FC<Props> = ({ template, workoutLog, isEditable }) => {
  const [entries, setEntries] = useState<(LogEntry & { listId: string })[]>([])

  const getDefaultEntries = (): LogEntry[] =>
    template.exercises.map((e) => ({ exercise: e, sets: [] }))

  const shouldEditable = (exerciseTable: TemplateExerciseTable) => {
    if (!isEditable) {
      return false
    }

    return (
      template.exercises.findIndex((e) => e.exerciseData.id === exerciseTable.exerciseData.id) ===
      -1
    )
  }

  const isExerciseDone = (exerciseTable: TemplateExerciseTable) => {
    const exerciseEntry = entries.find(
      (es) => es.exercise.exerciseData.id === exerciseTable.exerciseData.id
    )

    if (!exerciseEntry) {
      return false
    }

    const { sets, reps } = exerciseTable

    const entrySets = exerciseEntry.sets
    const setsRange = stringToRange(sets)
    if (entrySets.length + 1 <= setsRange.start) {
      return false
    }

    const repsRange = stringToRange(reps)
    return entrySets.filter((set) => set.repsCount >= repsRange.start).length >= setsRange.start
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
    const exercise: TemplateExerciseTable = {
      exerciseData: {
        name: '',
        id: -1,
        tags: [],
      },
      reps: '',
      sets: '',
      order: entries.length,
    }

    setEntries((prev) => [...prev, { exercise, sets: [], listId: uniqid() }])
  }

  useEffect(() => {
    if (workoutLog.entries.length === 0) {
      setEntries(getDefaultEntries().map((entry) => ({ ...entry, listId: uniqid() })))
      return
    }

    setEntries(workoutLog.entries.map((entry) => ({ ...entry, listId: uniqid() })))
  }, [])

  return (
    <div data-testid="log-list-wrapper">
      <div>
        {entries.map((entry) => (
          <div key={entry.listId} className={style.log_list_item}>
            <LogListProgress isDone={isExerciseDone(entry.exercise)} />
            <LogListItem
              exerciseModel={convertExerciseTableToModel(entry.exercise)}
              exerciseSets={entry.sets}
              isEditable={shouldEditable(entry.exercise)}
              isLoggable={isEditable}
              onChange={(sets) => handleChangeExerciseSet(sets, entry.listId)}
            />
          </div>
        ))}
      </div>
      <button
        className={`btn btn--xs btn--secondary ${style.add_exercise_btn}`}
        onClick={handleAddExercise}
      >
        <RiAddFill />
        ADD EXERCISE
      </button>
    </div>
  )
}

export default LogList
