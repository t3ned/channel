import type { FastifyRequest } from "fastify";
import { removeUndefinedEntries } from "..";
import { z, ZodTypeAny } from "zod";

export const validate = (req: FastifyRequest, schema: Partial<ValidationSchema>) => {
	const validationSchema = removeUndefinedEntries(schema);
	const shape = z.object(validationSchema);
	return shape.safeParse(req);
};

export type ValidationKey = "params" | "query" | "body";
export type ValidationSchema = Record<ValidationKey, ZodTypeAny>;
