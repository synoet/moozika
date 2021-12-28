import axios from "axios";
import storage from "../../../utils/storage";

export const createMood = async(name, vibes, songs, description) => {
  return await axios.post('http://192.168.5.164:8000/api/mood',  {
    name: name,
    vibes: vibes,
    songs: songs.map(song => song.id),
    description: description,
  },{
    headers: {
      'access_token': storage.getToken(),
    },
  }).catch((error) => console.log(error));
};
