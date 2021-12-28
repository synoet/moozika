import React, {useState, useEffect} from 'react';

import Layout from '../../components/Layout';
import MoodCard from '../../components/MoodCard';
import { getDashboard } from "./api/getDashboard";


const SectionHeader = ({children}) => (
  <div>
    <h2 className='text-white font-bold text-2xl'>{children}</h2>
  </div>
);

const Dashboard = () => {
  const [moodz, setMoodz] = useState(undefined);

  useEffect(() => {
    getDashboard().then((res) => setMoodz(res.data?.moodz))
  }, [])

  return (
    <Layout>
      <SectionHeader>Your Moodz</SectionHeader>
      <div className='grid w-full grid-cols-4 gap-8'>
        {moodz && moodz.map((mood, index) => (
          <div className='w-full h-full' key={`${mood.name}-${index}`}>
            <MoodCard
              name={mood.name}
              vibes={mood.vibes}
              likes={mood.likes}
            />
          </div>
        ))}
        <MoodCard
          create
        />

      </div>
    </Layout>
  );
};

export default Dashboard;
