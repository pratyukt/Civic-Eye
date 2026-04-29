import Joi from "joi";

// signup schema

export const userOtpValidationSchema = Joi.object({
    email : Joi.string().trim().lowercase().email().required().messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",  
    })
}).required("email is required");


export const userSignUpValidationSchema = Joi.object({

  userName: Joi.string().trim().min(3).max(45).required().messages({
    "string.base": "Username should be a type of text",
    "string.empty": "Username cannot be empty",
    "string.min": "Username should have at least 3 characters",
    "string.max": "Username should not exceed 30 characters",
    "any.required": "Username is required",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().trim().min(4).required().messages({
    "string.min": "Password should have at least 6 characters",
    "any.required": "Password is required",
  }),

  mobileNumber: Joi.string().trim().pattern(/^[6-9]\d{9}$/).required().messages({
      "string.pattern.base":
        "Mobile number must be a valid Indian number (10 digits starting with 6-9)",
      "any.required": "Mobile number is required",
    }),

  credit: Joi.number().integer().default(10).min(1).max(10).messages({
    "number.base": "Credit must be a number",
    "number.min": "Credit must be at least 1",
    "number.max": "Credit cannot be more than 10",
  }),

  role: Joi.string().trim().valid("user").default("user").messages({
    "any.only": "Role must be 'user'",
  }),
  sessionId : Joi.string().trim().required().messages({
    "string.base": "sessionId should be a type of text",
    "string.empty": "sessionId cannot be empty",
    "any.required": "sessionId is required",
  }),
  otp: Joi.string().trim().required().messages({
    "string.base": "OTP should be a type of text",
    "string.empty": "OTP cannot be empty",
    "any.required": "OTP is required",
  }),
}).required();


// login schema 
export const userLoginValidationSchema = Joi.object({
  email:Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",  
  }),
  password: Joi.string().trim().required().messages({
    "any.required": "Password is required",
  }),
}).required();
