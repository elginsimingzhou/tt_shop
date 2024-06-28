import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Person3Icon from '@mui/icons-material/Person3';
import { useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const handleNavigate = (url) => {
    navigate(`/${url}`);
  }

  return (
    // General box for navigation
    <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
    }}>
      {/* Each navigation button */}
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          backgroundColor: 'black',
        }}
      >
        <BottomNavigationAction 
          label="Home" 
          icon={<HomeIcon />} 
          sx={{
            color:'white'
          }}
          onClick={() => handleNavigate('')}
        />
        <BottomNavigationAction 
          label="Shop" 
          icon={<ShoppingBagIcon />} 
          sx={{
            color:'white'
          }}
          onClick={() => handleNavigate('products')}
        />
        {/* Custom styling to the add button for styling purposes */}
        <div className='flex items-center justify-center w-1/5 text-black'>
          <div className='bg-blue-400 h-1/2 w-2/12 rounded-l-lg -mr-2'></div>
          <div className='flex justify-center items-center text-black bg-white h-1/2 w-1/2 z-10 rounded-md'><AddIcon/></div>
          <div className='bg-red-400 h-1/2 w-2/12 rounded-r-lg -ml-2'></div>
        </div>
        <BottomNavigationAction 
          label="Inbox" 
          icon={<ChatBubbleIcon />} 
          sx={{
            color:'white'
          }}
        />
        <BottomNavigationAction 
          label="Profile" 
          icon={<Person3Icon />} 
          sx={{
            color:'white'
          }}
        />
      </BottomNavigation>
    </Box>
  );
}