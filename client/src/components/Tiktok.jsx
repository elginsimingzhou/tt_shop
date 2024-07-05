import React, { useEffect, useRef, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ReactLogo from "../assets/react.svg";
import CommentSection from "./CommentSection";
import StarIcon from "@mui/icons-material/Star";
import Recommended from "./Recommended";

const Tiktok = ({vid, idx, onPause, onEnd}) => {
  // Stores video
  const [video, setVideo] = useState(vid);
  // Stores miscellaneous data of video
  const [data, setData] = useState({});

  // Ref to determine video displayed
  const videoRef = useRef(null);
  // Record current watch time for video
  const [currentTime, setCurrentTime] = useState(0);
  // Check whether video is playing
  const [isPlaying, setIsPlaying] = useState(false);
  // Whether video is starred
  const [star, setStar] = useState(false);
  // Whether recommended portion is shown
  const [recommended, setRecommended] = useState(false);
  // Determine what animation to use
  const [animate, setAnimate] = useState(false);
  // Remember the start time
  const [startTime, setStartTime] = useState(0);
  
  //For showing product when user click on "Star" icon
  const productData = 
  {
    "product_info": {
      "product_id": 1,
      "shop_id": 1,
      "product_title": "Hydroflask Water Bottle 32oz Hydro flask Thermos Flask Vacuum Flask Stainless Steel Thermal Tumbler",
      "product_description": "The best choice for buying water bottle !!!\n\n*Note: Hydroflask has no anti -condensation coating\n\n\n\nFeatures\n\n● This insulated water bottle is dishwasher safe!\n\n● This bottles keep the coldest drinks icy cold and hot drinks piping hot for hours!\n\n● Reusable water bottle is BPA-free, phthalate-free, and made of stainless steel!\n\n● Fits car bottle holders!\n\n\n\n\n\nDetails\n\n● Capacity: 32oz（946ml）\n\n● Wide mouth opening\n\n● Constructed with 18/8 pro stainless steel\n\n● Odor- and bacteria-resistant\n\n● 100% recyclable\n\n● Convenient carry\n\n● Double wall vacuum insulation keeps hot beverages hot up to 12 hours and cold drinks refreshing for 24 hours\n\n\n\nNote:\n\nAs the lighting effects, the color of objects maybe a little different from pictures",
      "price": "16.90",
      "stock": 30,
      "image_url": "1",
      "product_sold_count": 0,
      "shop_title": "hydro_flask.sg",
      "shop_sold_count": 0,
      "response_rate": 0,
      "shipped_on_time_rate": 0
    },
  }

  useEffect(() => {
    // async function fetchData() {
    //   const response = await fetch(
    //     `http://localhost:3000/videos/${video.video_id}`
    //   );
    //   const fetchedData = await response.json();
    //   setData(fetchedData);
    // }
    // fetchData();

    // Sample data
    const test = {
      "generic_data": {
        "video_id": 1,
        "like_count": "3",
        "star_count": "1",
        "comment_count": "2",
        "save_count": "1"
      },
      "comments": [
        {
          "username": "minze",
          "comment_text": "Amazing video!!!"
        },
        {
          "username": "yonghui",
          "comment_text": "Love your items!"
        }
      ],
      "keywords": {
        "video_id": 1,
        "keywords": [
          "hair curler",
          "haircare",
          "women",
          "curls",
          "airwrap"
        ]
      }
    }
    setData(test);

    // Checks whether video is on screen, otherwise pauses it
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play();
            setIsPlaying(true);
            setStartTime(videoRef.current.currentTime);
          } else {
            entry.target.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 } // Adjust as needed
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [video]);

  // Updates current time state
  const updateTime = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Updates current time every second
  useEffect(() => {
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Runs parent function to update all video watch time array when video ends
  const handleVideoEnd = () => {
    console.log("Video end")
    setIsPlaying(false);
    onEnd(currentTime);
    setStartTime(0);
    videoRef.current.play();
    setIsPlaying(true);
  };

  // Runs parent function to update all video watch time array when video pauses
  const handleVideoPause = () => {
    console.log("Video paused")
    setIsPlaying(false);
    onPause(currentTime - startTime);
    console.log(currentTime - startTime)
  };

  // Function to handle side buttons click
  const handleIcon = (e, id) => {
    e.stopPropagation();
    const button = document.getElementById(id);
    const currentColor = button.style.color;

    if (currentColor == "white" || currentColor == "") {
      if (id[0] == "H") {
        button.style.color = "red";
        // Perform any database changes (both local and cloud)
      } else if (id[0] == "B") {
        button.style.color = "yellow";
        // Perform any database changes (both local and cloud)
      } else if (id[0] == "S") {
        button.style.color = "gold";
        // Perform any database changes (both local and cloud)
      }

    } else {
      button.style.color = "white";
    }

    // Animation
    button.classList.add("animate-click");
    button.addEventListener(
      "animationend",
      () => {
        button.classList.remove("animate-click");
      },
      { once: true }
    );
  };

  // Handles starring the product
  const handleStar = (e, id) => {
    handleIcon(e, id);
    setStar(!star) // Toggle starred value
    // Perform relevant database changes after starring video

    
    // We only show recommended product if star button is activated
    if (star == false){
      setRecommended(true);
      setAnimate(true);
  
      setTimeout(() => {
        setAnimate(false);
        setTimeout(() => {
          setRecommended(false);
        }, 1000); // Animation duration should match the CSS
      }, 5000);
    }
  }

  // Handles the video click playing and pausing
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
        // Start timing only if video was paused
        if (videoRef.current.paused) {
          updateTime();
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        onPause(currentTime);
      }
    }
  };

  return (
    <div
      key={idx}
      className="w-full h-screen snap-center flex justify-center items-center pb-6 relative"
      onClick={handleVideoClick}
    >
      {/* Recommending popup */}
      {recommended && <Recommended item={productData} animate={animate}/>}

      <video
        src={`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/${video.video_url}.mp4`}
        ref={videoRef}
        className="max-w-full max-h-dvh z-0"
        autoPlay
        onEnded={handleVideoEnd}
        onPause={handleVideoPause}
      ></video>

      {/* Side buttons */}
      <div className="absolute top-1/4 right-3 z-10">
        <div className="flex flex-col gap-8 text-white">
          <div className="relative">
            <img src={ReactLogo} alt="logo" className="bg-white rounded-full" />{" "}
            {/* To change to image url*/}
            <p className="bg-red-500 absolute top-7 right-2 rounded-full h-5 w-5 flex justify-center items-center">
              +
            </p>
          </div>
          <div>
            <FavoriteIcon
              fontSize="large"
              id={"Heart_" + idx}
              onClick={(e) => handleIcon(e, "Heart_" + idx)}
            />
            {Object.keys(data).length !== 0 ? (
              <p className="text-sm">{data.generic_data.like_count}</p>
            ) : (
              <p>...</p>
            )}
          </div>
          <div>
            <CommentSection comments={data.comments} id={video.id} />
            {Object.keys(data).length !== 0 ? (
              <p className="text-sm">{data.generic_data.comment_count}</p>
            ) : (
              <p>...</p>
            )}
          </div>
          <div>
            <BookmarkIcon
              fontSize="large"
              id={"Bookmark_" + idx}
              onClick={(e) => handleIcon(e, "Bookmark_" + idx)}
            />
            {Object.keys(data).length !== 0 ? (
              <p className="text-sm">{data.generic_data.save_count}</p>
            ) : (
              <p>...</p>
            )}
          </div>
          <div>
            <StarIcon
              fontSize="large"
              id={"Star_" + idx}
              onClick={(e) => handleStar(e, "Star_" + idx)}
            />
            {Object.keys(data).length !== 0 ? (
              <p className="text-sm">{data.generic_data.star_count}</p>
            ) : (
              <p>...</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      {/* TODO: Will have to update this with actual data */}
      <div className="absolute bottom-20 left-4 z-10 text-white">
        <div className="flex flex-col text-left">
          <div className="font-bold">{video.username}</div>
          <div className="max-w-64 max-h-12 overflow-y-hidden ellipsis">
            {video.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tiktok;
