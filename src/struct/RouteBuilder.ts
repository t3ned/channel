import type {
	RouteHandlerMethod,
	HTTPMethods,
	onRequestHookHandler,
	preParsingHookHandler,
	preValidationHookHandler,
	preHandlerHookHandler,
	preSerializationHookHandler,
	onSendHookHandler,
	onResponseHookHandler,
	onTimeoutHookHandler,
	onErrorHookHandler,
	onReadyHookHandler,
	onCloseHookHandler,
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
	public onRequestHook?: onRequestHookHandler;

	/**
	 * The preParsing hook for the route
	 */
	public preParsingHook?: preParsingHookHandler;

	/**
	 * The preValidation hook for the route
	 */
	public preValidationHook?: preValidationHookHandler;

	/**
	 * The preHandler hook for the route
	 */
	public preHandlerHook?: preHandlerHookHandler;

	/**
	 * The preSerialization hook for the route
	 */
	public preSerializationHook?: preSerializationHookHandler<unknown>;

	/**
	 * The onSend hook for the route
	 */
	public onSendHook?: onSendHookHandler<unknown>;

	/**
	 * The onResponse hook for the route
	 */
	public onResponseHook?: onResponseHookHandler;

	/**
	 * The onTimeout hook for the route
	 */
	public onTimeoutHook?: onTimeoutHookHandler;

	/**
	 * The onError hook for the route
	 */
	public onErrorHook?: onErrorHookHandler;

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
	public onRequest(handler: onRequestHookHandler): this {
		this.onRequestHook = handler;

		return this;
	}
	/**
	 * Define the preParsing hook for the route
	 * @param handler The hook handler
	 */
	public preParsing(handler: preParsingHookHandler): this {
		this.preParsingHook = handler;

		return this;
	}

	/**
	 * Define the preValidation hook for the route
	 * @param handler The hook handler
	 */
	public preValidation(handler: preValidationHookHandler): this {
		this.preValidationHook = handler;

		return this;
	}

	/**
	 * Define the preHandler hook for the route
	 * @param handler The hook handler
	 */
	public preHandler(handler: preHandlerHookHandler): this {
		this.preHandlerHook = handler;

		return this;
	}

	/**
	 * Define the preSerialization hook for the route
	 * @param handler The hook handler
	 */
	public preSerialization<Payload>(handler: preSerializationHookHandler<Payload>): this {
		this.preSerializationHook = handler;

		return this;
	}

	/**
	 * Define the onSend hook for the route
	 * @param handler The hook handler
	 */
	public onSend<Payload>(handler: onSendHookHandler<Payload>): this {
		this.onSendHook = handler;

		return this;
	}

	/**
	 * Define the onResponse hook for the route
	 * @param handler The hook handler
	 */
	public onResponse(handler: onResponseHookHandler): this {
		this.onResponseHook = handler;

		return this;
	}

	/**
	 * Define the onTimeout hook for the route
	 * @param handler The hook handler
	 */
	public onTimeout(handler: onTimeoutHookHandler): this {
		this.onTimeoutHook = handler;

		return this;
	}

	/**
	 * Define the onError hook for the route
	 * @param handler The hook handler
	 */
	public onError(handler: onErrorHookHandler): this {
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
	| onRequestHookHandler
	| preParsingHookHandler
	| preValidationHookHandler
	| preHandlerHookHandler
	| preSerializationHookHandler<unknown>
	| onSendHookHandler<unknown>
	| onResponseHookHandler
	| onTimeoutHookHandler
	| onErrorHookHandler
	| onReadyHookHandler
	| onCloseHookHandler;
