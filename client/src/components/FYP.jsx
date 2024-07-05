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
    // async function fetchVideos() {
    //   const response = await fetch("http://localhost:3000/");
    //   const data = await response.json();
    //   // {console.log(data)}
    //   setVideos(data);
    // }

    // fetchVideos();

    // Sample data
    const test = 
        [
      {
        "video_id": 2,
        "video_url": "2",
        "thumbnail_url": null,
        "title": "Waterbottles review! (2024)",
        "description": "Stay till the end to find our my favourite water bottle.\n#hydroflask #stanley #waterbottle #chilleddrinks",
        "created_at": "2024-06-24T05:06:04.318Z",
        "user_id": 1,
        "username": "elgin"
      },
      {
        "video_id": 1,
        "video_url": "1",
        "thumbnail_url": null,
        "title": "My new favourite powerbank!",
        "description": "30000wAh! Portable! I love it!\n#powerbank #portable #fastcharging",
        "created_at": "2024-06-24T05:04:07.024Z",
        "user_id": 1,
        "username": "elgin"
      },
      {
        "video_id": 3,
        "video_url": "3",
        "thumbnail_url": null,
        "title": "Funko Pop figurine unboxing!",
        "description": "Join me to unbox the ultra big funko pop!\n#funkopop #michaelmyers #chucky #halloween",
        "created_at": "2024-06-24T05:08:12.744Z",
        "user_id": 2,
        "username": "minze"
      },
      {
        "video_id": 5,
        "video_url": "5",
        "thumbnail_url": null,
        "title": "Try out the famous *THERMAL BRUSH*",
        "description": "Definitely, bringing the brush to my mexico trip :P\n#thermalbrush #girls #haircare #hair",
        "created_at": "2024-06-24T05:11:13.982Z",
        "user_id": 3,
        "username": "yonghui"
      },
      {
        "video_id": 4,
        "video_url": "4",
        "thumbnail_url": null,
        "title": "Chocolate bucket taste test!!!",
        "description": "#chocolate #bucket #maltese #sweettreats",
        "created_at": "2024-06-24T05:09:34.680Z",
        "user_id": 3,
        "username": "yonghui"
      }
    ]
   
    setVideos(test);
  }, []);

  console.log(videoTimes)

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
