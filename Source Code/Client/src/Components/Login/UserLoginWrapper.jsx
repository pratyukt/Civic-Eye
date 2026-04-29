import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { useDispatch } from 'react-redux';
import { UserLoginValidation } from "../../validations/UserValidations";
import UserLoginForm from "./UserLoginForm";
import axios from 'axios';
import { addUserData } from '../../Store/userDataSlice';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import {routes} from '../../data/routes'

const UserLoginWrapper = () => {
    const notifyError = (err) => toast.error(err);
    const notifySuccess = (suc) => toast.success(suc);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    
    const initialValues = {
        email: "",
        password: "",
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate(routes.userDashboard);
        }
    }, [])


    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASEURL}/user/login`, values)
                .then((response) => {
                    localStorage.setItem("token", response.data.data[0].token);
                    dispatch(addUserData(response.data.data[0]));
                    // notifySuccess(response.data.msg);
                    navigate(routes.userDashboard);
                });
        } catch (error) {
            notifyError(error?.response?.data?.msg || "Login failed");
        }
        resetForm();
        setSubmitting(false);
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={UserLoginValidation}
                validateOnChange={false}
                onSubmit={handleSubmit}
            >
                {(formikProps) => (
                    <Form>
                        <UserLoginForm formikProps={formikProps} />
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default UserLoginWrapper;
