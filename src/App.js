import './App.css';
import Mymap from "./kako_map/map";
import elec_info from "./kako_map/elec_station";
import {useEffect, useState} from "react";
import {Routes, Route} from 'react-router-dom'
import axios from "axios";
import Header from "./Header_Footer/Header";
import Footer from "./Header_Footer/Footer";
import MainPage from "./routes/MainPage.js";
import MapUi from "./routes/MapUi.js";
import Statistics from "./routes/Statistics";

import Board from "./board/BoardMain"
import Login from "./board/Login"
import DetailPost from "./board/DetailPost"
import CreatePost from "./board/Create";
import RestArea from "./routes/restArea";
import Jeju from "./routes/jeju";
import Chatbot from "./chatbot/chat";



// Axios 글로벌 설정
axios.defaults.baseURL = 'http://localhost:3001';
// axios.defaults.withCredentials = false;
axios.defaults.withCredentials = true;



function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginId, setLoginId] = useState('');
    const [userName, setUserName] = useState('');
    const [userRealName, setUserRealName] = useState('');



  return (
      <div className="App">
          <div id="wrap">

          <Header isLoggedIn={isLoggedIn} loginId={loginId} userName={userName} userRealName={userRealName}/>

              <div id="change">

                  <Routes>
                      <Route path="/" element={<MainPage/>}/>
                      <Route path="/map" element={<MapUi/> }/>
                      <Route path="/sub" element={<Statistics/>}/>
                      <Route path="/restArea" element={<RestArea/>}/>
                      <Route path="/restarea/:route" element={<RestArea />} />
                      <Route path="/jeju" element={<Jeju/>}/>
                      <Route path="/board" element={<Board isLoggedIn={isLoggedIn} loginId={loginId} userName={userName} userRealName={userRealName}/>}/>
                      <Route path="/boardMain/:page" element={<Board isLoggedIn={isLoggedIn} loginId={loginId} userName={userName} userRealName={userRealName}/>}/>
                      <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} loginId={loginId} setLoginId={setLoginId}
                                                           setUserName={setUserName} userName={userName} userRealName={userRealName} setUserRealName={setUserRealName}/>}/>
                      <Route  path="/detailPost/:id" element={<DetailPost isLoggedIn={isLoggedIn} loginId={loginId} userName={userName} userRealName={userRealName}/>}/>
                      <Route  path="/create" element={<CreatePost isLoggedIn={isLoggedIn} loginId={loginId} userName={userName} userRealName={userRealName}/>}/>
                      <Route  path="/chatbot" element={<Chatbot isLoggedIn={isLoggedIn} loginId={loginId} userName={userName} userRealName={userRealName}/>}/>
                  </Routes>
                  <link to="/chatbot"></link>

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
