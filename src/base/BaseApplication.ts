import { BaseApplicationLoader } from "./BaseApplicationLoader";
import { apiPathResolver, isClass } from "../utils";

export abstract class BaseApplication<S> {
	/**
	 * The express server
	 */
	public server!: S;

	/**
	 * The application file loader
	 */
	public abstract loader: BaseApplicationLoader<S>;

	/**
	 * The path to the API routes folder
	 */
	public apiPath?: string;

	/**
	 * The host to bind
	 */
	public host?: string;

	/**
	 * The port to bind
	 */
	public port?: number;

	/**
	 * The default route version
	 */
	public defaultVersion?: string;

	/**
	 * The contexts to pass to route handlers
	 */
	public contexts: ContextObj<unknown> = {};

	/**
	 * Create an instance of an express application
	 * @param server The express server
	 */
	public constructor(server: S) {
		Reflect.defineProperty(this, "server", { value: server, enumerable: false });
	}

	/**
	 * Set the path where the API routes are located
	 * @param path The API route path
	 * @param resolver The resolver for the path
	 */
	public setApiPath(path: string, resolver: ApiPathResolver = "dirname"): this {
		this.apiPath = apiPathResolver(path, resolver);

		return this;
	}

	/**
	 * Add a context
	 * @param contextName The name of the context
	 * @param context The context
	 *
	 * @returns The application
	 */
	public addContext<T>(contextName: string, context: Context<T>): this {
		this.contexts[contextName] = context;

		return this;
	}

	/**
	 * Add a class context - an instance of the classes will be created
	 * @param contextName The name of the context
	 * @param context The context
	 *
	 * @returns The application
	 */
	public addClassContext<T>(contextName: string, context: ContextClass<T>): this {
		if (isClass(context)) return this.addContext(contextName, new context());
		if (!this.contexts[contextName] || typeof this.contexts[contextName] !== "object")
			this.contexts[contextName] = {};

		for (const [key, value] of Object.entries(context).filter(isClass)) {
			(this.contexts[contextName] as object)[key] = new value();
		}

		return this;
	}

	/**
	 * Set the default route version
	 * @param version The version number
	 * @param prefix The version prefix
	 *
	 * @returns The application
	 */
	public setDefaultVersion(version: number, prefix = "v"): this {
		this.defaultVersion = `${prefix}${version}`;

		return this;
	}

	/**
	 * Listen for connections
	 * @param port The port to bind
	 * @param host The host to bind
	 *
	 * @returns The application
	 */
	public abstract listen(port: number, host?: string): Promise<this>;
}

export type ApiPathResolver = "dirname" | "cwd";
export type ContextConstructor<T> = new () => T;

export type ContextObj<T> = { [k: string]: T };
export type Context<T> = ContextObj<T> | T;
export type ContextClass<T> = ContextObj<ContextConstructor<T>> | ContextConstructor<T>;
