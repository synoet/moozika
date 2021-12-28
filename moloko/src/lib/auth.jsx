import React, {createContext, useContext} from 'react';
import axios from 'axios';
import storage from '../utils/storage';

// Auth Context
export const AuthContext = createContext(null);

// Use Auth Hook
export const useAuth = () => {
  return useContext(AuthContext);
}

// fetch user profile
export const fetchUser = async() => {
  return await axios.post('http://192.168.5.164:8000/api/user', {}, {
    headers: {
      'access_token': storage.getToken(),
    },
  }).catch((error) => console.log(error));
}
