import React, { useState, useRef } from 'react';

const VoiceRecorder = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    setError(null);
    setIsRecording(true);
    audioChunks.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        // Pass the recorded audio blob out to parent for backend upload if needed
        if (onAudioRecorded) onAudioRecorded(blob, url);
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      setError('Microphone access denied or not supported. Please check your browser permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    try {
      mediaRecorderRef.current?.stop();
    } catch {
      setError('Recorder failed to stop safely.');
    }
    setIsRecording(false);
  };

  const handleDownload = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = 'recording.webm';
      a.click();
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg text-center border border-gray-100 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center justify-center gap-2">
        🎙️ Voice Recorder
      </h2>
      {error && (
        <div className="mb-3 text-red-600 font-medium text-center">
          {error}
        </div>
      )}
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition duration-150 ease-in-out"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-md transition duration-150 ease-in-out"
        >
          Stop Recording
        </button>
      )}

      {audioURL && (
        <div className="mt-6">
          <audio
            controls
            src={audioURL}
            className="w-full rounded-lg border border-gray-300 shadow-sm"
          ></audio>
          <div className="flex gap-4 flex-wrap items-center justify-center mt-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded bg-green-600 text-white shadow hover:bg-green-700 text-sm"
            >
              Download Recording
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2 italic">
            ✅ Recording ready for submission
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
