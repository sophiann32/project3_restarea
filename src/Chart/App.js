import './App.css';
import Mymap from "./kako_map/map";
import My_location from "./kako_map/my_location";
import {useEffect, useState} from "react";
import {Routes, Route} from 'react-router-dom'
import axios from "axios";

import Header from "./Header_Footer/Header";
import Footer from "./Header_Footer/Footer";
import MainPage from "./routes/MainPage.js";
import MapUi from "./routes/MapUi.js";
import Statistics from "./routes/Statistics";

function App() {
  return (
      <div className="App">
          <div id="wrap">

          <Header/>

              <div id="change">

                  <Routes>
                      <Route path="/" element={<MainPage/>}/>
                      <Route path="/map" element={<MapUi/> }/>
                      <Route path="/sub" element={<Statistics/>}/>
                  </Routes>

              </div>

          <Footer/>


          </div>
          {/*wrap 끝*/}

      </div>
      // App 끝

  );
}

function statistics(){
    return(
        <>
            <aside id="aside"></aside>
            <section id="section"></section>
        </>
    )
}



export default App;
