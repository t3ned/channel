import { envString } from "./envString";
import { envBoolean } from "./envBoolean";
import { envInteger } from "./envInteger";
import { envNumber } from "./envNumber";

export const env = {
	string: envString,
	boolean: envBoolean,
	integer: envInteger,
	number: envNumber,
};
