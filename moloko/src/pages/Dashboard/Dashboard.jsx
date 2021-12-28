import React, {useState, useEffect} from 'react';

import Layout from '../../components/Layout';
import MoodCard from '../../components/MoodCard';
import { getDashboard } from "./api/getDashboard";
import {useHistory} from "react-router-dom";
import {deleteMood} from "../Create/api/deleteMood";


const SectionHeader = ({children}) => (
  <div>
    <h2 className='text-white font-bold text-2xl'>{children}</h2>
  </div>
);

const Dashboard = () => {
  const [moodz, setMoodz] = useState(undefined);
  const [likedMoodz, setLikedMoodz] = useState(undefined);
  const [reload, setReload] = useState(0);
  const history = useHistory();

  useEffect(() => {
    getDashboard().then((res) => {
      setMoodz(res.data?.moodz)
      setLikedMoodz(res.data?.liked_moodz)
    })
  }, [reload])

  return (
    <Layout>
      <SectionHeader>Your Moodz</SectionHeader>
      <div className='grid w-full grid-cols-4 gap-8'>
        {moodz && moodz.map((mood, index) => (
          <div className='w-full h-full' key={`${mood.name}-${index}`}>
            <MoodCard
              id={mood.id}
              name={mood.name}
              vibes={mood.vibes}
              likes={mood.likes}
              onEdit={() => {
                console.log('hi')
                history.push(`/create?edit=${JSON.stringify(mood)}`)
              }}
              onDelete={() => {
                deleteMood(mood.id).then((res) => setReload(reload + 1))
              }}
            />
          </div>
        ))}
        <MoodCard
          create
        />

      </div>

      <SectionHeader>Moodz You Liked</SectionHeader>
      <div className='grid w-full grid-cols-4 gap-8'>
        {likedMoodz && likedMoodz.map((mood, index) => (
          <div className='w-full h-full' key={`${mood.name}-${index}`}>
            <MoodCard
              name={mood.name}
              vibes={mood.vibes}
              likes={mood.likes}

              noControl
            />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Dashboard;
