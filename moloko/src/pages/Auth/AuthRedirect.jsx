import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import storage from '../../utils/storage';

const AuthRedirect = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { hash } = useLocation()
  const accessToken = hash.replace('#access_token=', '');

  useEffect(() => {
    if (accessToken){
      storage.clearToken()
      storage.setToken(accessToken)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }, [accessToken])

  return (
    <div>
      {isLoading ? (
        <h1>Loading ...</h1>
      ) : (
        <Redirect to='/dashboard' />
      )}
    </div>
  )
}

export default AuthRedirect;