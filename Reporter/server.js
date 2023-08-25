const express = require('express');
const app = express();
const server = app.listen(5000,() => console.log('http://localhost:5000/index.html')); //listening in port 5000
const sql = require("./db.js")
app.use(express.static('public')); 

app.use(express.json());

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Chungath',
  port: 5432,
})

const getAllRepos = async(response) => {
  pool.query('SELECT * FROM repo', (error, results) => {
    //console.log(results);
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

const getAllForks = async(request,response) =>{
  let qeuery = `select*from repo where repoid in (${request.body.forks});`;
  console.log(qeuery);
  pool.query(qeuery, (error, results) => {
    console.log(results);
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}

const getAllFiles = async(response) =>{
  let qeuery = `SELECT *FROM files`;
  console.log(qeuery);
  pool.query(qeuery, (error, results) => {
    console.log(results);
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}


const getSubFilesDetail = async(request,response) =>{
  let qeuery = `
  SELECT * FROM files where file_name='${request.body.fileName}'`;
  console.log(qeuery);
  pool.query(qeuery, (error, results) => {
    console.log(results);
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}





app.get("/getRepos", async (request,response) =>{
  await getAllRepos(response);
})


app.get("/getFiles", async (request,response) =>{
  await getAllFiles(response);
})


app.post("/getSubFiles", async (request,response) =>{
  await getSubFilesDetail(request,response);
})



app.post("/getForks", async (request,response) =>{
  await getAllForks(request,response);
})
