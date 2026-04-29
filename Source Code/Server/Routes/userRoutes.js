import express from "express"

const route = express.Router()

import userControllers from "../Controllers/userControllers.js"
import { verifyToken } from "../middleware/verifyToken.js"

route.post("/send-otp",userControllers.sendOtp)
route.post("/signup",userControllers.signup)
route.post("/login",userControllers.login)

export default route; 
