import { useState } from "react";
import ReactLogo from "../assets/react.svg";
import { Link } from "react-router-dom";

const Recommended = ({ item, animate }) => {
    const truncateString = (title) => {
        if (title !== null && title.length >26){
            const truncatedString = title.substring(0,26) + '...';
            return truncatedString;
        }
        else {
            return title
        }

    }
  return (
    <div
      className={`absolute top-20 right-0 transform bg-white rounded shadow-lg z-20 p-2 shadow-md rounded-l-xl opacity-95 ${
        animate ? "animate-slideIn" : "animate-slideOut"
      }`}
    >
      <div className="flex justify-evenly">
        <img
          src={`${import.meta.env.VITE_AWSCLOUDFRONT_PRODUCT_URL}/products/${
           item.image_url
          }.jpg`}
          alt={item.title}
          className="w-20 h-20 rounded-sm"
        />{" "}
        {/* TODO: To change to image url */}
        <div className="flex flex-col justify-center text-sm">
            <p className="">{truncateString(item.title)}</p>
            <p className="font-semibold text-red-500">S${item.price}</p>
            <p className="text-xs text-grey-500">{item.sold_count} sold</p>
        </div>
        <p className="flex justify-center items-center ellipsis">
          {item.product_title}
        </p>
      </div>
      <Link to={`products/${item.product_id}`}>
        <button className="m-1 bg-red-500 text-white text-sm">
          Find out more
        </button>
      </Link>
    </div>
  );
};

export default Recommended;
