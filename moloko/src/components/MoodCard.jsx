import React from 'react';

const MoodCard = ({name, author, vibes, colors}) => {
  return (
    <div className={`bg-slate-800 w-full rounded-sm border border-slate-700 p-4 shadow-${colors[1]}/40 shadow-md h-40`}>
      <h2 className={`text-2xl font-bold text-transparent bg-gradient-to-r from-${colors[0]} to-${colors[1]} bg-clip-text`}>{name}</h2>
      <div className='flex items-center space-x-4'>
        <p>Vibes: </p>
        {vibes && vibes.map((vibe, index) => (
          <div
            key={`${vibe}-${index}`}
            className={`p-2 rounded-full bg-gradient-to-r from-${vibe.colors[0]} to-${vibe.colors[1]}`}
          >
            {vibe.name}
          </div>
        ))}
      </div>

    </div>
  )
}

export default MoodCard;