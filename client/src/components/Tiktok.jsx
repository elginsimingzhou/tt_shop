import React, { useEffect, useRef, useState } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ReactLogo from "../assets/react.svg";

const Tiktok = (props) => {
  const [video, setVideo] = useState(props.video);
  const [data, setData] = useState({});
  const videoRefs = useRef([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `http://localhost:3000/videos/${video.video_id}`
      );
      const fetchedData = await response.json();
      setData(fetchedData);
    }
    fetchData();

    // Observer to only play video if video ref corresponds
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0, // Adjust this as needed
    };

    const handlePlayPause = (entries) => {
      entries.forEach((entry) => {
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

      videoRefs.current.forEach((video) => {
        if (video) observer.observe(video);
      });

      return () => {
        videoRefs.current.forEach((video) => {
          if (video) observer.unobserve(video);
        });
      };
    }, 1000);

    return () => clearTimeout(observerTimeout);
  }, []);

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
      } else if (id[0] == "F") {
        button.style.color = "red";
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

  // Handles video playing on touch
  const handleVideo = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  return (
    <div
      key={props.index}
      className="relative w-full h-screen snap-center flex justify-center items-center"
      onClick={() => handleVideo(props.index)}
    >
      <video
        src={`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/${video.video_url}.mp4`}
        ref={(el) => (videoRefs.current[props.index] = el)}
        className="max-w-full max-h-dvh z-0"
        loop
      >

      </video>

      {/* Side buttons */}
      {/* TODO: To replace numbers with relevant data */}
      <div className="absolute top-1/2 right-8 z-10">
        <div className="flex flex-col gap-6 text-white">
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
              id={"Heart_" + props.index}
              onClick={(e) => handleIcon(e, "Heart_" + props.index)}
            />
            {Object.keys(data).length !== 0 ? (
              <p className="text-sm">{data.generic_data.like_count}</p>
            ) : (
              <p>...</p>
            )}
          </div>
          <div>
            <InsertCommentIcon fontSize="large" />
            {Object.keys(data).length !== 0 ? (
              <p className="text-sm">{data.generic_data.comment_count}</p>
            ) : (
              <p>...</p>
            )}
          </div>
          <div>
            <BookmarkIcon
              fontSize="large"
              id={"Bookmark_" + props.index}
              onClick={(e) => handleIcon(e, "Bookmark_" + props.index)}
            />
            {Object.keys(data).length !== 0 ? (
              <p className="text-sm">{data.generic_data.save_count}</p>
            ) : (
              <p>...</p>
            )}
          </div>
          <div>
            <FlagIcon
              fontSize="large"
              id={"Flag_" + props.index}
              onClick={(e) => handleIcon(e, "Flag_" + props.index)}
            />
            {Object.keys(data).length !== 0 ? (
              <p className="text-sm">{data.generic_data.flag_count}</p>
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
            <p>{video.title}</p>
            <p>{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tiktok;
