"use strict";
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
var ResultPage = /** @class */ (function () {
    function ResultPage(model, items, pageInfo, args) {
        this.items = items;
        this.pageInfo = pageInfo;
        if (pageInfo.hasNextPage) {
            this.nextPage = function () {
                return model.fetch(__assign(__assign({}, args), { after: pageInfo.endCursor }));
            };
        }
        if (pageInfo.hasPreviousPage) {
            this.previousPage = function () {
                return model.fetch(__assign(__assign({}, args), { before: pageInfo.startCursor }));
            };
        }
    }
    return ResultPage;
}());
exports.ResultPage = ResultPage;
//# sourceMappingURL=resultPage.js.map