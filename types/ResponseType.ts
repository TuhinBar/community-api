export interface ResponseType {
    status: boolean;
    content : {
        meta?: {
            total?: number;
            pages?: number;
            page?: number;
        };
        data: [] | {};
    },
    meta?:{
        access_token: string;
    }
}

/**
 * 
 * @param {boolean} status - status of the response.
 * @param {} content - Metadata and response data.
 * @param {} meta - Response meta data e.g {access_token: string}.
 *
 * @returns ResponseData Object.
 */


export class ResponseData implements ResponseType {
    status: boolean;
    content: {
        meta?: {
            total?: number;
            pages?: number;
            page?: number;
        };
        data: [] | {};
    };
    meta?: {
        access_token: string;
    };
    constructor(status: boolean, content: {
        meta?: {
            total?: number;
            pages?: number;
            page?: number;
        };
        data: [] | {};
    }, meta?: {
        access_token: string;
    }) {
        this.status = status;
        this.content = content;
        this.meta = meta;
    }
}