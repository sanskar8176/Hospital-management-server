import mongoose from "mongoose";


const psychiatristSchema = new mongoose.Schema(
    {
          psychiatristname: {
            type: String,
            required: [true, "Name is a required field"],
          },

          psychiatristpatients:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: "Patient"
            }
          ]
   
        },
    
)


const Psychiatrist = mongoose.model("psychiatrist",psychiatristSchema);
export default Psychiatrist;