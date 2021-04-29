// tailwind colors on (500)
export const colors = [
  'red',
  'yellow',
  'green',
  'blue',
  'indigo',
  'pink',
  'black',
  'white',
] as const
export type Color = typeof colors[number]
export type ColorCode = Record<Color, string>
export const colorCodes: ColorCode = {
  red: '#EF4444',
  yellow: '#F59E0B',
  green: '#10B981',
  blue: '#3B82F6',
  indigo: '#6366F1',
  pink: '#EC4899',
  black: '#0E0E0E',
  // black: '#8A8A8A',
  white: '#FFFFFF',
}

export const colorTable: [Color, string][] = Object.keys(colorCodes).map((key) => [
  key as Color,
  colorCodes[key],
])
