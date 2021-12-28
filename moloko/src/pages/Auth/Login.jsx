import React from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import {BsSpotify} from "react-icons/bs";
import { useAuth } from '../../lib/auth';

const Login = () => {
  const history = useHistory();
  const user = useAuth();
  return (
    <div className='flex flex-col items-center justify-center bg-slate-900 w-screen h-screen'>
      {!user ? (
        <div className='relative w-96 border pl-8 pr-8 pt-8 pb-8 border-slate-400 rounded-md flex flex-col justify-center items-center space-y-4'>
          <div className='absolute bg-slate-900 -top-4 pr-4 pl-4'>
            <h1 className='text-2xl font-bold text-transparent bg-gradient-to-tr from-indigo-400 to-indigo-700 bg-clip-text'>moozika</h1>
          </div>
          <button
            onClick={() => history.push('/login')}
            className='bg-gradient-to-r from-green-400 to-green-600 w-full pl-4 pt-2 pb-2 pr-4 rounded-md hover:bg-green-600 flex justify-center items-center space-x-2 text-lg'>
            <BsSpotify /> <span>Log In with Spotify</span>
          </button>
        </div>
      ) : window.location !== '/' ? (
        <></>
      ) : (
        <Redirect to={'/dashboard'} />
      )}
    </div>
  )
}

export default Login;