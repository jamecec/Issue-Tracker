import React, { useState, useEffect } from 'react';
import Modal from "./Modal.js";
import axios from "axios";


export default function IssueForm({issueAction, foundIssue, closeIssueModal}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState("");
  const [project, setProject] = useState("");
  const [version, setVersion] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assigned, setAssigned] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState([ {_id: "0", username: "Unassigned"}]);
  const [projects, setProjects] = useState([]);
  const [projectIsOpen, setProjectIsOpen] = useState(false);
  const [projectModalStatus, setProjectModalStatus] = useState();
  const [projectName, setProjectName] = useState();
  const [newVersion, setNewVersion] = useState();
  const [versionIsOpen, setVersionIsOpen] = useState(false);
  const [versionModalStatus, setVersionModalStatus] = useState();
  const [issueStatus, setIssueStatus] = useState();

  useEffect(()=>{
    const fetchData = async () => {
      const userData = await axios.get('http://localhost:5000/api/users')
      setUsers([userData.data, {_id: "0", username: "Unassigned"}].flat());

      const projectData = await axios.get('http://localhost:5000/api/projects')
      setProjects([projectData.data].flat())
    }
    (async () => {
      await fetchData();
      console.log("refreshed");
      if(foundIssue){
        setTitle(foundIssue.Title);
        setDescription(foundIssue.Description);
        setComments(foundIssue.Comments);
        setProject(foundIssue.Project);
        setVersion(foundIssue.Version);
        setType(foundIssue.Type);
        setCategory(foundIssue.Category);
        setStatus(foundIssue.Status);
        setPriority(foundIssue.Priority);
        setAssigned(foundIssue.Assigned);
        setDueDate(foundIssue.DueDate);
      }
    })();
  },[]);

  const closeProjectModal = () =>{
    setProjectModalStatus();
    setProjectIsOpen(false);
  }
  const closeVersionModal = () => {
    setVersionModalStatus();
    setVersionIsOpen(false);
  }

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setComments("");
    setProject("");
    setVersion("");
    setType("");
    setCategory("");
    setStatus("");
    setPriority("");
    setAssigned("");
    setDueDate("");
  }

  const getProjects = async () =>{
    const projectData = await axios.get('http://localhost:5000/api/projects')
    setProjects([projectData.data].flat())
    console.log("refreshed projects")
  };

  const submitProject = async (e) => {
    e.preventDefault();
    if(document.querySelector('#projectName').value.length === 0){
      setProjectModalStatus('All Fields Required');
    }
    else{
        const projectData = {project: projectName}
        const postProject = await axios.post('http://localhost:5000/api/projects', projectData);
        console.log("Project Added");
        setTimeout(() => {
          getProjects();
        }, 500);
      closeProjectModal();
  }
}

  const submitVersion = async (e) => {
    e.preventDefault();
    if(document.querySelector('#newVersion').value.length === 0 || document.querySelector('#projectName').value === ""){
      setVersionModalStatus('All Fields Required');
    }
    else{
        const versionData = {project: projectName, version: newVersion};
        const put = await axios.put('http://localhost:5000/api/projects', versionData);
        console.log("Version Added");
        setTimeout(() => {
          getProjects();
        }, 500);
        closeVersionModal();
    }
  }
  const submitIssue = async (e, IssueAction) => {
  e.preventDefault();
    const issueData = {
      title: title,
      description: description,
      project: project,
      version: version,
      type: type,
      category: category,
      status: status,
      priority: priority,
      assigned: assigned,
      dueDate: dueDate,
      comments: comments
    }
    const submission = issueAction.action == "post" ? await axios.post('http://localhost:5000/api/issues', issueData) :
    issueAction.action == "put" ? await axios.put(`http://localhost:5000/api/issues/${issueAction._id}`, issueData) : null;

    if(issueAction.action == "post"){
      console.log("issue added");
      setIssueStatus("Issue Submitted!");
      clearForm();
    }
    if(issueAction.action == "put"){
      console.log("issue edited")
      setIssueStatus("Issue Submitted!");
      clearForm();
      setTimeout(()=>{
        closeIssueModal()
      }, 500);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
};

  return (
    <div>
    <form onSubmit={(e)=>submitIssue(e, issueAction)}>
    <div className = "issue-form">
    <div className="form-row">
    <input data-type="input" name="title" id="title" placeholder="Title" type="text" value = {title} onChange={(e)=>setTitle(e.target.value)} required/>
    </div>
    <div className="form-row">
    <textarea data-type="input" type="text" id="description" placeholder="Description" name="description" value = {description} onChange={(e)=>setDescription(e.target.value)} required/>
    </div>
    <div className="form-row">
    <textarea type="text" id="comments" placeholder="Comments" name="comments" value = {comments} onChange={(e)=>setComments(e.target.value)}/>
    </div>
    <div className="form-row">
    <div className="form-column">
    <div className="table-column">
    <div className="table-row">
    <p>Project:</p>
    <select data-type="select" id="project" name="project" value={project} onChange={(e)=>setProject(e.target.value)} required>
    <option value="" disabled hidden>Please Select</option>
    {projects.map((item)=><option key={item.project} value={item.project}>{item.project}</option>)}
    </select>
    <button type="button" onClick={()=>setProjectIsOpen(true)}>Or Add New Project</button>
    </div>
    <div className="table-row">
    <p>Type:</p>
    <select data-type="select" id="type" name="type" value={type} onChange={(e)=>setType(e.target.value)} required>
    <option value="" disabled hidden>Please Select</option>
    <option value="Bug">Bug</option>
    <option value="Task">Task</option>
    <option value="Other">Other</option>
    </select>
    </div>
    <div className="table-row">
    <p>Status:</p>
    <select data-type="select" id="status" name="status" value={status} onChange={(e)=>setStatus(e.target.value)} required>
    <option value="" disabled hidden>Please Select</option>
    <option value="Open">Open</option>
    <option value="In Progress">In Progress</option>
    <option value="Completed">Completed</option>
    <option value="Canceled">Canceled</option>
    </select>
    </div>
    <div className="table-row">
    <p>Assigned To:</p>
    <select data-type="select" id="assigned" name="assigned" value={assigned} onChange={(e)=>setAssigned(e.target.value)} required>
    <option value="" disabled hidden>Please Select</option>
    {users.map((item)=><option key={item._id} value={item.username}>{item.username}</option>)}
    </select>
    </div>
    </div>
    </div>
    <div className="form-column">
    <div className="table-column">
    <div className="table-row">
    <p>Version:</p>
    <select data-type="select" id="version" name="version" value={version} onChange={(e)=>setVersion(e.target.value)} required>
    <option value="" disabled hidden>Please Select</option>
    {!project ? "" : projects.find(element => element.project == project).versions.map((item)=><option key={item} value={item}>{item}</option>)}
    </select>
    <button type="button" onClick={() => setVersionIsOpen(true)}>Or Add New Version</button>
    </div>
    <div className="table-row">
    <p>Category:</p>
    <select data-type="select" id="category" name="category" value={category} onChange={(e)=>setCategory(e.target.value)} required>
    <option value="" disabled hidden>Please Select</option>
    <option value="Front End">Front End</option>
    <option value="Back End">Back End</option>
    <option value="Design">Design</option>
    <option value="Other">Other</option>
    </select>
    </div>
    <div className="table-row">
    <p>Priority:</p>
    <select data-type="select" id="priority" name="priority" value={priority} onChange={(e)=>setPriority(e.target.value)} required>
    <option value="" disabled hidden>Please Select</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
    </select>
    </div>
    <div className="table-row">
    <p>Due Date:</p>
    <input data-type="input" id="date" name="date" placeholder="Due Date" type="date" value = {dueDate} onChange={(e)=>setDueDate(e.target.value)} required/>
    </div>
    </div>
    </div>
    </div>
    <div className="submission">
    <button className="form-submit" type="submit">Submit</button>
    <p>{issueStatus}</p>
    </div>
    </div>
    </form>
    <Modal open={projectIsOpen} onClose={closeProjectModal} onSubmit={submitProject}>
    <div className="modal-div">
    <div className='project-modal'>
    <h3>Project Name:</h3>
    <input id='projectName' name="projectName" onChange={(e)=>setProjectName(e.target.value)}/>
    </div>
    <p>{projectModalStatus}</p>
    </div>
    </Modal>
    <Modal open={versionIsOpen} onClose={closeVersionModal} onSubmit={submitVersion}>
    <div className="modal-div">
    <div className='project-modal'>
    <h3>Project Name:</h3>
    <select id="projectName" name="projectName" defaultValue="" onChange={(e)=>setProjectName(e.target.value)}>
    <option value="" disabled hidden>Please Select</option>
    {projects.map((item)=><option key={item.project} value={item.project}>{item.project}</option>)}
    </select>
    </div>
    <div className='project-modal'>
    <h3>Version:</h3>
    <input id='newVersion' name="newVersion" onChange={(e)=>setNewVersion(e.target.value)}/>
    </div>
    <p className = "warning">{versionModalStatus}</p>
    </div>
    </Modal>
    </div>
  )};
