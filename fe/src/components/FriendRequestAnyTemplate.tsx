import { Outlet } from "react-router-dom";

import FriendRequestAnyContextProvider from "../contexts/friendRequestAny/FriendRequestAnyContextProvider";



const FriendRequestAnyTemplate = () => {
  return (
    <FriendRequestAnyContextProvider>
      <Outlet />
    </FriendRequestAnyContextProvider>
  );
}



export default FriendRequestAnyTemplate;