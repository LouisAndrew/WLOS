import client from '@lib/db'
import tables from '@lib/tables'

import { LibAPIResponse } from '@t/APIResponse'
import { UserDataTable } from '@t/tables/UserData'
import { TemplateTable, TemplateType } from '@t/tables/Template'

import userApiHandler from './user'
import { isError } from './helper'

/**
 * get user created templates
 * @param user user object / uuid
 * @param getDefault sets if the default templates should also be fetched
 * @param type type of template that should be retrieved.
 *    Set to -1 if no filter should be applied.
 */
const getUserTemplates = async (
  user: LibAPIResponse<UserDataTable> | string,
  getDefault: boolean = false,
  type: TemplateType | -1 = -1
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
  return { data: templateDatas.filter((data) => (type !== -1 ? data.type === type : true)) }
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

export default {
  getUserTemplates,
}
