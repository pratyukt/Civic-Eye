import DepartmentServices from "../Services/DepartmentServices.js";
import UserServices from "../Services/UserServices.js";
import express from "express";

const refreshController = {};

refreshController.refresh = async (req, res) => {
  try {
    const { email, role } = req.user;
    if (role == "user") {
      const response = await UserServices.getUserByEmail(email);
      if (response.status == "ERR") {
        return res.status(500).send({
          status: "ERR",
          msg: "error at server in user login",
          data: [],
        });
      }
      if (response.status == "OK" && response.data.length == 0) {
        return res.status(400).send({
          status: "ERR",
          msg: "user not register with enterd mail",
          data: [],
        });
      }
      if (response.status == "OK" && response.data.length > 0) {
        const userObj = response.data[0].toObject();
        delete userObj.password;
        return res.status(200).send({
          status: "OK",
          msg: "user is valid",
          data: [userObj],
        });
      }
    }
    if (role == "department") {
      const response = await DepartmentServices.getDepartmentByEmail(email);
      if (response.status == "ERR") {
        return res.status(500).send({
          status: "ERR",
          msg: "error at server in department login",
          data: [],
        });
      }
      if (response.status == "OK " && response.data.length == 0) {
        return res.status(400).send({
          status: "ERR",
          msg: "department not register with enterd mail",
          data: [],
        });
      }
      if (response.status == "OK" && response.data.length > 0) {
        const departmentObj = response.data[0].toObject();
        delete departmentObj.password;
        res.status(200).send({
          status: "OK",
          msg: "department is valid",
          data: [departmentObj],
        });
      }
    }
  } catch (err) {
    return res.status(500).send({
      status: "ERR",
      msg: "error in refresh at server",
      data: [],
    });
  }
};

export default refreshController;
