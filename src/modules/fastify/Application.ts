import type { FastifyInstance } from "fastify";

import { BaseApplication } from "../../base";

export class Application extends BaseApplication<FastifyInstance> {
	/**
	 * Listen for connections
	 * @param port The port to bind
	 * @param host The host to bind
	 *
	 * @returns The application
	 */
	public async listen(port: number, host?: string): Promise<this> {
		this.port = port;
		this.host = host;

		await this.server.listen({ port, host });

		return this;
	}
}
