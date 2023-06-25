import { useQueryClient } from "@tanstack/react-query";



const useSetFriendRequestAny = () => {
	const queryClient = useQueryClient();

    return (data: boolean) => { queryClient.setQueryData(['friend-request-any'], data); }
}



export default useSetFriendRequestAny;