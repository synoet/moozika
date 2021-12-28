import React, {memo} from 'react';

const MoodCard = ({create = false, name,  vibes, colors, likes}) =>{

  if (!create) {
    return (
      <div className={`bg-slate-800 w-full rounded-sm border border-slate-700 p-4 shadow-indigo-500/10 shadow-lg space-y-4 hover:shadow-indigo-400/20 cursor-pointer hover:border-slate-600`}>
        <h2 className={`text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-orange-500 bg-clip-text`}>{name}</h2>
        <div className='flex items-center space-x-4'>
          {vibes && vibes.map((vibe, index) => (
            <div
              key={`${vibe.name}-${index}`}
              className={`pb-1 pt-1 pl-2 pr-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 text-black text-sm`}
            >
              {vibe.name}
            </div>
          ))}
        </div>
        <div className='w-full border-b border-gray-700' />
        <div className='flex items-center justify-between'>
          <p className=''>👍 <span className='ml-2'>{likes}</span></p>
          <div className=' flex space-x-4'>
            <button className='opacity-70 hover:opacity-100'> ✏️ Edit</button>
            <div className='h-6 border-r-2 border-slate-700' />
            <button className='opacity-70 hover:opacity-100'> 🗑️ Delete</button>
          </div>
        </div>

      </div>
    )
  } else {
    return (
      <div className='bg-slate-800/20 w-full rounded-sm border-dashed border-2 border-slate-700 flex flex-col justify-center items-center hover:bg-slate-800/40 cursor-pointer '>
        <p className='text-2xl'>🔨 Create a Mood</p>
      </div>
    )
  }

}

export default memo(MoodCard);