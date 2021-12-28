import React from 'react';
import Nav from './Nav';

const Layout = ({children}) => {
  return (
    <div className='w-screen min-h-screen flex flex-col items-center bg-slate-900'>
      <div className='w-large text-white p-4 space-y-8'>
        <Nav />
        {children}
      </div>
    </div>
  );
};

export default Layout;
