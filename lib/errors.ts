type ErrorOpts = {
  message?: string;
  status?: number;
  type?: ErrorType;
};

export enum ErrorType {
  KONTIST_SDK_ERROR = "KONTIST_SDK_ERROR",
  CHALLENGE_EXPIRED_ERROR = "CHALLENGE_EXPIRED_ERROR",
  CHALLENGE_DENIED_ERROR = "CHALLENGE_DENIED_ERROR",
  USER_UNAUTHORIZED_ERROR = "USER_UNAUTHORIZED_ERROR"
}

export enum ErrorMessage {
  KONTIST_SDK_ERROR = "An error occurred",
  CHALLENGE_EXPIRED_ERROR = "Challenge expired",
  CHALLENGE_DENIED_ERROR = "Challenge denied",
  USER_UNAUTHORIZED_ERROR = "User unauthorized"
}

export enum ErrorStatus {
  USER_UNAUTHORIZED_ERROR = 401
}

export class KontistSDKError extends Error {
  type: string;
  status?: number;

  constructor(opts: ErrorOpts = {}) {
    super(opts.message);
    Object.setPrototypeOf(this, KontistSDKError.prototype);
    this.name = this.constructor.name;
    this.type = opts.type || ErrorType.KONTIST_SDK_ERROR;
    this.status = opts.status;
  }
}

export class ChallengeExpiredError extends KontistSDKError {
  constructor(opts: ErrorOpts = {}) {
    super({
      message: ErrorMessage.CHALLENGE_EXPIRED_ERROR,
      ...opts,
      type: ErrorType.CHALLENGE_EXPIRED_ERROR
    });
    Object.setPrototypeOf(this, ChallengeExpiredError.prototype);
    this.name = this.constructor.name;
  }
}

export class ChallengeDeniedError extends KontistSDKError {
  constructor(opts: ErrorOpts = {}) {
    super({
      message: ErrorMessage.CHALLENGE_DENIED_ERROR,
      ...opts,
      type: ErrorType.CHALLENGE_DENIED_ERROR
    });
    Object.setPrototypeOf(this, ChallengeDeniedError.prototype);
    this.name = this.constructor.name;
  }
}

export class UserUnauthorizedError extends KontistSDKError {
  constructor(opts: ErrorOpts = {}) {
    super({
      message: ErrorMessage.USER_UNAUTHORIZED_ERROR,
      ...opts,
      status: ErrorStatus.USER_UNAUTHORIZED_ERROR,
      type: ErrorType.USER_UNAUTHORIZED_ERROR
    });
    Object.setPrototypeOf(this, UserUnauthorizedError.prototype);
    this.name = this.constructor.name;
  }
}
