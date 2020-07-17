import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './routes/home';
// import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className='App'>
     <Router>
       <Route path='/'>
         <Home />
       </Route>
     </Router>
    </div>
  );
}

export default App;
