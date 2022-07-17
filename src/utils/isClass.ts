import type { ContextConstructor } from "../base/Application";

/**
 * Check whether a value is a class
 * @param value The value to check
 *
 * @returns Whether the value is a class
 */
export const isClass = <T>(value: unknown): value is ContextConstructor<T> => {
	return typeof value === "function" && typeof value.prototype === "object";
};
