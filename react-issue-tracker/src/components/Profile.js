import React, {useEffect, useState} from 'react';
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const initials = (username) => {
    if(isAuthenticated){
      return username[0] + username[username.indexOf(" ")+1]
    }
    else{
      return ""
    }
  }
useEffect(() => {
    if(isAuthenticated){
      const userData = {
        username: user.name,
        email: user.email};
        axios.post('https://issue-tracker-jc.herokuapp.com/api/users', userData)
        .then((response) => {
          console.log("User Login")
        })
    }
    else{
      return;
    }
  }, [user])
  return(
    isAuthenticated && (
    <div className="profile">
    <div className="user-icon">{initials(user.name)}</div>
    <p>{user.name}</p>
    </div>
  )
  )
}

export default Profile
