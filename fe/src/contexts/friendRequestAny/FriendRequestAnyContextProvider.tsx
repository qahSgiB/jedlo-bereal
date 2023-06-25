import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { friendRequestApi } from "shared/api";
import { ApiResponse } from "shared/types";

import client from "../../axios/client";
import { processApiErrorSimple } from "../../utils/processApiError";
import validateApiResponse from "../../utils/validateApiResponse";
import FriendRequestAnyContext from "./friendRequestAnyContext";



const getFriendRequestsAny = async (): Promise<boolean> => {
  const response = await client.get<ApiResponse<friendRequestApi.any.Result>>('/friend-request/any');
  validateApiResponse(response.data);
  return processApiErrorSimple(response.data);
}

const FriendRequestAnyContextProvider = (props: { children?: ReactNode }) => {
  const anyQuery = useQuery(['friend-request-any'], {
    queryFn: getFriendRequestsAny,
  });

  if (anyQuery.isError) {
    throw anyQuery.error;
  }

  return (
    <FriendRequestAnyContext.Provider value={ anyQuery.isLoading ? false : anyQuery.data }>
      { props.children }
    </FriendRequestAnyContext.Provider>
  )
}



export default FriendRequestAnyContextProvider;