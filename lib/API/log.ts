import client from '@lib/db'
import tables from '@lib/tables'

import { LibAPIResponse } from '@t/APIResponse'
import { SavedLogsTable } from '@t/tables/Log'
import { UserDataTable } from '@t/tables/UserData'

import { isError } from './helper'
import userApiHandler from './user'

/**
 * handler to get user's saved logs
 * @param user user id or LibAPIResponse object containing user data
 * @returns user's saved logs (without data)
 */
const getUserSavedLogs = async (
  user: string | LibAPIResponse<UserDataTable>
): Promise<LibAPIResponse<SavedLogsTable[]>> => {
  const userObj = typeof user === 'string' ? await userApiHandler.getUser(user) : user
  if (isError(userObj)) {
    return userObj
  }

  const query = `
    user_id,
    log_id (
      template_id (
        name,
        color,
        tags,
        id,
        type,
        created_by,
        id
      ),
      date
    )
  `

  const response = await client
    .from(tables.SAVED_LOGS)
    .select(query)
    .match({ user_id: userObj.data.id.toString() })

  const { data, error } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  return { data }
}

export default {
  getUserSavedLogs,
}
