import { Outlet } from 'react-router-dom'

import Navigation from './components/nav/Navigation'

import './Template.css'
import UserContextProvider from './contexts/user/UserContextProvider'



function Template() {
  return (
    <div className='main'>
      <div className='main__navigation-container'>
        <Navigation />
      </div>
      <div className="main__content-container">
        <UserContextProvider>
          <Outlet />
        </UserContextProvider>
      </div>
    </div>
  )
}

export default Template