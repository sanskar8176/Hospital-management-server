import express, { urlencoded }  from "express";
import * as dotenv from "dotenv"; 
dotenv.config();
import dbConnect from "./db.js";
import cors from 'cors';
import route from './routes/route.js'
const app = express();

const port = process.env.PORT || 5000 ;

dbConnect(process.env.MONGO_USER, process.env.MONGO_PASSWORD);


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})

app.use(express.json());
app.use(cors());


app.get('/',(req, res)=>{
    res.status(200).json({
        message: "Hello from Server",

    });
})


app.use('/api',route);