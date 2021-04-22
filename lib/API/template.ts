import client from '@lib/db'
import tables from '@lib/tables'

import { LibAPIResponse } from '@t/APIResponse'
import { UserDataTable } from '@t/tables/UserData'
import {
  TemplateExerciseTable,
  TemplateTable,
  TemplateTableWithData,
  TemplateType,
} from '@t/tables/Template'
import { ExerciseTable } from '@t/tables/Exercise'

import userApiHandler from './user'
import exerciseApiHandler from './exercise'
import { isError } from './helper'

/**
 * get user created templates
 * @param user user object / uuid
 * @param getDefault sets if the default templates should also be fetched
 * @param type type of template that should be retrieved.
 *    Set to -1 if no filter should be applied.
 * @param getData sets if the exercise data should also be retrieved
 */
const getUserTemplates = async (
  user: LibAPIResponse<UserDataTable> | string,
  getDefault: boolean = false,
  type: TemplateType | -1 = -1,
  getData: boolean = false
): Promise<LibAPIResponse<TemplateTable[]>> => {
  const userObj = typeof user === 'string' ? await userApiHandler.getUser(user) : user
  if (isError(userObj)) {
    return { error: { msg: userObj.error.msg } }
  }

  const query = `
    type,
    name,
    color,
    id
  `

  const response = await client
    .from(tables.TEMPLATE)
    .select(query)
    .match({ created_by: userObj.data.id.toString() })

  const { data, error } = response
  if (error) {
    return {
      error: { msg: error.message },
    }
  }

  const templateDatas: TemplateTable[] = getDefault
    ? [...data, ...(await getDefaultExercises())]
    : data
  const filtered = templateDatas.filter((data) => (type !== -1 ? data.type === type : true))

  if (!getData) {
    return { data: filtered }
  }

  const withData = await Promise.all(
    templateDatas.map(async (data) => {
      const exercises = await getExerciseData(data.id)
      return {
        ...data,
        exercises: exercises || [],
      }
    })
  )

  return { data: withData }
}

/**
 * helper function to get default exercises
 * @returns default created exercises
 */
const getDefaultExercises = async (): Promise<TemplateTable[]> => {
  const response = await getUserTemplates('ROOT')
  if (isError(response)) {
    return []
  }

  return response.data
}

/**
 * function to get exercise datas within a template
 * @param templateId
 */
const getExerciseData = async (templateId: number): Promise<TemplateExerciseTable[] | null> => {
  const query = `
    exercise_id (
      name,
      id,
      created_by
    ),
    sets,
    reps
  `
  const response = await client
    .from(tables.TEMPLATE_EXERCISE)
    .select(query)
    .match({ template_id: templateId.toString() })
  const { error, data } = response
  if (error) {
    return null
  }

  return data.map((d) => ({ exerciseData: { ...d.exercise_id }, sets: d.sets, reps: d.reps }))
}

/**
 * save exercise as child of a template
 * @param templateId id of the template
 * @param exercise data of the exercise
 * @returns error if not succesful and data: { success: true } if successful
 */
const saveExerciseToTemplate = async (
  templateId: number,
  exercise: TemplateExerciseTable
): Promise<LibAPIResponse<{ succes: true }>> => {
  const { exerciseData, reps, sets } = exercise

  const response = await client.from(tables.TEMPLATE_EXERCISE).insert({
    exercise_id: exerciseData.id,
    template_id: templateId,
    sets,
    reps,
  })
  const { error } = response

  if (error) {
    return { error: { msg: error.message } }
  }

  return { data: { succes: true } }
}

/**
 * helper function to handle exercise (create if it's not yet in the DB)
 * @param exercises
 * @param userObj
 * @returns
 */
const exerciseHandler = async (
  exercises: TemplateExerciseTable[],
  userObj: LibAPIResponse<UserDataTable>
): Promise<TemplateExerciseTable[]> =>
  Promise.all(
    exercises.map(async (exercise) => {
      // exercise id is going to be equal -1 if it's not yet created
      if (exercise.exerciseData.id === -1) {
        // destructure exercise to extract its id
        const {
          exerciseData: { id: _, ...data },
          ...rest
        } = exercise
        const exerciseId = await exerciseApiHandler.createExercise(userObj, data as ExerciseTable)
        if (isError(exerciseId)) {
          return exercise
        }

        return {
          ...rest,
          exerciseData: {
            ...data,
            id: exerciseId.data.exercise_id,
          },
        }
      }

      return exercise
    })
  )

/**
 * create a new template on the db with the created_flag by user
 * @param user user who creates the template / his/her uuid
 * @param data template data
 */
const createTemplate = async (
  user: LibAPIResponse<UserDataTable> | string,
  data: TemplateTableWithData
): Promise<LibAPIResponse<{ template_id: number }>> => {
  const userObj = typeof user === 'string' ? await userApiHandler.getUser(user) : user
  if (isError(userObj)) {
    return { error: { msg: userObj.error.msg } }
  }

  // creating exercise db entry if not yet available..
  const exercises = await exerciseHandler(data.exercises, userObj)

  const { exercises: _, ...templateData } = data

  const response = await client
    .from(tables.TEMPLATE)
    .insert({ ...templateData, created_by: userObj.data.id })

  const { error, data: responseData } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  const templateId = responseData[0].id

  const savePromises = await Promise.all(
    exercises.map((e) => saveExerciseToTemplate(templateId, e))
  )

  if (!savePromises.every((promise) => !isError(promise))) {
    return { error: { msg: 'Error while saving the exercises to the template' } }
  }

  return { data: { template_id: templateId } }
}

export default {
  getUserTemplates,
  createTemplate,
}
