import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth, logout} from '../lib/auth';

const Nav = () => {
  const user = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login')
  }

  return (
    <div className='w-full flex items-center justify-between border-b border-gray-600 pb-4 pt-4'>
      <h1 className='text-2xl font-bold'>🐄 moozika</h1>
      <div className='flex items-center space-x-4'>
        <div className='flex items-center space-x-2'>
          <img  className='w-10 h-10 rounded-full border-2 border-indigo-500' src={user.profile_pic_url} />
          <p className='text-lg'>{user?.display_name}</p>
        </div>
        <div className='w-2 h-8 border-r border-gray-700' />
        <div>
          <button
            onClick={handleLogout}
            className='text-gray-300 hover:text-white cursor-pointer'
          >
            Log Out
          </button>
        </div>

      </div>

    </div>
  )
}

export default Nav;