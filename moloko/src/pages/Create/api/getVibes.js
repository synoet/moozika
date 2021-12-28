import axios from 'axios';
import storage from "../../../utils/storage";

export const getVibes = async(query) => {
  return await axios.get('http://192.168.5.164:8000/api/vibes',  {
    headers: {
      'access_token': storage.getToken(),
    },
  }).catch((error) => console.log(error));
};
