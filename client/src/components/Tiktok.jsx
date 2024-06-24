import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const Tiktok = () => {
  const { video_id } = useParams();

  return (
    <div className="h-screen">
      This is a specific tiktok video: {video_id}
      <video
        key={video_id}
        src={`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/${video_id}.mp4`}
        width="320"
        controls
        autoPlay
      ></video>
    </div>
  );
};

export default Tiktok;
