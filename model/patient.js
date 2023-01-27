import mongoose from "mongoose";


const patientSchema = new mongoose.Schema(
    {
          patientname: {
            type: String,
            required: [true, "Name is a required field"],
          },
          patientaddress: {
            type: String,
            required: true,
          },
          patientemail: {
            type: String,
            required: true,
            unique: true,
          },
          patientphone: {
            type: String
          },
          patientpassword: {
            type: String,
            required: true,
          },
          patientpic: {
            type: String,
            required: true,
            default:
              "https://res.cloudinary.com/dh9rf3psk/image/upload/v1673967493/photos/default-avatar_lav4in.png",
          },
        },
        {
          timestamps: true,
        }
    
)


const Patient = mongoose.model("Patient",patientSchema);
export default Patient;