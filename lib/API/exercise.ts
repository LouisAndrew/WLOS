import { uniqBy } from 'lodash'

import client from '@lib/db'
import tables from '@lib/tables'
import { LibAPIResponse, LibAPIResponseError } from '@t/APIResponse'
import { ExerciseTable } from '@t/tables/Exercise'
import { UserDataTable } from '@t/tables/UserData'

import { isError } from './helper'
import userApiHandler from './user'

/**
 * Function to save an exercise to user's saved_exercises_table
 * @param exercise id of the exerise to be created or the an APIResponse object
 * @param user either an APIResponse object or a user id
 * @returns id of the exercise
 */
const saveExercise = async (
  exercise: LibAPIResponse<ExerciseTable> | number,
  user: LibAPIResponse<UserDataTable> | string
): Promise<LibAPIResponse<{ exercise_id: number }>> => {
  const userObj = typeof user === 'string' ? await userApiHandler.getUser(user) : user
  const exerciseObj = typeof exercise === 'number' ? await getExercise(exercise) : exercise

  if (isError(userObj)) {
    return { error: { msg: userObj.error.msg } }
  }

  if (isError(exerciseObj)) {
    return { error: { msg: exerciseObj.error.msg } }
  }

  // save to saved_exercises table
  const response = await client
    .from(tables.SAVED_EXERCISES)
    .insert({ user_id: userObj.data.id, exercise_id: exerciseObj.data.id })

  const { error } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  return { data: { exercise_id: exerciseObj.data.id } }
}

/**
 * get exercises saved by user
 * @param uuid id of the user
 * @param getAll sets if default exercises should also be retrieved
 */
const getSavedExercise = async (
  user: string | LibAPIResponse<UserDataTable>,
  getAll?: string
): Promise<LibAPIResponse<ExerciseTable[]>> => {
  const userObj = typeof user === 'string' ? await userApiHandler.getUser(user) : user
  if (isError(userObj)) {
    return { error: { msg: 'User not found' } }
  }

  // todo: add tags retrieval..
  const query = `
    exercise_id (
      name,
      id
    )
  `
  const response = await client
    .from(tables.SAVED_EXERCISES)
    .select(query)
    .match({ user_id: userObj.data.id.toString() })

  const { error, data } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  const exerciseData = data.map((d) => {
    const e = d.exercise_id
    return {
      ...e,
    }
  })

  if (getAll === 'true') {
    const defaultExercisesResponeObj = await getCreatedExercises('ROOT')
    const defaultExercises = isError(defaultExercisesResponeObj)
      ? []
      : defaultExercisesResponeObj.data
    return {
      data: uniqBy([...exerciseData, ...defaultExercises], 'id'),
    }
  }

  return {
    data: exerciseData,
  }
}

/**
 * get exercises created by the user
 * @param uuid id of the user
 */
const getCreatedExercises = async (
  user: string | LibAPIResponse<UserDataTable>
): Promise<LibAPIResponse<ExerciseTable[]>> => {
  const userObj = typeof user === 'string' ? await userApiHandler.getUser(user) : user
  if (isError(userObj)) {
    return { error: { msg: userObj.error.msg } }
  }

  const query = `
    name,
    id
  `
  const response = await client
    .from(tables.EXERCISE)
    .select(query)
    .match({ created_by: userObj.data.id.toString() })

  const { error, data } = response

  if (error) {
    return { error: { msg: error.message } }
  }

  return {
    data,
  }
}

/**
 * get a single exercise object
 * @param exerciseId id of the exercise
 */
const getExercise = async (exerciseId: number): Promise<LibAPIResponse<ExerciseTable>> => {
  const query = `
    name,
    id
  `
  const response = await client
    .from(tables.EXERCISE)
    .select(query)
    .match({ id: exerciseId.toString() })

  const { error, data } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  if (data.length === 0) {
    return { error: { msg: 'No exercise found' } }
  }

  return { data: data[0] }
}

const createExercise = async (uuid: string, data: Partial<ExerciseTable>) => {}

export default {
  getSavedExercise,
  saveExercise,
}
