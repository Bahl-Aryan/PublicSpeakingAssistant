import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

const FileUpload = ({ onFileSelect }) => {

    const fileInputRef = React.createRef();

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
      <div>
        <button
            className='bg-gray-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl flex flex-col items-center'
            onClick={handleClick}
        >
            <FontAwesomeIcon icon={faFile} style={{ fontSize: '96px' }}/>
            <span className='mt-4'>Upload File</span>
        </button>
        <input
            type='file'
            ref={fileInputRef}
            style={{display: 'none'}}
            onChange={onFileSelect}
            //accept='audio/*'
        />
      </div>
    );
  };
  
  export default FileUpload;