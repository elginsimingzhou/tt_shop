import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Tiktok from "./Tiktok";

const FYP = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);

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
        "video_url":`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/1.mp4`
      },
      {
        "video_url":`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/2.mp4`
      },
      {
        "video_url":`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/3.mp4`
      },
    ];
    setVideos(test);

    // Observer to only play video if video ref corresponds
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0, // Adjust this as needed
    };

    const handlePlayPause = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.play();
        } else {
          entry.target.pause();
        }
      });
    };

    // Initialize observer with a delay to ensure data is loaded properly
    const observerTimeout = setTimeout(() => {
      const observer = new IntersectionObserver(handlePlayPause, options);

      videoRefs.current.forEach(video => {
        if (video) observer.observe(video);
      });

      return () => {
        videoRefs.current.forEach(video => {
          if (video) observer.unobserve(video);
        });
      };
    }, 1000); 

    return () => clearTimeout(observerTimeout);
  }, []);

  return (
    <div className="max-h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      {videos.map((video, index) => {
        return (
          // <Link key={video.video_id} to={`/videos/${video.video_url}`} state={video} >
          //   <Tiktok key={video.video_id} video={video}/>
          // </Link>

          // To be replaced with <Tiktok/> but for now, i dont have sample data to play with 
          <div key={index} className="w-full h-screen snap-center flex justify-center items-center pb-6">
            <video 
              src={video.video_url}
              ref={el => (videoRefs.current[index] = el)}
              className="max-w-full max-h-dvh"
              autoPlay
              loop
              controls
            ></video>
        </div>
        );
      })}

      {/* <p>{video.username}</p>  */}
    </div>
  );
};

export default FYP;
