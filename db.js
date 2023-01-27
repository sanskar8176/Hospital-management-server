
import mongoose from 'mongoose';


 const dbConnect = async()=> {
    // database name is HospitalDb 
       const MONGO_URL = "mongodb://localhost:27017/HospitalDb";

         try{
            mongoose.set("strictQuery", false);
             await mongoose.connect(MONGO_URL,{useUnifiedTopology:true, useNewUrlParser:true})
            .then(()=>console.log("db is connnected successfully"));
         }  
         catch(err){
            console.log("connection with db is failed");
         } 


}
export default dbConnect;

