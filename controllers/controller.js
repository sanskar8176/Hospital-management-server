import bcrypt from "bcrypt";
import Patient from "../model/patient.js";
import Hospital from "../model/hospital.js";
import Psychiatrist from "../model/psychiatrist.js";

export const addPatient = async (req, res) => {
  const {
    patientname,
    patientaddress,
    patientemail,
    patientphone,
    patientpassword,
    patientpic,
  } = req.body;
  const { hid, pid } = req.params;

  if (
    !patientemail ||
    !patientaddress ||
    !patientname ||
    !patientpic ||
    !patientpassword
  ) {
    res.status(401).send({
      status: "failed",
      message: "Please enter all the required fields",
    });
  } else {
    if (!hid || !pid) {
      res.status(401).send({
        status: "failed",
        message: "Please give hospital and psychiatrist id",
      });
    } else {
      // validate phone and email
      const emailRegexp =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      if (emailRegexp.test(patientemail)) {
       
        const regex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        if (!patientphone || regex.test(patientphone)) {
          const patientExist = await Patient.findOne({ patientemail });
          if (patientExist) {
            res.status(401).send({
              status: "failed",
              message: "Patient already Exist with same Email",
            });
          } else {
            try {
              const hospitalExist = await Hospital.findById({ _id: hid });
              if (hospitalExist) {
                const arr = hospitalExist.hospitalpsychiatrists;
                let present = 0;

                arr.map((psy) => {
                  if (psy === pid) {
                    present = 1;
                  }
                });

                if ((present = 1)) {
                  const salt = await bcrypt.genSalt(10);
                  const hashPassword = await bcrypt.hash(patientpassword, salt);
                  // console.log(hashPassword);
                  const newPatient = await Patient.create({
                    patientname,
                    patientaddress,
                    patientemail,
                    patientphone,
                    patientpassword: hashPassword,
                    patientpic,
                  });

                  const psychiatristExist = await Psychiatrist.findById({
                    _id: pid,
                  });
                  if (psychiatristExist) {
                    const arr2 = psychiatristExist.psychiatristpatients;
                    // console.log(arr2);
                    arr2.push(newPatient._id);
                    await Psychiatrist.findByIdAndUpdate(
                      { _id: pid },
                      { psychiatristpatients: arr2 }
                    );
                    res.status(200).send({
                      status: "success",
                      message: "Patient Registration successful",
                    });
                  } else {
                    res.status(401).send({
                      status: "failed",
                      message: "Psychiatrist not found",
                    });
                  }
                } else {
                  res.status(401).send({
                    status: "failed",
                    message: "Psychiatrist not found in given hospital",
                  });
                }
              } else {
                res
                  .status(401)
                  .send({ status: "failed", message: "Hospital not found" });
              }
            } catch (err) {
              console.log(
                "Error in adding patient to database at addpatient controller"
              );
              res.status(501).send({
                status: "failed",
                message:
                  "Error in adding patient to database at addpatient controller",
              });
            }
          }
        }
        else{
            res.status(401).send({
                status: "failed",
                message: "Phone is not valid Plz add countrycode followed by number like +912134567890",
              });
        }
      } else {
        res.status(401).send({
          status: "failed",
          message: "Email is Incorrect",
        });
      }
    }
  }
};

export const getAllDetails = async (req, res) => {
  const { hospitalid } = req.body;

  var details = {
    Hospitalname: "",
    TotalPsychiatristcount: 0,
    Totalpatientscount: 0,
    PsychiatristDetails: [],
  };

  if (!hospitalid)
    res.status(401).send({
      status: "failed",
      message: "Please enter hospitalid ",
    });
  else {
    const hospitalExist = await Hospital.findById({ _id: hospitalid });
    if (!hospitalExist) {
      res.status(401).send({
        status: "failed",
        message: "hospitalid is incorrect ",
      });
    } else {
      details.Hospitalname = hospitalExist.hospitalname;

      const psychiatristarr = hospitalExist.hospitalpsychiatrists;
      details.TotalPsychiatristcount = psychiatristarr.length;
      var patientcount = 0;

      // wait for forEach loop finished => promise all used

      try {
        const promises = [];
        psychiatristarr.forEach(async (psy) => {
          promises.push(Psychiatrist.findById({ _id: psy }));
        });

        const psychiatristExistArr = await Promise.all(promises);

        psychiatristExistArr.forEach((psychiatristExist) => {
          const patientarr = psychiatristExist.psychiatristpatients;
          details.PsychiatristDetails.push({
            id: psychiatristExist._id,
            name: psychiatristExist.psychiatristname,
            patientcount: patientarr ? patientarr.length : 0,
          });
          if (patientarr) {
            patientcount += patientarr.length;
          }
        });
        details.Totalpatientscount = patientcount;
        // console.log(details);
        res.status(200).send({
          status: "success",
          message: details,
        });
      } catch (err) {
        console.log("Error in getalldetails controller");
        res.status(501).send({
          status: "failed",
          message: "Error in getalldetails controller",
        });
      }
    }
  }
};

//   -------OPTIONAL--------------//

export const addPsychiatrist = async (req, res) => {
  const { psychiatristname, psychiatristpatients } = req.body;
  const { hid } = req.params;

  if (!psychiatristname) {
    res.status(401).send({
      status: "failed",
      message: "Please enter all the required fields",
    });
  } else {
    const psychiatristExist = await Psychiatrist.findOne({ psychiatristname });
    if (psychiatristExist) {
      res.status(401).send({
        status: "failed",
        message: "psychiatrist already Exist with same name",
      });
    }
    
    else {
      
        if(!hid){
            res.status(401).send({
                status: "failed",
                message: "hid is incorrect ",
              });
        }
      
        
        try {
            // checking for valid hospital and psychiatrist
            
        const hospitalExist = await Hospital.findById({ _id: hid });
        // console.log(hospitalExist);
        if (hospitalExist) {
          const arr = hospitalExist.hospitalpsychiatrists;
         
          const newPsychiatrist = await Psychiatrist.create({
            psychiatristname,
            psychiatristpatients,
          });

        //   console.log(newPsychiatrist);

          arr.push(newPsychiatrist._id);

          await Hospital.findByIdAndUpdate(
            { _id: hid },
            { hospitalpsychiatrists: arr }
          );

          res.status(200).send({
            status: "success",
            message: "Psychiatrist Registration successfull",
          });
        } 
        else {
          res.status(401).send({ status: "failed", message: "Hospital not found" });
        }
      } 
      catch (err) {
        console.log(
          "Error in adding Psychiatrist to database at addPsychiatrist controller"
        );
        res.status(401).send({
          status: "failed",
          message:
            "Error in adding Psychiatrist to database at addPsychiatrist controller",
        });
      }


    }
  }
};


export const addHospital = async (req, res) => {
  const { hospitalname, hospitalpsychiatrists } = req.body;

  if (!hospitalname) {
    res.status(401).send({
      status: "failed",
      message: "Please enter all the required fields",
    });
  } else {
    const hospitalExist = await Hospital.findOne({ hospitalname });
    if (hospitalExist) {
      res.status(401).send({
        status: "failed",
        message: "Hospital already Exist with same name",
      });
    } else {
      try {
        const newHospital = await Hospital.create({
          hospitalname,
          hospitalpsychiatrists,
        });

        if (newHospital) {
          res.status(200).send({
            status: "success",
            message: "Hospital Registration successfull",
          });
        } else {
          res.status(401).send({ status: "failed", message: "Hospital cannot be created" });
        }
      } catch (err) {
        console.log(
          "Error in adding hospital to database at addHospital controller"
        );
        res.status(501).send({
          status: "failed",
          message:
            "Error in adding hospital to database at addHospital controller",
        });
      }
    }
  }
};
