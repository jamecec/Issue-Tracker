import React, { useState, useEffect } from 'react';
import IssueForm from "../IssueForm";
import { useAuth0 } from '@auth0/auth0-react';

export default function AddIssue() {
  const postIssue = {action: "post"};
  const { isAuthenticated } = useAuth0();
    if(!isAuthenticated){
      return(
      <>
      <h1>Add An Issue</h1>
      <p className="please-login">Please Login To Access This Page</p>
      </>)
    }
    else{
  return (
    <div className="container">
    <h1>Add An Issue</h1>
    <IssueForm issueAction={postIssue}/>
    </div>
  )
}
}
