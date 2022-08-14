import React, {useState, useEffect, useRef} from 'react';
import axios from "axios";
import Table from "./Table";

export default function TableData({profileName}) {
  const [issues, setIssues] = useState([]);
  const [project, setProject] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assigned, setAssigned] = useState("");
  const [users, setUsers] = useState([{_id: "0", username: "Unassigned"}]);
  const [projects, setProjects] = useState([]);
  const [tableData, setTableData] = useState([{_id: "Loading", Error: ["Please Wait"]}]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState([""]);
  const [perPage, setPerPage] = useState(25);

  const userAssigned = profileName ? {Assigned: profileName} : {Assigned: assigned};
  const criteria = [{Project: project}, {Type: type}, {Category: category}, {Status: status}, {Priority: priority}, userAssigned];
  const reducedCriteria = criteria.filter((item) => Object.values(item)[0] !== "");
  const filters = Object.entries(Object.assign({}, ...reducedCriteria));
  const filteredData = !isLoaded ? ([{_id: "Loading", Error: ["Please Wait"]}]) : issues.filter((item) => filters.every(([k,v]) => item[k] === v));
  const searchedFilteredData = !isLoaded ? ([{_id: "Loading", Error: ["Please Wait"]}]) : filteredData.filter((item) => search.some(word => JSON.stringify(item).toLowerCase().includes(search.join().toLowerCase())))

  useEffect(()=>{
    const fetchData = async () => {
      const userData = await axios.get('https://issue-tracker-jc.herokuapp.com/api/users')
      setUsers([userData.data, {_id: "0", username: "Unassigned"}].flat());

      const projectData = await axios.get('https://issue-tracker-jc.herokuapp.com/api/projects')
      setProjects([projectData.data].flat())

      const issueData = await axios.get('https://issue-tracker-jc.herokuapp.com/api/issues')
      setIssues([issueData.data].flat());
      setIsLoaded(true);
    }
    fetchData();
    console.log("refreshed")
  },[]);

  useEffect(()=>{
    if(searchedFilteredData.length==0){
      setTableData([{_id: "Error", Error:["No Entries Found"]}])
    }
    else{
      setTableData(searchedFilteredData);
    }
  },[project,type,category,status,priority,assigned,issues,search]);

  const clearFilters = () => {
    setProject("");
    setType("");
    setCategory("");
    setStatus("");
    setPriority("");
    setAssigned("");
    setSearch([""]);
  }

  return(
  <>
  <div className="filters">
  <div className="mobile-row">
  <p>Project:</p>
  <select name="project" value={project}onChange={(e)=>setProject(e.target.value)}>
  <option value="" disabled hidden>Please Select</option>
  {projects.map((item)=><option key={item._id} value={item.project}>{item.project}</option>)}
  </select>
  </div>
  <div className="mobile-row">
  <p>Type:</p>
  <select name="type" value={type} onChange={(e)=>setType(e.target.value)}>
  <option value="" disabled hidden>Please Select</option>
  <option value="Bug">Bug</option>
  <option value="Task">Task</option>
  <option value="Other">Other</option>
  </select>
  </div>
  <div className="mobile-row">
  <p>Category:</p>
  <select name="category" value={category} onChange={(e)=>setCategory(e.target.value)}>
  <option value="" disabled hidden>Please Select</option>
  <option value="Front End">Front End</option>
  <option value="Back End">Back End</option>
  <option value="Design">Design</option>
  <option value="Other">Other</option>
  </select>
  </div>
  <div className="mobile-row">
  <p>Status:</p>
  <select name="status" value={status} onChange={(e)=>setStatus(e.target.value)}>
  <option value="" disabled hidden>Please Select</option>
  <option value="Open">Open</option>
  <option value="In Progress">In Progress</option>
  <option value="Completed">Completed</option>
  <option value="Canceled">Canceled</option>
  </select>
  </div>
  <div className="mobile-row">
  <p>Priority:</p>
  <select name="priority" value={priority} onChange={(e)=>setPriority(e.target.value)}>
  <option value="" disabled hidden>Please Select</option>
  <option value="High">High</option>
  <option value="Medium">Medium</option>
  <option value="Low">Low</option>
  </select>
  </div>
  <div className="mobile-row">
  {!profileName &&
  <div style={{display: "flex", alignItems: "center"}}>
  <p>Assigned To:</p>
  <select name="assigned" value={assigned} onChange={(e)=>setAssigned(e.target.value)}>
  <option value="" disabled hidden>Please Select</option>
  {users.map((item)=><option key={item._id} value={item.username}>{item.username}</option>)}
  </select>
  </div>
  }
  </div>
  <button onClick={clearFilters}>Clear Filters</button>
  </div>
  <div className = "filters">
  <p>Search:</p>
  <input name="search" value = {search} onChange={((e)=>setSearch([e.target.value]))}/>
  <p>Items per Page</p>
  <select name="perPage" value = {perPage} onChange={(e)=>setPerPage(e.target.value)}>
  <option value={25}>25</option>
  <option value={50}>50</option>
  <option value={100}>100</option>
  </select>
  </div>
  <Table arr={tableData} perPage={perPage} users={users}/>
  </>
)
}
