import './App.css';
import Navbar from "./components/Navbar.js";
import { useAuth0 } from '@auth0/auth0-react';
import Home from "./components/pages/Home.js";
import Issues from "./components/pages/Issues.js";
import AddIssue from "./components/pages/AddIssue.js";
import MyIssues from "./components/pages/MyIssues.js";
import { Route, Routes } from 'react-router-dom';
import React from 'react';

function App() {
  const { isLoading } = useAuth0();

  if(isLoading) return <div>Loading...</div>

  return (
    <div className="App">
    <Navbar/>
    <div className="container">
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/issues" element={<Issues/>}/>
      <Route path="/add-issue" element={<AddIssue/>}/>
      <Route path="/my-issues" element={<MyIssues/>}/>
    </Routes>
    </div>
    </div>
  );
}

export default App;
