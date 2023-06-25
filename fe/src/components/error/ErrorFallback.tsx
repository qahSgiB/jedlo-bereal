import { useRouteError } from "react-router";

import { KnownErrorFromClient, KnownErrorFromApi } from "../../types";
import ErrorBox from "./ErrorBox";



const ErrorFallback = () => {
    const error = useRouteError();

    if (error instanceof KnownErrorFromClient) {
        return <ErrorBox title='ERROR' message={ error.message } />
    } else if (error instanceof KnownErrorFromApi) {
        const data = error.data;

        if (data.status === 'error-client') {
           return <ErrorBox title='API ERROR' message={ data.data.message } />
        } else if (data.status === 'error-validation') {
            return <ErrorBox title='API ERROR' message='validation' />
        } else {
            return <ErrorBox title='API ERROR' message='unknown' />
        }
    } else {
        return <ErrorBox title='UNKNOWN ERROR' />
    }
}



export default ErrorFallback;