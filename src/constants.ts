export enum HttpStatus {
	// Information responses
	Continue = 100,
	SwitchingProtcols,
	EarlyHints = 103,

	// Successful responses
	Ok = 200,
	Created,
	Accepted,
	NonAuthoritativeInformation,
	NoContent,
	ResetContent,
	PartialContent,

	// Redirectional messages
	MultipleChoices = 300,
	MovedPermanently,
	Found,
	SeeOther,
	NotModified,
	TemporaryRedirect = 307,
	PermanentRedirect,

	// Client error responses
	BadRequest = 400,
	Unauthorized,
	PaymentRequired,
	Forbidden,
	NotFound,
	MethodNotAllowed,
	NotAcceptable,
	ProxyAuthenticationRequired,
	RequestTimeout,
	Conflict,
	Gone,
	LengthRequired,
	PreconditionFailed,
	PayloadTooLarge,
	URITooLong,
	UnsupportedMediaType,
	RangeNotSatisfiable,
	ExpectationFailed,
	ImATeapot,
	UnprocessableEntity = 422,
	TooEarly = 425,
	UpgradeRequired,
	PreconditionRequired = 428,
	TooManyRequests,
	RequestHeaderFieldsTooLarge = 431,
	UnavailableForLegalReasons = 451,

	// Server error responses
	InternalServerError = 500,
	NotImplemented,
	BadGateway,
	ServiceUnavailable,
	GatewayTimeout,
	HTTPVersionNotSupported,
	VariantAlsoNegotiates,
	InsufficientStorage,
	LoopDetected,
	NotExtended,
	NetworkAuthenticationRequired,
}

export enum HttpHeader {
	Authorization = "authorization",
	ContentType = "content-type",
}
