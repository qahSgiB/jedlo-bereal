import { useQueryClient } from "@tanstack/react-query";

import { IdModel } from "shared/types";



const useSetUser = () => {
    const queryClient = useQueryClient();

    return (user: IdModel | null) => { queryClient.setQueryData(['me'], user); };
}



export default useSetUser;