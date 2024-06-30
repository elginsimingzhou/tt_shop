import React, { useState, useEffect} from "react";
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
    // Sample data
    const test = 
    [
      {
        "username": "Creator1",
        "video_id": "123",
        "data":"some random caption blablablablabla 1",
        "video_url":`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/1.mp4`
      },
      {
        "username": "Creator2",
        "video_id": "456",
        "data":"some random caption blablablablabla 2",
        "video_url":`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/2.mp4`
      },
      {
        "username": "Creator3",
        "video_id": "789",
        "data":"some random caption blablablablabla 3",
        "video_url":`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/3.mp4`
      },
    ];
    setVideos(test);
  }, []);


  return (
    <div className="max-h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      {videos.map((video, index) => {
        return (
          <Tiktok video={video} index={index}/>
        )
      })}
    </div>
  );
};

export default FYP;
