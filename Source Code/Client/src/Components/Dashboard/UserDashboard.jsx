import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  BarChart3,
  Activity
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

function UserDashboard() {
  const userData = useSelector((store) => store.userData);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserComplaints();
  }, []);

  const fetchUserComplaints = async () => {

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_BASEURL}/complain/get-complain-by-user`,
        {filter:""},
        { headers: { token } }
      );

      if (res.data.status === 'OK') {
        const complaints = res.data.data;
        
        // Calculate statistics
        console.log(complaints)
        setStats({
          total: complaints.length,
          pending: complaints.filter(c => c.status === 'Pending').length,
          resolved: complaints.filter(c => c.status === 'Resolved').length,
          Active: complaints.filter(c => c.status === 'Active').length
        });

        // Get recent 5 complaints
        setRecentComplaints(complaints.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${bgColor} p-4 rounded-xl`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.userName}! 👋
          </h1>
          <p className="text-gray-600">Here's an overview of your complaints and activity</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Full Name</p>
                  <p className="text-sm font-semibold text-gray-900">{userData.userName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email Address</p>
                  <p className="text-sm font-semibold text-gray-900">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Mobile Number</p>
                  <p className="text-sm font-semibold text-gray-900">{userData.mobileNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Member Since</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(userData.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Credit Badge */}
            <div className="md:ml-auto">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl p-4 text-center shadow-lg min-w-[120px]">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{userData.credit}</p>
                <p className="text-xs font-medium opacity-90">Credit Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FileText}
            label="Total Complaints"
            value={stats.total}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={stats.pending}
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
          <StatCard
            icon={TrendingUp}
            label="Active"
            value={stats.Active}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={CheckCircle}
            label="Resolved"
            value={stats.resolved}
            color="text-green-600"
            bgColor="bg-green-50"
          />
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Complaints</h2>
                <p className="text-sm text-gray-500">Your latest submissions</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : recentComplaints.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No complaints found</p>
              <p className="text-sm text-gray-400 mt-1">Start by raising your first complaint</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                >
                  <div className="flex items-start gap-4 flex-1 mb-3 sm:mb-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {complaint.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {complaint.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(complaint.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {complaint.location?.district || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        complaint.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : complaint.status === 'Resolved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
            <TrendingUp className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-bold mb-1">Raise New Complaint</h3>
            <p className="text-sm text-blue-100">Submit a new issue or concern</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
            <FileText className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-bold mb-1">View All Complaints</h3>
            <p className="text-sm text-purple-100">Track all your submissions</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
            <Activity className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-bold mb-1">Check Status</h3>
            <p className="text-sm text-green-100">Monitor complaint progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;