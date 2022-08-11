import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import TableData from "../TableData";
import Profile from "../Profile"

export default function MyIssues() {
  const { user, isAuthenticated } = useAuth0();

  if(!isAuthenticated){
    return(
      <>
      <h1>My Issues</h1>
      <p className="please-login">Please Login To Access This Page</p>
      </>
    )
  }
  else{
    return (
      <div className="container">
      <h1>My Issues</h1>
      <TableData profileName={user.name}/>
      </div>
    )
  }
}
