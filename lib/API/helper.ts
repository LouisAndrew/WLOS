import { LibAPIResponse, LibAPIResponseError } from '@t/APIResponse'

export const isError = <T>(response: LibAPIResponse<T> | any): response is LibAPIResponseError =>
  (<LibAPIResponseError>response).error !== undefined
