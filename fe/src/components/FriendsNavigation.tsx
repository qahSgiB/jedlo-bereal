import useFriendRequestAny from '../contexts/friendRequestAny/hooks/friendRequestAny';

import FriendsNavigationLink from './FriendsNavigationLink';
import LinkIcon from './LinkIcon';

import './FriendsNavigation.css'



function FriendsNavigation() {
  const friendRequestsAny = useFriendRequestAny();
  
  const selectedRequestsIcon = friendRequestsAny ? '/static/icons/friends-request-filled-dot.svg' : '/static/icons/friends-request-filled.svg';
  const unselectedRequestsIcon = friendRequestsAny ? '/static/icons/friends-request-dot.svg' : '/static/icons/friends-request.svg';

  return (
  <div className='friends-navigation'>
    <LinkIcon path_to_page='/profile' path_to_image='/static/icons/go_back.svg' className='friends-go-back-icon'/>
    <FriendsNavigationLink to='/profile/friends' alt='friends icon' selectedIcon='/static/icons/friends-filled.svg' unselectedIcon='/static/icons/friends_AR.svg' className='friends-friends-icon'/>
    <FriendsNavigationLink to='/profile/requests' alt='requests icon' selectedIcon={ selectedRequestsIcon } unselectedIcon={ unselectedRequestsIcon } className='friends-requests-icon'/>
  </div>
  )
}



export default FriendsNavigation;