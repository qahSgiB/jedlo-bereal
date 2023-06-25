import { KnownErrorFromClient } from "../types";
import { responseValidation } from "shared/schemas";



const validateApiResponse = (responseData: unknown) => {
    const responseKnown = responseValidation.apiResponse.safeParse(responseData);
    if (!responseKnown.success) {
        throw new KnownErrorFromClient('Unknown api response');
    }
}



export default validateApiResponse;