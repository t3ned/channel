import type {
	RouteHandlerMethod,
	HTTPMethods,
	onRequestAsyncHookHandler,
	preParsingAsyncHookHandler,
	preValidationAsyncHookHandler,
	preHandlerAsyncHookHandler,
	preSerializationAsyncHookHandler,
	onSendAsyncHookHandler,
	onResponseAsyncHookHandler,
	onTimeoutAsyncHookHandler,
	onErrorAsyncHookHandler,
	onReadyAsyncHookHandler,
	onCloseAsyncHookHandler,
} from "fastify";

import { Application } from "./Application";

export class RouteBuilder {
	/**
	 * The version slugs for the route
	 */
	public versions: string[] = [];

	/**
	 * The onRequest hook for the route
	 */
	public onRequestHook?: onRequestAsyncHookHandler;

	/**
	 * The preParsing hook for the route
	 */
	public preParsingHook?: preParsingAsyncHookHandler;

	/**
	 * The preValidation hook for the route
	 */
	public preValidationHook?: preValidationAsyncHookHandler;

	/**
	 * The preHandler hook for the route
	 */
	public preHandlerHook?: preHandlerAsyncHookHandler;

	/**
	 * The preSerialization hook for the route
	 */
	public preSerializationHook?: preSerializationAsyncHookHandler<unknown>;

	/**
	 * The onSend hook for the route
	 */
	public onSendHook?: onSendAsyncHookHandler<unknown>;

	/**
	 * The onResponse hook for the route
	 */
	public onResponseHook?: onResponseAsyncHookHandler;

	/**
	 * The onTimeout hook for the route
	 */
	public onTimeoutHook?: onTimeoutAsyncHookHandler;

	/**
	 * The onError hook for the route
	 */
	public onErrorHook?: onErrorAsyncHookHandler;

	/**
	 * The route handler
	 */
	public _handler: RouteHandlerMethod = () => {
		throw new Error("Handler not implemented");
	};

	/**
	 * @param path The route path
	 * @param method The route method
	 */
	public constructor(public path: RoutePath, public method: HTTPMethods) {}

	/**
	 * Add a supported version to the route
	 * @param version The version
	 * @param prefix The version prefix
	 *
	 * @returns The route builder
	 */
	public version(version: number, prefix = Application.defaultVersionPrefix): this {
		this.versions.push(`${prefix ?? ""}${version}`);

		return this;
	}
	/**
	 * Define the onRequest hook for the route
	 * @param handler The hook handler
	 */
	public onRequest(handler: onRequestAsyncHookHandler): this {
		this.onRequestHook = handler;

		return this;
	}
	/**
	 * Define the preParsing hook for the route
	 * @param handler The hook handler
	 */
	public preParsing(handler: preParsingAsyncHookHandler): this {
		this.preParsingHook = handler;

		return this;
	}

	/**
	 * Define the preValidation hook for the route
	 * @param handler The hook handler
	 */
	public preValidation(handler: preValidationAsyncHookHandler): this {
		this.preValidationHook = handler;

		return this;
	}

	/**
	 * Define the preHandler hook for the route
	 * @param handler The hook handler
	 */
	public preHandler(handler: preHandlerAsyncHookHandler): this {
		this.preHandlerHook = handler;

		return this;
	}

	/**
	 * Define the preSerialization hook for the route
	 * @param handler The hook handler
	 */
	public preSerialization<Payload>(handler: preSerializationAsyncHookHandler<Payload>): this {
		this.preSerializationHook = handler;

		return this;
	}

	/**
	 * Define the onSend hook for the route
	 * @param handler The hook handler
	 */
	public onSend<Payload>(handler: onSendAsyncHookHandler<Payload>): this {
		this.onSendHook = handler;

		return this;
	}

	/**
	 * Define the onResponse hook for the route
	 * @param handler The hook handler
	 */
	public onResponse(handler: onResponseAsyncHookHandler): this {
		this.onResponseHook = handler;

		return this;
	}

	/**
	 * Define the onTimeout hook for the route
	 * @param handler The hook handler
	 */
	public onTimeout(handler: onTimeoutAsyncHookHandler): this {
		this.onTimeoutHook = handler;

		return this;
	}

	/**
	 * Define the onError hook for the route
	 * @param handler The hook handler
	 */
	public onError(handler: onErrorAsyncHookHandler): this {
		this.onErrorHook = handler;

		return this;
	}

	/**
	 * Set the handler for the route
	 * @param handler The route handler
	 *
	 * @returns The route builder
	 */
	public handle(handler: RouteHandlerMethod): this {
		this._handler = handler;

		return this;
	}
}

export const Get = (route: RoutePath) => new RouteBuilder(route, "GET");
export const Post = (route: RoutePath) => new RouteBuilder(route, "POST");
export const Patch = (route: RoutePath) => new RouteBuilder(route, "PATCH");
export const Put = (route: RoutePath) => new RouteBuilder(route, "PUT");
export const Delete = (route: RoutePath) => new RouteBuilder(route, "DELETE");

export type RoutePath = `/${string}`;

export type Hook =
	| onRequestAsyncHookHandler
	| preParsingAsyncHookHandler
	| preValidationAsyncHookHandler
	| preHandlerAsyncHookHandler
	| preSerializationAsyncHookHandler<unknown>
	| onSendAsyncHookHandler<unknown>
	| onResponseAsyncHookHandler
	| onTimeoutAsyncHookHandler
	| onErrorAsyncHookHandler
	| onReadyAsyncHookHandler
	| onCloseAsyncHookHandler;
