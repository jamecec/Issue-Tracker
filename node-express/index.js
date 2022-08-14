require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoFunctions = require('./mongoDB.js');

const mongoose = require('mongoose');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const start = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URI,{useNewURLParser: true, useUnifiedTopology: true});
    console.log("Server is connected to MongoDB")
  }
  catch(err){
    console.error(err);
  }
  const listener = app.listen(process.env.PORT || 5000, () =>{
    console.log("Your app is listening on port " + listener.address().port);
  });
};
start();

app.get('/', (req, res) => res.send('Hello from Express!'));

//users
app.post('/api/users', async (req,res) => {
  const result = await mongoFunctions.createUser(req.body);
  res.send(JSON.stringify(result))
});

app.get('/api/users', async (req,res) => {
  const result = await mongoFunctions.getUsers();
  res.send(JSON.stringify(result));
});

app.get('/api/users/:_id', async (req,res) => {
  const result = await mongoFunctions.findUser(req.params._id);
  res.send(JSON.stringify(result));
})

app.put('/api/users/:_id', async (req,res) => {
  const result = await mongoFunctions.editUser(req.params._id, req.body);
  res.send(JSON.stringify(result));
});

app.delete('/api/users/:_id', async (req,res) => {
  const result = await mongoFunctions.deleteUser(req.params._id);
  res.send(JSON.stringify(result));
})

//projects
app.post('/api/projects', async (req,res) => {
  const result = await mongoFunctions.createProject(req.body.project);
  res.send(JSON.stringify(result))
});

app.put('/api/projects', async (req,res) => {
  const result = await mongoFunctions.createVersion(req.body);
  res.send(JSON.stringify(result))
})

app.get('/api/projects', async (req,res) => {
  const result = await mongoFunctions.getProjects();
  res.send(JSON.stringify(result))
})

//issues

app.post('/api/issues', async (req,res) => {
  const result = await mongoFunctions.createIssue(req.body);
  res.send(JSON.stringify(result))
})

app.put('/api/issues/:_id', async (req,res) => {
  const result = await mongoFunctions.editIssue(req.params._id, req.body);
  res.send(JSON.stringify(result))
});

app.get('/api/issues', async (req,res) => {
  const result = await mongoFunctions.getIssues();
  res.send(JSON.stringify(result))
});

app.get('/api/issues/:_id', async (req,res) => {
  const result = await mongoFunctions.findIssue(req.params._id);
  res.send(JSON.stringify(result));
});

app.delete('/api/issues/:_id', async (req,res) => {
  const result = await mongoFunctions.deleteIssue(req.params._id);
  res.send(JSON.stringify(result));
})
