import { useContext } from "react";
import FriendRequestAnyContext from "../friendRequestAnyContext";



const useFriendRequestAny = () => {
	return useContext(FriendRequestAnyContext)
}



export default useFriendRequestAny;