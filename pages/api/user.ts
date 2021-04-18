import { NextApiRequest, NextApiResponse } from 'next'
import userAPIHandler from '@lib/API/user'

/**
 * API endpoint to read / create user-data
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  switch (method) {
    /**
     * get user from user_data endpoint
     */
    case 'GET':
      const {
        query: { email: getEmail },
      } = req
      const userObj = await userAPIHandler.readUser(getEmail as string)
      if (userObj) {
        res.send({ userData: userObj.data })
      } else {
        res.status(404).send({ msg: 'Not Found' })
      }
      return

    /**
     * creates new user document in user-data
     */
    case 'POST':
      const { body: createBody } = req
      const createSuccesful = await userAPIHandler.createUser(createBody)
      if (createSuccesful) {
        res.send({ msg: 'Succesful' })
      } else {
        res.status(400).send({ msg: 'Body must contain name and email' })
      }
      return

    /**
     * deletes user
     */
    case 'DELETE':
      const {
        query: { email: deleteEmail },
      } = req
      const isDeleted = await userAPIHandler.deleteUser(deleteEmail as string)
      if (isDeleted) {
        res.send({ msg: 'Succesful' })
      } else {
        res.status(400).send({ msg: 'Either user is not found or something went wrong' })
      }
      return

    /**
     * updates user data
     */
    case 'PUT':
      const {
        body: updateBody,
        query: { email: updateEmail },
      } = req
      const isUpdated = await userAPIHandler.updateUser(updateBody, updateEmail as string)
      if (isUpdated) {
        res.send({ msg: 'Succesful' })
      } else {
        res.status(400).send({ msg: 'Either user is not found or something went wrong' })
      }
      return

    default:
      res.send({ msg: 'not found' })
      return
  }
}
