"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeGraphQLError = function (graphQLError) {
    var _a, _b;
    var errorOptions = {};
    var errorDetails = (_b = (_a = graphQLError.response) === null || _a === void 0 ? void 0 : _a.errors, (_b !== null && _b !== void 0 ? _b : []))[0];
    if (errorDetails) {
        errorOptions.message = errorDetails.message;
        var extensions = errorDetails.extensions;
        if (extensions) {
            errorOptions.status = extensions.status;
            errorOptions.type = extensions.type;
        }
    }
    return errorOptions;
};
//# sourceMappingURL=serializeGraphQLError.js.map