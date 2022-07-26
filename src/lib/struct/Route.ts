import type {
	HTTPMethods,
	FastifyRequest,
	FastifyReply,
	onErrorHookHandler,
	onRequestHookHandler,
	onResponseHookHandler,
	onSendHookHandler,
	onTimeoutHookHandler,
	preHandlerHookHandler,
	preParsingHookHandler,
	preSerializationHookHandler,
	preValidationHookHandler,
} from "fastify";

import type { z, ZodTypeAny } from "zod";
import { ChannelError } from "../../errors/ChannelError";
import { HttpStatus } from "../constants";
import { joinRoutePaths } from "../../utils";
import { Application } from "./Application";

export class Route<Params extends ZodTypeAny, Query extends ZodTypeAny, Body extends ZodTypeAny> {
	/**
	 * The route path
	 */
	public path: Route.Path;

	/**
	 * The route method
	 */
	private _method: Route.Method;

	/**
	 * The supported versions for the route
	 */
	private _versions: string[] = [];

	/**
	 * The default http status for responses
	 */
	private _httpStatus: HttpStatus;

	/**
	 * The schema for the request params
	 */
	private _paramsSchema?: Params;

	/**
	 * The schema for the request query
	 */
	private _querySchema?: Query;

	/**
	 * The schema for request body
	 */
	private _bodySchema?: Body;

	/**
	 * The onRequest hook for the route
	 */
	private _onRequestHook?: onRequestHookHandler;

	/**
	 * The preParsing hook for the route
	 */
	private _preParsingHook?: preParsingHookHandler;

	/**
	 * The preValidation hook for the route
	 */
	private _preValidationHook?: preValidationHookHandler;

	/**
	 * The preHandler hook for the route
	 */
	private _preHandlerHook?: preHandlerHookHandler;

	/**
	 * The preSerialization hook for the route
	 */
	private _preSerializationHook?: preSerializationHookHandler<unknown>;

	/**
	 * The onSend hook for the route
	 */
	private _onSendHook?: onSendHookHandler<unknown>;

	/**
	 * The onResponse hook for the route
	 */
	private _onResponseHook?: onResponseHookHandler;

	/**
	 * The onTimeout hook for the route
	 */
	private _onTimeoutHook?: onTimeoutHookHandler;

	/**
	 * The onError hook for the route
	 */
	private _onErrorHook?: onErrorHookHandler;

	/**
	 * The route handler
	 */
	private _handler: Route.Handler<Params, Query, Body> = () => {
		throw new ChannelError("Handler not implemented");
	};

	/**
	 * @param options The route options
	 */
	public constructor(options: Route.Options<Params, Query, Body>) {
		this.path = options.path;
		this._method = options.method;
		this._httpStatus = options.httpStatus ?? HttpStatus.Ok;
		this._paramsSchema = options.paramsSchema;
		this._querySchema = options.querySchema;
		this._bodySchema = options.bodySchema;
		this._onRequestHook = options.onRequestHook;
		this._preParsingHook = options.preParsingHook;
		this._preValidationHook = options.preValidationHook;
		this._preHandlerHook = options.preHandlerHook;
		this._preSerializationHook = options.preSerializationHook;
		this._onSendHook = options.onSendHook;
		this._onResponseHook = options.onResponseHook;
		this._onTimeoutHook = options.onTimeoutHook;
		this._onErrorHook = options.onErrorHook;
	}

	/**
	 * Add a supported version to the route
	 * @param version The version
	 * @param prefix The version prefix
	 *
	 * @returns The route
	 */
	public version(version: number, prefix = Application.defaultVersionPrefix): this {
		this._versions.push(`${prefix ?? ""}${version}`);

		return this;
	}

	/**
	 * Set the default http status for responses
	 * @param httpStatus The http status
	 *
	 * @returns The route
	 */
	public status(httpStatus: HttpStatus): this {
		this._httpStatus = httpStatus;

		return this;
	}

	/**
	 * Set the params schema
	 * @param schema The validation schema
	 *
	 * @returns The route
	 */
	public params<U extends ZodTypeAny>(schema: U): Route<U, Query, Body> {
		return new Route({
			path: this.path,
			method: this._method,
			httpStatus: this._httpStatus,
			paramsSchema: schema,
			querySchema: this._querySchema,
			bodySchema: this._bodySchema,
		});
	}

	/**
	 * Set the query schema
	 * @param schema The validation schema
	 *
	 * @returns The route
	 */
	public query<U extends ZodTypeAny>(schema: U): Route<Params, U, Body> {
		return new Route({
			path: this.path,
			method: this._method,
			httpStatus: this._httpStatus,
			paramsSchema: this._paramsSchema,
			querySchema: schema,
			bodySchema: this._bodySchema,
		});
	}

	/**
	 * Set the body schema
	 * @param schema The validation schema
	 *
	 * @returns The route
	 */
	public body<U extends ZodTypeAny>(schema: U): Route<Params, Query, U> {
		return new Route({
			path: this.path,
			method: this._method,
			httpStatus: this._httpStatus,
			paramsSchema: this._paramsSchema,
			querySchema: this._querySchema,
			bodySchema: schema,
		});
	}

	/**
	 * Set the handler for the route
	 * @param handler The route handler
	 *
	 * @returns The route
	 */
	public handler(handler: Route.Handler<Params, Query, Body>): this {
		this._handler = handler;

		return this;
	}

	/**
	 * Define the onRequest hook for the route
	 * @param handler The hook handler
	 */
	public onRequest(handler: onRequestHookHandler): this {
		this._onRequestHook = handler;

		return this;
	}

	/**
	 * Define the preParsing hook for the route
	 * @param handler The hook handler
	 */
	public preParsing(handler: preParsingHookHandler): this {
		this._preParsingHook = handler;

		return this;
	}

	/**
	 * Define the preValidation hook for the route
	 * @param handler The hook handler
	 */
	public preValidation(handler: preValidationHookHandler): this {
		this._preValidationHook = handler;

		return this;
	}

	/**
	 * Define the preHandler hook for the route
	 * @param handler The hook handler
	 */
	public preHandler(handler: preHandlerHookHandler): this {
		this._preHandlerHook = handler;

		return this;
	}

	/**
	 * Define the preSerialization hook for the route
	 * @param handler The hook handler
	 */
	public preSerialization<Payload>(handler: preSerializationHookHandler<Payload>): this {
		this._preSerializationHook = handler;

		return this;
	}

	/**
	 * Define the onSend hook for the route
	 * @param handler The hook handler
	 */
	public onSend<Payload>(handler: onSendHookHandler<Payload>): this {
		this._onSendHook = handler;

		return this;
	}

	/**
	 * Define the onResponse hook for the route
	 * @param handler The hook handler
	 */
	public onResponse(handler: onResponseHookHandler): this {
		this._onResponseHook = handler;

		return this;
	}

	/**
	 * Define the onTimeout hook for the route
	 * @param handler The hook handler
	 */
	public onTimeout(handler: onTimeoutHookHandler): this {
		this._onTimeoutHook = handler;

		return this;
	}

	/**
	 * Define the onError hook for the route
	 * @param handler The hook handler
	 */
	public onError(handler: onErrorHookHandler): this {
		this._onErrorHook = handler;

		return this;
	}

	/**
	 * Get the versioned routes
	 */
	public toVersionedRoutes(): Route.VersionedRoute<Params, Query, Body>[] {
		const versions = [...this._versions];
		if (!versions.length) versions.push(Application.defaultVersionSlug);

		return versions.map((version) => ({
			path: joinRoutePaths(Application.routePrefix, version, this.path),
			method: this._method,
			httpStatus: this._httpStatus,
			paramsSchema: this._paramsSchema,
			querySchema: this._querySchema,
			bodySchema: this._bodySchema,
			handler: this._handler,
			onRequest: this._onRequestHook,
			preParsing: this._preParsingHook,
			preValidation: this._preValidationHook,
			preHandler: this._preHandlerHook,
			preSerialization: this._preSerializationHook,
			onSend: this._onSendHook,
			onResponse: this._onResponseHook,
			onTimeout: this._onTimeoutHook,
			onError: this._onErrorHook,
		}));
	}
}

export namespace Route {
	export type Any = Route<ZodTypeAny, ZodTypeAny, ZodTypeAny>;
	export type AnyParsedData = ParsedData<ZodTypeAny, ZodTypeAny, ZodTypeAny>;
	export type Path = `/${string}`;
	export type Method = HTTPMethods;

	export type Handler<Params extends ZodTypeAny, Query extends ZodTypeAny, Body extends ZodTypeAny> = (
		ctx: HandlerContext<Params, Query, Body>,
	) => unknown;

	export interface HandlerContext<
		Params extends ZodTypeAny,
		Query extends ZodTypeAny,
		Body extends ZodTypeAny,
	> {
		req: FastifyRequest;
		reply: FastifyReply;
		parsed: ParsedData<Params, Query, Body>;
	}

	export interface ParsedData<
		Params extends ZodTypeAny,
		Query extends ZodTypeAny,
		Body extends ZodTypeAny,
	> {
		params: z.infer<Params>;
		query: z.infer<Query>;
		body: z.infer<Body>;
	}

	export interface VersionedRoute<
		Params extends ZodTypeAny,
		Query extends ZodTypeAny,
		Body extends ZodTypeAny,
	> {
		path: Path;
		method: Method;
		httpStatus: HttpStatus;
		paramsSchema?: Params;
		querySchema?: Query;
		bodySchema?: Body;
		handler: Handler<Params, Query, Body>;
		onRequest?: onRequestHookHandler;
		preParsing?: preParsingHookHandler;
		preValidation?: preValidationHookHandler;
		preHandler?: preHandlerHookHandler;
		preSerialization?: preSerializationHookHandler<unknown>;
		onSend?: onSendHookHandler<unknown>;
		onResponse?: onResponseHookHandler;
		onTimeout?: onTimeoutHookHandler;
		onError?: onErrorHookHandler;
	}

	export interface Options<Params extends ZodTypeAny, Query extends ZodTypeAny, Body extends ZodTypeAny> {
		/**
		 * The route path
		 */
		path: Path;

		/**
		 * The route method
		 */
		method: Method;

		/**
		 * The default http for responses
		 */
		httpStatus?: HttpStatus;

		/**
		 * The schema for the request params
		 */
		paramsSchema?: Params;

		/**
		 * The schema for the request query
		 */
		querySchema?: Query;

		/**
		 * The schema for the request body
		 */
		bodySchema?: Body;

		/**
		 * The onRequest hook for the route
		 */
		onRequestHook?: onRequestHookHandler;

		/**
		 * The preParsing hook for the route
		 */
		preParsingHook?: preParsingHookHandler;

		/**
		 * The preValidation hook for the route
		 */
		preValidationHook?: preValidationHookHandler;

		/**
		 * The preHandler hook for the route
		 */
		preHandlerHook?: preHandlerHookHandler;

		/**
		 * The preSerialization hook for the route
		 */
		preSerializationHook?: preSerializationHookHandler<unknown>;

		/**
		 * The onSend hook for the route
		 */
		onSendHook?: onSendHookHandler<unknown>;

		/**
		 * The onResponse hook for the route
		 */
		onResponseHook?: onResponseHookHandler;

		/**
		 * The onTimeout hook for the route
		 */
		onTimeoutHook?: onTimeoutHookHandler;

		/**
		 * The onError hook for the route
		 */
		onErrorHook?: onErrorHookHandler;
	}
}

export const Get = (path: Route.Path) => new Route({ path, method: "GET" });
export const Post = (path: Route.Path) => new Route({ path, method: "POST" });
export const Patch = (path: Route.Path) => new Route({ path, method: "PATCH" });
export const Put = (path: Route.Path) => new Route({ path, method: "PUT" });
export const Delete = (path: Route.Path) => new Route({ path, method: "DELETE" });
