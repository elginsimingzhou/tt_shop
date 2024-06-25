import React from "react";
import { useLocation } from "react-router-dom";
import Tiktok from "./Tiktok";

const TikTokDetails = () => {
  const location = useLocation();
  const video = location.state;

  

  return (
    <div>
      <h1>This is tiktok detail page</h1>
      <Tiktok video={video} />
    </div>
  );
};

export default TikTokDetails;
