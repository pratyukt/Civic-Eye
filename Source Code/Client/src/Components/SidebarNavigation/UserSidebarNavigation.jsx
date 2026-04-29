import React, { useState, useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { routes } from '../../data/routes';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import image from '../../assets/image.png';

export default function UserSidebarNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.userData);
  const deptData = useSelector((store) => store.departmentData);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(true);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    { id: 'DashBoard', text: "DashBoard", icon: FileText, navigateTo: routes.userDashboard },
    { id: 'AllComplaints', text: "All Complaints", icon: CheckCircle, navigateTo: routes.seeComplaints },
    { id: 'userComplaint', text: "Your Complaints", icon: CheckCircle, navigateTo: routes.userComplaint },
    { id: 'rise', text: "Raise a Complaints", icon: TrendingUp, navigateTo: routes.raiseComplaint },
    { id: 'areas', text: "Issue In Areas", icon: MapPin },
    { id: 'announcements', text: "Announcements", icon: Bell },
    { id: 'settings', text: "Settings", icon: Settings },
    { id: 'feedback', text: "Feedback & Ratings", icon: Star }
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleItemClick = (item) => {
    if (item.navigateTo) navigate(item.navigateTo);
    if (isMobile) setIsOpen(false);
  };

  // Check if current route matches the menu item
  const isActiveRoute = (navigateTo) => {
    if (!navigateTo) return false;
    return location.pathname === navigateTo;
  };

  // 🔹 Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate(routes.hero);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-22 left-4 z-50 p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 md:hidden"
        >
          {isOpen ? <X className="w-3 h-3 text-gray-700" /> : <Menu className="w-3 h-3 text-gray-700" />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative top-0 left-0 h-full z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isMobile ? 'w-80 mt-39' : 'w-72'}
        `}
      >
        <div className="h-full bg-white shadow-2xl flex flex-col">
          {/* Header with User Profile */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
                <img
                  src={image}
                  alt="User Profile"
                  className="w-12 h-12 object-cover rounded-full"
                />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{userData.userName}</h2>
                <p className="text-blue-100 text-sm">{userData.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.navigateTo);

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                    text-left transition-all duration-200 group
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600'}
                  `}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'
                      }`}
                  />
                  <span className="font-medium flex-1">{item.text}</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-blue-500'
                      }`}
                  />
                </button>
              );
            })}

            {/* 🔹 Logout Button below Feedback */}
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl mt-4
                bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg
                hover:opacity-90 transition-all duration-200
              "
            >
              <LogOut className="w-5 h-5 text-white" />
              <span className="font-medium flex-1">Logout</span>
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 text-center text-sm text-gray-500">
            <p>© 2024 Complaint System</p>
          </div>
        </div>
      </div>
    </div>
  );
}