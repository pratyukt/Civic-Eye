import { object, string, ref } from "yup";


export const DepartmentSignUpValidation = object({
    departmentName: string()
        .required("Department name is required")
        .min(2, "Minimun 2 characters required")
        .max(50, "Name can't be longer than 50 characters"),

    departmentShortName: string()
        .required("Department short name is required")
        .max(10, "Maximun 10 characters allowed"),

    headOfDepartment: string()
        .required("Name of HOD is required")
        .min(2, "Minimun 2 characters required")
        .max(50, "Name can't be longer than 50 characters"),

    email: string()
        .email("Invalid email format")
        .required("Email is required"),

    mobileNumber: string()
        .required("Mobile number is required")
        .matches(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

    password: string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password can't be more than 20 characters"),

    district: string()
        .required("District name is required")
        .min(2, "Minimun 2 characters required")
        .max(20, "Name can't be longer than 20 characters"),

    state: string()
        .required("State name is required")
        .min(2, "Minimun 2 characters required")
        .max(50, "Name can't be longer than 50 characters"),

    deptAddress: string()
        .required("Department Address name is required")
        .min(2, "Minimun 2 characters required")
        .max(100, "Address can't be longer than 100 characters"),

});
export const DepartmentLoginValidation= object({
  email: string()
    .email("Invalid email format")
    .required("Email is required"),

  password: string()
    .required("Password is required")
    .min(4, "Password must be at least 6 characters")
    .max(20, "Password can't be more than 20 characters"),
});