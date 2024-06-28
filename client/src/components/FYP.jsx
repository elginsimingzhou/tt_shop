import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Tiktok from "./Tiktok";
import ReplyIcon from '@mui/icons-material/Reply';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ReactLogo from '../assets/react.svg'
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SearchIcon from "@mui/icons-material/Search";
import { Badge } from "@mui/material";

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

  // Function to handle side buttons click
  const handleIcon = (id) => {
    const button = document.getElementById(id);
    const currentColor = button.style.color;

    if(currentColor == 'white' || currentColor == ""){
      if(id[0] == 'H'){
        button.style.color = 'red';
        // Perform any database changes (both local and cloud)
      }
      else if (id[0] == 'B'){
        button.style.color = 'yellow';
        // Perform any database changes (both local and cloud)
      } 
    }
    else{
      button.style.color = 'white';
    }

    // Animation
    button.classList.add('animate-click');
    button.addEventListener('animationend', () => {
      button.classList.remove('animate-click');
    }, { once: true });
  }

  return (
    <div className="max-h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      {videos.map((video, index) => {
        return (
          // <Link key={video.video_id} to={`/videos/${video.video_url}`} state={video} >
          //   <Tiktok key={video.video_id} video={video}/>
          // </Link>

          // To be replaced with <Tiktok/>, will change when everything is done
          <div key={index} className="w-full h-screen snap-center flex justify-center items-center pb-6 relative">
            <video 
              src={video.video_url}
              ref={el => (videoRefs.current[index] = el)}
              className="max-w-full max-h-dvh z-0"
              loop
              controls
            ></video>

            {/* Top Bar */}
            <div className="absolute top-10 left-0 z-10 text-white">
              <div className="flex w-screen place-content-around">
                <div>
                  <LiveTvIcon/>
                </div>
                <div className="flex gap-4">
                    <p>Friends</p>
                    <p>Following</p>
                    <p className="font-bold">For You</p>
                </div>
                <div>
                  <SearchIcon/>
                </div>
              </div>
            </div>

            {/* Side buttons */}
            {/* To replace numbers with relevant data */}
            <div className="absolute top-1/4 right-3 z-10">
              <div className="flex flex-col gap-8 text-white">
                <div className="relative">
                    <img src={ReactLogo} alt="logo" className="bg-white rounded-full"/> {/* To change to image url*/}
                    <p className="bg-red-500 absolute top-7 right-2 rounded-full h-5 w-5 flex justify-center items-center">+</p>
                </div>
                <div>
                  <FavoriteIcon fontSize="large" id={'Heart_'+ index} onClick={() => handleIcon('Heart_'+ index)}/>
                  <p className="text-sm">2000</p>
                </div>
                <div>
                  <InsertCommentIcon fontSize="large"/>
                  <p className="text-sm">2000</p>
                </div>
                <div>
                  <BookmarkIcon fontSize="large" id={'Bookmark_'+ index} onClick={() => handleIcon('Bookmark_'+ index)}/>
                  <p className="text-sm">2000</p>
                </div>
                <div>
                  <ReplyIcon fontSize="large"/>
                  <p className="text-sm">2000</p>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            {/* Will have to update this with actual data */}
            <div className="absolute bottom-20 left-4 z-10 text-white">
              <div className="flex flex-col text-left">
                  <div className="font-bold">
                    The Creator 
                  </div>
                  <div className="max-w-64 max-h-12 overflow-y-hidden ellipsis">
                      This is the caption. This is the caption. This is the caption. This is the caption. This is the caption.
                  </div>
              </div>
            </div>
        </div>
        );
      })}

      {/* <p>{video.username}</p>  */}
    </div>
  );
};

export default FYP;
