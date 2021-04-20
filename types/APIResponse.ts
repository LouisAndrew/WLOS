export type LibAPIResponseError = {
  /**
   * specifies an error and its err message
   */
  error: {
    msg: string
  }
}

/**
 * type of the response that should be returned upon calling
 * API handler functions within the lib/API files
 */
export type LibAPIResponse<T = any> =
  | {
      /**
       * returns data requested
       */
      data: T
    }
  | LibAPIResponseError
