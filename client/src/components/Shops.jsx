import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Tiktok from "./Tiktok";

const Shops = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("http://localhost:3000/products");
      const data = await response.json();
      setProducts(data);
    }

    fetchProducts();
  }, []);

  return (
    <div>
      Welcome to Tiktok shop!
      {products.map((product) => {
        return (
          <Link
            key={product.product_id}
            to={`/products/${product.product_id}`}
            state={product}
          >
            <h1>{product.title}</h1>;
          </Link>
        );
      })}
    </div>
  );
};

export default Shops;
