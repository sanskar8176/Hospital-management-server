# README

## Introduction

This repository contains a Node.js server that serves as a backend for a healthcare application. The server is built using the Express.js framework and connects to a MongoDB database.
[Live](https://hospital-api-otx0.onrender.com/)
## How to run

Fork the repository to your local machine
Open the repository in your preferred code editor
Run 
```bash
npm i
```
 to install all the dependencies
If you have nodemon installed, run 
```bash
 npm run dev
```
 to start the server. If not, run
```bash
 npm start
```
## List of all the major libraries

bcrypt: for password hashing
cors: for handling cross-origin resource sharing
dotenv: for loading environment variables
express: for building the server
mongoose: for connecting to and querying the MongoDB database

## API endpoints details

POST api/addpatient/:hid/:pid 
for adding patient info, hospitalid and psychiatristid is given via url

POST api/addpsychiatrist/:hid 
for adding psychiatrist info, hospitalid is given via url

POST api/addhospital 
for adding hospital info

POST api/getalldetails 
for fetch all detials via hospitalid as req.body


Note: postman-endPoints and database folder are present in repository plz check it also 