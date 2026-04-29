// import Department from "../Models/Department.js";
import DepartmentServices from "../Services/DepartmentServices.js";
import {
  departmentSignUpValidationSchema,
  departmentLoginValidationSchema,
  departmentRejectComplainValidationSchema,
  departmentActiveComplainValidationSchema,
  departmentResolvedComplainValidationSchema,
} from "../Validations/DepartmentValidation.js";
import { generateToken } from "../utils/token/generateToken.js";
import hashPassword from "../utils/password/hashPassword.js";
import verifyPassword from "../utils/password/verifyPassword.js";
import Department from "../Models/Department.js";
import User from "../Models/User.js";

const departmentControllers = {};
departmentControllers.signup = async (req, res) => {
  try {
    const { value, error } = departmentSignUpValidationSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({
        status: "ERR",
        msg: error.message,
        data: [],
      });
    } else {
      const existingDepartment = await DepartmentServices.getDepartmentByEmail(
        value?.email
      );
      //error while finding department
      if (existingDepartment?.status == "ERR") {
        return res.status(500).send(existingDepartment);
      }

      if (existingDepartment.data.length > 0) {
        return res.status(400).send({
          status: "ERR",
          msg: "Department already registered with given email",
          data: [],
        });
      }

      const existingDepartmentLocation =
        await DepartmentServices.getDepartmentByStateAndDistrict(
          value?.state,
          value?.city,
          value?.DepartmentShortName
        );

      if (existingDepartmentLocation?.status == "ERR") {
        return res.status(500).send(existingDepartmentLocation);
      }

      if (existingDepartmentLocation.data.length > 0) {
        return res.status(400).send({
          status: "ERR",
          msg: "Department already registered in given state and district",
          data: [],
        });
      }

      if (
        existingDepartment?.status == "OK" &&
        existingDepartmentLocation?.status == "OK"
      ) {
        // department not found , means need to signup
        if (
          existingDepartment.data.length == 0 &&
          existingDepartmentLocation.data.length == 0
        ) {
          try {
            const hashedPassword = await hashPassword(value.password);
            value.password = hashedPassword;
            const registerDepartment = await DepartmentServices.signup(value);
            if (registerDepartment.status == "OK") {
              const departmentObj = registerDepartment.data[0].toObject();
              delete departmentObj.password;
              try {
                const token = generateToken({
                  email: departmentObj.email,
                  role: departmentObj.role,
                });
                departmentObj["token"] = token;
                return res.status(200).send({
                  status: "OK",
                  msg: "Department signup sucessfully",
                  // data: [departmentObj],
                  data: [],
                });
              } catch (err) {
                return res.status(500).send({
                  status: "ERR",
                  msg: "error in server while generating token",
                  data: [],
                });
              }
            } else {
              return res.status(500).send({
                status: "ERR",
                msg: `error at signup service while signup user ${registerDepartment.msg}`,
                data: [],
              });
            }
          } catch (err) {
            // error while hashing password
            return res.status(500).send({
              status: "ERR",
              msg: err.message,
              data: [],
            });
          }
        } else {
          // department founded means already register eith id
          return res.status(400).send({
            status: "ERR",
            msg: "department already register with given email or in given state and district",
            data: [],
          });
        }
      }
    }
  } catch (err) {
    return res.status(500).send({
      status: "ERR",
      msg: `error at server while signup department ${err.message}`,
      data: [],
    });
  }
};

departmentControllers.login = async (req, res) => {
  try {
    const { value, error } = departmentLoginValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).send({
        status: "ERR",
        msg: error.message,
        data: [],
      });
    } else {
      const department = await DepartmentServices.getDepartmentByEmail(
        value.email
      );
      if (department.status == "ERR") {
        return res.status(500).send({
          status: "ERR",
          msg: "error at server in department login",
          data: [],
        });
      }
      if (department.status == "OK" && department.data.length == 0) {
        return res.status(400).send({
          status: "ERR",
          msg: "Department not register with entered mail",
          data: [],
        });
      }
      if (department.status == "OK" && department.data.length > 0) {
        try {
          const departmentObj = department.data[0];
          // check department verified or not
          if (!departmentObj.isVerified) {
            return res.status(403).send({
              status: "ERR",
              msg: "Department not verified yet. Contact admin for approval.",
              data: [],
            });
          }
          // verify pwd
          const isPasswordCorrect = await verifyPassword(
            value.password,
            departmentObj.password
          );
          if (isPasswordCorrect) {
            // Remove password before sending
            const deptWithoutPassword = departmentObj.toObject();
            delete deptWithoutPassword.password;
            try {
              const token = generateToken({
                email: deptWithoutPassword.email,
                role: deptWithoutPassword.role,
              });
              deptWithoutPassword["token"] = token;
              return res.status(200).send({
                status: "OK",
                msg: "Department Login sucessfully",
                data: [deptWithoutPassword],
              });
            } catch (err) {
              return res.status(500).send({
                status: "ERR",
                msg: "error in server while generating token",
                data: [],
              });
            }
          } else {
            return res.status(400).send({
              status: "ERR",
              msg: "invalid password",
              data: [],
            });
          }
        } catch (err) {
          return res.status(500).send({
            status: "ERR",
            msg: err.message,
            data: [],
          });
        }
      }
    }
  } catch (err) {
    res.status(500).send({
      status: "ERR",
      msg: `err in server at department login , ${err.message}`,
      data: [],
    });
  }
};

departmentControllers.getAllState = async (req, res) => {
  try {
    const response = await DepartmentServices.getStatesOfAllDepartment();
    if (response.status == "ERR") {
      return res.status(500).send(response);
    } else {
      return res.status(200).send(response);
    }
  } catch (err) {
    res.status(500).send({
      status: "ERR",
      msg: "error in sserver to get all state",
      data: [],
    });
  }
};

departmentControllers.getAllDistrictsOfState = async (req, res) => {
  try {
    const { state } = req.query;
    if (!state) {
      return res.status(400).send({
        status: "ERR",
        msg: "State is required in query param",
        data: [],
      });
    }
    const cities = await DepartmentServices.getAllDistrictsInState({ state });
    if (cities.status == "ERR") {
      res.status(500).send(cities);
    } else {
      res.status(200).send(cities);
    }
  } catch (err) {
    res.status(500).send({
      status: "ERR",
      msg: `error in server to get all districts, ${err.message}`,
      data: [],
    });
  }
};

departmentControllers.getAllDepartmentOfDistrict = async (req, res) => {
  try {
    const { district, state } = req.query;
    if (!district || !state) {
      return res.status(400).send({
        status: "ERR",
        msg: "district and state is required in query param",
        data: [],
      });
    }
    console.log("hello");
    const department = await DepartmentServices.getAllDepartmentInDisrtict({
      state,
      district,
    });
    if (department.status == "ERR") {
      res.status(500).send(department);
    } else {
      res.status(200).send(department);
    }
  } catch (err) {
    res.status(500).send({
      status: "ERR",
      msg: `error in server to get all getAllDepartmentOfDistrict, ${err.message}`,
      data: [],
    });
  }
};

departmentControllers.getDepartmenInfo = async (req, res) => {
  try {
    const { district, state, departmentName } = req.query;
    if (!district || !state || !departmentName) {
      return res.status(400).send({
        status: "ERR",
        msg: "district and state and departmentName is required in query param",
        data: [],
      });
    } else {
      const departInfo = await DepartmentServices.getDepartmentInfo({
        district,
        state,
        departmentName,
      });
      if (departInfo.status == "ERR") {
        return res.status(500).send(departInfo);
      } else {
        return res.status(200).send(departInfo);
      }
    }
  } catch (err) {
    res.status(500).send({
      status: "ERR",
      msg: `error in server to get all getAllDepartmentOfDistrict, ${err.message}`,
      data: [],
    });
  }
};

departmentControllers.rejectComplain = async (req, res) => {
  try {
    const { value, error } = departmentRejectComplainValidationSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).send({
        status: "ERR",
        msg: error.message,
        data: [],
      });
    }
    const response = await DepartmentServices.rejectComplain(
      value._id,
      value.reason
    );
    if (response.status == "OK") {
      const userId = response.data.userId;

      // Update user credit: decrease by 1
      await User.findByIdAndUpdate(
        userId,
        { $inc: { credit: -1 } }, // decrement credit by 1
        { new: true }
      );

      return res.status(200).send(response);
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  } catch (err) {
    res.status(500).send({
      status: "ERR",
      msg: `error in server to get all departmentControllers, ${err.message}`,
      data: [],
    });
  }
};

departmentControllers.activeComplain = async (req, res) => {
  try {
    const { value, error } = departmentActiveComplainValidationSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).send({
        status: "ERR",
        msg: error.message,
        data: [],
      });
    }
    console.log(value._id);
    const response = await DepartmentServices.activeComplain(value._id);
    if (response.status == "OK") {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  } catch (err) {
    res.status(500).send({
      status: "ERR",
      msg: `error in server to get all departmentControllers, ${err.message}`,
      data: [],
    });
  }
};

departmentControllers.resolvedComplain = async (req, res) => {
  try {
    const { value, error } =
      departmentResolvedComplainValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).send({
        status: "ERR",
        msg: error.message,
        data: [],
      });
    }
    console.log(value._id);
    const response = await DepartmentServices.resolvedComplain(value._id);
    if (response.status == "OK") {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  } catch (err) {
    res.status(500).send({
      status: "ERR",
      msg: `error in server to get all departmentControllers, ${err.message}`,
      data: [],
    });
  }
};

export default departmentControllers;
