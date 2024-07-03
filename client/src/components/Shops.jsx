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
import { useNavigate } from "react-router-dom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ForumIcon from "@mui/icons-material/Forum";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import HistoryIcon from "@mui/icons-material/History";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const Shops = () => {
  //  Store product data
  const [products, setProducts] = useState([]);
  // Store current tab value
  const [value, setValue] = React.useState(0);
  // Store search
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();

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

  // Function for submission of search
  const handleProduct = (product_id) => {
    navigate(`/products/${product_id}`);
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
    async function fetchProducts() {
      const response = await fetch("http://localhost:3000/products");
      const fetchedProducts = await response.json();
      setProducts(fetchedProducts);
    }
    fetchProducts();

    // I will use placeholder data for now.
    // const test =
    // [
    //   {
    //     "product_id": 1,
    //     "shop_id": 3,
    //     "title": "[SG Ready Stock] Mini Fast Charging Power Bank With Cable 5000mAh Portable Charger Small Powerbank For iPhone",
    //     "description": "𝐒𝐏𝐄𝐂𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍:\n▶ Product Type: Mini Power Bank\n▶ Product size: 75*25*40mm\n▶ Product weight: 93g\n▶ Input interface: 5V/2A(Max)\n▶ Output interface: 5V/1-2.4A(Max)\n▶ Battery capacity: 5000mAh\n▶ Storage/transportation temperature: -20℃±50℃\n▶ Certification: Appearance Patent/Quality Inspection\n▶ Report/CE/FCC/ROSH\n▶ Cell type: physical ion cell\n▶ Product colors: black, white, pink, green",
    //     "price": "9.50",
    //     "stock": 76,
    //     "image_url": "3",
    //     "sold_count": 0,
    //     "created_at": "2024-06-25T03:39:34.711Z"
    //   },
    //   {
    //     "product_id": 2,
    //     "shop_id": 3,
    //     "title": "Anime Shirt",
    //     "description": "𝐒𝐏𝐄𝐂𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍:\n▶ Product Type: Mini Power Bank\n▶ Product size: 75*25*40mm\n▶ Product weight: 93g\n▶ Input interface: 5V/2A(Max)\n▶ Output interface: 5V/1-2.4A(Max)\n▶ Battery capacity: 5000mAh\n▶ Storage/transportation temperature: -20℃±50℃\n▶ Certification: Appearance Patent/Quality Inspection\n▶ Report/CE/FCC/ROSH\n▶ Cell type: physical ion cell\n▶ Product colors: black, white, pink, green",
    //     "price": "9.50",
    //     "stock": 76,
    //     "image_url": "3",
    //     "sold_count": 1800,
    //     "created_at": "2024-06-25T03:39:34.711Z"
    //   },
    //   {
    //     "product_id": 3,
    //     "shop_id": 3,
    //     "title": "[SG Ready Stock] Mini Fast Charging Power Bank With Cable 5000mAh Portable Charger Small Powerbank For iPhone",
    //     "description": "𝐒𝐏𝐄𝐂𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍:\n▶ Product Type: Mini Power Bank\n▶ Product size: 75*25*40mm\n▶ Product weight: 93g\n▶ Input interface: 5V/2A(Max)\n▶ Output interface: 5V/1-2.4A(Max)\n▶ Battery capacity: 5000mAh\n▶ Storage/transportation temperature: -20℃±50℃\n▶ Certification: Appearance Patent/Quality Inspection\n▶ Report/CE/FCC/ROSH\n▶ Cell type: physical ion cell\n▶ Product colors: black, white, pink, green",
    //     "price": "9.50",
    //     "stock": 76,
    //     "image_url": "3",
    //     "sold_count": 0,
    //     "created_at": "2024-06-25T03:39:34.711Z"
    //   },
    //   {
    //     "product_id": 4,
    //     "shop_id": 3,
    //     "title": "Anime Shirt",
    //     "description": "𝐒𝐏𝐄𝐂𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍:\n▶ Product Type: Mini Power Bank\n▶ Product size: 75*25*40mm\n▶ Product weight: 93g\n▶ Input interface: 5V/2A(Max)\n▶ Output interface: 5V/1-2.4A(Max)\n▶ Battery capacity: 5000mAh\n▶ Storage/transportation temperature: -20℃±50℃\n▶ Certification: Appearance Patent/Quality Inspection\n▶ Report/CE/FCC/ROSH\n▶ Cell type: physical ion cell\n▶ Product colors: black, white, pink, green",
    //     "price": "12.50",
    //     "stock": 76,
    //     "image_url": "3",
    //     "sold_count": 1800,
    //     "created_at": "2024-06-25T03:39:34.711Z"
    //   },
    //   {
    //     "product_id": 5,
    //     "shop_id": 3,
    //     "title": "[SG Ready Stock] Mini Fast Charging Power Bank With Cable 5000mAh Portable Charger Small Powerbank For iPhone",
    //     "description": "𝐒𝐏𝐄𝐂𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍:\n▶ Product Type: Mini Power Bank\n▶ Product size: 75*25*40mm\n▶ Product weight: 93g\n▶ Input interface: 5V/2A(Max)\n▶ Output interface: 5V/1-2.4A(Max)\n▶ Battery capacity: 5000mAh\n▶ Storage/transportation temperature: -20℃±50℃\n▶ Certification: Appearance Patent/Quality Inspection\n▶ Report/CE/FCC/ROSH\n▶ Cell type: physical ion cell\n▶ Product colors: black, white, pink, green",
    //     "price": "4.50",
    //     "stock": 76,
    //     "image_url": "3",
    //     "sold_count": 0,
    //     "created_at": "2024-06-25T03:39:34.711Z"
    //   },
    //   {
    //     "product_id": 6,
    //     "shop_id": 3,
    //     "title": "Anime Shirt",
    //     "description": "𝐒𝐏𝐄𝐂𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍:\n▶ Product Type: Mini Power Bank\n▶ Product size: 75*25*40mm\n▶ Product weight: 93g\n▶ Input interface: 5V/2A(Max)\n▶ Output interface: 5V/1-2.4A(Max)\n▶ Battery capacity: 5000mAh\n▶ Storage/transportation temperature: -20℃±50℃\n▶ Certification: Appearance Patent/Quality Inspection\n▶ Report/CE/FCC/ROSH\n▶ Cell type: physical ion cell\n▶ Product colors: black, white, pink, green",
    //     "price": "2.50",
    //     "stock": 76,
    //     "image_url": "3",
    //     "sold_count": 1800,
    //     "created_at": "2024-06-25T03:39:34.711Z"
    //   },
    // ]
    // setProducts(test)
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
            {products.length !== 0 ? (
              products.map((product) => {
                return (
                  <div
                    key={product.product_id}
                    className="bg-white text-black flex-col justify-items-center rounded"
                    onClick={() => handleProduct(product.product_id)}
                  >
                    <img
                      src={`${
                        import.meta.env.VITE_AWSCLOUDFRONT_PRODUCT_URL
                      }/products/${product.image_url}.jpg`}
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
