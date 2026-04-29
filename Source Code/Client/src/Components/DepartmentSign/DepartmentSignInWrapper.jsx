import DepartmentSignInForm from './DepartmentSignInForm'
import { Formik, Form } from 'formik'
import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { DepartmentLoginValidation } from "../../validations/DepartmentValidation";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { routes } from '../../data/routes'
import { addDeptData } from '../../Store/departmentDataSlice';
function DepartmentSignInWrapper() {
    const initialValues = {
        email: "",
        password: ""
    }
    const dispatch=useDispatch()
    const navigate = useNavigate()
    const notifyError = (err) => toast.error(err);
    const notifySuccess = (suc) => toast.success(suc);
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await axios.post(`${import.meta.env.VITE_BASEURL}/department/login`, values)
                .then((response) => {
                    localStorage.setItem("token", response.data.data[0].token);                 
                    dispatch(addDeptData(response.data.data[0]));
                    // notifySuccess(response.data.msg);
                    navigate(routes.deptDashboard);
                })
        } catch (error) {
            notifyError(error?.response?.data?.msg || "Login Failed")
        }
        resetForm();
        setSubmitting(false);

    }
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={DepartmentLoginValidation}
                validateOnChange={false}
                onSubmit={handleSubmit}
            >
                {(formikProps) => (
                    <Form>
                        <DepartmentSignInForm formikProps={formikProps} />
                    </Form>
                )}

            </Formik>
        </>
    )
}

export default DepartmentSignInWrapper