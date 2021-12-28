import React, {useState, useEffect} from 'react';
import { AuthContext, fetchUser } from '../lib/auth';

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(undefined);
  const [lock, setLock] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
      fetchUser().then((res) => setUser(res.data))
  }, [reload]);

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;