import { ChannelError } from "./ChannelError";

export class MissingEnvVariableError extends ChannelError {
	/**
	 * @param envVariable The name of the env variable
	 */
	public constructor(envVariable: string) {
		super(`Missing environment variable: ${envVariable}`);
	}
}
