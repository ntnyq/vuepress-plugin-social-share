/**
 * Check if the given value is a string
 * @param value - value to be checked
 * @returns `true` if given a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Upper the first letter of given string
 * @param value - string to be change
 * @returns changed string
 */
export function upperFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
