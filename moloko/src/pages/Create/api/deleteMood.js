import axios from 'axios';
import storage from "../../../utils/storage";

export const deleteMood= async(id) => {
  return await axios.delete(`https://moozika.herokuapp.com/api/mood/${id}`,  {
    headers: {
      'access_token': storage.getToken(),
    },
  }).catch((error) => console.log(error));
};
