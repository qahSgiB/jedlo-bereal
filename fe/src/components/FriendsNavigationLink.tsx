import { NavLink } from 'react-router-dom';
import './LinkIcon.css'

type Props = {
  to: string,
  alt: string,
  selectedIcon: string,
  unselectedIcon: string,
  className: string,
};

function FriendsNavigationLink(props: Props) {
  return (
    <NavLink to={ props.to } className={props.className ?? ''}>
      {({ isActive }) => (
        <img className='link-icon' src={ isActive ? props.selectedIcon : props.unselectedIcon } alt={ props.alt } />
      )}
    </NavLink>
  )
}



export default FriendsNavigationLink;