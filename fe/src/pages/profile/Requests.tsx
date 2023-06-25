import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

import { ApiResponse, IdModel, UserFriendRequests, CreateFriendRequestData } from 'shared/types';
import { friendRequestApi } from 'shared/api';

import client from '../../axios/client';
import validateApiResponse from '../../utils/validateApiResponse';
import { processApiErrorSimple, processApiError } from '../../utils/processApiError.ts';
import useSetFriendRequestAny from '../../contexts/friendRequestAny/hooks/setFriendRequestAny.ts';

import FriendsNavigation from "../../components/FriendsNavigation";
import RequestChoice from "../../components/RequestChoice";
import RequestNoChoice from '../../components/RequestNoChoice';
import Loading from '../../components/loading/Loading.tsx';

import './Requests.css'

import { FriendRequestData } from 'shared/types';
import profilePictureDefault from '../../utils/profilePictureDefault.ts';


const getRequests = async (): Promise<UserFriendRequests> => {
    const response = await client.get<ApiResponse<friendRequestApi.getAll.Result>>('/friend-request');
    validateApiResponse(response.data);
    return processApiErrorSimple(response.data);
};

const simplePostFriendRequest = <TResult,>(url: string) => async (data: IdModel): Promise<TResult> => {
    const response = await client.post<ApiResponse<TResult>>(url, data);
    validateApiResponse(response.data);
    return processApiErrorSimple(response.data);
}

const postAccept = simplePostFriendRequest<friendRequestApi.accept.Result>('/friend-request/accept');
const postDecline = simplePostFriendRequest<friendRequestApi.decline.Result>('/friend-request/decline');
const postCancel = simplePostFriendRequest<friendRequestApi.cancel.Result>('/friend-request/cancel');


function Requests() {
    const queryClient = useQueryClient();

    const requestsQuery = useQuery(['loggedIn', 'friend-requests'], {
        queryFn: getRequests,
        // staleTime: 10 * 1000, // [todo]
    });

    if (requestsQuery.isError) {
        throw requestsQuery.error;
    }

    const setAny = useSetFriendRequestAny();

    useEffect(() => {
        if (requestsQuery.fetchStatus === 'idle' && requestsQuery.isSuccess) {
            setAny(requestsQuery.data.to.length !== 0);
        }
    }, [requestsQuery.fetchStatus, requestsQuery.isSuccess, requestsQuery.data, setAny]);

    const simplePostSuccessFrom = (_: undefined, data: IdModel) => {
        if (!requestsQuery.isSuccess) {
            queryClient.invalidateQueries(['loggedIn', 'friend-requests']);
            return;
        }

        queryClient.setQueryData(['loggedIn', 'friend-requests'], (requests: UserFriendRequests | undefined) => {
            if (requests === undefined) {
                return undefined;
            }

            return {
                to: requests.to,
                from: requests.from.filter(request => request.id !== data.id),
            }
        });
    };

    const simplePostSuccessTo = (_: undefined, data: IdModel) => {
        if (!requestsQuery.isSuccess) {
            queryClient.invalidateQueries(['loggedIn', 'friend-requests']);
            return;
        }

        queryClient.setQueryData(['loggedIn', 'friend-requests'], (requests: UserFriendRequests | undefined) => {
            if (requests === undefined) {
                return undefined;
            }

            return {
                to: requests.to.filter(request => request.id !== data.id),
                from: requests.from,
            }
        });
    };

    const simpleCreateSuccess = (dataFromServer: FriendRequestData | undefined) => {
        if (dataFromServer === undefined) {
            return;
        }

        if (!requestsQuery.isSuccess) {
            queryClient.invalidateQueries(['loggedIn', 'friend-requests']);
            return;
        }

        queryClient.setQueryData(['loggedIn', 'friend-requests'], (requests: UserFriendRequests | undefined) => {
            if (requests === undefined) {
                return undefined;
            }

            return {
                to: requests.to,
                // from: [{id: dataFromServer.id, user: {id: dataFromServer.toId, username: data.toUsername}}, ...requests.from]
                from: [dataFromServer, ...requests.from]
            }
        });
    };

    const acceptRequestMutation = useMutation({
        mutationFn: postAccept,
        onSuccess: simplePostSuccessTo,
        useErrorBoundary: true,
    });
    const onAccept = (id: number) => {
        acceptRequestMutation.mutate({ id });
    };

    const declineRequestMutation = useMutation({
        mutationFn: postDecline,
        onSuccess: simplePostSuccessTo,
        useErrorBoundary: true,
    });
    const onDecline = (id: number) => {
        declineRequestMutation.mutate({ id });
    };

    const cancelRequestMutation = useMutation({
        mutationFn: postCancel,
        onSuccess: simplePostSuccessFrom,
        useErrorBoundary: true,
    });
    const onCancel = (id: number) => {
        cancelRequestMutation.mutate({ id });
    };


    const createFriendRequest = async (submitData: CreateFriendRequestData): Promise<FriendRequestData | undefined> => {
        console.log('helo');
        const response = await client.post<ApiResponse<friendRequestApi.create.Result>>('/friend-request', submitData);
        validateApiResponse(response.data);
        return processApiError(response.data, setError, {
            'fr-1': { field: 'toUsername', message: 'You cannot send friend request to yourself lol...' },
            'fr-2': { field: 'toUsername', message: 'SERVER ERROR - Id of user sending request doesn\'t exist' },
            'fr-3': { field: 'toUsername', message: 'SERVER ERROR - Id of user to whom request is going to doesn\'t exist' },
            'fr-4': { field: 'toUsername', message: 'Friend request already sent' },
            'fr-5': { field: 'toUsername', message: 'You already have friend request from this user' },
            'fr-6': { field: 'toUsername', message: 'You are already friends...' },
            'fr-7': { field: 'toUsername', message: 'User doesn\'t exist' },
        }, { 'toUsername': 'toUsername' });
    };
    const createRequestMutation = useMutation({
        mutationFn: createFriendRequest,
        onSuccess: simpleCreateSuccess,
        useErrorBoundary: true,
    });
    const onCreate = (data: CreateFriendRequestData) => {
        createRequestMutation.mutate(data);
    };

    //// validation
    const { register, handleSubmit, formState: { errors }, setError } = useForm<CreateFriendRequestData>({
        resolver: zodResolver(friendRequestApi.create.schema.body),
    });

    if (requestsQuery.isLoading) {
        return <Loading />;
    }

    return (
        <div className="requests-background">
            <FriendsNavigation />

            <form className='requests-form' onSubmit={handleSubmit(onCreate)}>
                <h6 className='requests-form-text'>Add new friend:</h6>
                <input {...register('toUsername')} className='requests-form-inputbox' type='text' placeholder="friend's username" />
                {errors.toUsername && <span className="requests-form-inputbox__errormessage">{errors.toUsername.message}</span>}
                <input className='requests-form-button' type='submit' value='Add!' />
            </form>

            {requestsQuery.data.to.map(request =>
                <div key={request.id} className="requests-person">
                    <img className="requests-person-image" src={ profilePictureDefault(request.picture) } alt="profile picture" />
                    <div className="requests-person-texts">
                        <h1 className="requests-person-name">{request.username}</h1>
                        <p className="requests-person-bio">{request.bio}</p>
                    </div>
                    <RequestChoice requestId={request.id} handleAcceptRequest={onAccept} handleRejectRequest={onDecline} />
                </div>
            )}

            {requestsQuery.data.from.map(request =>
                <div key={request.id} className="requests-person">
                    <img className="requests-person-image" src={ profilePictureDefault(request.picture) } alt="profile picture" />
                    <div className="requests-person-texts">
                        <h1 className="requests-person-name">{request.username}</h1>
                        <p className="requests-person-bio">{request.bio}</p>
                    </div>
                    <RequestNoChoice requestId={request.id} handleDeleteRequest={onCancel} />
                </div>
            )}
        </div>
    )
}

export default Requests;
