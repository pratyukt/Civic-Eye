import express from "express";
import adminController from "../Controllers/adminController.js";

const adminRoute = express.Router();

adminRoute.post("/login",adminController.login)

adminRoute.get(
  "/get-unverified-departments",
  adminController.getUnverifiedDepartments
);

adminRoute.get(
  "/get-pending-complain/department-not-solve",
  adminController.getPendingComplainThatNotSolvedByDepartment
);

adminRoute.post(
  "/verify-department",                     // admin must be logged in
  adminController.verifyDepartment
);

adminRoute.post(
  "/reject-department",
  adminController.rejectDepartment
);


export default adminRoute;