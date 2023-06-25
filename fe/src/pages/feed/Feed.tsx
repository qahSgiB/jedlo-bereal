import './Feed.css'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

import { useQuery } from '@tanstack/react-query';
import client from '../../axios/client';
import { ApiResponse } from 'shared/types';
import validateApiResponse from '../../utils/validateApiResponse';
import { processApiErrorSimple } from '../../utils/processApiError.ts';
import { postApi } from 'shared/api';

import { Post as PostType } from 'shared/types';
import { getBeUrlStatic } from '../../utils/getBeUrl.ts';
import profilePictureDefault from '../../utils/profilePictureDefault.ts';



// Function to use with onClick -> scrolls to top of the page
const goToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

function Feed() {
    const getPosts = async (): Promise<Array<PostType>> => {      
        const response = await client.get<ApiResponse<postApi.getAll.Result>>('/post')
        const apiResponse = response.data;
        validateApiResponse(apiResponse);
        const data = processApiErrorSimple(apiResponse);
        return data;
    };

    const postsQuery = useQuery(['loggedIn', 'posts'], {
        queryFn: getPosts,
    });

    if (postsQuery.isError) {
        throw postsQuery.error;
    }

    return (
        <div className='feed-background'>
            <nav className='feed-navbar'>
                <h1 className='feed-appname'>CalorieS</h1>
            </nav>
            
            <main className='feed-posts'>
                {
                    postsQuery.data === undefined 
                    ? <p>No posts from database</p> 
                    : postsQuery.data.map( (post) => 
                        <div key={post.id} className='feed-post'>
                            <div className='feed-post-profile'>
                                <img src={ profilePictureDefault(post.creator.picture) } className='feed-post-ppic' alt='profile picture'/>
                                <h2 className='feed-post-name'>{post.creator.username}</h2>
                            </div>
                            <img src={getBeUrlStatic() + post.picture} className='feed-post-pic'/>
                            <span className='feed-post-added'>Added: {dayjs(post.createdAt).fromNow()}</span>
                        </div>
                    )
                }
            </main>
            
            <footer className='feed-footer'>
                <span>Wow, you scrolled all the way down. 
                    Sadly, there are no more posts, 
                    but you can go <button onClick={goToTop} className='feed-footer-link'>back up</button> and 
                    take the journey once again...</span>
            </footer>
        </div>
    )
}

export default Feed;