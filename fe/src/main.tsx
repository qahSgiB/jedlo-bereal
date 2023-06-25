import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { KnownError, KnownErrorFromClient } from './types/knownError.ts'

import Template from './Template.tsx'
import ErrorFallback from './components/error/ErrorFallback.tsx'
import Throw from './components/Throw.tsx'
import AuthLoggedIn from './components/auth/AuthLoggedIn.tsx'
import AuthLoggedOut from './components/auth/AuthLoggedOut.tsx'
import FriendRequestAnyTemplate from './components/FriendRequestAnyTemplate.tsx'

import Profile from './pages/profile/Profile.tsx'
import Friends from './pages/profile/Friends.tsx'
import Requests from './pages/profile/Requests.tsx'
import ProfileSettings from './pages/profile/ProfileSettings.tsx'
import Login from './pages/login/Login.tsx'
import Signup from './pages/login/Signup.tsx'
import Profile_edit from './pages/profile/ProfileEdit.tsx'
import AccountSettings from './pages/profile/AccountSettings.tsx'
import Goals from './pages/profile/Goals.tsx'
import Fyzio from './pages/profile/Fyzio.tsx'
import Feed from './pages/feed/Feed.tsx'

import './index.css'
import FoodList from './pages/FoodList.tsx'

import Home from './pages/home/Home.tsx'
import AuthLoggedInMessage from './components/auth/AuthLoggedInMessage.tsx'



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => failureCount < 2 && !(error instanceof KnownError),
    }
  }
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Template />,
    errorElement: <ErrorFallback />,
    children: [
      {
        element: <AuthLoggedInMessage/>,
        children: [
          {
            index: true,
            element: <Home />
          },
          {
            path: 'foods',
            element: <FoodList />,
          },
          {
            path: 'feed',
            element: <Feed />,
          },
          {
            path: 'graphs',
            element: <p>graphs</p>,
          },
        ]
      },
      {
        path: 'profile',
        element: <AuthLoggedIn />,
        children: [
          {
            element: <FriendRequestAnyTemplate />,
            children: [
              {
                index: true,
                element: <Profile />
              },
              {
                path: 'friends',
                element: <Friends />,
              },
              {
                path: 'requests',
                element: <Requests />,
              },
            ]
          },
          {
            path: 'settings',
            element: <ProfileSettings />,
          },  
          {
            path: 'settings/edit',
            element: <Profile_edit />,
          },
          {
            path: 'settings/account',
            element: <AccountSettings />,
          },
          {
            path: 'settings/goals',
            element: <Goals />,
          },
          {
            path: 'settings/fyzio',
            element: <Fyzio />,
          },
        ]
      },
      {
        path: 'profile',
        element: <AuthLoggedOut />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'signup',
            element: <Signup />,
          },
        ]
      },
      {
        path: '*',
        element: <Throw error={ new KnownErrorFromClient('Route not found') } />,
      }
    ],
  }
]);



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={ queryClient }>
        <RouterProvider router={ router } />
    </QueryClientProvider>
  </React.StrictMode>,
)
