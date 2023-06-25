import { ReactNode } from "react";

import { KnownErrorFromClient } from "../../types";
import useUser from "../user/hooks/user";
import LoggedInContext from "./loggedInContext";



const LoggedInContextProvider = (props: { children?: ReactNode }) => {
  const user = useUser();

  if (user.user === null) {
    throw new KnownErrorFromClient('Expected loggedin user');
  }

  return (
    <LoggedInContext.Provider value={ user.user }>
      { props.children }
    </LoggedInContext.Provider>
  )
}



export default LoggedInContextProvider;