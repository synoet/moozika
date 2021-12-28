import React from 'react';
import { Redirect } from 'react-router-dom';

import Nav from './Nav';
import { useAuth } from '../lib/auth';

const Layout = ({children, noNav = false}) => {
  const user = useAuth();
  return (
    <div className='w-screen min-h-screen flex flex-col items-center bg-slate-900'>
      {user ? (
        <div className='relative w-large text-white p-4 space-y-8'>
          {!noNav && <Nav /> }
          {children}
        </div>
      ): (
        <Redirect to={'/login'} />
      )}

    </div>
  );
};

export default Layout;
