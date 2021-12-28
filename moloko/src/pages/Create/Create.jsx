import React, {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";

import Layout from '../../components/Layout';
import { getSongs } from './api/getSongs';
import { getVibes } from './api/getVibes';
import { createMood } from "./api/createMood";

const Create = () => {
  const [name, setName] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [vibes, setVibes] = useState(undefined);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [selectedVibes, setSelectedVibes] = useState([]);

  const [isSearcherToggled, setIsSearcherToggled] = useState(false);

  const history = useHistory();

  const selectSong = (song) => {
    let selected = selectedSongs;
    selected.push(song);
    setSelectedSongs(selected)
    setIsSearcherToggled(false);
  };

  const selectVibe = (vibe) => {
    let selected = selectedVibes;
    selected.push(vibe);
    setSelectedVibes(selected);
    console.log(selectedVibes)
  }

  const handleCreateMood = async() => {
    await createMood(name, ['Energetic', 'Calm'] , selectedSongs, description).then((res) => history.push('/dashboard'));
  }

  useEffect(() => {
    getVibes().then((res) => setVibes(res.data));
  }, [])

  const SongSearcher = () => {
    const [query, setQuery] = useState(undefined);
    const [songs, setSongs] = useState(undefined);
    const [selectedSongs, setSelectedSongs] = useState(undefined);
    const [timeout, sTimeout] = useState(null);
    const [vibes, setVibes] = useState(undefined);

    const handleSearch = async() => {
      clearTimeout(timeout);

      sTimeout(setTimeout(async () => {
        const response = await getSongs(query);
        setSongs(response.data);
        console.log(response.data)
      }, 1000));
    };


    return (
      <div className=' space-y-4 absolute w-5/6 left-20 top-64 bg-slate-800 border shadow-slate-500/20 shadow-lg border-slate-600 p-8 rounded-md z-50'>
        <input
          value={query}
          onChange={async (event) => {
            setQuery(event.target.value)
            await handleSearch();
          }}
          placeholder={'Search For Songs'}
          className='w-full bg-slate-800 p-3 rounded-sm border border-slate-600' />

        {songs && songs.map((song, index) => (
          <div
            className='w-full bg-slate-700 rounded-sm border border-slate-400 p-4 flex items-center justify-between'
            key={`${song.name}-${index}`}>
            <div className='flex items-center space-x-4'>
              <img  className='rounded-md shadow-lg shadow-indigo/50' src={song.image_url} />
              <div className='flex flex-col space-y-2'>
                <h2>{song.name}</h2>
                <p className='text-slate-400'>{song.artists}</p>
              </div>
            </div>
            <button onClick={() => selectSong(song)} className='hover:white text-slate-300'>Add Song</button>
          </div>
        ))}

      </div>
    );
  };

  return (
    <Layout>
      {isSearcherToggled &&
        <SongSearcher/>
      }
      <div className={isSearcherToggled ? 'blur-sm pointer-events-none space-y-8' : 'blur-none space-y-8'}>
        <div className='flex items-center justify-between'>
          <h1 className='text-4xl font-semibold'> 🔨 Mood Builder</h1>
          <button
            onClick={() => history.push('/dashboard')}
            className='opacity-70 hover:opacity-90'
          >
            Back to Dashboard
          </button>
        </div>
        <div className='space-y-2'>
          <p className='text-xl'>Mood Name: </p>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className='w-full bg-slate-800 p-3 rounded-sm border border-slate-600'/>
        </div>

        <div className='space-y-2'>
          <p className='text-xl'>Description: </p>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className='w-full bg-slate-800 p-3 rounded-sm border border-slate-600'/>
        </div>

        <div className='space-y-2'>
          <p className='text-xl'>Vibes: </p>
          <div className='grid grid-cols-10 gap-2'>
            {vibes && vibes.map((vibe, index) => (
              <div
                onClick={() => selectVibe(vibe)}
                className={selectedVibes.filter(x => x.name === vibe.name).length === 0 ? 'bg-slate-800/50 p-2 text-center rounded-full border border-slate-700 hover:border-slate-500 cursor-pointer' :
                'bg-slate-800/50 p-2 text-center rounded-full border border-indigo-500 hover:border-slate-500 cursor-pointer'}
                key={`${vibe.name}-${index}`}>
                {vibe.name}
              </div>
            ))}
          </div>

        </div>

        <div className='space-y-4'>
          <p className='text-xl'>Songs: </p>
          {selectedSongs && selectedSongs.map((song, index) => (
            <div
              className='w-full bg-slate-700 rounded-sm border border-slate-400 p-2 flex items-center justify-between'
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
          <button
            onClick={() => setIsSearcherToggled(true)}
            className='bg-slate-800/50 w-full pb-4 pt-4 border border-slate-500 hover:bg-slate-800'> Add a Song</button>
        </div>

        <button
          onClick = {handleCreateMood}
          className='bg-gradient-to-r from-indigo-500 to-indigo-800 w-full p-4 border border-slate-500 hover:to-indigo-900 hover:from-indigo-600'> Create Mood</button>

      </div>

    </Layout>
  )
}

export default Create;