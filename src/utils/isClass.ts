/**
 * Check whether a value is a class
 * @param value The value to check
 *
 * @returns Whether the value is a class
 */
export const isClass = <T>(value: unknown): value is Class<T> => {
	return typeof value === "function" && typeof value.prototype === "object";
};

export type Class<T> = new () => T;
