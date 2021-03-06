import { NextApiRequest, NextApiResponse } from 'next'
import userApiHandler from '@lib/API/user'
import { isError } from '@lib/API/helper'

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request

  switch (method) {
    case 'GET': {
      const {
        query: { uuid },
      } = request
      if (!uuid) {
        response.status(400).send({ msg: 'Please add uuid to the url query' })
        return
      }

      if (uuid === 'ROOT') {
        response.status(401).send({ msg: 'Forbidden access' })
        return
      }

      const serviceResponse = await userApiHandler.getUser(uuid as string)
      if (isError(serviceResponse)) {
        response.status(400).send({ msg: serviceResponse.error.msg })
        return
      }

      response.send({ ...serviceResponse })
      return
    }

    case 'POST': {
      const { body } = request
      if (!body || !body.uuid) {
        response.status(400).send({ msg: 'Invalid data posted' })
        return
      }

      const serviceResponse = await userApiHandler.createUser(body)
      if (isError(serviceResponse)) {
        response.status(400).send({ msg: serviceResponse.error.msg })
        return
      }

      response.send({ ...serviceResponse })
      return
    }

    case 'PUT': {
      const {
        body,
        query: { uuid },
      } = request
      if (!body || !uuid) {
        response.status(400).send({ msg: 'Invalid data posted' })
        return
      }

      const serviceResponse = await userApiHandler.updateUser(uuid as string, body)
      if (isError(serviceResponse)) {
        response.status(400).send({ msg: serviceResponse.error.msg })
        return
      }

      response.send({ ...serviceResponse })
      return
    }

    case 'DELETE': {
      response.status(401).send({ msg: 'Not yet supported' })
      return
    }

    default: {
      response.status(404).send({ msg: 'Not found' })
      return
    }
  }
}
