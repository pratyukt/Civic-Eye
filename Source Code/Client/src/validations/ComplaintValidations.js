import { object, string, mixed, number } from "yup";

export const ComplaintValidations = object({
  userEmail: string()
    .email("Invalid email format")
    .required("Email is required"),

  title: string()
    .required("Complaint title is required")
    .min(5, "Minimum 5 characters required")
    .max(100, "Title can't be longer than 100 characters"),

  description: string()
    .required("Complaint description is required")
    .min(20, "Minimum 20 characters required")
    .max(1000, "Description can't exceed 1000 characters"),

  department: string().required("Please select a department"),

  state: string()
    .required("State is required")
    .min(2, "Minimum 2 characters required")
    .max(50, "State name can't be longer than 50 characters"),

  district: string()
    .required("District is required")
    .min(2, "Minimum 2 characters required")
    .max(50, "District name can't be longer than 50 characters"),

  location: object({
    type: string().nullable(),
    wardNumber: number().nullable(),
    areaName: string().nullable(),
  }),

  image: object({
    file: mixed()
      .nullable()
      .test(
        "fileSize",
        "File size is too large (max 2MB)",
        (value) => !value || (value && value.size <= 2 * 1024 * 1024)
      )
      .test(
        "fileFormat",
        "Unsupported file type (only JPG/PNG allowed)",
        (value) =>
          !value ||
          (value &&
            ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
      ),
    url: string().nullable(),
    public_id: string().nullable(),
  }),
});
