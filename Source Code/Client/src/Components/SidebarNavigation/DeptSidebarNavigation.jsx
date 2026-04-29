import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  FileText,
  CheckCircle,
  TrendingUp,
  MapPin,
  Bell,
  Settings,
  Star,
  LogOut,
  ChevronRight,
  BadgeCheck ,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { routes } from "../../data/routes";
import image from "../../assets/image.png";

export default function DeptSidebarNavigation() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const deptData = useSelector((store) => store.departmentData);
  const navigate = useNavigate();
  const location = useLocation();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(true);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const menuItems = [
    { id: "DashBoard", text: "Dashboard", icon: FileText, navigateTo: routes.deptDashboard },
    { id: "AllComplaints", text: "All Complaints", icon: CheckCircle, navigateTo: routes.seeComplaints },
    { id: "deptComplaint", text: "Received Complaints", icon: TrendingUp, navigateTo: routes.deptComplaint },
    { id: "activeComplaint", text: "Active Complaints", icon: BadgeCheck, navigateTo: routes.activeComplaint },
    { id: "Areas", text: "Issue In Areas", icon: MapPin, navigateTo: routes.issueAreas },
    { id: "Announcements", text: "Announcements", icon: Bell, navigateTo: routes.announcements },
    { id: "Settings", text: "Settings", icon: Settings, navigateTo: routes.settings },
    { id: "Feedback", text: "Feedback & Ratings", icon: Star, navigateTo: routes.feedback },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleItemClick = (item) => {
    navigate(item.navigateTo);
    if (isMobile) setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(routes.hero);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile Toggle */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-5 left-4 z-50 p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
        </button>
      )}

      {/* Overlay for Mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-full z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isMobile ? "w-80" : "w-72"}`}
      >
        <div className="h-full bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white bg-opacity-20 flex items-center justify-center">
                <img src={image} alt="profile" className="w-12 h-12 object-cover" />
              </div>
              <div>
                <h2 className="font-semibold text-lg truncate">{deptData.DepartmentName}</h2>
                <h3 className="text-sm text-blue-100">{deptData.departmentShortName}</h3>
                <p className="text-blue-100 text-xs truncate">{deptData.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.navigateTo;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-[1.02]"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-gray-500 group-hover:text-blue-500"
                    }`}
                  />
                  <span className="font-medium flex-1">{item.text}</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? "text-white translate-x-1" : "text-gray-400 group-hover:text-blue-500"
                    }`}
                  />
                </button>
              );
            })}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:opacity-90 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 text-white" />
              <span className="font-medium flex-1">Logout</span>
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 text-center text-sm text-gray-500">
            © 2025 Complaint System
          </div>
        </div>
      </div>
    </div>
  );
}
