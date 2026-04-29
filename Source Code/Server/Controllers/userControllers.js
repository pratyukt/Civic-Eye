import UserServices from "../Services/UserServices.js";
import hashPassword from "../utils/password/hashPassword.js";
import verifyPassword from "../utils/password/verifyPassword.js";
import { generateToken } from "../utils/token/generateToken.js";
import {
  userSignUpValidationSchema,
  userLoginValidationSchema,
  userOtpValidationSchema,
} from "../Validations/UserValidation.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const userControllers = {};
const otpStore = new Map();

const genOtp = () => String(Math.floor(100000 + Math.random() * 900000));
const genSessionId = () => crypto.randomBytes(16).toString("hex");
const hash = (str) => crypto.createHash("sha256").update(str).digest("hex");
const OTP_TTL_MS = 1 * 60 * 1000; // 5 minutes
const MAX_OTP_ATTEMPTS = 5;

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });

  
userControllers.sendOtp = async (req, res) => {
  try {
    const { value, error } = userOtpValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).send({
        status: "ERR",
        msg: error.message,
        data: [],
      });
    } else {
      const existingUser = await UserServices.getUserByEmail(value?.email);
      if (existingUser?.status == "ERR") {
        return res.status(500).send(existingUser);
      } else {
        if (existingUser.data.length == 0) {
          const otp = genOtp();
          const sessionId = genSessionId();
          const expiresAt = Date.now() + OTP_TTL_MS;
          const email = value.email;
          otpStore.set(sessionId, {
            email,
            otpHash: hash(otp),
            expiresAt,
            attempts: 0,
          });

        
          const o = await transporter.sendMail({
            from: process.env.BREVO_FROM,
            to: email,
            subject: "Your Verification OTP",
            html: `<p>Your OTP Is <b>${otp}</b>. It expires in ${
              OTP_TTL_MS / 60000
            } minutes.</p>`,
          });
          console.log(o)
          res.status(200).send({
            status: "OK",
            msg: "OTP sent successfully",
            sessionId,
            ttl: OTP_TTL_MS,
          });
        } else {
          return res.status(400).send({
            status: "ERR",
            msg: "user already register with given email",
            data: [],
          });
        }
      }
    }
  } catch (err) {
    return res.status(500).send({
      status: "ERR",
      msg: `error at server while sending OTP to user ${err.message}`,
      data: [],
    });
  }
};

userControllers.signup = async (req, res) => {
  try {
    const { value, error } = userSignUpValidationSchema.validate(req.body);
    //in-valid body
    if (error) {
      return res.status(400).send({
        status: "ERR",
        msg: error.message,
        data: [],
      });
    }

    //valid body
    else {
      const existingUser = await UserServices.getUserByEmail(value?.email);
      //  error while finding user
      if (existingUser?.status == "ERR") {
        return res.status(500).send(existingUser);
      }
      if (existingUser?.status == "OK") {
        // user not found , means need to signup
        if (existingUser.data.length == 0) {
          try {
            const entry = otpStore.get(value.sessionId);
            if (!entry)
              return res.status(400).send({
                status: "ERR",
                msg: "Invalid or expired session",
                data: [],
              });

            if (Date.now() > entry.expiresAt) {
              otpStore.delete(value.sessionId);
              return res
                .status(400)
                .send({ status: "ERR", msg: "OTP expired", data: [] });
            }
            entry.attempts += 1;
            if (entry.attempts > MAX_OTP_ATTEMPTS) {
              otpStore.delete(value.sessionId);
              return res
                .status(400)
                .send({ status: "ERR", msg: "Too many attempts" });
            }
            if (hash(value.otp) !== entry.otpHash) {
              return res
                .status(400)
                .json({ status: "ERR", msg: "Incorrect OTP" });
            }
            //
            const hashedPassword = await hashPassword(value.password);
            value.password = hashedPassword;
            const registerUser = await UserServices.signup(value);
            if (registerUser.status == "OK") {
              const userObj = registerUser.data[0].toObject();
              delete userObj.password;
              try {
                const token = generateToken({
                  email: userObj.email,
                  role: userObj.role,
                });
                userObj["token"] = token;
                return res.status(200).send({
                  status: "OK",
                  msg: "user signup sucessfully",
                  data: [userObj],
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
                msg: `error at signup service while signup user ${registerUser.msg}`,
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
          // user founded means already register eith email
          return res.status(400).send({
            status: "ERR",
            msg: "user already register with given email",
            data: [],
          });
        }
      }
    }
  } catch (err) {
    // error at server while signup to user
    return res.status(500).send({
      status: "ERR",
      msg: `error at server while signup user ${err.message}`,
      data: [],
    });
  }
};

userControllers.login = async (req, res) => {
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
      const user = await UserServices.getUserByEmail(value.email);
      if (user.status == "ERR") {
        return res.status(500).send({
          status: "ERR",
          msg: "error at server in user login",
          data: [],
        });
      }
      if (user.status == "OK" && user.data.length == 0) {
        return res.status(400).send({
          status: "ERR",
          msg: "user not register with enterd mail",
          data: [],
        });
      }
      if (user.status == "OK" && user.data.length > 0) {
        try {
          const isPasswordCorrect = await verifyPassword(
            value.password,
            user.data[0].password
          );
          if (isPasswordCorrect) {
            const userObj = user.data[0].toObject();
            delete userObj.password;

            try {
              const token = generateToken({
                email: userObj.email,
                role: userObj.role,
              });
              userObj["token"] = token;
              return res.status(200).send({
                status: "OK",
                msg: "user login sucessfully",
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
      msg: `err in server at user login , ${err.message}`,
      data: [],
    });
  }
};

userControllers.refresh = async(req,res)=>{
  try{
    const {email , role} = req.user;
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
    if (response.status == "OK" && response.data.length > 0){
        const userObj = response.data[0].toObject()
        delete userObj.password
        return res.status(200).send({
          status:"OK",
          msg:"user is valid",
          data:[userObj]
        })
    }
  }catch(err){
    return res.status(500).send({
      status:"ERR",
      msg:"error in refresh at server",
      data:[]
    })
  }
}

export default userControllers;
