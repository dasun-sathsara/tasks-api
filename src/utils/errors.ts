// custom authentication error
class AuthError extends Error {
	constructor(public message: string) {
		super(message);

		// Set the prototype explicitly to preserve the instanceof check
		Object.setPrototypeOf(this, AuthError.prototype);
	}
}

export { AuthError };
