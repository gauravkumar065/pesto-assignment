import React, { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { Navigate } from 'react-router-dom';
import './App.css';


const App = () => {
  const [session , setSession] = useState(undefined);
  
  useEffect(()=>{
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.log("Logger -> fetchUser -> user:", data.session);
        setSession(null);
      } else {
        setSession(data.session);
      }
    };

    fetchSession();
  },[])

  if (session === undefined) {
    // Session is still being fetched
    return <div>Loading...</div>;
  }

  if (session === null) {
    // User is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

    const Header = ({ logoSrc, userName, onLogout }) => {
      return (
        <header className="header">
          <img src={logoSrc} alt="Company Logo" className="logo" />
          <div className="user-section">
            <span className="user-name">{userName}</span>
            <button className="logout-button" onClick={onLogout}>Logout</button>
          </div>
        </header>
      );
    };
    
    

  return (
    <Header className="header">
    <img src= '' alt="Company Logo" className="logo" />
    <div className="user-section">
      <span className="user-name">{session}</span>
      <button className="logout-button" onClick={()=>{}}>Logout</button>
    </div>
  </Header>
  );
}

export default App