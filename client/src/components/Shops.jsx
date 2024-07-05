import React from "react";
import { useEffect, useState } from "react";
import ReactLogo from "../assets/react.svg";
import Box from "@mui/material/Box";
import {
  Button,
  Card,
  FormControl,
  Input,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  styled,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ForumIcon from "@mui/icons-material/Forum";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import HistoryIcon from "@mui/icons-material/History";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ShopCardComponent from "./ShopCardComponent";

const Shops = () => {
  //  Store product data
  const [staredProducts, setStaredProducts] = useState([]);
  const [watchedProducts, setWatchedProducts] = useState([]);
  const [remainingProducts, setRemainingProducts] = useState([]);
  // Store current tab value
  const [value, setValue] = React.useState(0);
  // Store search
  const [search, setSearch] = React.useState("");

  // Function for search
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // OPTIONAL: See if this is necessary.
  // Function for submission of search
  const handleSubmit = (event) => {
    event.preventDefault();
    if (search.trim()) {
      navigate(`/results?search=${search}`);
    }
  };



  // Item for each type of content
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: "16px",
    textAlign: "center",
    color: theme.palette.text.secondary,
    boxShadow: "0 0 0",
  }));

  // Component for each tab (tab content)
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        className="bg-slate-100"
      >
        {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
      </div>
    );
  }

  // Sets current tab id
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Function to calculate the tab id
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  // Fetch product data
  useEffect(() => {
    //Sample data
//     const test = {
//   "star_products": [
//     {
//       "product_id": 4,
//       "title": "Mylikes mini bi Chocolate Candy Bucket 128gr",
//       "price": "7.09",
//       "stock": 129,
//       "sold_count": 0,
//       "image_url": "4",
//       "shop_id": 1,
//       "video_id": 1,
//       "user_id": 1,
//       "avg_rating": "3"
//     }
//   ],
//   "watched_products": [
//     {
//       "product_id": 1,
//       "title": "Hydroflask Water Bottle 32oz Hydro flask Thermos Flask Vacuum Flask Stainless Steel Thermal Tumbler",
//       "price": "16.90",
//       "stock": 30,
//       "sold_count": 0,
//       "image_url": "1",
//       "shop_id": 1,
//       "video_id": 1,
//       "user_id": 1,
//       "duration": 10,
//       "avg_rating": "4"
//     },
//     {
//       "product_id": 2,
//       "title": "Hot Air Brush, Hair Brush Dryer Styler, 3 in 1 Electric Negative Ion Hair Dryers, Curler Straightener",
//       "price": "18.81",
//       "stock": 76,
//       "sold_count": 0,
//       "image_url": "2",
//       "shop_id": 2,
//       "video_id": 2,
//       "user_id": 1,
//       "duration": 5,
//       "avg_rating": "5"
//     },
//     {
//       "product_id": 3,
//       "title": "[SG Ready Stock] Mini Fast Charging Power Bank With Cable 5000mAh Portable Charger Small Powerbank For iPhone",
//       "price": "9.50",
//       "stock": 76,
//       "sold_count": 0,
//       "image_url": "3",
//       "shop_id": 3,
//       "video_id": 3,
//       "user_id": 1,
//       "duration": 3,
//       "avg_rating": "4"
//     },
//     {
//       "product_id": 5,
//       "title": "Funko Pop Pokemon - Pokémon Pikachu Squirtle Bulbasaur Esquirtle Charizard Charmander Vulpix Flareon Mewtwo Eevee Dragonite",
//       "price": "13.46",
//       "stock": 129,
//       "sold_count": 0,
//       "image_url": "5",
//       "shop_id": 2,
//       "video_id": 5,
//       "user_id": 1,
//       "duration": 2,
//       "avg_rating": "4"
//     }
//   ],
//   "remaining_products": [
//     {
//       "product_id": 7,
//       "shop_id": 1,
//       "title": "Cute Decompression Sanrio Toy Vent Pinch Music Slow Rebound Little Milk Dragon Decompression Doll Small Gift Ornaments",
//       "description": "Origin: China\n\n3c Configuration Category: Toys Over 14 Years Old\n\nToy Material: PVC\n\nColor: Sanrio Series - Kate Cat, Sanrio Series - Kulome, Sanrio Series - Melody, Sanrio Series - Pudding Dog, Sanrio Series - Yugui Dog Spongebob Squarepants Pie Star\n\nWhether It Is Exclusively For Foreign Trade: No\n\nApplicable Age: Youth (15-35 Years Old)",
//       "price": "1.92",
//       "stock": 9000,
//       "image_url": "7",
//       "sold_count": 10,
//       "created_at": "2024-07-04T05:18:40.122Z",
//       "avg_rating": "5"
//     },
//     {
//       "product_id": 6,
//       "shop_id": 3,
//       "title": "Stanley 40oz/1.1L Quengher H2.0 Tumbler With Handle With Straw Lids Stainless Steel Coffee Termos Cup Car Mugs vacuum cup",
//       "description": "Constructed of recycled stainless steel for sustainable sipping, our 40 oz Quencher H2.0 offers maximum hydration with fewer refills. Commuting, studio workouts, day trips or your front porch—you’ll want this tumbler by your side. Thanks to Stanley’s vacuum insulation, your water will stay ice-cold, hour after hour. The advanced FlowState™ lid features a rotating cover with three positions: a straw opening designed to resist splashes while holding the reusable straw in place, a drink opening, and a full-cover top. The ergonomic handle includes comfort-grip inserts for easy carrying, and the narrow base fits just about any car cup holder.",
//       "price": "38.79",
//       "stock": 9322,
//       "image_url": "6",
//       "sold_count": 20,
//       "created_at": "2024-07-04T04:58:10.907Z",
//       "avg_rating": null
//     }
//   ]
// }

    async function fetchProducts() {
      const response = await fetch("http://localhost:3000/products");
      const fetchedProducts = await response.json();
      setStaredProducts(fetchedProducts.star_products);
      setWatchedProducts(fetchedProducts.watched_products);
      setRemainingProducts(fetchedProducts.remaining_products);
      console.log(JSON.stringify(fetchedProducts));
    }
    fetchProducts();
   
  }, []);

  return (
    <div className="pb-12 bg-white text-black">
      {/* Welcome to Tiktok shop!
      {products.map((product) => {
        return (
          <Link
            key={product.product_id}
            to={`/products/${product.product_id}`}
            // state={product}
          >
            <h1>{product.title}</h1>;
          </Link>
        );
      })}  */}

      {/* Search bar and shopping cart icon */}
      <div className="pt-4 pb-4 flex p-2 space-x-1 items-center">
        <FormControl
          variant="standard"
          sx={{
            backgroundColor: "white",
            width: "90%",
            padding: "8px",
          }}
        >
          <Input
            id="input-with-icon-adornment"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            endAdornment={
              <Button
                variant="contained"
                sx={{
                  fontSize: ".8rem",
                  padding: "2px",
                  margin: "2px",
                  backgroundColor: "#ee1d52",
                }}
                onClick={handleSubmit}
              >
                Search
              </Button>
            }
            placeholder="tote bag"
            disableUnderline
            sx={{
              boxShadow: "1px 4px 10px -6px rgba(0,0,0,0.75)",
              borderRadius: "10px",
              padding: "4px",
            }}
            onChange={handleSearch}
          ></Input>
        </FormControl>
        <ShoppingCartIcon
          sx={{
            width: "30px",
            height: "30px",
          }}
        />
      </div>

      {/* Different options for styling purposes*/}
      <div className="p-2 max-w-prose overflow-x-hidden">
        <Stack direction="row" spacing={0}>
          <div>
            <ListAltIcon />
            <Item>Order</Item>
          </div>
          <div>
            <ConfirmationNumberIcon />
            <Item>Coupons</Item>
          </div>
          <div>
            <ForumIcon />
            <Item>Messages</Item>
          </div>
          <div>
            <BookmarkBorderIcon />
            <Item>Favourites</Item>
          </div>
          <div>
            <HistoryIcon />
            <Item>History</Item>
          </div>
          <div>
            <LocationOnIcon />
            <Item>Address</Item>
          </div>
          <div>
            <PaymentIcon />
            <Item>Payment</Item>
          </div>
          <div>
            <HelpOutlineIcon />
            <Item>Help</Item>
          </div>
        </Stack>
      </div>

      {/* Card to hold categories and cards */}
      <Card
        variant="outlined"
        sx={{
          margin: "8px",
        }}
      >
        {/* Categories Tabs*/}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All" {...a11yProps(0)} />
            <Tab label="Beauty" {...a11yProps(1)} />
            <Tab label="Toys" {...a11yProps(2)} />
            <Tab label="Food" {...a11yProps(3)} />
            <Tab label="Clothes" {...a11yProps(4)} />
          </Tabs>
        </Box>

        {/* Categories Content */}
        {/* NOTE: Only the first tab is populated */}
        <CustomTabPanel value={value} index={0}>
          {/* Cards */}
          <div className="grid grid-cols-2 auto-rows-max gap-2">
            {staredProducts.length !== 0 ? (
              staredProducts.map((product) => {
                return (
                  <ShopCardComponent key={product.product_id} product={product} />
                );
              })
            ) : (
              <p>Loading products...</p>
            )}
            {watchedProducts.length !== 0 ? (
              watchedProducts.map((product) => {
                return (
                  <ShopCardComponent key={product.product_id} product={product} />
                );
              })
            ) : (
              <p>Loading products...</p>
            )}
            {remainingProducts.length !== 0 ? (
              remainingProducts.map((product) => {
                return (
                  <ShopCardComponent key={product.product_id} product={product} />
                );
              })
            ) : (
              <p>Loading products...</p>
            )}
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Empty...
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Empty...
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          Empty...
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          Empty...
        </CustomTabPanel>
      </Card>
    </div>
  );
};

export default Shops;
