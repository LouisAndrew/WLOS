import { Table } from './Table'
export type UserDataTable = Table & {
  /**
   * name of the user
   */
  name: string
  /**
   * stringified version of the user's settings
   */
  settings?: string
  /**
   * user uid
   */
  uuid: string
  /**
   * user email
   */
  email: string
}
