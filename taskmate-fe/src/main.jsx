import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Categories from './pages/Categories/Categories';
import Services from './pages/Services/Services';
import Nav from './components/NavBar/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Footer from './components/Footer/Footer';
import CartView from './pages/CartView/CartView';
import Profile from './pages/Profile/Profile';
import Store from './pages/Store/Store';
import Booking from './pages/Booking/Booking';
import LocationMap from './components/map/Map';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <Nav /> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/services' element={<Services />} />
        <Route path='/cart' element={<CartView />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/store' element={<Store />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/mao' element={<LocationMap />} />

      </Routes>
      {/* <Footer/> */}

    </BrowserRouter>
  </React.StrictMode>,
)