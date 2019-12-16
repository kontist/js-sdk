"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage;
(function (ErrorMessage) {
    ErrorMessage["KONTIST_SDK_ERROR"] = "An error occurred";
    ErrorMessage["CHALLENGE_EXPIRED_ERROR"] = "Challenge expired";
    ErrorMessage["CHALLENGE_DENIED_ERROR"] = "Challenge denied";
    ErrorMessage["MFA_CONFIRMATION_CANCELED_ERROR"] = "MFA confirmation canceled";
    ErrorMessage["RENEW_TOKEN_ERROR"] = "Token renewal failed";
    ErrorMessage["USER_UNAUTHORIZED_ERROR"] = "User unauthorized";
    ErrorMessage["GRAPHQL_ERROR"] = "An error occurred while processing the GraphQL query";
})(ErrorMessage = exports.ErrorMessage || (exports.ErrorMessage = {}));
var ErrorStatus;
(function (ErrorStatus) {
    ErrorStatus[ErrorStatus["USER_UNAUTHORIZED_ERROR"] = 401] = "USER_UNAUTHORIZED_ERROR";
})(ErrorStatus = exports.ErrorStatus || (exports.ErrorStatus = {}));
var KontistSDKError = /** @class */ (function (_super) {
    __extends(KontistSDKError, _super);
    function KontistSDKError(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, opts.message) || this;
        Object.setPrototypeOf(_this, KontistSDKError.prototype);
        _this.name = _this.constructor.name;
        _this.status = opts.status;
        _this.type = opts.type;
        return _this;
    }
    return KontistSDKError;
}(Error));
exports.KontistSDKError = KontistSDKError;
var ChallengeExpiredError = /** @class */ (function (_super) {
    __extends(ChallengeExpiredError, _super);
    function ChallengeExpiredError(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, __assign({ message: ErrorMessage.CHALLENGE_EXPIRED_ERROR }, opts)) || this;
        Object.setPrototypeOf(_this, ChallengeExpiredError.prototype);
        _this.name = _this.constructor.name;
        return _this;
    }
    return ChallengeExpiredError;
}(KontistSDKError));
exports.ChallengeExpiredError = ChallengeExpiredError;
var ChallengeDeniedError = /** @class */ (function (_super) {
    __extends(ChallengeDeniedError, _super);
    function ChallengeDeniedError(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, __assign({ message: ErrorMessage.CHALLENGE_DENIED_ERROR }, opts)) || this;
        Object.setPrototypeOf(_this, ChallengeDeniedError.prototype);
        _this.name = _this.constructor.name;
        return _this;
    }
    return ChallengeDeniedError;
}(KontistSDKError));
exports.ChallengeDeniedError = ChallengeDeniedError;
var MFAConfirmationCanceledError = /** @class */ (function (_super) {
    __extends(MFAConfirmationCanceledError, _super);
    function MFAConfirmationCanceledError(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, __assign({ message: ErrorMessage.MFA_CONFIRMATION_CANCELED_ERROR }, opts)) || this;
        Object.setPrototypeOf(_this, MFAConfirmationCanceledError.prototype);
        _this.name = _this.constructor.name;
        return _this;
    }
    return MFAConfirmationCanceledError;
}(KontistSDKError));
exports.MFAConfirmationCanceledError = MFAConfirmationCanceledError;
var UserUnauthorizedError = /** @class */ (function (_super) {
    __extends(UserUnauthorizedError, _super);
    function UserUnauthorizedError(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, __assign(__assign({ message: ErrorMessage.USER_UNAUTHORIZED_ERROR }, opts), { status: ErrorStatus.USER_UNAUTHORIZED_ERROR })) || this;
        Object.setPrototypeOf(_this, UserUnauthorizedError.prototype);
        _this.name = _this.constructor.name;
        return _this;
    }
    return UserUnauthorizedError;
}(KontistSDKError));
exports.UserUnauthorizedError = UserUnauthorizedError;
var RenewTokenError = /** @class */ (function (_super) {
    __extends(RenewTokenError, _super);
    function RenewTokenError(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, __assign({ message: ErrorMessage.RENEW_TOKEN_ERROR }, opts)) || this;
        Object.setPrototypeOf(_this, RenewTokenError.prototype);
        _this.name = _this.constructor.name;
        return _this;
    }
    return RenewTokenError;
}(KontistSDKError));
exports.RenewTokenError = RenewTokenError;
var GraphQLError = /** @class */ (function (_super) {
    __extends(GraphQLError, _super);
    function GraphQLError(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, __assign({ message: ErrorMessage.GRAPHQL_ERROR }, opts)) || this;
        Object.setPrototypeOf(_this, GraphQLError.prototype);
        _this.name = _this.constructor.name;
        return _this;
    }
    return GraphQLError;
}(KontistSDKError));
exports.GraphQLError = GraphQLError;
//# sourceMappingURL=errors.js.map