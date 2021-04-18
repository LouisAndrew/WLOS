import { Client, query } from 'faunadb'
import dotenv from 'dotenv'
dotenv.config({})

const { FAUNA_KEY } = process.env

const client = new Client({
  secret: FAUNA_KEY,
  queryTimeout: 1000,
})

export { query, client }
