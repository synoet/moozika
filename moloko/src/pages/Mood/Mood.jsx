import React, {useState, useEffect} from 'react';

import Layout from '../../components/Layout';
import { getMood } from './api/getMood';
import { getSongs } from './api/getSongs';
import {useLocation} from "react-router-dom";
import {getRecommendations} from "./api/getRecommendations";

const Mood = () => {
  const [mood, setMood] = useState(undefined);
  const [songs, setSongs] = useState(undefined);
  const [recs, setRecs] = useState(undefined);

  const search = useLocation().search;
  const query = new URLSearchParams(search).get('id');
  const id  = JSON.parse(query)
  console.log(id);

  useEffect(() => {
    getMood(id).then((res) => {
      setMood(res.data)
      console.log(res.data);
      getSongs(res.data.songs).then((songs) => setSongs(songs))
    })
  }, [])

  useEffect(() => {
    getRecommendations(id).then((res) => setRecs(res.data));
    console.log(recs)
  }, [])


  return (
    <Layout noNav>
      <div className='absolute blue-gradient h-large w-large -top-100 -right-100 opacity-10' />
      {mood && songs &&
        <div className='p-8'>
          <div className='w-full flex flex-col h-96 justify-center space-y-2' >
            <div className='flex items-center space-x-4'>
              <img className='h-12 w-12 rounded-full shadow-lg shadow-indigo/50' src={mood.img_url}/>
              <h1 className='text-xl'>{mood.author}</h1>
            </div>
            <h1 className={` text-8xl font-black bg-gradient-to-r from-${mood?.vibes[0]?.colors[0]} to-${mood?.vibes[mood?.vibes.length - 1].colors[0]} text-transparent bg-clip-text`}>{mood.name.toUpperCase()}</h1>
          </div>
          <h1 className='text-xl tracking-widest'>YOUR VIBES: </h1>
          <div className='mt-2 flex space-x-8'>
            {mood.vibes.map((vibe) => (
                <h1 key={vibe.name} className={`bg-gradient-to-r text-5xl font-black text-transparent bg-clip-text  from-${vibe.colors[0]} to-${vibe.colors[1]}`}>{vibe.name.toUpperCase()}</h1>
            ))}
          </div>

          <h1 className='text-xl tracking-widest mt-10'>CHOSEN SONGS: </h1>
          <div className='mt-6 grid grid-cols-2 gap-4'>
            {songs.map((song, index) => (
              <div
                className={`w-full bg-slate-700/30 rounded-sm border border-${mood?.vibes[0]?.colors[0]} p-4 flex items-center justify-between`}
                key={`${song.name}-${index}`}>
                <div className='flex items-center space-x-4'>
                  <img  className='rounded-md shadow-lg shadow-indigo/50' src={song.image_url} />
                  <div className='flex flex-col space-y-2'>
                    <h2>{song.name}</h2>
                    <p className='text-slate-400'>{song.artists}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h1 className='text-xl tracking-widest mt-10'>SIMILAR SONGS: </h1>
          <div className='mt-6 grid grid-cols-2 gap-4'>
            {recs.map((song, index) => (
              <div
                className={`w-full bg-slate-700/30 rounded-sm border border-${mood?.vibes[0]?.colors[0]} p-4 flex items-center justify-between`}
                key={`${song.name}-${index}`}>
                <div className='flex items-center space-x-4'>
                  <img  className='rounded-md shadow-lg shadow-indigo/50' src={song.image_url} />
                  <div className='flex flex-col space-y-2'>
                    <h2>{song.name}</h2>
                    <p className='text-slate-400'>{song.artists}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    </Layout>
  )
}

export default Mood;