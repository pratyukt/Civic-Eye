import express from "express";
import refreshController from "../Controllers/refreshController.js";

const refreshroute = express.Router()

import { verifyToken } from "../middleware/verifyToken.js"
refreshroute.post("/",verifyToken,refreshController.refresh);

export default refreshroute;