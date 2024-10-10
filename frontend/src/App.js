import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import ShopCategory from "./Pages/ShopCategory";
import women_banner from "./Components/Assets/banner_women.png";
import men_banner from "./Components/Assets/banner_mens.png";
import rent_banner from "./Components/Assets/banner_kids.png";
import LoginSignup from "./Pages/LoginSignup";

import Confirm from "./Components/Confirm/Confirm";


export const backend_url = 'http://localhost:4000';
export const currency = '₹';

function App() {

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop gender="all" />} />
          <Route path="/mens" element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path="/womens" element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path="/rent" element={<ShopCategory banner={rent_banner} category="rent" />} />
          <Route path='/product' element={<Product />}>
            <Route path=':productId' element={<Product />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          {/* <div>
            <Confirm/>
          </div> */}
          
       
          <Route path="/login" element={<LoginSignup/>} />
          <Route path="/Confirm" element={<Confirm/>}/>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
