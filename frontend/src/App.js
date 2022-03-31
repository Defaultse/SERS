import logo from './logo.svg';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css';
import NavBar from './Navbar/Navber';
import { lazy, Suspense } from 'react';

const Login = lazy(()=>import('./Login/Login'));
const Registration = lazy(()=>import('./Registration/Registration'));

function App() {
  return (
    <Router>
      <NavBar />
      <Suspense fallback="Loading...">
      <Routes>
        <Route path="/" exact element={<Login/>}></Route>
        <Route path="/registration" exact element={<Registration/>}></Route>
      </Routes>
    </Suspense>
    </Router>
  );
}

export default App;
