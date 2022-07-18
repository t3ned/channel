import type { Express } from "express";

import { BaseApplication } from "../../base";
import { ApplicationLoader } from "./ApplicationLoader";

export class Application extends BaseApplication<Express> {
	/**
	 * The application file loader
	 */
	public loader: ApplicationLoader = new ApplicationLoader(this);

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

		await this.loader.loadRoutes();

		return new Promise((resolve, reject) => {
			try {
				if (host) {
					this.server.listen(port, host, () => resolve(this));
				} else {
					this.server.listen(port, () => resolve(this));
				}
			} catch (error) {
				reject(error);
			}
		});
	}
}
