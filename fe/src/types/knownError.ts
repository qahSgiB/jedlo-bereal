import { ApiResponse } from "shared/types";



export class KnownError extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, KnownError.prototype);
    }
}

export class KnownErrorFromApi extends KnownError {
    data: ApiResponse;

    constructor(data: ApiResponse) {
        super();

        this.data = data;

        Object.setPrototypeOf(this, KnownErrorFromApi.prototype);
    }
}

export class KnownErrorFromClient extends KnownError {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, KnownErrorFromClient.prototype);
    }
}