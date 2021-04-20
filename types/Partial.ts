// https://netbasal.com/getting-to-know-the-partial-type-in-typescript-ecfcfbc87cb6
export type Partial<T> = { [P in keyof T]?: T[P] }
