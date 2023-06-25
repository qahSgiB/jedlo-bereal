import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { ApiResponse } from 'shared/types';
import { authApi } from 'shared/api';

import client from '../../axios/client';
import validateApiResponse from '../../utils/validateApiResponse';
import { processApiErrorSimple } from '../../utils/processApiError.ts';

import LinkIcon from '../../components/LinkIcon.tsx';

import './ProfileSettings.css'
import useLogout from '../../contexts/user/hooks/logout.ts';




function ProfileSettings() {
    const postLogout = async (): Promise<void> => {
        const response = await client.post<ApiResponse<authApi.logout.Result>>('/auth/logout');
        validateApiResponse(response.data);
        processApiErrorSimple(response.data);
    }

    const navigate = useNavigate();
    const logout = useLogout();

    const logoutMutation = useMutation({
        mutationFn: postLogout,
        onSuccess: () => {
            logout();
            navigate('/profile/login');
        },
        useErrorBoundary: true,
    });

    const onLogout = () => {
        logoutMutation.mutate();
    }

    return (
        <div className='profile-settings-background'>
            <nav className='profile-settings-navbar'>
                <LinkIcon className='profile-settings-icon' path_to_page='/profile' path_to_image='/static/icons/go_back.svg'/>
                <button className='logout-button' onClick={onLogout}>
                    <img className='profile-settings-icon' src='../../../static/icons/logout.svg' alt='logout icon'></img>
                </button>
            </nav>
            <img src='../../../static/icons/snoopy.png' alt='snoopy doggo' className='snoopy-doggo'></img>
            <div className='profile-settings-links'>
                {/* <Link className='profile-settings-link flex-col-center' to='/profile/settings/account'>
                    <p>Change account data</p>
                </Link> */}
                <Link className='profile-settings-link flex-col-center' to='/profile/settings/edit'>
                    <p>Edit profile</p>
                </Link>
                <Link className='profile-settings-link flex-col-center' to='/profile/settings/goals'>
                    <p>Goals</p>
                </Link>
                <Link className='profile-settings-link flex-col-center' to='/profile/settings/fyzio'>
                    <p>Body stats</p>
                </Link>
            </div>
        </div>

    )
}

export default ProfileSettings;