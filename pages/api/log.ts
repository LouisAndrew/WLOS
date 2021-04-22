import { NextApiRequest, NextApiResponse } from 'next'
import logApiHandler from '@lib/API/log'
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

      const serviceResponse = await logApiHandler.getUserSavedLogs(uuid as string)
      if (isError(serviceResponse)) {
        response.status(400).send({ msg: serviceResponse.error.msg })
        return
      }

      response.send({ ...serviceResponse })
      return
    }

    case 'POST': {
      // const { body } = request
      // if (!body || !body.name || !body.uuid) {
      //   response.status(400).send({ msg: 'Invalid data posted' })
      //   return
      // }
      // const { uuid, ...exercise } = body
      // const serviceResponse = await exerciseApiHandler.createExercise(uuid, exercise)
      // if (isError(serviceResponse)) {
      //   response.status(400).send({ msg: serviceResponse.error.msg })
      //   return
      // }
      // response.send({ data: { ...serviceResponse } })
      // return
    }

    case 'PUT': {
      // const { body } = request
      // if (!body || !body.id || !body.uuid) {
      //   response.status(400).send({ msg: 'Invalid data posted' })
      //   return
      // }
      // const { uuid, ...exercise } = body
      // const serviceResponse = await exerciseApiHandler.updateExercise(uuid, exercise)
      // if (isError(serviceResponse)) {
      //   response.status(400).send({ msg: serviceResponse.error.msg })
      //   return
      // }
      // response.send(serviceResponse)
      // return
    }

    case 'DELETE': {
      response.status(401).send({ msg: 'Not yet supported' })
    }

    default: {
      response.status(404).send({ msg: 'Not found' })
      return
    }
  }
}
