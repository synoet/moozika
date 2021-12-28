import axios from "axios";
import storage from "../../../utils/storage";

export const getSongs = async(ids) => {
  let songs = []

  for(let idx = 0; idx < ids.length; idx++) {
    let res = await axios.get(`https://moozika.herokuapp.com/api/songs/${ids[idx]}`,  {
      headers: {
        'access_token': storage.getToken(),
      },
    }).catch((error) => console.log(error));

    songs.push(res.data);
  }

  return songs

}
