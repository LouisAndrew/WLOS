import client from '@lib/db'
import tables from '@lib/tables'
import { LibAPIResponse, LibAPIResponseError } from '@t/APIResponse'
import { UserDataTable } from '@t/tables/UserData'
import { isError } from './helper'

/**
 * get user by his/her uuid
 * @param uuid id of the user
 * @returns error if operation is not succesful and the data object
 * if operation is succesful
 */
const getUser = async (uuid: string): Promise<LibAPIResponse<UserDataTable>> => {
  const response = await client.from(tables.USER_DATA).select().match({ uuid })
  const { error, data } = response

  if (error) {
    return { error: { msg: error.message } }
  }

  if (data.length === 0) {
    return { error: { msg: 'User not found' } }
  }

  return { data: data[0] }
}

/**
 * insert user to the user_data table
 * @param uuid id of the user
 * @param data data that's needed to be inserted
 * @returns error if operation is not succesful and uuid of the user if operation
 * is sucesful
 */
const createUser = async (data: UserDataTable): Promise<{ uuid: string } | LibAPIResponseError> => {
  const userObj = await getUser(data.uuid)
  if (!isError(userObj)) {
    return { error: { msg: 'User already exists' } }
  }

  const { error, data: responseData } = await client.from(tables.USER_DATA).insert(data)
  if (error) {
    return { error: { msg: error.message } }
  }

  return {
    uuid: data.uuid,
  }
}

/**
 * updates user based on the uuid and data provided
 * todo: create data type validation
 * @param uuid id of the user
 * @param data data to be updated
 * @returns uuid if operation succesful and error if it's not
 */
const updateUser = async (
  uuid: string,
  data: Partial<UserDataTable>
): Promise<{ uuid: string } | LibAPIResponseError> => {
  const { data: responseData, error } = await client
    .from(tables.USER_DATA)
    .update({ ...data })
    .match({ uuid })

  if (error) {
    return { error: { msg: error.message } }
  }

  if (responseData.length === 0) {
    return { error: { msg: 'Not found' } }
  }

  return {
    uuid: responseData[0].uuid,
  }
}

export default {
  createUser,
  getUser,
  updateUser,
}
