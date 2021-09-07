import React, { useState, useEffect } from 'react';
import Dashboard from './features/dashboard/Dashboard';
import './App.css';
import { nw } from 'nodewire';
import SignIn from './Signin.js'
import SignUp from './Signup';
import Splash from './Splash'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

//nw.debug_level = 2

function App() {
  const [authorized, setAuthorized] = useState(false);
  const [connected, setConnected] = useState(false);

  const signout = ()=> {
    localStorage.removeItem('cred');
    setAuthorized(false);
    nw.disconnect();
    window.location.reload();
  }

  const signin = (tok) => {
    setAuthorized(true);
    nw.connect({ token: tok, server: process.env.REACT_APP_API_SERVER, use_tls: window.location.protocol === 'https:'});
  }
  
  useEffect(() => {
    const cred = JSON.parse(localStorage.getItem('cred'));
    if(cred){
      setAuthorized(true)
      if(!nw.connected)
        !nw.connect({ token: cred.token, server: process.env.REACT_APP_API_SERVER, use_tls: window.location.protocol === 'https:' }) && signout();
    }
    else
      nw.server = process.env.REACT_APP_API_SERVER
    
    nw.onStart(()=>setConnected(true))
    nw.when('authfail', ()=>signout()) 
    nw.when('autherror', ()=>signout())
  }, []);

  if(!authorized)
    return (
      <Router>
      <Switch>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/">
          <SignIn success = {t=>signin(t)} />
        </Route>
      </Switch>
      </Router>
    )
  if(!connected)
    return (
      <Splash />
    )
  return (
    <Dashboard signout={signout}/>
  );  
}

export default App;