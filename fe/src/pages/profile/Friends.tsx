import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiResponse, UserInfoSimple } from 'shared/types';
import { friendApi } from 'shared/api';

import client from '../../axios/client';
import validateApiResponse from '../../utils/validateApiResponse';
import { processApiErrorSimple } from '../../utils/processApiError.ts';

import FriendsNavigation from "../../components/FriendsNavigation";
import Loading from '../../components/loading/Loading.tsx';

import './Friends.css'
import { FriendData } from 'shared/types';
import profilePictureDefault from '../../utils/profilePictureDefault.ts';


function Friends() {
    const queryClient = useQueryClient();

    const postRemoveFriend = async (deleteFriendData: { friendId: number }): Promise<undefined> => {
        const response = await client.post<ApiResponse<friendApi.remove.Result>>('/friend/remove', deleteFriendData);
        validateApiResponse(response.data);
        processApiErrorSimple(response.data);
    };

    const removeFriendMutation = useMutation({
        mutationFn: postRemoveFriend,
        onSuccess: (_, { friendId }) => {
            if (!friendsQuery.isSuccess) {
                queryClient.invalidateQueries(['loggedIn', 'friends']);
                return;
            }

            queryClient.setQueryData(['loggedIn', 'friends'], (friends: UserInfoSimple[] | undefined) => {
                if (friends === undefined) {
                    return undefined;
                } else {
                    return friends.filter(friend => friend.id !== friendId);
                }
            });
        },
        useErrorBoundary: true,
    });

    const onRemoveFriend = (friendId: number) => {
        removeFriendMutation.mutate({ friendId });
    };

    const getFriends = async (): Promise<FriendData[]> => {      
        const response = await client.get<ApiResponse<friendApi.getAll.Result>>('/friend');
        validateApiResponse(response.data);
        console.log(response.data);
        return processApiErrorSimple(response.data);
    };

    const friendsQuery = useQuery(['loggedIn', 'friends'], {
        queryFn: getFriends,
        onSuccess: ( friends ) => {
            console.log("here")
            console.log(friends.at(0)?.picture);
        }
    });

    if (friendsQuery.isError) {
        throw friendsQuery.error;
    }

    if (friendsQuery.isLoading) {
        return <Loading />;
    }

    return (
        <div className="friends-background">
            <FriendsNavigation />
            { friendsQuery.data.map(friend => (
                <div key={ friend.id } className="friends-person">
                <img className="friends-person-image" src={ profilePictureDefault(friend.picture) } alt="profile picture"/>
                <div className="friends-person-texts">
                    <h1 className="friends-person-name">{ friend.username }</h1>
                    <p className="friends-person-bio">{ friend.bio }</p>
                </div>
                <div className='friends-person-delete'>
                    <button type='submit' onClick={ () => onRemoveFriend(friend.id) } className="friends-person-button">
                        <img src='/static/icons/reject_primary.svg' className='friends-person-ximage' alt='x mark icon' />
                    </button>
                </div>
            </div>
            )) }
        </div>
    )
}

export default Friends;