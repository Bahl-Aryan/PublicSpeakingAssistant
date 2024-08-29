import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import RecordUpload from './Components/RecordUpload';
import Home from './Components/Home'; // Assuming you have a Home component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/upload/" element={<RecordUpload/>} />
      </Routes>
    </Router>
  );
}

export default App;