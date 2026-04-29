import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyDepartmentToken = (req, res, next) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = req.headers["token"]; 
    
    if(!token){
        return res.status(400).send({
            status:"ERR",
            msg:"token is required in header",
            data:[]
        })
    }else{
        try{
            const decoded = jwt.verify(token, JWT_SECRET);
            req.department = decoded
            next();
        }catch(error){
            return res.status(400).send({
                status:"ERR",
                msg:"token is tempard or expired",
                data:[]
            })
        }
    }
  } catch (err) {
    return res.status(500).send({
        status:"ERR",
        msg:`internal server error in middleWare while verifing token ${err.message}`,
        data:[]
    })
  }
};
