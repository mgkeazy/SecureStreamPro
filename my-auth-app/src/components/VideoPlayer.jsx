import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VideoPlayer({ videoId }) {
  const [otp, setOtp] = useState(null);
  const [playbackInfo, setPlaybackInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:8000/api/v1/getVdoCipherOtp', {videoId},
            {
                withCredentials:true
            }
        )
        const data=response.data;

        setOtp(data.otp);
        setPlaybackInfo(data.playbackInfo); // keep Base64 string as-is
      } catch (error) {
        console.error('Error fetching OTP/playbackInfo:', error);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchToken();
    }
  }, [videoId]);

  if (loading) {
    return <p>Loading player…</p>;
  }

  if (!otp || !playbackInfo) {
    return <p>Could not load video.</p>;
  }

  return (
    <iframe
      title={`Video ${videoId}`}
      width="100%"
      height="500"
      src={`https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`}
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  );
}
