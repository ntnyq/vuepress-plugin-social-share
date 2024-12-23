/**
 * Check if the given value is a string
 * @param value - value to be checked
 * @returns `true` if given a string
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}
