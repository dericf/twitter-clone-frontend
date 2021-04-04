

export class UserNotAuthenticatedError extends Error {
  constructor(message: string) {
    super(message); // (1)
    this.name = "UserNotAuthenticatedError"; // (2)
  }
}