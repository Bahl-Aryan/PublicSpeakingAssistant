import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useAudioRecorder } from "../Hooks/AudioRecorder";
import Microphone from "./Microphone";
import FileUpload from "./FileUpload";
import { submitRecording } from "../Services/APIService";
import '../index.css'



function RecordUpload() {

  const {
    is_recording,
    recording_url,
    setRecordingUrl,
    recording_blob,
    setRecordingBlob,
    record,
    stop, 
    reRecord
  } = useAudioRecorder();
  const [submission_status, set_submission_status] = useState('');
  const [recording_name, set_recording_name] = useState('');

  const handleFileUpload = (event) => {
    if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setRecordingUrl(url);
        setRecordingBlob(file);
        console.log("File uploaded")
    } else {
        console.error("No file selected");
    }
};

  const handleSubmitRecording = async () => {
    if(recording_blob && recording_name) {
      try {
        await submitRecording(recording_blob, recording_name);
        set_submission_status(true);
        if (submission_status) {
          alert("Succes! Scores in progress!")
        }
      } catch (error) {
        console.error('Error submitting recording:', error)
        set_submission_status(false)
      }
    } else {
      alert("Please upload the file and/or provide a name!")
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (submission_status === true) {
      navigate('/dashboard/')
    }
  }, [submission_status, navigate])

  return (
    <>
        {!is_recording && !recording_url && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="flex flex-col items-center">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
              <Microphone onClick={record} />
              <FileUpload onFileSelect={handleFileUpload} />
            </div>
          </div>
        </div>
        )}
        {is_recording && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="flex flex-col items-center">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full flex items-center mt-4"
              onClick={stop}
            >
              Click to stop recording...
            </button>
          </div>
        </div>
        )}
        {recording_url && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>{recording_url}</p>
            <div className="flex flex-col items-center">
                <audio src={recording_url} controls style={{ marginBottom: '20px' }} />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                    <button className="bg-gray-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleSubmitRecording}>
                        Submit
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full" onClick={reRecord}>
                        Something else?
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Enter recording name"
                    value={recording_name}
                    onChange={(e) => set_recording_name(e.target.value)}
                    className="input-recording-name"
                    style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
            </div>
        </div>
      )}
     </> 
  );
}

export default RecordUpload;
