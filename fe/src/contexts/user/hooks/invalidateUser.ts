import { useQueryClient } from "@tanstack/react-query"



const useInvalidateUser = () => {
    const queryClient = useQueryClient();

    return () => { queryClient.invalidateQueries(['me']); }
}



export default useInvalidateUser