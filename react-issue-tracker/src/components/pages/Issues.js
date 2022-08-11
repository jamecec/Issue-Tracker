import React, {useState, useEffect, useRef} from 'react';
import TableData from "../TableData";
import { useAuth0 } from '@auth0/auth0-react';


export default function Issues() {
  const { isAuthenticated } = useAuth0();
  if(!isAuthenticated){
    return(
    <>
    <h1>Issues</h1>
    <p className="please-login">Please Login To Access This Page</p>
    </>)
  }
  else{
  return (
    <div className="container">
    <h1>Issues</h1>
    <TableData/>
    </div>
  )
}
}
