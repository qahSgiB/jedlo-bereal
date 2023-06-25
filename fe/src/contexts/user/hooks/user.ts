import { useContext } from "react"

import { UserContext } from "../userContext"



const useUser = () => {
    return useContext(UserContext);
}



export default useUser;