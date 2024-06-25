import "./App.css";
import FYP from "./components/FYP";
import Layout from "./components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";  
import Shops from "./components/Shops";
import Shop from "./components/Shop";
import TikTokDetails from "./components/TikTokDetails";

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
          <Route index element={<FYP />} />
          <Route path="videos/:video_id" element={<TikTokDetails />} />
          <Route path="products" element={<Shops />} />
          <Route path="products/:product_id" element={<Shop />} />
      </Route>
    </Routes>
   
   </BrowserRouter> 
  );
}

export default App;
