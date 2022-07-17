import type { Express } from "express";

import { BaseApplication } from "../../base";

export class Application extends BaseApplication<Express> {
	/**
	 * Listen for connections
	 * @param port The port to bind
	 * @param host The host to bind
	 *
	 * @returns The application
	 */
	public listen(port: number, host?: string): Promise<this> {
		this.port = port;
		this.host = host;

		return new Promise((resolve, reject) => {
			try {
				this.server.listen(port, host, () => resolve(this));
			} catch (error) {
				reject(error);
			}
		});
	}
}
