import express from "express";
import complainController from "../Controllers/complainControllers.js";

import { verifyToken } from "../middleware/verifyToken.js";
const complainRoute = express.Router();

// get
complainRoute.get("/get-all-complain",verifyToken,complainController.getAllComplain);


// post
complainRoute.post("/add",verifyToken,complainController.add);
complainRoute.post("/get-complain-by-department",verifyToken,complainController.getComplainByDepartment);
complainRoute.post(
  "/get-complain-by-user",
  verifyToken,
  complainController.getComplainByUserID
);
export default complainRoute;
