import { LibAPIResponse, LibAPIResponseError } from '@t/APIResponse'

export const isError = (response: LibAPIResponse): response is LibAPIResponseError =>
  (<LibAPIResponseError>response).error !== undefined
