import { useQueryClient } from "@tanstack/react-query";



const useLogout = () => {
    const queryClient = useQueryClient();

    return () => {
        queryClient.removeQueries({ queryKey: ['loggedIn'] });
        queryClient.cancelQueries(['me']);
        queryClient.setQueryData(['me'], null);
    };
}



export default useLogout;