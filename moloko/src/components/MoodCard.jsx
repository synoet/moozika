import React, {memo} from 'react';
import { useHistory } from "react-router-dom";

const MoodCard = ({id, create = false, name,  vibes,  likes, noControl = false, onEdit, onDelete}) =>{
  const history = useHistory();


  if (!create) {
    return (
      <div onClick={() => history.push(`/mood?id=${JSON.stringify(id)}`)} className={`bg-slate-800 w-full rounded-sm border border-slate-700 p-4 shadow-indigo-500/10 shadow-lg space-y-4 hover:shadow-in-400/20 cursor-pointer hover:border-slate-600`}>
        <h2 className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-${vibes[0].colors[0]} to-${vibes[vibes.length - 1 ].colors[1]}`}>{name}</h2>
        <div className='flex items-center space-x-2'>
          {vibes && vibes.map((vibe, index) => (
            <div
              key={`${vibe.name}-${index}`}
              className={`pb-1 pt-1 pl-2 pr-2 rounded-full bg-gradient-to-r from-${vibe.colors[0]} to-${vibe.colors[1]} text-black text-sm`}
            >
              {vibe.name}
            </div>
          ))}
        </div>
        <div className='w-full border-b border-gray-700' />
        <div className='flex items-center justify-between'>
          <p className=''>👍 <span className='ml-2'>{likes}</span></p>
          {!noControl &&
            <div className=' flex space-x-4'>
              <button className='opacity-70 hover:opacity-100' onClick={onEdit}> ✏️ Edit</button>
              <div className='h-6 border-r-2 border-slate-700'/>
              <button onClick={onDelete} className='opacity-70 hover:opacity-100'> 🗑️ Delete</button>
            </div>
          }
        </div>

      </div>
    )
  } else {
    return (
      <div
        onClick={ () => history.push('/create')}
        className='bg-slate-800/20 w-full rounded-sm border-dashed border-2 border-slate-700 flex flex-col justify-center items-center hover:bg-slate-800/40 cursor-pointer '>
        <p className='text-2xl'>🔨 Create a Mood</p>
      </div>
    )
  }

}

export default memo(MoodCard);