import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Tiktok from "./Tiktok";

const FYP = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      const response = await fetch("http://localhost:3000/");
      const data = await response.json();
      setVideos(data);
    }

    fetchVideos();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      {videos.map((video) => {
        return (
          <Link key={video.video_id} to={`/videos/${video.video_url}`} state={video} >
            {/* <video
              className="h-screen"
              src={`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/${video.video_url}.mp4`}
              width="320"
              controls
            ></video>
            <p>{video.username}</p> */}
            <Tiktok key={video.video_id} video={video}/>
          </Link>
        );
      })}
    </div>
  );
};

export default FYP;
