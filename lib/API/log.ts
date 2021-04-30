import client from '@lib/db'
import tables from '@lib/tables'

import { LibAPIResponse } from '@t/APIResponse'
import { LogTable, SavedLogsTable } from '@t/tables/Log'
import { UserDataTable } from '@t/tables/UserData'

import { isError } from './helper'
import userApiHandler from './user'
import templateApiHandler from './template'

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

/**
 * function to get a workout log based on its id
 * @param logId id of the log
 */
const getLog = async (logId: number): Promise<LibAPIResponse<LogTable>> => {
  const query = `
    template_id (
      name,
      color,
      tags,
      id,
      type,
      created_by,
      id
    ),
    date,
    id
  `
  const response = await client
    .from(tables.EXERCISE_LOG)
    .select(query)
    .match({ id: logId.toString() })
  const { error, data } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  if (data.length === 0) {
    return {
      error: { msg: 'Data not found' },
    }
  }

  return {
    data: data[0],
  }
}

/**
 * create a new log to the user's saved entry
 * @param user user id or LibAPIResponse object containing user data
 * @param data data to be created
 */
const createLog = async (
  user: string | LibAPIResponse<UserDataTable>,
  data: LogTable
): Promise<LibAPIResponse<{ log_id: number }>> => {
  const userObj = typeof user === 'string' ? await userApiHandler.getUser(user) : user
  const templateObj = await templateApiHandler.getTemplate(data.template_id as number)
  if (isError(userObj)) {
    return userObj
  }

  // check if template exists
  if (isError(templateObj)) {
    return templateObj
  }

  const { id: _, ...templateData } = data

  const response = await client.from(tables.EXERCISE_LOG).insert(templateData)
  const { data: responseData, error } = response
  if (error) {
    return { error: { msg: error.message } }
  }

  const saveResponse = await client
    .from(tables.SAVED_LOGS)
    .insert({ user_id: userObj.data.id, log_id: responseData[0].id })

  const { error: saveError } = saveResponse
  if (saveError) {
    return { error: { msg: saveError.message } }
  }

  return { data: { log_id: responseData[0].id } }
}

export default {
  getUserSavedLogs,
  getLog,
  createLog,
}
