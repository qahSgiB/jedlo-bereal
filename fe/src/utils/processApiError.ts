import { z } from "shared/zod";

import { KnownErrorFromApi, KnownErrorFromClient } from "../types";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiResponse } from "shared/types";



export const processApiErrorSimple = <TData>(apiResponse: ApiResponse<TData>): TData => {
    if (apiResponse.status !== 'ok') {
        throw new KnownErrorFromApi(apiResponse);
    }

    return apiResponse.data;
}


export const processApiError = <TFieldValues extends FieldValues, TData>(
    apiResponse: ApiResponse<TData>,
    setError: UseFormSetError<TFieldValues>,
    onClientError?: Record<string, { field: Path<TFieldValues>, message: string }>, // [todo] remove ? maybe
    onValidationError?: Record<string, Path<TFieldValues>>,
): TData | undefined => {
    if (apiResponse.status === 'ok') {
        return apiResponse.data;
    }

    if (apiResponse.status === 'error-client' && onClientError !== undefined) {
        const clientError = apiResponse.data;

        if (clientError.code in onClientError) {
            const { field, message } = onClientError[clientError.code];
            setError(field, { message });
            return undefined;
        }
    }

    if (apiResponse.status === 'error-validation' && onValidationError !== undefined) {
        apiResponse.data.issues.forEach(issue => {
            if (issue.path.length !== 1) {
                throw new KnownErrorFromClient('Unknown api validation error');
            }
    
            const field = z.string().parse(issue.path[0]);
    
            if (field in onValidationError) {
                setError(onValidationError[field], { message: issue.message });
            } else {
                throw new KnownErrorFromClient('Unknown api validation error');
            }
        });
        return undefined;
    }

    throw new KnownErrorFromApi(apiResponse);
}