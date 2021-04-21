import client from '@lib/db'
import tables from '@lib/tables'

import { LibAPIResponse } from '@t/APIResponse'
import { UserDataTable } from '@t/tables/UserData'
import { TemplateExerciseTable, TemplateTable, TemplateType } from '@t/tables/Template'
import { ExerciseTable } from '@t/tables/Exercise'

import userApiHandler from './user'
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

export default {
  getUserTemplates,
}
