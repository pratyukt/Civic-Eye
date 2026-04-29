import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../data/routes";

const ProfileDropDown = ({handleLogOut}) => {
  const data = useSelector((store) => store.userData);
  const role = data?.role;
  const userName = data?.userName;
  const email = data?.email;
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check authentication using both Redux AND localStorage
  const isAuthenticated = (role && role.trim() !== "") || localStorage.getItem("isAuthenticated") === "true";
  
  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1565C0] text-white font-bold hover:bg-[#0D47A1] transition"
      >
        {userName ? userName.charAt(0).toUpperCase() : "U"}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-semibold text-gray-800">
              {userName || "User"}
            </p>
            <p className="text-xs text-gray-500">{email || ""}</p>
          </div>
          <ul className="py-1">
            <li>
              <Link
                to={routes.userDashboard}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to={routes.profile}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={()=>{
                  handleLogOut();
                }}
                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropDown;