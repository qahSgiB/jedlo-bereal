import './Profile.css'
import { useQuery } from '@tanstack/react-query';

import client from '../../axios/client';
import validateApiResponse from '../../utils/validateApiResponse';
import { processApiErrorSimple } from '../../utils/processApiError.ts';
import useFriendRequestAny from '../../contexts/friendRequestAny/hooks/friendRequestAny';

import LinkIcon from '../../components/LinkIcon';

import { userApi } from 'shared/api';
import { Social, ApiResponse, Fyzio as FyzioType } from 'shared/types';
import profilePictureDefault from '../../utils/profilePictureDefault.ts';



function Profile() {
    const friendRequestsAny = useFriendRequestAny();
    
    const source = friendRequestsAny ? "/static/icons/friends-filled-dot.svg" : "/static/icons/friends-filled.svg";
    
    //// get data
    const getUsername = async (): Promise<{ username: string }> => {      
        const response = await client.get<ApiResponse<userApi.getName.Result>>('/user/name')
        const apiResponse = response.data;
        validateApiResponse(apiResponse);
        return processApiErrorSimple(apiResponse);
    };

    const usernameQuery = useQuery(['loggedIn', 'username'], {
        queryFn: getUsername,
    });

    if (usernameQuery.isError) {
        throw usernameQuery.error;
    }

    const getFyzio = async (): Promise<FyzioType> => {      
        const response = await client.get<ApiResponse<userApi.getFyzio.Result>>('/user/fyzio')
        const apiResponse = response.data;
        validateApiResponse(apiResponse);
        return processApiErrorSimple(apiResponse);
    };

    const fyzioQuery = useQuery(['loggedIn', 'fyzio'], {
        queryFn: getFyzio,
    });

    if (fyzioQuery.isError) {
        throw fyzioQuery.error;
    }

    const getSocial = async (): Promise<Social> => {      
        const response = await client.get<ApiResponse<userApi.getSocial.Result>>('/user/social')
        const apiResponse = response.data;
        validateApiResponse(apiResponse);
        return processApiErrorSimple(apiResponse);
    };

    const socialQuery = useQuery(['loggedIn', 'social'], {
        queryFn: getSocial,
    });

    if (socialQuery.isError) {
        throw socialQuery.error;
    }

    const picturePath = profilePictureDefault(socialQuery.data?.picture);

    return (
        <div className="profile-background">
            <div className="profile-top">
                <LinkIcon className='profile-friends' path_to_page='/profile/friends' path_to_image={source}/>
                <LinkIcon className='profile-settings' path_to_page='/profile/settings' path_to_image='/static/icons/settings.svg' />
            </div>
            <img className="profile-picture" 
                src={ picturePath } alt="profile picture" />
            <h2 className='profile-name'>{usernameQuery.data?.username}</h2>
            <div className="basic-info">
                <span className="basic-info-text basic-info-text__names grid1">Age</span>
                <span className="basic-info-text basic-info-text__names grid2">Weight</span>
                <span className="basic-info-text basic-info-text__names grid3">Height</span>
                <span className="basic-info-text basic-info-text__values grid4">{fyzioQuery.data?.age} years</span>
                <span className="basic-info-text basic-info-text__values grid5">{fyzioQuery.data?.weight} kg</span>
                <span className="basic-info-text basic-info-text__values grid6">{fyzioQuery.data?.height} cm</span>
            </div>
            <div className='profile-bio'>
                <span className='basic-info-text basic-info-text__names'>Bio</span>
                <textarea readOnly value={socialQuery.data?.bio} className='profile-bio-textarea' />
            </div>
        </div>
    )
}



export default Profile;