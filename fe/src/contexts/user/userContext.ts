import { createContext } from "react";

import { IdModel } from "shared/types";



type UserQuery = {
    user: IdModel | null,
    refetching: boolean
}



export const UserContext = createContext<UserQuery>({ user: null, refetching: false });