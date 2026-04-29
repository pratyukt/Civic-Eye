import { object, string, ref } from "yup";

export const UserSignUpValidation = object({
  userName: string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name can't be more than 50 characters"),

  email: string()
    .email("Invalid email format")
    .required("Email is required"),

  otp: string()
    .required("otp is required"),

  mobileNumber: string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

  password: string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password can't be more than 20 characters"),

  confirmPassword: string()
    .required("Confirm Password is required")
    .oneOf([ref('password')], "Passwords must match"),
});

export const UserLoginValidation = object({
  email: string()
    .email("Invalid email format")
    .required("Email is required"),

  password: string()
    .required("Password is required")
    .min(4, "Password must be at least 6 characters")
    .max(20, "Password can't be more than 20 characters"),
});

