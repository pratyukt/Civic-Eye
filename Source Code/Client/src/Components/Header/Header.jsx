import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { routes } from "../../data/routes";
import logo2 from "../../assets/logo2.png";
import ProfileDropDown from "./profileDropDown";
import OAuth from "../auth/OAuth";

const Header = () => {
  console.log("running")
  const userData = useSelector((store) => store.userData);
  const deptData = useSelector((store) => store.departmentData);

  // const [userRole , setUserRole] = useState(userData?.role)
  // const [deptRole , setDeptRole] = useState(deptData?.role)
  const userRole = userData?.role;
  const deptRole = deptData?.role;
  const [isOpen, setIsOpen] = useState(false);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-md">
      {/* Top Govt Info */}
      <div className="bg-[#1565C0] text-white text-center py-2">
        <p className="text-sm font-semibold leading-tight m-0">
          भारत सरकार | Government of India
        </p>
        <p className="text-sm font-semibold leading-tight m-0">
          कार्मिक, लोक शिकायत | Ministry of Personnel, Public Grievances
        </p>
      </div>

      {/* Navbar */}
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-20 py-2 bg-[#F5F5F5] relative">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to={userRole === "" ? (deptRole === "" ? routes.deptLogin : routes.deptDashboard) : routes.userDashboard}>
            <img
              src={logo2}
              alt="Civic Eye Logo"
              className="w-40 h-20 object-contain"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link
            to={'/'}
            className="text-[#212121] hover:text-[#1565C0] transition-colors duration-200 font-medium px-2 py-1"
          >
            Hero
          </Link>
          <Link
            to={routes.aboutUs}
            className="text-[#212121] hover:text-[#1565C0] transition-colors duration-200 font-medium px-2 py-2 shadow-blue-200 hover:bg-gray-200 rounded-2xl"
          >
            About Us
          </Link>
          <Link
            to={userRole === "" ? (deptRole === "" ? routes.deptLogin : routes.deptDashboard) : routes.userDashboard}
            className="text-[#212121] hover:text-[#1565C0] transition-colors duration-200 font-medium px-2 py-1 shadow-blue-200 hover:bg-gray-200 rounded-2xl"
          >
            DashBoard
          </Link>
          <Link
            to={routes.departmentInfo}
            className="text-[#212121] hover:text-[#1565C0] transition-colors duration-200 font-medium px-2 py-1 shadow-blue-200 hover:bg-gray-200 rounded-2xl"
          >
            View Department Info
          </Link>
          <Link
            to={routes.contactSupport}
            className="text-[#212121] hover:text-[#1565C0] transition-colors duration-200 font-medium px-2 py-1 shadow-blue-200 hover:bg-gray-200 rounded-2xl"
          >
            Contact Support
          </Link>

          {/* Conditional Login/Logout */}
          {/* <OAuth>
            {userRole !== "" || deptRole !== "" ? (
              <div className="flex items-center space-x-4 ml-4">
                <ProfileDropDown handleLogOut={handleLogOut} />
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  to={routes.userLogin}
                  className="px-5 py-2 rounded-full bg-[#FF9800] text-white font-semibold hover:bg-orange-600 transition-colors duration-200"
                >
                  User Login
                </Link>
                <Link
                  to={routes.deptLogin}
                  className="px-5 py-2 rounded-full bg-[#1565C0] text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Department Login
                </Link>
              </div>
            )}
          </OAuth> */}
        </nav>

        {/* Mobile ProfileDropDown and Menu Button */}
        <div className="lg:hidden flex items-center space-x-3">
          {/* ProfileDropDown for mobile - positioned on the right */}
          {/* <OAuth>
            {(userRole !== "" || deptRole !== "") && (
              <div className="relative">
                <ProfileDropDown handleLogOut={handleLogOut} />
              </div>
            )}
          </OAuth> */}

          {/* Mobile Menu Button */}
          <button
            className="border rounded-lg p-2 text-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200 transform hover:scale-105"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <span className={`transform transition-all duration-300 ${isOpen ? 'rotate-45 scale-110' : 'rotate-0'}`}>
                {isOpen ? "✖" : "☰"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown with Animation */}
      <div
        className={`lg:hidden overflow-hidden bg-[#F5F5F5] border-t shadow-inner transition-all duration-300 ease-in-out ${isOpen
          ? 'max-h-96 opacity-100'
          : 'max-h-0 opacity-0'
          }`}
      >
        <div className={`transform transition-all duration-300 ease-in-out ${isOpen
          ? 'translate-y-0 scale-100'
          : '-translate-y-4 scale-95'
          }`}>
          <div className="flex flex-col space-y-4 px-6 py-5">
            <Link
              to={routes.aboutUs}
              className="text-[#212121] hover:text-[#1565C0] transition-all duration-200 font-medium py-2 hover:translate-x-2 transform"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link
              to={routes.departmentWorks}
              className="text-[#212121] hover:text-[#1565C0] transition-all duration-200 font-medium py-2 hover:translate-x-2 transform"
              onClick={() => setIsOpen(false)}
            >
              View Department Works
            </Link>
            <Link
              to={routes.departmentInfo}
              className="text-[#212121] hover:text-[#1565C0] transition-all duration-200 font-medium py-2 hover:translate-x-2 transform"
              onClick={() => setIsOpen(false)}
            >
              View Department Info
            </Link>
            <Link
              to={routes.contactSupport}
              className="text-[#212121] hover:text-[#1565C0] transition-all duration-200 font-medium py-2 hover:translate-x-2 transform"
              onClick={() => setIsOpen(false)}
            >
              Contact Support
            </Link>

            {/* Conditional Login Buttons for Mobile */}
            {/* <OAuth>
            {userRole === "" && deptRole === "" && (
              <div className="flex flex-col space-y-3 pt-3 border-t">
                <Link
                  to={routes.userLogin}
                  className="px-5 py-2 rounded-full bg-[#FF9800] text-white font-semibold hover:bg-orange-600 transition-all duration-200 text-center transform hover:scale-105"
                  onClick={() => setIsOpen(false)}
                >
                  User Login
                </Link>
                <Link
                  to={routes.deptLogin}
                  className="px-5 py-2 rounded-full bg-[#1565C0] text-white font-semibold hover:bg-blue-700 transition-all duration-200 text-center transform hover:scale-105"
                  onClick={() => setIsOpen(false)}
                >
                  Department Login
                </Link>
              </div>
            )}
            </OAuth> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;