import React from "react";
import { useNavigate } from "react-router-dom";

const ShopCardComponent = ({ product }) => {
  // Function for submission of search
  const navigate = useNavigate();

  const handleProduct = (product_id) => {
    navigate(`/products/${product_id}`);
  };
  return (
    <div
      key={product.product_id}
      className="bg-white text-black flex-col justify-items-center rounded"
      onClick={() => handleProduct(product.product_id)}
    >
      <img
        src={`${import.meta.env.VITE_AWSCLOUDFRONT_PRODUCT_URL}/products/${
          product.image_url
        }.jpg`}
        alt={product.title}
        className="w-full h-inherit"
      />{" "}
      {/* To change to image url*/}
      <div className="p-2">
        <p className="ellipsis text-left">{product.title}</p>
        <p className="text-left text-red-500">
          S$
          <span className="text-xl">{product.price}</span>
        </p>
        <p className="text-left text-base text-slate-400">
          {product.sold_count} sold
        </p>
      </div>
    </div>
  );
};

export default ShopCardComponent;
