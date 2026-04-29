import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from 'react-redux'
import { DepartmentSignUpValidation } from "../../validations/DepartmentValidation"
import DepartmentSignUpForm from "./DepartmentSignUpForm";
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { routes } from '../../data/routes'
function DepartmentSignUpWrapper() {
  const navigate = useNavigate()
  const initialValues = {
    departmentName: "",
    headOfDepartment: "",
    departmentShortName: "",
    email: "",
    password: "",
    mobileNumber: "",
    state: "",
    deptAddress: "",
    district: "",
  };
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const apiPayload = {
      DepartmentName: values.departmentName,
      DepartmentShortName: values.departmentShortName,
      HeadOfDepartment: values.headOfDepartment,
      email: values.email,
      password: values.password,
      mobileNumber: values.mobileNumber,
      state: values.state,
      city: values.district,
      deptAddress: values.deptAddress,
    };

    console.log(apiPayload);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/department/signup`,
        apiPayload
      );
      toast.success("Department registered successfully!");
      resetForm();
      navigate(routes.deptLogin);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={DepartmentSignUpValidation}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <Form>
            <DepartmentSignUpForm
              formikProps={formikProps}
            />
          </Form>
        )

        }

      </Formik>
    </>
  )
}

export default DepartmentSignUpWrapper