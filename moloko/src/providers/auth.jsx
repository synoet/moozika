import React, {useState, useEffect} from 'react';
import { AuthContext, fetchUser } from '../lib/auth';

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(undefined);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    fetchUser().then((res) => console.log(res))
  }, [reload]);

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;