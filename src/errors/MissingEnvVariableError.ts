export class MissingEnvVariableError extends Error {
	/**
	 * @param envVariable The name of the env variable
	 */
	public constructor(envVariable: string) {
		super(`Missing environment variable: ${envVariable}`);
	}
}
