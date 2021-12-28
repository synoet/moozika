import React from 'react';
import { useAuth } from '../lib/auth';

const Nav = () => {
  const user = useAuth();
  console.log(user);
  return (
    <div className='w-full flex items-center justify-between border-b border-gray-600 pb-4 pt-4'>
      <h1>Moozika</h1>
      <div className='flex items-center space-x-2'>
        <img  className='w-10 h-10 rounded-full border-2 border-indigo-500' src={user.profile_pic_url} />
        <p className='text-lg'>{user?.display_name}</p>
      </div>

    </div>
  )
}

export default Nav;