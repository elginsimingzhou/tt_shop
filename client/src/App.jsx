import "./App.css";
import FYP from "./components/FYP";
import Tiktok from "./components/Tiktok";
import Layout from "./components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";  
import Shops from "./components/Shops";

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
          <Route index element={<FYP />} />
          <Route path="videos/:video_id" element={<Tiktok />} />
          <Route path="shops" element={<Shops />} />
      </Route>
    </Routes>
   
   </BrowserRouter> 
  );
}

export default App;
