import { Outlet, Link } from "react-router-dom";
import BottomNav from "./BottomNav";

const Layout = () => {
  return (
    <div className="h-screen w-screen">
      {/* <nav>
        <ul className='flex space-x-4 place-items-center'>
          <li>
            <Link to="/">FYP</Link>
          </li>
          <li>
            <Link to="/products">Shop</Link>
          </li>
        </ul> 
      </nav> */}
      <Outlet/>
      <BottomNav/>
    </div>
  )
};

export default Layout;