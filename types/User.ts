export type UserDBSChema = {
  /**
   * name of the user
   */
  name: string
  /**
   * user's email
   */
  email: string
  /**
   * user's id (must be unique)
   */
  uid: string
  settings: {} // todo
}
