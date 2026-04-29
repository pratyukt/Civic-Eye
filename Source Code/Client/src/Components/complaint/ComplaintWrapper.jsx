import React from "react";
import { Formik, Form } from "formik";
import axios from "axios";
import { ComplaintForm } from "./ComplaintForm";
import { ComplaintValidations } from "../../validations/ComplaintValidations";
import { toast } from "react-toastify";
import { routes } from "../../data/routes";
import { useNavigate } from "react-router-dom";
const CLOUD_NAME = "dvvae8cxm";
const UPLOAD_PRESET = "unsigned_upload";

export const ComplaintWrapper = () => {
  const token = localStorage.getItem("token");
  const navigate=useNavigate();
  // Upload image to Cloudinary
  const handleUpload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );

      return {
        url: res.data.secure_url,
        public_id: res.data.public_id,
      };
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      toast.error("Image upload failed. Please try again.");
      return null;
    }
  };

  const initialValues = {
    state: "",
    district: "",
    location: {
      type: "",
      wardNumber: null,
      areaName: "",
      district: "",
      state: "",
    },
    department: "",
    userEmail: "",
    title: "",
    description: "",
    image: {
      url: "",
      public_id: "",
    },
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let imageData = { ...values.image };

      // Upload to Cloudinary
      if (values.image?.file) {
        const uploaded = await handleUpload(values.image.file);
        if (uploaded) {
          imageData = {
            url: uploaded.url,
            public_id: uploaded.public_id,
          };
        }
      }

      // Never mutate Formik values — build a clean payload
      const payload = {
        state: values.state,
        district: values.district,
        department: values.department,
        userEmail: values.userEmail,
        title: values.title,
        description: values.description,
        location: {
          type: values.location.type,
          wardNumber: values.location.wardNumber,
          areaName: values.location.areaName,
          district: values.location.district,
          state: values.location.state,
        },
        image: imageData,
      };

      // Submit complaint
      try{
        await axios.post(
          `${import.meta.env.VITE_BASEURL}/complain/add`,
          payload,
          { headers: { token } }
        );
        toast.success("Complaint submitted successfully!");
        resetForm();
        navigate(routes.seeComplaints);
      }catch(err){
        console.error("credit Error submitting complaint:", err.response.data.msg);
        toast.error(` credit Failed to submit complaint ${err?.response?.data?.msg}`);
      }
    } catch (error) {
      console.error("Error submitting complaint:", error.message);
      toast.error(`Failed to submit complaint`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ComplaintValidations}
      onSubmit={handleSubmit}
      enableReinitialize={true} // ensures full reset
    >
      {(formikProps) => (
        <Form>
          <ComplaintForm formikProps={formikProps} />
        </Form>
      )}
    </Formik>
  );
};

export default ComplaintWrapper;
