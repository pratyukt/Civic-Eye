import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
  Building2, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  Shield,
  Activity,
  Loader2
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';

const AdminDashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDepartments: 0,
    unverifiedDepartments: 0,
    totalComplaints: 0,
    unsolvedComplaints: 0,
    resolvedComplaints: 0
  });
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState({
    name: 'Admin',
    email: localStorage.getItem('adminEmail') || 'admin@civiceye.gov.in',
    role: 'System Administrator'
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const url = import.meta.env.VITE_BASEURL;
      
      // Fetch stats from multiple endpoints
      const [deptResponse, complaintsResponse] = await Promise.all([
        axios.get(`${url}/admin/get-unverified-departments`).catch(() => ({ data: { data: [] } })),
        axios.get(`${url}/admin/get-pending-complain/department-not-solve`).catch(() => ({ data: { data: [] } }))
      ]);

      setStats({
        totalDepartments: 25, // You can fetch this from API
        unverifiedDepartments: deptResponse.data.data?.length || 0,
        totalComplaints: 156, 
        unsolvedComplaints: complaintsResponse.data.data?.length || 0,
        resolvedComplaints: 134 // You can fetch this from API
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Departments',
      value: stats.totalDepartments,
      icon: Building2,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+5 this month'
    },
    {
      title: 'Unverified Departments',
      value: stats.unverifiedDepartments,
      icon: Clock,
      gradient: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: 'Pending review'
    },
    {
      title: 'Total Complaints',
      value: stats.totalComplaints,
      icon: AlertCircle,
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+12 today'
    },
    {
      title: 'Unsolved Complaints',
      value: stats.unsolvedComplaints,
      icon: TrendingUp,
      gradient: 'from-red-500 to-red-600',
      bgLight: 'bg-red-50',
      textColor: 'text-red-600',
      change: 'Needs attention'
    }
  ];

  const content = (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome back, {adminInfo.name}!</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{adminInfo.name}</p>
                <p className="text-xs text-gray-500">{adminInfo.role}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.bgLight} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-6 h-6 ${stat.textColor}`} />
                        </div>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.gradient} animate-pulse`}></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.change}</p>
                      </div>
                    </div>
                    <div className={`h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                  </div>
                );
              })}
            </div>

            {/* Activity Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/admin/unverified-departments')}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-xl transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">Review Departments</span>
                    </div>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold group-hover:scale-110 transition-transform">
                      {stats.unverifiedDepartments}
                    </span>
                  </button>
                  <button
                    onClick={() => navigate('/admin/unsolved-complaints')}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-xl transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-gray-900">Resolve Complaints</span>
                    </div>
                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold group-hover:scale-110 transition-transform">
                      {stats.unsolvedComplaints}
                    </span>
                  </button>
                </div>
              </div>

              {/* Admin Info Card */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold">Admin Information</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-purple-100 text-sm mb-1">Full Name</p>
                      <p className="text-white font-semibold text-lg">{adminInfo.name}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-purple-100 text-sm mb-1">Email Address</p>
                      <p className="text-white font-semibold">{adminInfo.email}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-purple-100 text-sm mb-1">Role</p>
                      <p className="text-white font-semibold">{adminInfo.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return <AdminDashboard>{content}</AdminDashboard>;
};

export default AdminDashboardHome;
