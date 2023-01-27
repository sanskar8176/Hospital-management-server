import mongoose from "mongoose";


const hospitalSchema = new mongoose.Schema(
    {

          hospitalname: {
            type: String,
            required: [true, "Name is a required field"],
          },
          hospitalpsychiatrists:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: "Psychiatrist"
            }
          ]
   
        },
    
)


const Hospital = mongoose.model("hospital",hospitalSchema);
export default Hospital;