import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
  CheckCircle, 
  XCircle, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Building2, 
  Calendar, 
  Loader2
} from 'lucide-react';
import { notifyError, notifySuccess } from '../../utils/tostify';
import { routes } from '../../data/routes';
import AdminDashboard from './AdminDashboard';

const UnverifiedDepartments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate(routes.adminLogin);
      return;
    }
    fetchUnverifiedDepartments();
  }, []);

  const fetchUnverifiedDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = import.meta.env.VITE_BASEURL;
      const response = await axios.get(`${url}/admin/get-unverified-departments`);

      if (response.data.status === "OK") {
        setDepartments(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch departments");
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (departmentId) => {
    try {
      setProcessingId(departmentId);
      const token = localStorage.getItem("adminToken");
      const url = import.meta.env.VITE_BASEURL;
      
      await axios.post(`${url}/admin/verify-department`, 
        { _id: departmentId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setDepartments(prev => prev.filter(dept => dept._id !== departmentId));
      notifySuccess("Department verified successfully!");
    } catch (err) {
      console.error("Error accepting department:", err);
      notifyError(err.response?.data?.msg || "Failed to accept department");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (departmentId) => {
    try {
      setProcessingId(departmentId);
      const token = localStorage.getItem("adminToken");
      const url = import.meta.env.VITE_BASEURL;
      
      await axios.post(`${url}/admin/reject-department`, { _id: departmentId });

      setDepartments(prev => prev.filter(dept => dept._id !== departmentId));
      notifySuccess("Department rejected successfully!");
    } catch (err) {
      console.error("Error rejecting department:", err);
      notifyError(err.response?.data?.msg || "Failed to reject department");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const content = (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Unverified Departments</h1>
              <p className="text-gray-600 mt-1">Review and approve department registrations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg">
                {departments.length} Pending
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
              <p className="text-gray-600 text-lg font-medium">Loading departments...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3">
              <XCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && departments.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">All Verified!</h3>
              <p className="text-gray-600">No pending departments to review.</p>
            </div>
          )}

          {/* Departments Grid */}
          {!loading && departments.length > 0 && (
            <div className="grid gap-6">
              {departments.map((dept) => (
                <div 
                  key={dept._id} 
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">{dept.DepartmentName}</h2>
                            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold mt-1">
                              {dept.DepartmentShortName}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 font-mono">Department ID: {dept.departmentId}</p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAccept(dept._id)}
                          disabled={processingId === dept._id}
                          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === dept._id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <CheckCircle className="w-5 h-5" />
                          )}
                          Verify
                        </button>
                        <button
                          onClick={() => handleReject(dept._id)}
                          disabled={processingId === dept._id}
                          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === dept._id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Left Column */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <User className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Head of Department</p>
                            <p className="text-gray-900 font-semibold">{dept.HeadOfDepartment}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <Mail className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Email Address</p>
                            <a 
                              href={`mailto:${dept.email}`} 
                              className="text-purple-600 hover:text-purple-800 font-medium break-all"
                            >
                              {dept.email}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <Phone className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Contact Number</p>
                            <a 
                              href={`tel:${dept.mobileNumber}`} 
                              className="text-purple-600 hover:text-purple-800 font-medium"
                            >
                              {dept.mobileNumber}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Location</p>
                            <p className="text-gray-900 font-semibold">{dept.city}, {dept.state}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <Building2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Address</p>
                            <p className="text-gray-900 font-medium">{dept.deptAddress}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <Calendar className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Registered On</p>
                            <p className="text-gray-900 font-medium">{formatDate(dept.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return <AdminDashboard>{content}</AdminDashboard>;
};

export default UnverifiedDepartments;
