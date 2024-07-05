import React, { useState, useEffect } from "react";
import Tiktok from "./Tiktok";
import TopNav from "./TopNav";

const FYP = () => {
  // All videos
  const [videos, setVideos] = useState([]);
  // Array to store watch time
  const [videoTimes, setVideoTimes] = useState([]);

  // Dynamically initializes the videoTimes array
  useEffect(() => {
    setVideoTimes(new Array(videos.length).fill(0));
  }, [videos]);

  // Updates array when video ends
  const handleVideoEnd = (index, currentTime) => {
    setVideoTimes(prevTimes => {
      const updatedTimes = [...prevTimes];
      updatedTimes[index] += Math.round(Number(currentTime));
      return updatedTimes;
    });
  };

  // Updates array when video pauses
  const handleVideoPause = (index, currentTime) => {
    setVideoTimes(prevTimes => {
      const updatedTimes = [...prevTimes];
      updatedTimes[index] += Math.round(Number(currentTime));
      return updatedTimes;
    });
  };

  useEffect(() => {
    async function fetchVideos() {
      const response = await fetch("http://localhost:3000/");
      const data = await response.json();
      // {console.log(data)}
      setVideos(data);
    }

    fetchVideos();

  }, []);

  // console.log(videoTimes)

  return (
    <div className="max-h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      <TopNav />
      {videos.length !== 0? (videos.map((video, index) => {
        return (
          <Tiktok vid={video} idx={index} key={index} onEnd={(currentTime) => handleVideoEnd(index, currentTime)} onPause={(currentTime) => handleVideoPause(index, currentTime)}/>
        )
      })) 
      : <p>FYP loading...</p>}
    
    </div>
  );
};

export default FYP;
