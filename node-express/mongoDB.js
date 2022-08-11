require('dotenv').config();
const mongoose = require('mongoose');

//mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

//users added to DB on login, unless the user already exists
const userSchema = new Schema({
  username: String,
  email: String,
  role: String
})

const User = mongoose.model("User", userSchema);

const createUser = async (body) => {
  const {username, email} = body;
  const searchResult = await User.countDocuments({email: email});
  if(searchResult == 0){
    var user = new User({
      username: name,
      email: email,
      role: "user"
    });
    user.save(function(err,data){
      if(err) return console.error(err);
      console.log("New User Added")
      return(data);
    });
  }
  else{
    return;
  }
}

const getUsers = () => {
    const result = User.find({}, function(err,data){
    if(err) return console.error(err);
    return(data);
  }).clone();
  return(result);
}

const findUser = (id) => {
  const result = User.find({_id: id}, function(err,data){
  if(err) return console.error(err);
  return(data);
}).clone();
return(result);
};

const editUser = (id, body) => {
  const { username, email, role} = body;
  const result = User.findOneAndUpdate({_id: id},
  {
    $set: {
      username: username,
      email: email,
      role: role
    }
  },{new: true}, function(err,data){
    if(err) return console.error(err);
    return(data);
  })
};

const deleteUser = (id) => {
  const result = User.findByIdAndRemove(id, function(err, data){
    if (err) return console.error(err);
    return(data);
  }).clone();
  return(result);
}
//Project adding & retrieving; versions are contained in an array inside the project document

const projectSchema = new Schema({
  project: String,
  versions: [{type: String}]
});

const Project = mongoose.model("Project", projectSchema);

const createProject = (name) => {
  var project = new Project({
    project: name
  });
  project.save(function(err,data){
    if(err) return console.error(err);
    return(data);
  });
};

const createVersion = (body) => {
  const {project, version} = body;
  Project.findOneAndUpdate({project: project}, version, {new:true},(err,data)=>{
    if(err) return console.error(err);
    data.versions.push(version);
    data.save();
    return(data);
    }
  )
};

const getProjects = () => {
  const result = Project.find({}, function(err,data){
    if(err) return console.error(err);
    return(data);
  }).clone();
  return(result);
};

//create and get Issues; comments are contained as an array inside the Issue document
const issueSchema = new Schema({
  Title: String,
  Description: String,
  Project: String,
  Version: String,
  Type: String,
  Category: String,
  Status: String,
  Priority: String,
  Assigned: String,
  DueDate: String,
  Comments: String
});

const Issue = mongoose.model("Issue", issueSchema);

const createIssue = (body) => {
  const {title, description, project, version, type, category, status, priority, assigned, dueDate, comments} = body;
  var issue = new Issue({
    Title: title,
    Description: description,
    Project: project,
    Version: version,
    Type: type,
    Category: category,
    Status: status,
    Priority: priority,
    Assigned: assigned,
    DueDate: dueDate,
    Comments: comments
  });
  issue.save(function(err,data){
    if(err) return console.error(err);
    return(data);
  })
};

const getIssues = () => {
  const result = Issue.find({}, function(err,data){
    if(err) return console.error(err);
    return(data);
  }).clone();
  return(result);
};

const findIssue = (issueId) => {
  const result = Issue.findById({_id: issueId}, function(err,data){
    if(err) return console.error(err);
    return(data);
  }).clone();
  return(result);
}

const editIssue = (id, body) => {
  const {title, description, project, version, type, category, status, priority, assigned, dueDate, comments} = body;
  Issue.findOneAndUpdate({_id: id},
  {
    $set: {
      Title: title,
      Description: description,
      Project: project,
      Version: version,
      Type: type,
      Category: category,
      Status: status,
      Priority: priority,
      Assigned: assigned,
      DueDate: dueDate,
      Comments: comments
    }
  },{new: true}, function(err,data){
    if(err) return console.error(err);
    return(data);
  })
};

const deleteIssue = (id) => {
  const result = Issue.findByIdAndRemove(id, function(err, data){
    if (err) return console.error(err);
    return(data);
  }).clone();
  return(result);
}

module.exports = {
  createUser,
  getUsers,
  findUser,
  editUser,
  deleteUser,
  createProject,
  createVersion,
  getProjects,
  createIssue,
  getIssues,
  findIssue,
  editIssue,
  deleteIssue
}
