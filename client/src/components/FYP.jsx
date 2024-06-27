import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Tiktok from "./Tiktok";

const FYP = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // async function fetchVideos() {
    //   const response = await fetch("http://localhost:3000/");
    //   const data = await response.json();
    //   setVideos(data);
    // }

    // fetchVideos();
  }, []);

  return (
    <div className="snap-mandatory snap-y bg-black">
      {/* {videos.map((video) => {
        return (
          <Link key={video.video_id} to={`/videos/${video.video_url}`} state={video} >
            <Tiktok key={video.video_id} video={video}/>
          </Link>
        );
      })} */}

      {/* Testing out with three sample videos first */}
      {/* TODO: snap scrolling of tiktok videos */}
      <div className="snap-normal snap-center flex justify-center items-center h-screen pb-6">
        <video 
          src={`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/1.mp4`} 
          className="snap-normal snap-start w-screen"
          loop
          controls
        ></video>
      </div>
      <div className="snap-normal snap-center flex justify-center items-center h-screen pb-6">
      <video 
          src={`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/2.mp4`} 
          className="snap-normal snap-start w-screen"
          loop
          controls
        ></video>
      </div>
      <div className="snap-normal snap-center flex justify-center items-center h-screen pb-6">
      <video 
          src={`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/3.mp4`} 
          className="snap-normal snap-start w-screen"
          loop
          controls
        ></video>
      </div>

      {/* <p>{video.username}</p>  */}
    </div>
  );
};

export default FYP;
