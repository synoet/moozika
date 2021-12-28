import axios from 'axios';
import storage from "../../../utils/storage";

export const getSongs = async(query) => {
  return await axios.get('http://192.168.5.164:8000/api/songs/search',  {
    headers: {
      'access_token': storage.getToken(),
    },
    params: {
      query: query,
    },
  }).catch((error) => console.log(error));
};
