import React, { useEffect, useState } from "react";
import { Field, ErrorMessage } from "formik";
import Select from "react-select";
import logo2 from "../../assets/logo2.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Upload, X, Mail, FileText, MapPin, Building2, Image as ImageIcon } from "lucide-react";

export const ComplaintForm = ({ formikProps }) => {
  const { values, setFieldValue, isSubmitting, handleBlur } = formikProps;
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [department, setDepartment] = useState([]);
  const [areaType, setAreaType] = useState([]);
  const [wardNumber, setWardNumber] = useState([]);
  const [areaNames, setAreaNames] = useState([]);

  const [isWardExist, setIsWardExist] = useState(false);

  const userEmail = useSelector((state) => state.userData.email);
  const notifyError = (err) => toast.error(err);
  const notifySuccess = (succ) => toast.success(succ);

  useEffect(() => {
    values.userEmail = userEmail;
    async function getStates() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASEURL}/department/get-all-state-of-department`
        );
        setStates(res.data.data);
      } catch (error) {
        notifyError(error.response?.data?.msg || "Failed to fetch states");
      }
    }
    getStates();
  }, []);

  useEffect(() => {
    async function getAreaTypes() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASEURL}/area/types`);
        setAreaType(res.data.data);
      } catch (error) {
        notifyError(error.response?.data?.msg || "Failed to fetch area types");
      }
    }
    getAreaTypes();
  }, []);

  useEffect(() => {
    if (!values.state) return;
    async function getDistricts() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASEURL}/department/get-all-districts-of-state?state=${values.state}`
        );
        setDistricts(res.data.data);
      } catch (error) {
        notifyError(error.response?.data?.msg || "Failed to fetch districts");
      }
    }
    getDistricts();
  }, [values.state]);

  useEffect(() => {
    if (!values.state || !values.district) return;
    async function getDepartments() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASEURL}/department/get-all-department-of-district?district=${values.district}&state=${values.state}`
        );
        setDepartment(res.data.data);
      } catch (error) {
        notifyError(error.response?.data?.msg || "Failed to fetch departments");
      }
    }
    getDepartments();
  }, [values.district]);

  useEffect(() => {
    if (
      !values.state ||
      !values.district ||
      !values.location.type ||
      values.location.type === "village"
    ) {
      setWardNumber([]);
      return;
    }
    async function fetchWard() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASEURL}/area/get-all-ward-by-district`,
          {
            state: values.state,
            district: values.district,
            type: values.location.type
          }
        );

        if (res.data.status === "OK") {
          setWardNumber(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchWard();
  }, [values.state, values.district, values.location?.type]);

  useEffect(() => {
    const selected = areaType.find((a) => a.type === values.location?.type);
    setIsWardExist(selected?.isWardExists ?? false);

    if (!selected?.isWardExists) {
      setFieldValue("location.wardNumber", null);
    }
  }, [values.location?.type, areaType]);

  useEffect(() => {
    if (!values.state || !values.district || !values.location.type) return;

    let payload = {
      state: values.state,
      district: values.district,
      type: values.location.type
    };

    if (values.location.wardNumber) payload.wardNumber = values.location.wardNumber;

    async function fetchAreaNames() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASEURL}/area/get-all-area-by-district`,
          payload
        );

        if (res.data.status === "OK") {
          setAreaNames(res.data.data.map(a => a.areaName));

        } else {
          setAreaNames([]);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchAreaNames();
  }, [
    values.state,
    values.district,
    values.location?.type,
    values.location?.wardNumber
  ]);

  const stateOptions = states.map((s) => ({ value: s, label: s }));
  const districtOptions = districts.map((d) => ({ value: d, label: d }));
  const departmentOptions = department.map((dep) => ({ value: dep, label: dep }));
  const areaTypeOptions = areaType.map((a) => ({ value: a.type, label: a.type }));
  const wardOptions = wardNumber.map((w) => ({ value: w, label: w }));
  const areaNameOptions = areaNames.map(name => ({ value: name, label: name }));

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: "6px",
      borderRadius: "0.75rem",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(59,130,246,0.2)"
        : "none",
      "&:hover": {
        borderColor: "#3b82f6"
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
          ? "#eff6ff"
          : "white",
      color: state.isSelected ? "white" : "#1f2937",
      "&:active": {
        backgroundColor: "#3b82f6"
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Raise a Complaint
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Fill out the form below to submit your complaint
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">

            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-blue-500" />
                Email Address
              </label>
              <Field
                type="email"
                name="userEmail"
                readOnly
                value={userEmail}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                onBlur={handleBlur}
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Complaint Title
              </label>
              <Field
                type="text"
                name="title"
                placeholder="Enter a brief title for your complaint"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                placeholder="Describe your complaint in detail..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  State
                </label>

                <Select
                  options={stateOptions}
                  value={stateOptions.find((opt) => opt.value === values.state)}
                  onChange={(selected) => {
                    setFieldValue("state", selected.value);
                    setFieldValue("district", "");
                    setFieldValue("location.state", selected.value);
                    setFieldValue("location.district", "");
                  }}
                  placeholder="Select State"
                  styles={customSelectStyles}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  District
                </label>

                <Select
                  options={districtOptions}
                  value={districtOptions.find(
                    (opt) => opt.value === values.district
                  )}
                  onChange={(selected) => {
                    setFieldValue("district", selected.value);
                    setFieldValue("location.district", selected.value);
                  }}
                  placeholder="Select District"
                  isDisabled={!values.state}
                  styles={customSelectStyles}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                Department
              </label>

              <Select
                options={departmentOptions}
                value={departmentOptions.find(
                  (opt) => opt.value === values.department
                )}
                onChange={(selected) =>
                  setFieldValue("department", selected.value)
                }
                placeholder="Select Department"
                isDisabled={!values.district}
                styles={customSelectStyles}
              />
            </div>

            <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                Location Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Area Type
                  </label>

                  <Select
                    options={areaTypeOptions}
                    value={areaTypeOptions.find(
                      (opt) => opt.value === values.location?.type
                    )}
                    onChange={(selected) => {
                      setFieldValue("location.type", selected.value);
                      setFieldValue("location.wardNumber", null);
                      setFieldValue("location.areaName", "");
                    }}

                    placeholder="Select Type"
                    styles={customSelectStyles}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Ward Number
                  </label>

                  <Select
                    options={wardOptions}
                    value={wardOptions.find(
                      (opt) => opt.value === values.location?.wardNumber
                    )}
                    onChange={(selected) => {
                      setFieldValue("location.wardNumber", selected.value);
                      setFieldValue("location.areaName", "");
                    }}

                    placeholder="Select Ward"
                    isDisabled={!isWardExist}
                    styles={customSelectStyles}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Area Name
                  </label>

                  <Select
                    options={areaNameOptions}
                    value={
                      values.location?.areaName
                        ? { value: values.location.areaName, label: values.location.areaName }
                        : null
                    }
                    onChange={(selected) => setFieldValue("location.areaName", selected.value)}
                    placeholder="Select Area Name"
                    isDisabled={areaNameOptions.length === 0}
                    styles={customSelectStyles}
                  />
                </div>

              </div>
            </div>

            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                Upload Supporting Image
              </label>
              <input
                type="file"
                accept="image/*"
                id="image-upload"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFieldValue("image.file", e.target.files[0]);
                    setFieldValue(
                      "image.url",
                      URL.createObjectURL(e.target.files[0])
                    );
                  }
                }}
                className="hidden"
              />

              {!values.image?.url ? (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer"
                >
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                  </p>
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border">
                  <img
                    src={values.image.url}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFieldValue("image.file", null);
                      setFieldValue("image.url", "");
                    }}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 text-white font-semibold text-base rounded-xl shadow-lg ${isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600"
                }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Your complaint will be reviewed and processed within 24-48 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
