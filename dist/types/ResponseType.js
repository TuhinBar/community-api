"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseData = void 0;
/**
 *
 * @param {boolean} status - status of the response.
 * @param {} content - Metadata and response data.
 * @param {} meta - Response meta data e.g {access_token: string}.
 *
 * @returns ResponseData Object.
 */
class ResponseData {
    constructor(status, content, meta) {
        this.status = status;
        this.content = content;
        this.meta = meta;
    }
}
exports.ResponseData = ResponseData;
//# sourceMappingURL=ResponseType.js.map