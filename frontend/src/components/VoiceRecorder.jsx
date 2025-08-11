import React, { useState, useRef } from 'react';

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    setIsRecording(true);
    audioChunks.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg text-center border border-gray-100 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center justify-center gap-2">
        🎙️ Voice Recorder
      </h2>

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
          <p className="text-sm text-gray-500 mt-2 italic">
            ✅ Recording ready for submission
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
