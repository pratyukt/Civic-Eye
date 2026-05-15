import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Building2, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Search, 
  Loader2,
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

const DepartmentWorks = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const url = import.meta.env.VITE_BASEURL;
      const res = await axios.get(`${url}/department/get-all-state-of-department`);
      if (res.data.status === 'OK') {
        setDepartments(res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter(dept =>
    typeof dept === 'string' && dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Activity className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Department Works
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View the activities and performance of government departments across various states.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by state name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm bg-white"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 py-16">
            <AlertCircle className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-600">No departments found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((state, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{state}</h3>
                    <p className="text-sm text-gray-500">Active State</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Departments Active</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How Departments Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Building2 className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Register & Verify</h3>
              <p className="text-sm text-gray-600">Departments register on the platform and get verified by the admin.</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Receive & Process</h3>
              <p className="text-sm text-gray-600">Complaints are automatically routed to the relevant department.</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Resolve & Report</h3>
              <p className="text-sm text-gray-600">Departments resolve issues and update status for transparency.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentWorks;
