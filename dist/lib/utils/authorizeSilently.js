"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../errors");
exports.authorizeSilently = function (uri, origin, timeout) {
    return new Promise(function (resolve, reject) {
        var timeoutId;
        var iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        var cleanup = function () {
            window.removeEventListener("message", onMessageHandler);
            iframe.remove();
            clearTimeout(timeoutId);
        };
        var onMessageHandler = function (event) {
            var _a, _b, _c;
            if (event.origin !== origin) {
                return;
            }
            cleanup();
            if ((_a = event.data) === null || _a === void 0 ? void 0 : _a.response) {
                var code = event.data.response.code;
                return resolve(code);
            }
            else {
                var error = (_c = (_b = event.data) === null || _b === void 0 ? void 0 : _b.error, (_c !== null && _c !== void 0 ? _c : new errors_1.RenewTokenError({
                    message: "Invalid message received from server"
                })));
                return reject(error);
            }
        };
        window.addEventListener("message", onMessageHandler);
        iframe.src = uri;
        timeoutId = setTimeout(function () {
            cleanup();
            return reject(new errors_1.RenewTokenError({
                message: "Server did not respond with authorization code, aborting."
            }));
        }, timeout);
    });
};
//# sourceMappingURL=authorizeSilently.js.map