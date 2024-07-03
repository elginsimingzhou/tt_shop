import { Outlet, Link } from "react-router-dom";
import BottomNav from "./BottomNav";

const Layout = () => {
  return (
    <div className="h-screen w-screen bg-white">
      <Outlet/>
      <BottomNav/>
    </div>
  )
};

export default Layout;