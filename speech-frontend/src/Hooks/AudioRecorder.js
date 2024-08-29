import { useState, useCallback } from 'react';
import vmsg from 'vmsg'; // Ensure vmsg is installed

const recorder = new vmsg.Recorder({
  wasmURL: 'https://unpkg.com/vmsg@0.3.0/vmsg.wasm'
});

export const useAudioRecorder = () => {
  const [is_recording, setIsRecording] = useState(false);
  const [recording_url, setRecordingUrl] = useState(null);
  const [recording_blob, setRecordingBlob] = useState(null);

  const record = async () => {
    try {
      await recorder.initAudio(); // Initializes audio recording
      await recorder.initWorker(); // Initializes the WebAssembly worker
      recorder.startRecording(); // Starts recording
      setIsRecording(true); // Update state to indicate recording is in progress
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stop = async () => {
    try {
      const blob = await recorder.stopRecording(); // Stops recording and returns the audio blob
      const url = URL.createObjectURL(blob); // Creates a URL for the blob
      setIsRecording(false); // Update state to indicate recording has stopped
      setRecordingBlob(blob); // Update state with the audio blob
      setRecordingUrl(url); // Update state with the URL for the audio blob
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const reRecord = useCallback(() => {
    // Optionally stop the recorder if it's currently recording
    if (is_recording) {
      recorder.stopRecording().then(() => {
        setIsRecording(false);
        setRecordingBlob(null);
        setRecordingUrl(null);
      }).catch(error => console.error("Error stopping the recording:", error));
    } else {
      // Directly reset states if not currently recording
      setRecordingBlob(null);
      setRecordingUrl(null);
    }
  }, [is_recording]);

  return { is_recording, recording_url, setRecordingUrl, recording_blob, setRecordingBlob, record, stop, reRecord };
};