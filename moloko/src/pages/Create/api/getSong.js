import axios from 'axios';
import storage from "../../../utils/storage";

export const getSong = async(id) => {
  return await axios.get(`https://moozika.herokuapp.com/api/songs/${id}`,  {
    headers: {
      'access_token': storage.getToken(),
    },
  }).catch((error) => console.log(error));
};

export const getMultSongs = async(ids) => {
  let songs = []

  for(let idx = 0; idx < ids.length; idx++) {
    let res = await axios.get(`http://192.168.5.164:8000/api/songs/${ids[idx]}`,  {
      headers: {
        'access_token': storage.getToken(),
      },
    }).catch((error) => console.log(error));

    songs.push(res.data);
  }

  return songs

}
