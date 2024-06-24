import React from "react";
import { useEffect, useState } from "react";

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
        return <h1>{product.title}</h1>;
      })}
    </div>
  );
};

export default Shops;
