import Joi from "joi";

export const getAreaSchema = Joi.object({
    state: Joi.string().required().messages({
        "any.required": "State is required",
        "string.empty": "State cannot be empty"
    }),

    district: Joi.string().required().messages({
        "any.required": "District is required",
        "string.empty": "District cannot be empty"
    }),

    type: Joi.string().required().messages({
        "any.required": "Area type is required",
        "string.empty": "Area type cannot be empty"
    }),

    wardNumber: Joi.number().optional().messages({
        "number.base": "Ward number must be a number"
    })

}).required();
export const getWardSchema = Joi.object({
    state: Joi.string().required().messages({
        "any.required": "State is required",
        "string.empty": "State cannot be empty"
    }),

    district: Joi.string().required().messages({
        "any.required": "District is required",
        "string.empty": "District cannot be empty"
    }),

    type: Joi.string().required().messages({
        "any.required": "Area type is required",
        "string.empty": "Area type cannot be empty"
    }),
}).required();
