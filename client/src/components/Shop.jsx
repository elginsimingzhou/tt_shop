import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const Shop = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState({});
  // const location = useLocation() ;
  // const productState = location.state;

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
          <h1>
            This is a specific product: {product.product_info.product_title}
          </h1>
          <img
            src={`${import.meta.env.VITE_AWSCLOUDFRONT_PRODUCT_URL}/products/${
              product.product_info.image_url
            }.jpg`}
          />
          <p>Rating Count: {product.metrics.rating_count}</p>
          <p>Average Rating: {product.metrics.avg_ratings}</p>
          <p>Review Count: {product.metrics.review_count}</p>
          <p>Reviews: {JSON.stringify(product.reviews)}</p>
        </div>
      ) }
    </div>
  );
};

export default Shop;
