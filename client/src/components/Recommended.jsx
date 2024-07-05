import { useState } from 'react';
import ReactLogo  from '../assets/react.svg'
import { Link } from 'react-router-dom';

const Recommended = ({ item, animate }) => {
    const [product, setProduct] = useState(item.product_info)

    //Sample data
    // const productData = 
    // {
    //   "product_info": {
    //     "product_id": 1,
    //     "shop_id": 1,
    //     "product_title": "Hydroflask Water Bottle 32oz Hydro flask Thermos Flask Vacuum Flask Stainless Steel Thermal Tumbler",
    //     "product_description": "The best choice for buying water bottle !!!\n\n*Note: Hydroflask has no anti -condensation coating\n\n\n\nFeatures\n\n● This insulated water bottle is dishwasher safe!\n\n● This bottles keep the coldest drinks icy cold and hot drinks piping hot for hours!\n\n● Reusable water bottle is BPA-free, phthalate-free, and made of stainless steel!\n\n● Fits car bottle holders!\n\n\n\n\n\nDetails\n\n● Capacity: 32oz（946ml）\n\n● Wide mouth opening\n\n● Constructed with 18/8 pro stainless steel\n\n● Odor- and bacteria-resistant\n\n● 100% recyclable\n\n● Convenient carry\n\n● Double wall vacuum insulation keeps hot beverages hot up to 12 hours and cold drinks refreshing for 24 hours\n\n\n\nNote:\n\nAs the lighting effects, the color of objects maybe a little different from pictures",
    //     "price": "16.90",
    //     "stock": 30,
    //     "image_url": "1",
    //     "product_sold_count": 0,
    //     "shop_title": "hydro_flask.sg",
    //     "shop_sold_count": 0,
    //     "response_rate": 0,
    //     "shipped_on_time_rate": 0
    //   },
    // }

    return (
        <div className={`absolute top-20 right-0 transform bg-white p-4 rounded shadow-lg z-20 p-2 shadow-md rounded-l-xl opacity-95 ${
        animate ? 'animate-slideIn' : 'animate-slideOut'}`}>
            <div className='flex justify-evenly'>
                <img src={ReactLogo} alt={product.product_title} className="w-30 h-30 rounded-sm"/> {/* TODO: To change to image url */}
                <p className='flex justify-center items-center w-20 ellipsis'>{product.product_title}</p>
            </div>
            <Link to={`products/${product.product_id}`}>
                <button className='m-1 bg-red-500 text-white text-sm'>Find out more</button>
            </Link>
        </div>
    );
};


export default Recommended