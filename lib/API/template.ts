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
import { before, difference } from 'lodash'

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
 * get a single template with the provided id
 * @param templateId id of the template
 * @param getData sets if the data should also be retrieved
 */
const getTemplate = async (
  templateId: number,
  getData: boolean = false
): Promise<LibAPIResponse<TemplateTable | TemplateTableWithData>> => {
  const query = `
    type,
    name,
    color,
    id,
    created_by
  `

  const response = await client
    .from(tables.TEMPLATE)
    .select(query)
    .match({ id: templateId.toString() })
  const { error, data } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  const templateData: TemplateTable = data[0]

  return {
    data: { ...templateData, exercises: getData ? await getExerciseData(templateData.id) : null },
  }
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
    reps,
    order,
    id
  `
  const response = await client
    .from(tables.TEMPLATE_EXERCISE)
    .select(query)
    .match({ template_id: templateId.toString() })
  const { error, data } = response
  if (error) {
    return null
  }

  return data.map((d) => ({
    exerciseData: { ...d.exercise_id },
    sets: d.sets,
    reps: d.reps,
    order: d.order,
    id: d.id,
  }))
}

/**
 * save exercise as child of a template
 * @param templateId id of the template
 * @param exercise data of the exercise
 * @returns error if not succesful and data: { success: true } if successful
 */
const saveExerciseToTemplate = async (
  templateId: number,
  exercise: TemplateExerciseTable,
  order: number
): Promise<LibAPIResponse<{ succes: true }>> => {
  const { exerciseData, reps, sets } = exercise

  const response = await client.from(tables.TEMPLATE_EXERCISE).insert({
    exercise_id: exerciseData.id,
    template_id: templateId,
    sets,
    reps,
    order,
  })
  const { error } = response

  if (error) {
    return { error: { msg: error.message } }
  }

  return { data: { succes: true } }
}

/**
 * remove an exercise from template
 * @param templateId id of the template
 * @param exerciseId id of the exercise
 */
const removeExerciseFromTemplate = async (
  templateId: number,
  exerciseId: number
): Promise<LibAPIResponse<{ success: true }>> => {
  const response = await client
    .from(tables.TEMPLATE_EXERCISE)
    .delete()
    .match({ template_id: templateId.toString(), exercise_id: exerciseId.toString() })

  const { error } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  return { data: { success: true } }
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

  const { exercises: exercisesData, ...templateData } = data

  const response = await client
    .from(tables.TEMPLATE)
    .insert({ ...templateData, created_by: userObj.data.id })

  const { error, data: responseData } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  const templateId = responseData[0].id

  // creating exercise db entry if not yet available..
  const exercises = await exerciseHandler(exercisesData, userObj)
  const savePromises = await Promise.all(
    exercises.map((e, index) => saveExerciseToTemplate(templateId, e, index))
  )

  if (!savePromises.every((promise) => !isError(promise))) {
    return { error: { msg: 'Error while saving the exercises to the template' } }
  }

  return { data: { template_id: templateId } }
}

/**
 * updates an existing template
 * @param user user who updates the template / his/her uuid
 * @param data template data
 */
const updateTemplate = async (
  user: LibAPIResponse<UserDataTable> | string,
  data: TemplateTableWithData
): Promise<LibAPIResponse<{ template_id: number }>> => {
  const userObj = typeof user === 'string' ? await userApiHandler.getUser(user) : user
  const templateObj = (await getTemplate(data.id, true)) as LibAPIResponse<TemplateTableWithData>
  if (isError(userObj)) {
    return { error: { msg: userObj.error.msg } }
  }

  if (isError(templateObj)) {
    return { error: { msg: templateObj.error.msg } }
  }

  // restrict editing to just the creator
  if (templateObj.data.created_by !== userObj.data.id) {
    console.log({ templateObj, userObj })
    return { error: { msg: 'User is not the creator of the template' } }
  }

  const exercisesBefore = templateObj.data.exercises
  const { exercises: exercisesAfter, ...templateData } = data

  const response = await client
    .from(tables.TEMPLATE)
    .update(templateData)
    .match({ id: templateData.id.toString() })

  const { error } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  const exercisesAfterHandled = await exerciseHandler(exercisesAfter, userObj)
  const savePromises = await Promise.all(
    exercisesAfterHandled.map(async (e, index) => {
      exercisesBefore.findIndex((before) => before.exerciseData.id === e.exerciseData.id)
      const beforeIndex = exercisesBefore.findIndex(
        (before) => before.exerciseData.id === e.exerciseData.id
      )
      if (beforeIndex !== -1) {
        const before = exercisesBefore[beforeIndex]
        if (before.reps !== e.reps || before.sets !== e.sets || before.order !== index) {
          const updateResponse = await client
            .from(tables.TEMPLATE_EXERCISE)
            .update({ sets: e.sets, reps: e.reps, order: index })
            .match({ id: (before as any).id.toString() })

          const { error } = updateResponse
          if (error) {
            return { error: { msg: error.message } }
          }
        }
        return { data: { success: true } }
      }

      return saveExerciseToTemplate(templateData.id, e, index)
    })
  )

  if (!savePromises.every((promise) => !isError(promise))) {
    return { error: { msg: 'Error while saving the exercises to the template' } }
  }

  // delete exercise that's not in the exerciseAfter array..
  const exerciseAfterIds = exercisesAfter.map((e) => e.exerciseData.id)
  const exerciseBeforeIds = exercisesBefore.map((e) => e.exerciseData.id)

  const toBeRemoved = difference(exerciseBeforeIds, exerciseAfterIds)
  const removePromises = await Promise.all(
    toBeRemoved.map((id) => removeExerciseFromTemplate(templateData.id, id))
  )

  if (!removePromises.every((promise) => !isError(promise))) {
    return { error: { msg: 'Error while removing exercises' } }
  }

  return { data: { template_id: templateData.id } }
}

export default {
  getUserTemplates,
  createTemplate,
  updateTemplate,
  getTemplate,
}
