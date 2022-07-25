import type { HttpStatus } from "../lib";
import { STATUS_CODES } from "http";
import { ChannelError } from ".";

export class ApiError<ErrorData = unknown> extends ChannelError {
	/**
	 * The internal application error code
	 */
	public code?: string | number;

	/**
	 * The error data
	 */
	public data?: ErrorData;

	/**
	 * The HTTP status code
	 */
	private _status?: HttpStatus;

	/**
	 * The error message
	 */
	private _message?: string;

	/**
	 * Set the HTTP status code
	 * @param status The status
	 *
	 * @returns The ApiError
	 */
	public setStatus(status: HttpStatus): this {
		this._status = status;

		if (!this._message) {
			const statusMessage = STATUS_CODES[this._status];
			if (statusMessage) return this.setMessage(statusMessage);
		}

		return this;
	}

	/**
	 * Set the internal application error code
	 * @param code The code
	 *
	 * @returns The ApiError
	 */
	public setCode(code: string | number): this {
		this.code = code;

		return this;
	}

	/**
	 * Set the error message
	 * @param message The message
	 *
	 * @returns The ApiError
	 */
	public setMessage(message: string): this {
		this._message = message;

		return this;
	}

	/**
	 * Set the error stack
	 * @param stack The stack
	 *
	 * @returns The ApiError
	 */
	public setStack(stack: string): this {
		this.stack = stack;

		return this;
	}

	/**
	 * Set the error data
	 * @param data The data
	 *
	 * @returns The ApiError
	 */
	public setData(data: ErrorData): this {
		this.data = data;

		return this;
	}

	/**
	 * The HTTP status code
	 */
	public get status(): HttpStatus {
		if (!this._status) throw new ChannelError("Missing `status` field");
		return this._status;
	}

	/**
	 * The error message
	 */
	public override get message(): string {
		if (!this._message) throw new ChannelError("Missing `message` field");
		return this._message;
	}

	/**
	 * @returns Get the JSON representation of the ApiError
	 */
	public toJSON(): ApiErrorJson<ErrorData> {
		return {
			code: this.code,
			message: this.message,
			data: this.data,
			stack: this.stack,
		};
	}
}

export interface ApiErrorJson<ErrorData> {
	code?: string | number;
	message: string;
	data?: ErrorData;
	stack?: string;
}
