import { NextApiRequest, NextApiResponse } from 'next'

import logEntriesApiHandler from '@lib/API/log-entries'
import { isError } from '@lib/API/helper'

export default async (request: NextApiRequest, response: NextApiResponse) => {
  // lid: Log id
  const {
    query: { lid },
    method,
  } = request

  switch (method) {
    case 'GET': {
      const {
        query: { uuid },
      } = request

      if (!uuid || !lid) {
        response.status(400).send({ msg: 'Please add uuid and logId to the url query' })
        return
      }

      const logIdNumber = parseInt(lid as string, 10)

      if (Number.isNaN(logIdNumber)) {
        response.status(400).send({ msg: 'Please add a valid logId to the query' })
        return
      }

      const serviceResponse = await logEntriesApiHandler.getLogEntries(uuid as string, logIdNumber)
      if (isError(serviceResponse)) {
        response.status(400).send({ msg: serviceResponse.error.msg })
        return
      }

      response.send({ ...serviceResponse })
      return
    }

    case 'POST': {
      const { body } = request
      if (!body || !lid || !body.entries) {
        response.status(400).send({ msg: 'Invalid body structure' })
        return
      }

      const { entries } = body
      const logId = parseInt(lid as string, 10)
      if (Number.isNaN(logId)) {
        response.status(400).send({ msg: 'Please provide a vaild log id' })
        return
      }

      const serviceResponse = await logEntriesApiHandler.postLogEntries(entries, logId)
      if (isError(serviceResponse)) {
        response.status(400).send({ msg: serviceResponse.error.msg })
        return
      }

      response.send({ ...serviceResponse })
      return
    }

    default: {
      response.status(500).send({ msg: 'Operation not supported' })
      return
    }
  }
}
