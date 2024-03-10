/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Subash Dhital Student ID: 12334233 Date: March 8, 2024

GitHub: https://github.com/subashdhital/assign4.git 
Cyclic: https://itchy-sweatsuit-bass.cyclic.app/

********************************************************************************/ 

const express = require("express");
const path = require("path");
const data = require("./modules/collegeData.js");


const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use (express.urlencoded({ extended: true }) );

app.use(express.static("public"));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req,res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/htmlDemo", (req,res) => {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

app.get("/students/add", (req,res) => {
    res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});

app.post("/students/add", (req, res)=>{
    // console.log(req.body);
    data.addStudent(req.body)
    .then(() => {
        res.redirect('/students');
    })
    .catch(error => {
        res.status(500).send('Error adding student: ' + error.message);
    });
});


app.get("/students", (req, res) => {
    if (req.query.course) {
        data.getStudentsByCourse(req.query.course).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json({ message: "no results" });
        });
    } else {
        data.getAllStudents().then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json({ message: "no results" });
        });
    }
});

app.get("/student/:studentNum", (req, res) => {
    data.getStudentByNum(req.params.studentNum).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({message:"no results"});
    });
});

app.get("/tas", (req,res) => {
    data.getTAs().then((data)=>{
        res.json(data);
    });
});

app.get("/courses", (req,res) => {
    data.getCourses().then((data)=>{
        res.json(data);
    });
});

app.use((req,res)=>{
    res.status(404).send("Page Not Found");
});


data.initialize().then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});

