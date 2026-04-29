import Joi from "joi";

export const departmentSignUpValidationSchema = Joi.object({
  DepartmentName: Joi.string().trim().min(3).max(100).required().messages({
    "string.base": "Department name should be text",
    "string.empty": "Department name cannot be empty",
    "string.min": "Department name should have at least 3 characters",
    "string.max": "Department name should not exceed 100 characters",
    "any.required": "Department name is required",
  }),

  DepartmentShortName: Joi.string()
    .valid("ELEC", "WATER", "ROAD", "EDU", "HEALTH", "ENV", "SEVAGE")
    .required()
    .messages({
      "any.only": "Department short name must be one of the predefined values",
      "any.required": "Department short name is required",
    }),

  HeadOfDepartment: Joi.string().trim().min(3).max(100).required().messages({
    "string.base": "Head of Department should be text",
    "string.empty": "Head of Department cannot be empty",
    "string.min": "Head of Department should have at least 3 characters",
    "string.max": "Head of Department should not exceed 100 characters",
    "any.required": "Head of Department is required",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().trim().min(6).required().messages({
    "string.min": "Password should have at least 6 characters",
    "any.required": "Password is required",
  }),

  mobileNumber: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Mobile number must be a valid Indian number (10 digits starting with 6-9)",
      "any.required": "Mobile number is required",
    }),

  city: Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "City should be text",
    "string.empty": "City cannot be empty",
    "string.min": "City should have at least 2 characters",
    "string.max": "City should not exceed 50 characters",
    "any.required": "City is required",
  }),

  state: Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "State should be text",
    "string.empty": "State cannot be empty",
    "string.min": "State should have at least 2 characters",
    "string.max": "State should not exceed 50 characters",
    "any.required": "State is required",
  }),

  deptAddress: Joi.string().trim().min(5).max(200).required().messages({
    "string.base": "Department address should be text",
    "string.empty": "Department address cannot be empty",
    "string.min": "Department address should have at least 5 characters",
    "string.max": "Department address should not exceed 200 characters",
    "any.required": "Department address is required",
  }),

  solve_issue: Joi.array()
    .items(Joi.string().min(3).max(50))
    .messages({
      "array.base": "solve_issue must be an array of strings",
      "string.min": "Each issue should have at least 3 characters",
      "string.max": "Each issue should not exceed 50 characters",
    })
    .optional(),

  role: Joi.string().valid("department").default("department").messages({
    "any.only": "Role must be 'department'",
  }),
}).required();

export const departmentLoginValidationSchema = Joi.object({
  email:Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().trim().required().messages({
    "any.required": "Password is required",
  }),
}).required();

export const departmentRejectComplainValidationSchema = Joi.object({
  _id: Joi.string().required().messages({
      "any.required": "Complain ID is required",
      "string.empty": "Complain ID cannot be empty"
  }),

  status: Joi.string()
      .valid("Reject")
      .required()
      .messages({
          "any.only": "Status must be Reject",
          "any.required": "Status is required"
      }),

  reason: Joi.string()
      .required()
      .messages({
          "any.required": "Reason is required",
          "string.empty": "Reason cannot be empty"
      })
}).required();

export const departmentActiveComplainValidationSchema = Joi.object({
  _id: Joi.string().required().messages({
      "any.required": "Complain ID is required",
      "string.empty": "Complain ID cannot be empty"
  }),

  status: Joi.string()
      .valid("Active")
      .required()
      .messages({
          "any.only": "Status must be Active",
          "any.required": "Status is required"
      }),
}).required();

export const departmentResolvedComplainValidationSchema = Joi.object({
  _id: Joi.string().required().messages({
      "any.required": "Complain ID is required",
      "string.empty": "Complain ID cannot be empty"
  }),

  status: Joi.string()
      .valid("Resolved")
      .required()
      .messages({
          "any.only": "Status must be Resolved",
          "any.required": "Status is required"
      }),
}).required();
