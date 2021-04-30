import tables from '@lib/tables'
import client from '@lib/db'

import { LibAPIResponse } from '@t/APIResponse'
import { CompleteLogTable, EntriesTable, LogEntryTable } from '@t/tables/LogEntry'
import { UserDataTable } from '@t/tables/UserData'

import { isError } from './helper'
import userApiHandler from './user'
import logApiHandler from './log'
import { differenceBy } from 'lodash'

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
        tags,
        id
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
 * delete an entry from log_entry table
 * @param entryId id of the entry
 */
const deleteEntry = async (entryId: number): Promise<LibAPIResponse<{ success: true }>> => {
  const response = await client.from(tables.LOG_ENTRY).delete().match({ id: entryId.toString() })
  const { error } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  return { data: { success: true } }
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
 * delete an entry from ENTRIES table
 * @param entryId id of the entry
 */
const unbindEntry = async (entryId: number): Promise<LibAPIResponse<{ success: true }>> => {
  const response = await client
    .from(tables.ENTRIES)
    .delete()
    .match({ entry_id: entryId.toString() })
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

/**
 * function to update log entry
 * @param entries ![ALL] entries (also including the new ones)
 * @param logId id of the log
 */
const updateLogEntries = async (
  entries: LogEntryTable[],
  logId: number
): Promise<LibAPIResponse<{ success: true }>> => {
  const logObject = await logApiHandler.getLog(logId)
  const logEntriesObject = await getLogEntries('ROOT', logId)
  if (isError(logObject)) {
    return logObject
  }
  if (isError(logEntriesObject)) {
    return logEntriesObject
  }

  const oldEntries = logEntriesObject.data.entries.map((d: any) => ({
    id: d.entry_id.id as number,
    exercise_id: d.entry_id.exercise_id.id as number,
    log: d.entry_id.log as string,
    order: d.order,
  }))

  const savedPromises = await entries.map(async (entry, index) => {
    const oldIndex = oldEntries.findIndex((value) => value.id === entry.exercise_id)
    // log with the same exercise id exists
    if (oldIndex !== -1) {
      // check if log is the same
      const isChanged = entry.log !== oldEntries[oldIndex].log
      if (isChanged) {
        // update row but still keep its id
        const updateResponse = await client
          .from(tables.ENTRIES)
          .update(entry)
          .match({ id: oldEntries[oldIndex].id.toString() })

        const { error } = updateResponse
        if (error) {
          return { error: { msg: '' } }
        }

        if (oldEntries[oldIndex].order !== index) {
          await client
            .from(tables.LOG_ENTRY)
            .update({ order: index })
            .match({ id: oldEntries[oldIndex].id.toString() })
        }

        return { data: { success: true } }
      }

      return { data: { success: true } }
    }

    const saveResponse = await saveEntry(entry)
    if (isError(saveResponse)) {
      return saveResponse
    }

    const bindResponse = await bindEntry({
      log_id: logId,
      entry_id: saveResponse.data.entry_id,
      order: index,
    } as EntriesTable)

    if (isError(bindResponse)) {
      return bindResponse
    }

    return { data: { success: true } }
  })

  if (!savedPromises.every((promise) => !isError(promise))) {
    return { error: { msg: 'Error while saving new logs' } }
  }

  const toBeRemoved = differenceBy(oldEntries, entries, 'exercise_id')
  const removePromises = await Promise.all(
    toBeRemoved.map(async (entry) => {
      const unbindResponse = await unbindEntry(entry.id)
      if (isError(unbindResponse)) {
        return unbindResponse
      }

      const removeResponse = await deleteEntry(entry.id)
      if (isError(removeResponse)) {
        return removeResponse
      }

      return { data: { success: true } }
    })
  )

  if (!removePromises.every((promise) => !isError(promise))) {
    return { error: { msg: 'Error while removing old logs' } }
  }

  return { data: { success: true } }
}

export default {
  getLogEntries,
  postLogEntries,
  updateLogEntries,
}
