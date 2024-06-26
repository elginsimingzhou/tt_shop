import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Person3Icon from '@mui/icons-material/Person3';
import { Link } from 'react-router-dom';

export default function BottomNav() {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
    }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <Link to="/"><BottomNavigationAction label="Home" icon={<HomeIcon />}/></Link>
        <Link to='/products'><BottomNavigationAction label="Shop" icon={<ShoppingBagIcon />}/></Link>
        <BottomNavigationAction label="" icon={<AddIcon/>}/>
        <BottomNavigationAction label="" icon={<ChatBubbleIcon />} />
        <BottomNavigationAction label="" icon={<Person3Icon />} />
      </BottomNavigation>
    </Box>
  );
}