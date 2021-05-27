export type Range = {
  /**
   * Lower limit of the range
   */
  start: number
  /**
   * Upper limit of the range
   */
  end?: number
}

export const defaultRange: Range = {
  start: -1,
  end: undefined,
}
