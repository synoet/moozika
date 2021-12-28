import React from 'react';
import Layout from '../components/Layout';
import MoodCard from '../components/MoodCard';

const SectionHeader = ({children}) => (
  <div>
    <h2 className='text-white font-bold text-2xl'>{children}</h2>
  </div>
);

const Dashboard = () => {
  return (
    <Layout>
      <SectionHeader>Your Moodz</SectionHeader>
      <div className='grid w-full grid-cols-4 gap-4'>
        <div className='w-full h-full'>
          <MoodCard
            name='Dogecore'
            author='me'
            vibes={[{name: 'doge', colors: ['orange-400', 'orange-500']}, {name: 'drain gang', colors: ['green-500', 'green-600']}]}
            colors={['indigo-500', 'orange-500']}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
