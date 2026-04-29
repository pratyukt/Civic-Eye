import { Field, ErrorMessage } from "formik";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Select from "react-select";
import { routes } from "../../data/routes";
import logo2 from "../../assets/logo2.png";
import { stateData } from "../../data/departmentData/stateData";

const DepartmentSignUpForm = ({ formikProps }) => {
  const { values, setFieldValue, isSubmitting, handleBlur } = formikProps;
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const stateOptions = Object.keys(stateData).map((s) => ({ value: s, label: s }));
  const districtOptions =
    values.state && stateData[values.state]
      ? stateData[values.state].map((d) => ({ value: d, label: d }))
      : [];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-2xl mt-6">
        {/* Header */}
        <div className="flex justify-center items-center bg-blue-50 p-6">
          <img src={logo2} alt="Civic Eye Logo" className="h-30 w-auto mr-4" />
          <h1 className="text-2xl font-bold text-gray-700">Department Sign Up</h1>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium ${step <= currentStep ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {step}
                </div>
                {step < totalSteps && (
                  <div
                    className={`h-1 w-20 mx-2 ${step < currentStep ? "bg-blue-500" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {currentStep} of {totalSteps}:{" "}
            {currentStep === 1
              ? "Department Information"
              : currentStep === 2
                ? "Contact Details"
                : "Address & Security"}
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 pb-8">
          {/* Step 1: Department Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Department Name</label>
                <Field
                  type="text"
                  name="departmentName"
                  placeholder="Enter department name"
                  value={values.departmentName}
                  onChange={(e) => setFieldValue("departmentName", e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="departmentName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Head of Department</label>
                <Field
                  type="text"
                  name="headOfDepartment"
                  placeholder="Enter HOD name"
                  value={values.headOfDepartment}
                  onChange={(e) => setFieldValue("headOfDepartment", e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="headOfDepartment"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Department Short Name</label>
                <Field
                  type="text"
                  name="departmentShortName"
                  placeholder="e.g., PWD, EDU"
                  value={values.departmentShortName}
                  onChange={(e) => setFieldValue("departmentShortName", e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="departmentShortName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Department email"
                  value={values.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onBlur={handleBlur}
                  autoComplete="email"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Mobile Number</label>
                <Field
                  type="tel"
                  name="mobileNumber"
                  placeholder="Contact number"
                  value={values.mobileNumber}
                  onChange={(e) => setFieldValue("mobileNumber", e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onBlur={handleBlur}
                  autoComplete="tel"
                />
                <ErrorMessage
                  name="mobileNumber"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>
          )}

          {/* Step 3: Address & Security */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">State</label>
                  <Select
                    options={stateOptions}
                    value={stateOptions.find((opt) => opt.value === values.state)}
                    onChange={(selected) => {
                      setFieldValue("state", selected.value);
                      setFieldValue("district", "");
                    }}
                    placeholder="Select State"
                  />
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">District</label>
                  <Select
                    options={districtOptions}
                    value={districtOptions.find((opt) => opt.value === values.district)}
                    onChange={(selected) => setFieldValue("district", selected.value)}
                    placeholder="Select District"
                    isDisabled={!values.state}
                  />
                  <ErrorMessage
                    name="district"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Department Address</label>
                <Field
                  as="textarea"
                  rows={3}
                  name="deptAddress"
                  placeholder="Office address"
                  value={values.deptAddress}
                  onChange={(e) => setFieldValue("deptAddress", e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onBlur={handleBlur}
                  autoComplete="street-address"
                />
                <ErrorMessage
                  name="deptAddress"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={values.password}
                  onChange={(e) => setFieldValue("password", e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>

          {/* Already have an account link */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Already have an account?
              <NavLink to={routes.deptLogin} className="text-blue-500 hover:underline ml-1">
                Sign In
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSignUpForm;
