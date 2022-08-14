import React, {useState, useEffect, useRef} from 'react';
import axios from "axios";
import Modal from "../Modal.js";
import { useAuth0 } from '@auth0/auth0-react';
import BarChart from '../Graphs/BarChart.js';
import StackedBarChart from '../Graphs/StackedBarChart.js';
import HorizontalProgress from '../Graphs/ProgressBar.js'


export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [currentUser, setCurrentUser] = useState([{role: "user"}]);
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [userModalIsOpen, setUserModalIsOpen] = useState(false);
  const [userModalStatus, setUserModalStatus] = useState(false);
  const [userModalContent, setUserModalContent] = useState();
  const [enableButton, setEnableButton] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [usernameChange, setUsernameChange] = useState("");
  const [emailChange, setEmailChange] = useState("");
  const [roleChange, setRoleChange] = useState("");
  const [userId, setUserId] = useState();
  const [overdueArr, setOverdueArr] = useState();
  const userChange = useRef(0);
  const today = new Date();

  useEffect(() => {
    setIsLoaded(true);
  })

  useEffect(()=>{
    const fetchData = async () => {
      const userData = await axios.get('https://issue-tracker-jc.herokuapp.com/api/users')
      setUsers([userData.data, {_id: "0", username: "Unassigned"}].flat());

      const issueData = await axios.get('https://issue-tracker-jc.herokuapp.com/api/issues')
      setOverdueArr([issueData.data].flat().filter((item) => item.Status !== "Completed" && item.status !== "Canceled" && new Date(item.DueDate) < today));
      setIssues([issueData.data].flat())

    };
      fetchData();
      console.log("refreshed");
  },[]);

  useEffect(() => {
    if(isLoaded){
      roleCheck(users.filter((item) => item.email === user.email));
      setUserModalIsOpen(true)}
},[usernameChange, emailChange, roleChange])

  const roleCheck = (currentUser) => {
    if(currentUser[0].role === "user"){
      setUserModalContent((<div>
      <p>Only Admins May Access User Settings</p>
      </div>))
    }
    if(currentUser[0].role === "admin"){
      setEnableButton(true);
      setUserModalContent((<div className = "user-modal">
      <div className="row"><p>Username: </p><input value = {usernameChange} type="text" id="usernameChange" name= "usernameChange" onChange = {(e) => setUsernameChange(e.target.value)}/></div>
      <div className="row"><p>Email: </p><input value = {emailChange} type="text" name = "emailChange" id = "emailChange" onChange = {(e) => setEmailChange(e.target.value)}/></div>
      <div className="row"><p>Role: </p>
      <select value = {roleChange} id = "roleChange" name = "roleChange" onChange = {(e) => setRoleChange(e.target.value)}>
      <option value = "user">User</option>
      <option value = "admin">Admin</option>
      </select>
      </div>
      </div>))
    }
  }

  const selectUser = (id) => {
    let selectedUser = users.filter((item) => item._id === id)[0];
    setUsernameChange(selectedUser.username);
    setEmailChange(selectedUser.email);
    setRoleChange(selectedUser.role);
    setUserId(id);

  }

  const closeUserModal = () => {
    setUserModalIsOpen(false);
    setUserModalStatus();
  }

  const submitUserChanges = async (e) => {
    e.preventDefault();
    if(document.querySelector("#usernameChange").value.length === 0 || document.querySelector("#emailChange").value.length === 0){
      setUserModalStatus("All Fields Required")
    }
    else{
      const userData = {
        username: usernameChange,
        email: emailChange,
        role: roleChange
      }
      const submission = await axios.put(`https://issue-tracker-jc.herokuapp.com/api/users/${userId}`, userData);
      setUserModalStatus("User Updated!");
      console.log("User Updated");
      setTimeout(()=>{
        closeUserModal();
      }, 500);
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    }
  }

  const deleteUser = async () => {
    await axios.delete(`https://issue-tracker-jc.herokuapp.com/api/users/${userId}`, {_id: userId});
    console.log("user deleted");
    setUserModalStatus("User Deleted!");
    setTimeout(()=>{
        closeUserModal();
      }, 500);
    setTimeout(() => {
        window.location.reload();
      }, 1000);
  }

  if(!isAuthenticated){
    return(
    <>
    <h1>Home</h1>
    <p className="please-login">Please Login To Access This Page</p>
    </>)
  }
  else{
  return (
    <>
    <div className = 'home'>
    <div className="user-list">
    <div className = "table-container">
    <h2>Users</h2>
    <table>
    <tbody>
    <tr>
    <th>Admin</th>
    {users.filter((user)=>user.role === "admin").map((user)=><td key={user._id} onClick={()=>selectUser(user._id)}>{user.username}</td>)}
    </tr>
    <tr>
    <th>Users</th>
    {users.filter((user)=>user.role === "user").map((user)=><td key={user._id} onClick={()=>selectUser(user._id)}>{user.username}</td>)}
    </tr>
    </tbody>
    </table>
    </div>
    <Modal open={userModalIsOpen} onSubmit={submitUserChanges} onClose={closeUserModal} deleteItem={deleteUser} enableButton={enableButton} userId={userId}>
    {userModalContent}
    {userModalStatus}
    </Modal>
    </div>
    <div className = "dashboards">
    <h2>DashBoards</h2>
    {issues && overdueArr && <HorizontalProgress bgcolor="#d4463b" label="Overdue" numLabel={`${Math.round((overdueArr.length/issues.length)*100)}%`} progress = {Math.round((overdueArr.length/issues.length)*100)} barLabel = "Overdue Issues"/>}
    {issues && <StackedBarChart data={issues}/>}
    {issues && <BarChart data={issues}/>}
    </div>
    </div>
    </>
  )
}
}
