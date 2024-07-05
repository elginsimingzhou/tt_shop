import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ReplyIcon from '@mui/icons-material/Reply';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const Shop = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState({});
  // const location = useLocation() ;
  // const productState = location.state;

  useEffect(() => {
    // async function fetchProduct() {
    //   const response = await fetch(
    //     `http://localhost:3000/products/${product_id}`
    //   );
    //   const fetchedProduct = await response.json();
    //   setProduct(fetchedProduct);
    // }
    // fetchProduct();
  }, []);

  return (
    <div>
      {Object.keys(product).length !== 0 && (
        <div>
          <div className="p-4 flex justify-between">
            <Link to="/products" className="text-black">
              <ArrowBackIosIcon fontSize="large"/>
            </Link>
            <div className="flex gap-3">
              <ReplyIcon fontSize="large"/>
              <ShoppingCartIcon fontSize="large"/>
              <MoreHorizIcon fontSize="large"/>
            </div>
          </div>
          <img
            src={`${import.meta.env.VITE_AWSCLOUDFRONT_PRODUCT_URL}/products/${
              product.product_info.image_url
            }.jpg`}
          />
          <div className="text-left p-2">
            <p className="font-bold text-lg">S${product.product_info.price}</p>
            <div className="flex">
              {product.product_info.product_title}
              <BookmarkBorderIcon/>
            </div>
            <div>
              {product.product_info.product_sold_count} sold
            </div>

            <p>Rating Count: {product.metrics.rating_count}</p>
            <p>Average Rating: {product.metrics.avg_ratings}</p>
            <p>Review Count: {product.metrics.review_count}</p>
            <p>Reviews: {JSON.stringify(product.reviews)}</p>
          </div>
        </div>
      ) }
    </div>
  );
};

export default Shop;
