import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  FileText,
  Loader2,
  Search,
  Building2,
  ExternalLink,
  Zap
} from 'lucide-react';
import { notifyError, notifySuccess } from '../../utils/tostify';
import { routes } from '../../data/routes';
import AdminDashboard from './AdminDashboard';

const UnsolvedComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate(routes.adminLogin);
      return;
    }
    fetchUnsolvedComplaints();
  }, []);

  const fetchUnsolvedComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = import.meta.env.VITE_BASEURL;
      const response = await axios.get(`${url}/admin/get-pending-complain/department-not-solve`);

      if (response.data.success) {
        setComplaints(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch complaints");
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (complaintId) => {
    try {
      setProcessingId(complaintId);
      const token = localStorage.getItem("adminToken");
      const url = import.meta.env.VITE_BASEURL;
      
      await axios.post(`${url}/admin/resolve-complaint`, 
        { _id: complaintId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setComplaints(prev => prev.filter(complaint => complaint._id !== complaintId));
      notifySuccess("Complaint resolved successfully!");
    } catch (err) {
      console.error("Error resolving complaint:", err);
      notifyError(err.response?.data?.message || "Failed to resolve complaint");
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

  const getPriorityBadge = (priority) => {
    const badges = {
      1: { label: 'High', class: 'bg-red-100 text-red-700 border-red-200' },
      2: { label: 'Medium', class: 'bg-orange-100 text-orange-700 border-orange-200' },
      3: { label: 'Low', class: 'bg-blue-100 text-blue-700 border-blue-200' }
    };
    return badges[priority] || badges[2];
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const content = (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Unsolved Complaints</h1>
              <p className="text-gray-600 mt-1">Pending complaints requiring immediate attention</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg animate-pulse">
                {filteredComplaints.length} Urgent
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
              <p className="text-gray-600 text-lg font-medium">Loading complaints...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3 animate-slideIn">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredComplaints.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center animate-fadeIn">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">All Clear!</h3>
              <p className="text-gray-600">No pending complaints at the moment.</p>
            </div>
          )}

          {/* Complaints Grid - Medium Size Cards */}
          {!loading && filteredComplaints.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredComplaints.map((complaint, index) => {
                const priorityBadge = getPriorityBadge(complaint.priority);
                return (
                  <div 
                    key={complaint._id} 
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:scale-105 hover:-translate-y-2 animate-slideUp"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Image Header */}
                    {complaint.image && complaint.image.url && (
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={complaint.image.url} 
                          alt={complaint.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <a
                          href={complaint.image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <ExternalLink className="w-4 h-4 text-purple-600" />
                        </a>
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 backdrop-blur-sm bg-white/20 ${priorityBadge.class}`}>
                            <Zap className="w-3 h-3 inline mr-1" />
                            {priorityBadge.label}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {complaint.title}
                      </h3>

                      {/* Description */}
                      <div className="flex items-start gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                        <FileText className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                          {complaint.description}
                        </p>
                      </div>

                      {/* Info Grid */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-500 font-medium">Department:</span>
                          <span className="text-gray-900 font-mono text-xs">{complaint.departmentId}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-500 font-medium">Location:</span>
                          <span className="text-gray-900 font-mono text-xs">{complaint.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-500 font-medium">Submitted:</span>
                          <span className="text-gray-900 font-medium">{formatDate(complaint.createdAt)}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      
                    </div>

                    {/* Bottom Accent */}
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return <AdminDashboard>{content}</AdminDashboard>;
};

export default UnsolvedComplaints;
