import express from "express";
import mongoose from "mongoose";


import Complain from "../Models/Complain.js";
import Area from "../Models/Area.js";
import User from "../Models/User.js";
import Department from "../Models/Department.js"; // Assuming this exists
import {ComplainValidationGetDataSchema ,ComplainValidationAddSchema} from "../Validations/ComplainValidation.js"
const complainController = {};

// ✅ Validation schema using Joi


// ✅ Controller to add a new complaint
complainController.add = async (req, res) => {
  try {
    // 1️⃣ Validate request body
    const { error } = ComplainValidationAddSchema.validate(req.body);
    if (error) {
      return res.status(400).send(
        { status:"ERR",
          msg: error.details[0].message,
          data:[]
        });
    }

    const { state, district, location, department, userEmail, title, description, image } = req.body;

    // 2️⃣ Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(400).send({ 
            status:"ERR",
            msg: "User Not Found",
            data:[]
          });
    }

    if(user.credit<5){
      return res.status(400).send({ 
        status:"ERR",
        msg: "User Not Allow To Add Complain that Have less then 5 credit points",
        data:[]
      });
    }
    

    // 3️⃣ Find or verify the area
    const area = await Area.findOne({
      areaName: location.areaName,
      district: location.district,
      state: location.state,
      wardNumber: location.wardNumber ?? null,
    });

    if (!area) {
      return res.status(400).send({ 
        status:"ERR",
        msg: "Area Not Found",
        data:[]
      });
    }

    // 4️⃣ Find department
   
    const dept = await Department.findOne({ DepartmentName: department , state:state , city:district });
    if (!dept) {
      return res.status(404).send({ 
        status:"ERR",
        msg: "Department Not Found",
        data:[]
      });
    }

    // 5️⃣ Check if similar complaint already exists
    // const existingComplain = await Complain.findOne({
    //   departmentId: dept._id,
    //   location: area._id,
    //   //title: { $regex: new RegExp(title, "i") }, // case-insensitive match
    // });

    // if (existingComplain) {
    //   return res.status(200).send({
    //     status: "ERR",
    //     msg: "Issue already exists in your area. Please increase priority.",
    //     data: {existingComplainId:existingComplain._id},
    //   });
    // }

    // 6️⃣ Create new complaint
    const newComplain = new Complain({
      userId: user._id,
      departmentId: dept._id,
      title,
      description,
      priority: 1, // default
      status: "Pending",
      image,
      location: area._id,
    });

    await newComplain.save();

    return res.status(201).send({
      status: "OK",
      msg: "Complaint added successfully.",
      data: newComplain,
    });
  } catch (err) {
    // console.error("Error adding complaint:", err);
    return res.status(500).send({ 
        status: "ERR",
        msg: `${err.message} , Server Error at add complain`, 
        data:[]  });
  }
};

complainController.getAllComplain = async (req, res) => {
    try {
      // Fetch all complaints and populate related info
      const complains = await Complain.find()
        .populate({
          path: "userId",
          select: "userName email mobileNumber -_id",
        })
        .populate({
          path: "departmentId",
          select: "departmentName state district -_id",
        })
        .populate({
          path: "location",
          select: "areaName wardNumber district state type -_id",
        })
        .sort({ createdAt: -1 }); // newest first
  
      // If no complaints found
      if (!complains.length) {
        return res.status(200).send({
          status: "OK",
          msg: "No complaints found",
          data: [],
        });
      }
  
      // Return success response
      return res.status(200).send({
        status: "OK",
        msg: "All complaints fetched successfully",
        count: complains.length,
        data: complains,
      });
    } catch (err) {
      console.error("Error fetching complaints:", err);
      return res.status(500).send({
        status: "ERR",
        msg: "Server error while fetching complaints",
        error: err.message,
      });
    }
};

complainController.getComplainByDepartment = async (req, res) => {
  
  try {
    // 1️⃣ Validate request body
    const { error } = ComplainValidationGetDataSchema.validate(req.body);
    if (error) {
      return res.status(400).send({
        status: "ERR",
        msg: error.details[0].message,
        data: [],
      });
    }

    const { departmentName , state , district } = req.body;

    // 2️⃣ Find department by name
    const dept = await Department.findOne({ 
      DepartmentName: departmentName,
      state,
      city:district
     });
    if (!dept) {
      return res.status(400).send({
        status: "ERR",
        msg: "Department not found",
        data: [],
      });
    }

    // 3️⃣ Fetch all complaints for this department
    const complains = await Complain.find({ departmentId: dept._id })
      .populate({
        path: "userId",
        select: "userName email mobileNumber -_id",
      })
      .populate({
        path: "departmentId",
        select: "departmentName state district -_id",
      })
      .populate({
        path: "location",
        select: "areaName wardNumber district state type -_id",
      })
      .sort({ createdAt: -1 });

    // 4️⃣ No complaints found
    if (!complains.length) {
      return res.status(200).send({
        status: "OK",
        msg: `No complaints found for department '${departmentName}'`,
        data: [],
      });
    }

    // 5️⃣ Return success response
    return res.status(200).send({
      status: "OK",
      msg: `Complaints fetched successfully for department '${departmentName}'`,
      count: complains.length,
      data: complains,
    });
  } catch (err) {
    console.error("Error fetching complaints by department:", err);
    return res.status(500).send({
      status: "ERR",
      msg: "Server error while fetching complaints by department",
      error: err.message,
    });
  }
};

complainController.getComplainByUserID = async (req, res) => {
  try {
    
    const userEmail = req.user?.email; // ✅ From verified JWT
    const { filter } = req.body;

    if (!userEmail) {
      return res.status(400).send({
        status: "ERR",
        msg: "User not found in token",
        data: [],
      });
    }

    // 2️⃣ Build query
    const user = await User.findOne({email:userEmail})
    const userId = user._id;
    const query = { userId };
    if (filter && ["Pending", "Solved", "Rejected"].includes(filter)) {
      query.status = filter;
    }

    // 3️⃣ Fetch complaints
    console.log(query)
    const complains = await Complain.find(query)
      .populate({
        path: "departmentId",
        select: "departmentName state district -_id",
      })
      .populate({
        path: "location",
        select: "areaName wardNumber district state type -_id",
      })
      .sort({ createdAt: -1 });

    // 4️⃣ No results
    if (!complains.length) {
      return res.status(200).send({
        status: "OK",
        msg:
          filter && filter.trim() !== ""
            ? `No complaints found with status '${filter}'`
            : `No complaints found for this user`,
        data: [],
      });
    }

    // 5️⃣ Success
    return res.status(200).send({
      status: "OK",
      msg:
        filter && filter.trim() !== ""
          ? `Complaints fetched successfully with status '${filter}'`
          : `All complaints fetched successfully`,
      count: complains.length,
      data: complains,
    });
  } catch (err) {
    console.error("Error fetching complaints by user ID:", err);
    return res.status(500).send({
      status: "ERR",
      msg: "Server error while fetching complaints",
      error: err.message,
    });
  }
};


export default complainController;
