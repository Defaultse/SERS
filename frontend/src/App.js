import logo from './logo.svg';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
// import NavBar from './Navbar/Navbar';
import { lazy, Suspense } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AudioDetail from './AudioDetail/AudioDetail'
import Sidebar from './Sidebar/Sidebar';

const Navbar = lazy(()=>import('./Navbar/Navbar'));
const Login = lazy(()=>import('./Login/Login'));
const Registration = lazy(()=>import('./Registration/Registration'));
const Main = lazy(()=>import('./Main/Main'));
const ManualUpload = lazy(()=>import('./ManualUpload/ManualUpload'))

function App() {
  return (
    <Router>
      
      <Suspense fallback="Loading...">
      <Navbar />
      {/* <Sidebar/> */}
      {/* <Suspense fallback="Loading..."> */}
      <Routes>
        <Route path="/login" exact element={<Login/>}></Route>
        <Route path="/registration" exact element={<Registration/>}></Route>
        <Route path="/" exact element={<Main/>}></Route>
        <Route path="/audio-files/:id" exact element={<AudioDetail/>} />
        <Route path="/manual-upload" exact element={<ManualUpload/>} />
      </Routes>
    </Suspense>
    </Router>
  );
}

export default App;
