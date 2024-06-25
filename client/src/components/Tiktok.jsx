import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Tiktok = (props) => {
  const [video, setVideo] = useState(props.video);
  const [data, setData] = useState({});
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `http://localhost:3000/videos/${video.video_id}`
      );
      const fetchedData = await response.json();
      setData(fetchedData);
    }
    fetchData();
  }, []);
  return (
    <div className="h-screen">
      <video
        key={video.video_id}
        src={`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/${video.video_url}.mp4`}
        width="320"
        controls
        autoPlay
      ></video>
      <p>
        Data: {JSON.stringify(data.generic_data)}
      </p>
      <p>
        Comments: {JSON.stringify(data.comments)}
      </p>
    </div>
  );
};

export default Tiktok;
