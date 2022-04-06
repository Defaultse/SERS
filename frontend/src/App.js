import logo from './logo.svg';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import NavBar from './Navbar/Navbar';
import { lazy, Suspense } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = lazy(()=>import('./Login/Login'));
const Registration = lazy(()=>import('./Registration/Registration'));
const Main = lazy(()=>import('./Main/Main'));

function App() {
  return (
    <Router>
      <NavBar />
      <Suspense fallback="Loading...">
      <Routes>
        <Route path="/login" exact element={<Login/>}></Route>
        <Route path="/registration" exact element={<Registration/>}></Route>
        <Route path="/" exact element={<Main/>}></Route>
      </Routes>
    </Suspense>
    </Router>
  );
}

export default App;
