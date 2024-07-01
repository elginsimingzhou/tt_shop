import React from "react";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import SearchIcon from "@mui/icons-material/Search";

const TopNav = () => {
  return (
    <div className="absolute top-4 left-0 z-10 text-white">
      <div className="flex items-center w-screen place-content-around">
        <div>
          <LiveTvIcon />
        </div>
        <div className="flex gap-4">
          <p>Friends</p>
          <p>Following</p>
          <p className="font-bold">For You</p>
        </div>
        <div>
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
