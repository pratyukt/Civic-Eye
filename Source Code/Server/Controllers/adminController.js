import express from "express";
import { userLoginValidationSchema } from "../Validations/UserValidation.js";
import { generateToken } from "../utils/token/generateToken.js";
import AdminService from "../Services/AdminServices.js";
import DepartmentServices from "../Services/DepartmentServices.js";
import Complain from "../Models/Complain.js";

const adminController = {};

adminController.login = async (req,res)=>{
    try {
        const { value, error } = userLoginValidationSchema.validate(req.body);
        //in-valid body
        if (error) {
          return res.status(400).send({
            status: "ERR",
            msg: error.message,
            data: [],
          });
        } else {
          const user = await AdminService.getAdminByEmail(value.email);
          if (user.status == "ERR") {
            return res.status(500).send({
              status: "ERR",
              msg: "error at server in admin login",
              data: [],
            });
          }
          if (user.status == "OK" && user.data.length == 0) {
            return res.status(400).send({
              status: "ERR",
              msg: "Admin not register with enterd mail",
              data: [],
            });
          }
          if (user.status == "OK" && user.data.length > 0) {
            try {
              let isPasswordCorrect = true;
              if(user.data[0].password==value.password){
                isPasswordCorrect = true;
              }else{
                isPasswordCorrect = false;
              }
              if (isPasswordCorrect) {
                const userObj = user.data[0].toObject();
                delete userObj.password;
    
                try {
                  const token = generateToken({
                    email: userObj.email,
                    role: "admin",
                  });
                  userObj["token"] = token;
                  return res.status(200).send({
                    status: "OK",
                    msg: "admin login sucessfully",
                    data: [userObj],
                  });
                } catch (authErr) {
                  return res.status(500).send({
                    status: "ERR",
                    msg: authErr.message,
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
          msg: `err in server at admin login , ${err.message}`,
          data: [],
        });
      }
}

adminController.getUnverifiedDepartments = async (req, res) => {
  try {
    const response = await DepartmentServices.getUnverifiedDepartments();

    if (response.status === "ERR") {
      return res.status(500).send({
        status: "ERR",
        msg: response.msg,
        data: []
      });
    }

    if (response.data.length === 0) {
      return res.status(200).send({
        status: "OK",
        msg: "No unverified departments found",
        data: []
      });
    }

    return res.status(200).send({
      status: "OK",
      msg: "Unverified departments fetched successfully",
      count: response.data.length,
      data: response.data
    });

  } catch (err) {
    return res.status(500).send({
      status: "ERR",
      msg: "Server error while fetching unverified departments",
      data: []
    });
  }
};


adminController.verifyDepartment = async (req, res) => {
  try {
    const { _id } = req.body;   // 👈 Expect _id from client

    if (!_id) {
      return res.status(400).send({
        status: "ERR",
        msg: "_id is required",
        data: []
      });
    }

    const response = await DepartmentServices.verifyDepartment(_id);

    if (response.status === "ERR") {
      return res.status(500).send({
        status: "ERR",
        msg: response.msg,
        data: []
      });
    }

    return res.status(200).send({
      status: "OK",
      msg: response.msg,
      data: response.data
    });

  } catch (err) {
    return res.status(500).send({
      status: "ERR",
      msg: `Server error: ${err.message}`,
      data: []
    });
  }
};


adminController.rejectDepartment = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).send({
        status: "ERR",
        msg: "_id is required",
        data: []
      });
    }

    const response = await DepartmentServices.rejectDepartment(_id);

    if (response.status === "ERR") {
      return res.status(500).send({
        status: "ERR",
        msg: response.msg,
        data: []
      });
    }

    return res.status(200).send({
      status: "OK",
      msg: response.msg,
      data: response.data
    });

  } catch (err) {
    return res.status(500).send({
      status: "ERR",
      msg: `Server error: ${err.message}`,
      data: []
    });
  }
};


adminController.getPendingComplainThatNotSolvedByDepartment = async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pendingComplains = await Complain.find({
      status: "Pending",
      updatedAt: { $lte: twentyFourHoursAgo },
    });

    return res.status(200).json({
      success: true,
      message: "Complaints pending for more than 24 hours",
      data: pendingComplains,
    });

  } catch (error) {
    console.error("Error fetching pending complaints:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};




export default adminController;