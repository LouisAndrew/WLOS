import tables from '@lib/tables'
import client from '@lib/db'

import { LibAPIResponse } from '@t/APIResponse'
import { CompleteLogTable, EntriesTable, LogEntryTable } from '@t/tables/LogEntry'
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

/**
 * save an entry object in the LOG_ENTRY table
 * @param entry entry to be saved in the table
 */
const saveEntry = async (entry: LogEntryTable): Promise<LibAPIResponse<{ entry_id: number }>> => {
  const response = await client.from(tables.LOG_ENTRY).insert(entry)
  const { error, data } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  return { data: { entry_id: data[0].id } }
}

/**
 * function to bind entry with the logId in the entries table
 * @param entry entry to be added
 */
const bindEntry = async (entry: EntriesTable): Promise<LibAPIResponse<{ success: true }>> => {
  const response = await client.from(tables.ENTRIES).insert(entry)
  const { error } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  return { data: { success: true } }
}

/**
 * helper function
 * @param entry
 * @param logId
 */
const postLogEntries = async (
  entries: LogEntryTable[],
  logId: number
): Promise<LibAPIResponse<{ success: true }>> => {
  const logObject = await logApiHandler.getLog(logId)
  if (isError(logObject)) {
    return logObject
  }

  // todo: what to do with the failing data?
  const saveEntryPromises = await Promise.all(
    entries.map(async (entry, index) => {
      const saveResponse = await saveEntry(entry)
      return {
        log_id: logId,
        entry_id: isError(saveResponse) ? -1 : saveResponse.data.entry_id,
        order: index,
      }
    })
  )

  if (!saveEntryPromises.every((savedEntry) => savedEntry.entry_id !== -1)) {
    return { error: { msg: 'Error while saving log entry' } }
  }

  const bindPromises = await Promise.all(
    saveEntryPromises.map((entry) => bindEntry(entry as EntriesTable))
  )

  if (!bindPromises.every((bindedEntry) => !isError(bindEntry))) {
    return { error: { msg: 'Error while binding entry with workout log' } }
  }

  return { data: { success: true } }
}

export default {
  getLogEntries,
  postLogEntries,
}
