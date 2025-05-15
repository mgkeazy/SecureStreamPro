import React, { useEffect } from 'react';
import useVideoStore from '../store/useVideoStore';
import VideoPlayer from '../components/VideoPlayer';
import { useNavigate } from 'react-router-dom';

const VideoPage = () => {
  const videoId = useVideoStore((state) => state.videoId);
  const navigate = useNavigate();

  useEffect(() => {
    if (!videoId) {
      navigate('/courses'); // redirect if no video is selected
    }
  }, [videoId]);

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center">
        <h1 className='text-white text-2xl font-bold'>Video Page</h1>
      <div className="w-full max-w-4xl px-4">
        <VideoPlayer videoId={videoId} />
      </div>
    </div>
  );
};

export default VideoPage;
