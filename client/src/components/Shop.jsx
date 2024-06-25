import React from 'react'
import { useLocation } from 'react-router-dom';

const Shop = () => {

  const location = useLocation() ;
  const product = location.state;
  return (
    <div>
        This is a specific product: {product.title}
        <img  src={`${import.meta.env.VITE_AWSCLOUDFRONT_PRODUCT_URL}/products/${product.image_url}.jpg`} />
    </div>
  )
}

export default Shop
    