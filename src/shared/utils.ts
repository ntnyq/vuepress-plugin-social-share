/**
 * Checks whether the given value is a primitive string.
 *
 * @param value - Unknown value to inspect.
 * @returns true for a string, narrowing the value to string.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Uppercases the first character while preserving the remaining text.
 *
 * @param value - Text whose first character should be capitalized.
 * @returns The capitalized text, or an empty string when the input is empty.
 */
export function upperFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
