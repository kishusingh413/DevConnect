import React, {Component} from 'react' ;
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' ;

import Landing from './components/layout/Landing' ;
import Footer from './components/layout/Footer' ;
import Navbar from './components/layout/Navbar' ;
import Register from './components/auth/Register' ;
import Login from './components/auth/Login' ;

import './App.css';

class App extends Component {
  render(){
    return (
    <Router>
       <div className="App">
       <Navbar />
       <Routes>
           <Route exact path="/" element={<Landing />} />
       </Routes>
       <div className = "container">
            <Routes>
               <Route exact path="/register" element={<Register />} />
               <Route exact path="/login" element={<Login />} />
            </Routes>
       </div>
       <Footer />
       </div>
    </Router>
    );
  }
}

export default App;
