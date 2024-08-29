import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

const Microphone = ({ onClick}) => {
  return (
    <button
      className="bg-red-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-2xl flex flex-col items-center"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faMicrophone} style={{ fontSize: '96px' }} />
      <span className='mt-4'>Click to start recording</span>
    </button>
  );
};

export default Microphone;