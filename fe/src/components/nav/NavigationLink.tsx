import { NavLink } from 'react-router-dom';

import './NavigationLink.css'



type NavigationLinkProps = {
  to: string,
  alt: string,
  selectedIcon: string,
  unselectedIcon: string,
};



function NavigationLink(props: NavigationLinkProps) {
  return (
    <NavLink to={ props.to } className={ () => undefined }>
      {({ isActive }) => (
        <img className='navigation__icon' src={ isActive ? props.selectedIcon : props.unselectedIcon } alt={ props.alt } />
      )}
    </NavLink>
  )
}



export default NavigationLink;