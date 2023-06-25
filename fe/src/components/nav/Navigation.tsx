import NavigationLink from "./NavigationLink.tsx";

import './Navigation.css'




function Navigation() {
  return (
    <div className='navigation'>
      <NavigationLink to='/' alt='home icom' selectedIcon='/static/icons/navigation/home-filled.svg' unselectedIcon='/static/icons/navigation/home.svg' />
      <NavigationLink to='/foods' alt='foods icon' selectedIcon='/static/icons/navigation/foods-filled.svg' unselectedIcon='/static/icons/navigation/foods.svg' />
      <NavigationLink to='/feed' alt='feed icon' selectedIcon='/static/icons/navigation/feed-filled.svg' unselectedIcon='/static/icons/navigation/feed.svg' />
      <NavigationLink to='/profile' alt='profile icon' selectedIcon='/static/icons/navigation/profile-filled.svg' unselectedIcon='/static/icons/navigation/profile.svg' />
    </div>
  )
}



export default Navigation;