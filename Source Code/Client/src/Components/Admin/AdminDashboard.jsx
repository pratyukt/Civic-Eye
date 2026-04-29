import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Building2, 
  AlertCircle, 
  LogOut,
  Menu,
  X,
  Eye,
  LayoutDashboard
} from 'lucide-react';
import { notifySuccess } from '../../utils/tostify';
import { routes } from '../../data/routes';

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    notifySuccess("Logged out successfully!");
    navigate(routes.adminLogin);
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard'
    },
    {
      id: 'unverified',
      label: 'Unverified Departments',
      icon: Building2,
      path: '/admin/unverified-departments'
    },
    {
      id: 'complaints',
      label: 'Unsolved Complaints',
      icon: AlertCircle,
      path: '/admin/unsolved-complaints'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-72' : 'w-20'
        } bg-gradient-to-b from-purple-600 via-purple-700 to-indigo-700 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl fixed lg:relative h-full z-50`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                <Eye className="w-7 h-7 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-xl font-bold">CivicEye Admin</h1>
                  <p className="text-xs text-purple-200">Management Portal</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-white text-purple-700 shadow-lg'
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${!sidebarOpen && 'mx-auto'}`} />
                {sidebarOpen && (
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-purple-500/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-xl transition-colors font-medium shadow-lg"
          >
            <LogOut className={`w-5 h-5 ${!sidebarOpen && 'mx-auto'}`} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto ${sidebarOpen ? 'ml-0 lg:ml-0' : ''}`}>
        {children}
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
