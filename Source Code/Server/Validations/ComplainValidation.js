import Joi from "joi";

export const ComplainValidationGetDataSchema = Joi.object({
    departmentName: Joi.string().required().messages({
      "string.base": "Department name must be a string",
      "any.required": "Department name is required",
    }),
    state:Joi.string().required().messages({
        "string.base": "State name must be a string",
        "any.required": "State name is required",
      }),
    district:Joi.string().required().messages({
        "string.base": "District name must be a string",
        "any.required": "District name is required",
      }),

  }).required();

  export const ComplainValidationAddSchema = Joi.object({
    state: Joi.string().required(),
    district: Joi.string().required(),
    location: Joi.object({
      type: Joi.string().valid("society", "colony", "ward", "village", "town", "city","maholla").required(),
      wardNumber: Joi.number().allow(null),
      areaName: Joi.string().required(),
      district: Joi.string().required(),
      state: Joi.string().required(),
    }).required(),
    department: Joi.string().required(),
    userEmail: Joi.string().email().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
      public_id: Joi.string().required(),
      url: Joi.string().uri().required(),
    }).required(),
  });
  