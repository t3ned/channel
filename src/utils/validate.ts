import type { FastifyRequest } from "fastify";
import { z, ZodTypeAny } from "zod";

export const validate = (req: FastifyRequest, schema: Partial<ValidationSchema>) => {
	// remove entries with undefined values
	const validationSchema = Object.entries(schema).reduce((prev, curr) => {
		if (curr[1]) prev[curr[0]] = curr[1];
		return prev;
	}, {} as Partial<ValidationSchema>);

	const validationKeys = Reflect.ownKeys(validationSchema) as ValidationKey[];

	const requestData = validationKeys.reduce((data, key) => {
		data[key] = req[key];
		return data;
	}, {} as RequestData);

	const shape = z.object(validationSchema);
	return shape.safeParse(requestData);
};

export type ValidationKey = "params" | "query" | "body";
export type ValidationSchema = Record<ValidationKey, ZodTypeAny>;
export type RequestData = Pick<FastifyRequest, ValidationKey>;
