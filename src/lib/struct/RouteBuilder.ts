import type {
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
	FastifyRequest,
	FastifyReply,
} from "fastify";

import type { z, ZodTypeAny } from "zod";
import { ChannelError } from "../../errors/ChannelError";
import { Application } from "./Application";

export class RouteBuilder<
	ParamsSchema extends ZodTypeAny = ZodTypeAny,
	QuerySchema extends ZodTypeAny = ZodTypeAny,
	BodySchema extends ZodTypeAny = ZodTypeAny,
> {
	/**
	 * The version slugs for the route
	 */
	public versions: string[] = [];

	/**
	 * The validation schema for params
	 */
	public paramsValidationSchema!: ParamsSchema;

	/**
	 * The validation schema for query
	 */
	public queryValidationSchema!: QuerySchema;

	/**
	 * The validation schema for body
	 */
	public bodyValidationSchema!: BodySchema;

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
	public _handler: RouteBuilder.Handler<ParamsSchema, QuerySchema, BodySchema> = () => {
		throw new ChannelError("Handler not implemented");
	};

	/**
	 * @param path The route path
	 * @param method The route method
	 */
	public constructor(public path: RouteBuilder.RoutePath, public method: HTTPMethods) {}

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
	 * Set the params schema
	 * @param schema The validation schema
	 *
	 * @returns The route builder
	 */
	public params<U extends ZodTypeAny>(schema: U): RouteBuilder<U, QuerySchema, BodySchema> {
		this.paramsValidationSchema = schema as unknown as ParamsSchema;

		return this as unknown as RouteBuilder<U, QuerySchema, BodySchema>;
	}

	/**
	 * Set the query schema
	 * @param schema The validation schema
	 *
	 * @returns The route builder
	 */
	public query<U extends ZodTypeAny>(schema: U): RouteBuilder<ParamsSchema, U, BodySchema> {
		this.queryValidationSchema = schema as unknown as QuerySchema;

		return this as unknown as RouteBuilder<ParamsSchema, U, BodySchema>;
	}

	/**
	 * Set the body schema
	 * @param schema The validation schema
	 *
	 * @returns The route builder
	 */
	public body<U extends ZodTypeAny>(schema: U): RouteBuilder<ParamsSchema, QuerySchema, U> {
		this.bodyValidationSchema = schema as unknown as BodySchema;

		return this as unknown as RouteBuilder<ParamsSchema, QuerySchema, U>;
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
	public handle(handler: RouteBuilder.Handler<ParamsSchema, QuerySchema, BodySchema>): this {
		this._handler = handler;

		return this;
	}
}

export namespace RouteBuilder {
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

	export interface ValidatedInput<
		Params extends ZodTypeAny = ZodTypeAny,
		Query extends ZodTypeAny = ZodTypeAny,
		Body extends ZodTypeAny = ZodTypeAny,
	> {
		params: z.infer<Params>;
		query: z.infer<Query>;
		body: z.infer<Body>;
	}

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
		parsed: ValidatedInput<Params, Query, Body>;
	}
}

export const Get = (route: RouteBuilder.RoutePath) => new RouteBuilder(route, "GET");
export const Post = (route: RouteBuilder.RoutePath) => new RouteBuilder(route, "POST");
export const Patch = (route: RouteBuilder.RoutePath) => new RouteBuilder(route, "PATCH");
export const Put = (route: RouteBuilder.RoutePath) => new RouteBuilder(route, "PUT");
export const Delete = (route: RouteBuilder.RoutePath) => new RouteBuilder(route, "DELETE");
