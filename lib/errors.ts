type ErrorOpts = {
  message?: string;
  status?: number;
};

export enum ErrorMessage {
  KONTIST_SDK_ERROR = "An error occurred",
  CHALLENGE_EXPIRED_ERROR = "Challenge expired",
  CHALLENGE_DENIED_ERROR = "Challenge denied",
  MFA_CONFIRMATION_CANCELED_ERROR = "MFA confirmation canceled",
  RENEW_TOKEN_ERROR = "Token renewal failed",
  USER_UNAUTHORIZED_ERROR = "User unauthorized"
}

export enum ErrorStatus {
  USER_UNAUTHORIZED_ERROR = 401
}

export class KontistSDKError extends Error {
  status?: number;

  constructor(opts: ErrorOpts = {}) {
    super(opts.message);
    Object.setPrototypeOf(this, KontistSDKError.prototype);
    this.name = this.constructor.name;
    this.status = opts.status;
  }
}

export class ChallengeExpiredError extends KontistSDKError {
  constructor(opts: ErrorOpts = {}) {
    super({
      message: ErrorMessage.CHALLENGE_EXPIRED_ERROR,
      ...opts
    });
    Object.setPrototypeOf(this, ChallengeExpiredError.prototype);
    this.name = this.constructor.name;
  }
}

export class ChallengeDeniedError extends KontistSDKError {
  constructor(opts: ErrorOpts = {}) {
    super({
      message: ErrorMessage.CHALLENGE_DENIED_ERROR,
      ...opts
    });
    Object.setPrototypeOf(this, ChallengeDeniedError.prototype);
    this.name = this.constructor.name;
  }
}

export class MFAConfirmationCanceledError extends KontistSDKError {
  constructor(opts: ErrorOpts = {}) {
    super({
      message: ErrorMessage.MFA_CONFIRMATION_CANCELED_ERROR,
      ...opts
    });
    Object.setPrototypeOf(this, MFAConfirmationCanceledError.prototype);
    this.name = this.constructor.name;
  }
}

export class UserUnauthorizedError extends KontistSDKError {
  constructor(opts: ErrorOpts = {}) {
    super({
      message: ErrorMessage.USER_UNAUTHORIZED_ERROR,
      ...opts,
      status: ErrorStatus.USER_UNAUTHORIZED_ERROR
    });
    Object.setPrototypeOf(this, UserUnauthorizedError.prototype);
    this.name = this.constructor.name;
  }
}

export class RenewTokenError extends KontistSDKError {
  constructor(opts: ErrorOpts = {}) {
    super({
      message: ErrorMessage.RENEW_TOKEN_ERROR,
      ...opts
    });
    Object.setPrototypeOf(this, RenewTokenError.prototype);
    this.name = this.constructor.name;
  }
}
