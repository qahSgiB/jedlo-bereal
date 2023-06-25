import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { ApiResponse, IdModel } from "shared/types";
import { authApi } from "shared/api";

import client from "../../axios/client";
import { UserContext } from "./userContext";
import validateApiResponse from "../../utils/validateApiResponse";

import Loading from "../../components/loading/Loading";
import { processApiErrorSimple } from "../../utils/processApiError";



const getMe = async (): Promise<IdModel | null> => {
    const response = await client.get<ApiResponse<authApi.me.Result>>('/auth/me');

    // await new Promise((res, _rej) => { setTimeout(() => { res(undefined); }, 5000); });

    validateApiResponse(response.data);
    return processApiErrorSimple(response.data);
}


const UserContextProvider = (props: { children?: ReactNode }) => {
    const meQuery = useQuery(['me'], {
        queryFn: getMe
    });

    if (meQuery.isError) {
        throw meQuery.error;
    }

    if (meQuery.isLoading) {
        return (<Loading />);
    }

    return (
        <UserContext.Provider value={ { user: meQuery.data, refetching: meQuery.isFetching } }>
            { props.children }
        </UserContext.Provider>
    )
}



export default UserContextProvider