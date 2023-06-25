import { useContext } from "react";

import { KnownErrorFromClient } from "../../../types";
import LoggedInContext from "../loggedInContext";



const useLoggedIn = () => {
  const loggedIn = useContext(LoggedInContext);

  if (loggedIn === undefined) {
    throw new KnownErrorFromClient('Fuuuu react');
  }

  return loggedIn;
}



export default useLoggedIn;