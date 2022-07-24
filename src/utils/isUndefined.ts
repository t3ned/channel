/**
 * Check whether a value is undefined
 * @param value The value to check
 *
 * @returns Whether the value is undefined
 */
export const isUndefined = (value: unknown): value is undefined => {
	return typeof value === "undefined";
};
