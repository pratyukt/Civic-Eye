import React from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Phone, Calendar, Award, Shield, Activity } from 'lucide-react';

const UserProfile = () => {
  const userData = useSelector((store) => store.userData);
  const deptData = useSelector((store) => store.departmentData);
  
  const isUser = userData?.role === 'user';
  const isDept = deptData?.role === 'department';
  const data = isUser ? userData : deptData;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">View and manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                <User className="w-12 h-12 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="pt-16 pb-8 px-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isUser ? data.userName : data.DepartmentName || 'User'}
              </h2>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold capitalize">
                {data.role || 'User'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email Address</p>
                  <p className="text-sm font-semibold text-gray-900">{data.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Mobile Number</p>
                  <p className="text-sm font-semibold text-gray-900">{data.mobileNumber || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Member Since</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(data.createdAt)}</p>
                </div>
              </div>

              {isUser && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Credit Points</p>
                    <p className="text-sm font-semibold text-gray-900">{data.credit || 0}</p>
                  </div>
                </div>
              )}

              {isDept && (
                <>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Head of Department</p>
                      <p className="text-sm font-semibold text-gray-900">{data.HeadOfDepartment || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-3 bg-teal-100 rounded-xl">
                      <Activity className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Location</p>
                      <p className="text-sm font-semibold text-gray-900">{data.city}, {data.state}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
