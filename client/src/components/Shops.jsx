import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Tiktok from "./Tiktok";
import ReactLogo from '../assets/react.svg'
import Box from '@mui/material/Box';
import { Card, FormControl, Input, InputAdornment, InputLabel, Tab, Tabs} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';


const Shops = () => {
  //  Store product data
  const [products, setProducts] = useState([]);
  const [value, setValue] = React.useState('1');

  // Component for each tab
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        className="bg-slate-200"
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  // Fetch product data
  useEffect(() => {
    // async function fetchProducts() {
    //   const response = await fetch("http://localhost:3000/products");
    //   const data = await response.json();
    //   setProducts(data);
    // }
    // fetchProducts();

    // I will use placeholder data for now.
    const test = [{title: 'fishing rod'}, {title: 'kettle'}, {title: 'lipstick'}, {title: 'golf stick'}]
    setProducts(test)

  }, []);

  return (
    <div>
      {* Welcome to Tiktok shop!
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
      })} *}

      {/* Search bar and shopping cart icon */}
      <div className="pt-4 pb-4 flex p-2 space-x-4 items-center">
        <FormControl 
          variant="standard" 
          sx={{
            backgroundColor: 'white',
            width: '90%',
            padding: '8px'
          }}>
          <Input
            id="input-with-icon-adornment"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon/>
              </InputAdornment>
            }
            placeholder="Search"
          />
        </FormControl>
        <ShoppingCartIcon
          sx={{
            width:'30px',
            height:'30px',
          }}/>
      </div>

      {/* Card to hold categories and cards */}
      <Card variant="outlined" sx={{
          margin: '8px',
        }}>

        {/* Categories Tabs*/}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
          <div className="grid grid-cols-2 auto-rows-max gap-4">
            {products.map((product) => {
              return(
                <div className="bg-white text-black flex-col justify-items-center rounded p-8">
                  <img src={ReactLogo} alt='placeholder' className="w-16 h-16"/>
                  <p>{product.title}</p>
                </div>
              );
            })}
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Item Two
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          Item Four
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          Item Five
        </CustomTabPanel>
      </Card>

    </div>
  );
};

export default Shops;
