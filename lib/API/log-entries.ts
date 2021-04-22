import tables from '@lib/tables'
import client from '@lib/db'

import { LibAPIResponse } from '@t/APIResponse'
import { CompleteLogTable, LogEntryTable } from '@t/tables/LogEntry'
import { UserDataTable } from '@t/tables/UserData'

import { isError } from './helper'
import userApiHandler from './user'
import logApiHandler from './log'

/**
 * get log entries based on its id
 * @param user user who requested the entries (id / libApiResponse with user data)
 * @param logId id of the log that's requested
 */
const getLogEntries = async (
  user: string | LibAPIResponse<UserDataTable>,
  logId: number
): Promise<LibAPIResponse<CompleteLogTable>> => {
  const userObj = typeof user === 'string' ? await userApiHandler.getUser(user) : user
  const logObj = await logApiHandler.getLog(logId)
  if (isError(userObj)) {
    return userObj
  }
  if (isError(logObj)) {
    return logObj
  }

  // todo: check if user is the creator of the log

  const query = `
    log_id,
    entry_id (
      id,
      exercise_id (
        name,
        tags
      ),
      log
    ),
    order
  `

  const response = await client
    .from(tables.ENTRIES)
    .select(query)
    .match({ log_id: logId.toString() })

  const { error, data } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  return {
    data: {
      ...logObj.data,
      entries: [...data] as LogEntryTable[],
    },
  }
}

export default {
  getLogEntries,
}
