import { isEqual } from 'lodash'

import { ExerciseModelWithId } from '@t/Exercise'
import { WorkoutLog } from '@t/WorkoutLog'

/**
 * Helper function to determine if a list of exercises is changed
 * @param defaultList default list provided (`exercises` props on exercise-list component)
 * @param list list after changes (could also mean that list is at some point chanegd, but restored to its default state)
 * ! Ensure that the lists are ordered!
 */
export const isExerciseListEqual = (
  defaultList: ExerciseModelWithId[],
  list: ExerciseModelWithId[]
): boolean => {
  if (JSON.stringify(defaultList) === JSON.stringify(list)) {
    return true
  }

  if (defaultList.length !== list.length) {
    return false
  }

  return defaultList.every((item, index) => isEqual(item, list[index]))
}

/**
 * Helper function to determine if workout log is changed
 * @param defaultLog default log provided
 * @param log log that might have some changes in it.
 */
export const isWorkoutLogEqual = (defaultLog: WorkoutLog, log: WorkoutLog): boolean => {
  if (JSON.stringify(defaultLog) === JSON.stringify(log)) {
    return true
  }

  if (defaultLog.date !== log.date || defaultLog.templateId !== log.templateId) {
    return false
  }

  if (defaultLog.entries.length !== log.entries.length) {
    return false
  }

  return defaultLog.entries.every((entry, index) => {
    const logEntry = log.entries[index]

    return isEqual(entry, logEntry)
  })
}
