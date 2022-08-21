import { ChannelError } from "./ChannelError";

export class InvalidEnvVariableError extends ChannelError {
	/**
	 * @param envVariable The name of the env variable
	 * @param type The type of env variable
	 */
	public constructor(envVariable: string, type: string) {
		super(`Invalid ${type} environment variable: ${envVariable}`);
	}
}
