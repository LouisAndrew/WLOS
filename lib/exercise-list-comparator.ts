import { isEqual } from 'lodash'

import { ExerciseModelWithId } from '@t/Exercise'

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
