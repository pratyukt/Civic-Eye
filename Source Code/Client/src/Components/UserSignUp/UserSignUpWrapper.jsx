import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from 'react-redux'
import { UserSignUpValidation } from "../../validations/UserValidations"
import UserSignUpForm from "./UserSignUpForm";
import axios from 'axios'
import { addUserData } from '../../Store/userDataSlice';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { routes } from '../../data/routes'

const UserSignUpWrapper = () => {
  const [sessionId,setSessionId]=useState(localStorage.getItem("sessionId") || "");
  const notifyError = (err) => toast.error(err);
  const notifySuccess = (suc) => toast.success(suc);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOtpLoading,setIsOtpLoading]= useState(false);

  const initialValues = {
    userName: "",
    email: "",
    otp: "",
    mobileNumber: "",
    password: "",
    confirmPassword: ""
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate(routes.userDashboard);
    }
  }, [])
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = values
      const signUpPayload = { ...payload, sessionId }
      await axios.post(`${import.meta.env.VITE_BASEURL}/user/signup`,
        signUpPayload).then((response) => {
          localStorage.setItem("token", response.data.data[0].token)
          dispatch(addUserData(response.data.data[0]))
          notifySuccess(response.data.msg)
          localStorage.removeItem("sessionId");
          navigate(routes.userDashboard);
        })
        .catch((err)=>{
          notifyError(err?.response?.data?.msg || "SignUp Failed")
        })
    } catch (error) {
      console.log(error);
      
      notifyError(error?.response?.data?.msg || "Error")
    }
    resetForm();
    setSubmitting(false);
  };

  const handleSendOtp = async (email) => {
    setIsOtpLoading(true)
    if (!email) {
      notifyError("Please enter email first")
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_BASEURL}/user/send-otp`, { email })
        .then((response) => {
          localStorage.setItem("sessionId", response.data.sessionId);
          setSessionId(response.data.sessionId);
          notifySuccess(response.data.msg)
        })
        .catch((err) => {
          console.log(err)
          notifyError(err?.response?.data?.msg || "Error")
        })
    } catch (error) {
      notifyError(error.message);
    }
     setIsOtpLoading(false)
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={UserSignUpValidation}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >

        {(formikProps) => (
          <Form>
            <UserSignUpForm
              formikProps={formikProps}
              onSendOtp={handleSendOtp}
              isOtpLoading={isOtpLoading}
            />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UserSignUpWrapper;
