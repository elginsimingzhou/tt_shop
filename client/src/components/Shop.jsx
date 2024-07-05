import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ReplyIcon from "@mui/icons-material/Reply";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ReactStars from "react-rating-stars-component";

const Shop = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState({});
  // const location = useLocation() ;
  // const productState = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(
        `http://localhost:3000/products/${product_id}`
      );
      const fetchedProduct = await response.json();
      setProduct(fetchedProduct);
    }
    fetchProduct();
  }, []);

  return (
    <div>
      {Object.keys(product).length !== 0 && (
        <div>
          <div className="p-4 flex justify-between">
            <Link to={'..'} onClick={(e)=>{
              e.preventDefault();
              navigate(-1);
            }} className="text-black">
              <ArrowBackIosIcon fontSize="large" />
            </Link>
            <div className="flex gap-3">
              <ReplyIcon fontSize="large" />
              <ShoppingCartIcon fontSize="large" />
              <MoreHorizIcon fontSize="large" />
            </div>
          </div>
          <img
            src={`${import.meta.env.VITE_AWSCLOUDFRONT_PRODUCT_URL}/products/${
              product.product_info.image_url
            }.jpg`}
          />
          <div className="flex flex-col text-left p-2 gap-2">
            <div className="flex font-semibold">
              {product.product_info.product_title}
              <BookmarkBorderIcon />
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-lg text-red-500">
                S${product.product_info.price}
              </p>
              <span className="px-2">|</span>
              <p className="text-sm text-grey-500">
                {product.product_info.product_sold_count} sold
              </p>
            </div>
            <div className="flex items-center">
              <ReactStars
                count={5}
                value={parseFloat(product.metrics.avg_ratings)}
                isHalf={true}
                size={24}
                activeColor="#ffd700"
              />
              <span className="px-2">|</span>
              <p>Rating Count: {product.metrics.rating_count}</p>
            </div>
            <div className="flex">
              <p>Reviews ({product.metrics.review_count}):</p>
              {/* <p>Reviews: {JSON.stringify(product.reviews)}</p> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
