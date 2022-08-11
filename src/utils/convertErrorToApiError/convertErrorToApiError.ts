import { ApiError, HttpStatus } from "../..";

/**
 * Convert an error into an api error
 * @param error The error
 *
 * @returns The ApiError
 */
export const convertErrorToApiError = (error: Error): ApiError => {
	if (error instanceof ApiError) return error;

	const apiError = new ApiError()
		.setCode(0)
		.setStatus(HttpStatus.InternalServerError)
		.setMessage("Internal Server Error");

	return error.stack ? apiError.setStack(error.stack) : apiError;
};
