import React from "react";
import { useLocation } from "react-router-dom";

const Tiktok = () => {
  const location = useLocation() ;
  const video = location.state;

  return (
    <div className="h-screen">
      This is a specific tiktok video: {video.video_id}
      <video
        key={video.video_id}
        src={`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/${video.video_url}.mp4`}
        width="320"
        controls
        autoPlay
      ></video>
      <p>{video.title}</p>
      <p>{video.description}</p>
    </div>
  );
};

export default Tiktok;
