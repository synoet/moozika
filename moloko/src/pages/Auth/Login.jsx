import React from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import {BsSpotify} from "react-icons/bs";
import { useAuth } from '../../lib/auth';

const Login = () => {
  const history = useHistory();
  const user = useAuth();
  return (
    <div className='flex flex-col items-center justify-center bg-black w-screen h-screen'>
      {!user ? (
        <div className='w-96 border pl-8 pr-8 pt-32 pb-32 border-white rounded-md flex flex-col justify-center items-center space-y-4'>
          <h1 className='text-white font-bold text-2xl'>Welcome Back</h1>
          <button
            onClick={() => history.push('/login')}
            className='bg-green-500 w-full pl-4 pt-2 pb-2 pr-4 rounded-md hover:bg-green-600 flex justify-center items-center space-x-4 text-xl'>
            <BsSpotify /> <span>Sign In with Spotify</span>
          </button>
        </div>
      ) : (
        <Redirect to={'/dashboard'} />
      )}
    </div>
  )
}

export default Login;