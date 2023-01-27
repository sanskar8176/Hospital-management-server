import express  from "express";
import { addHospital, addPatient, addPsychiatrist, getAllDetails } from "../controllers/controller.js";

const route = express.Router();

route.post("/addpatient/:hid/:pid", addPatient);
route.post("/addpsychiatrist/:hid", addPsychiatrist);
route.post("/addhospital", addHospital);

route.get('/getalldetails', getAllDetails);
export default route;