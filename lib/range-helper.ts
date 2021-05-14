import { Range } from '@t/Range'
export const rangeToString = (range: Range) => {
  if (!range.end || range.end === -1 || range.end <= range.start) {
    return range.start.toString()
  }

  return `${range.start}-${range.end}`
}
export const stringToRange = (text: string): Range => {
  if (!text.includes('-')) {
    return { start: parseInt(text) }
  }

  const [startStr, endStr] = text.split('-')
  return {
    start: parseInt(startStr),
    end: endStr ? parseInt(endStr) : undefined,
  }
}
