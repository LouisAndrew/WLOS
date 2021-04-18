import { client, query } from '@lib/db'

const { Get, Match, Index, Create, Collection, Delete, Update } = query

const checkQueryCreateUser = (body: any) => body.name && body.email

/**
 * reads user-data based on email provided
 * @param email
 */
const readUser = async (email: string): Promise<{ data: any; ref: any } | null> => {
  try {
    const response = await client.query(Get(Match(Index('user_by_email'), email || '')))
    if (response['data']) {
      return { data: response['data'], ref: response['ref'] }
    }
  } catch (e) {
    console.error(e)
    // return null if user is not found or or faulty
    return null
  }
}

/**
 * create new document in user-data
 * @param body request body
 */
const createUser = async (body: any): Promise<boolean> => {
  if (!checkQueryCreateUser(body)) {
    return false
  }

  const data = { ...body, email: body.email.toLowerCase(), settings: body.settings ?? {} }
  const alreadyExist = await readUser(data.email)
  if (!alreadyExist) {
    try {
      const response = await client.query(Create(Collection('user_data'), { data }))
      return !!response
    } catch (e) {
      console.error(e)
      return false
    }
  }

  return false
}

/**
 * remove user from DB based on email
 * @param email email of the user
 */
const deleteUser = async (email: string): Promise<boolean> => {
  const userObj = await readUser(email)
  if (!userObj) {
    return false
  }

  try {
    await client.query(Delete(userObj.ref))
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

/**
 * updates user document
 * @param data data to be set in the document
 * @param email email of the user
 */
const updateUser = async (data: any, email: string): Promise<boolean> => {
  const userObj = await readUser(email)
  if (!userObj) {
    return false
  }

  try {
    await client.query(Update(userObj.ref, { data }))
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export default {
  readUser,
  createUser,
  deleteUser,
  updateUser,
}
