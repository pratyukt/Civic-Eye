import React, { useState , useEffect } from 'react'
import { useParams ,useNavigate} from "react-router-dom";
import axios from 'axios';
import { routes } from '../../data/routes';
import { notifyError } from '../../utils/tostify';
import { 
  Building2, 
  User, 
  Mail, 
  MapPin, 
  Shield, 
  Hash, 
  Phone, 
  Calendar, 
  Clock,
  IdCard,
  Globe,
  CheckCircle,
  XCircle
} from 'lucide-react';

const DepartmentInfo = () => {
    const {param , district ,departmentName} =  useParams()
    const [departmentInfo, setDepartmentInfo] = useState([])
    const navigate = useNavigate()

    const getDepartmentInfo = async () => {
        await axios.get(`${import.meta.env.VITE_BASEURL}/department/get-department-info?state=${param}&district=${district}&departmentName=${departmentName}`).then((res) => {
            if (res.data.status == "OK") {
                if(res.data.data.length==0){
                    navigate(routes.departmentInfo)
                }
                setDepartmentInfo(res.data.data)
            } else {
                notifyError(res.data.msg)
            }
        }).catch((err) => {
            const msg = `err on AllState on calling axios ${err.message}`
            notifyError(msg);
        })
    }

    useEffect(()=>{
        getDepartmentInfo()
    },[])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMapUrl = (address) => {
        const encodedAddress = encodeURIComponent(address);
        return `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;
    };

    if(departmentInfo.length==0) return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Loading department information...</p>
            </div>
        </div>
    )

    const dept = departmentInfo[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6 shadow-lg">
                        <Building2 className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-3">
                        {dept?.DepartmentName}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xl text-gray-600 mb-4">
                        <Hash className="w-6 h-6" />
                        <span className="font-medium">{dept?.DepartmentShortName}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        {dept?.isVerified ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                        )}
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            dept?.isVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {dept?.isVerified ? 'Verified Department' : 'Pending Verification'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Contact & Basic Info */}
                    <div className="space-y-6">
                        {/* Contact Information Card */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <User className="w-6 h-6" />
                                    Contact Information
                                </h2>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                {/* Head of Department */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Head of Department</p>
                                        <p className="text-lg font-semibold text-gray-900">{dept?.HeadOfDepartment}</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                                        <a href={`mailto:${dept?.email}`} className="text-lg font-semibold text-blue-600 hover:text-blue-800 break-all">
                                            {dept?.email}
                                        </a>
                                    </div>
                                </div>

                                {/* Mobile Number */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Mobile Number</p>
                                        <a href={`tel:${dept?.mobileNumber}`} className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                                            {dept?.mobileNumber}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Department Details Card */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <IdCard className="w-6 h-6" />
                                    Department Details
                                </h2>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                {/* Department ID */}
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Department ID</p>
                                    <p className="text-sm font-mono text-gray-700 break-all">{dept?.departmentId}</p>
                                </div>

                                {/* Role */}
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Role</p>
                                    <p className="text-lg font-semibold text-gray-900 capitalize">{dept?.role}</p>
                                </div>

                                {/* MongoDB ID */}
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">Database ID</p>
                                    <p className="text-xs font-mono text-gray-600 break-all">{dept?._id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Location & Address */}
                    <div className="space-y-6">
                        {/* Location Card */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <MapPin className="w-6 h-6" />
                                    Location
                                </h2>
                            </div>
                            
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500">City</p>
                                        <p className="text-xl font-bold text-orange-600">{dept?.city}</p>
                                    </div>
                                    <div className="text-center p-4 bg-red-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500">State</p>
                                        <p className="text-xl font-bold text-red-600">{dept?.state}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
                                    <p className="text-sm font-medium text-gray-500 mb-2">Complete Address</p>
                                    <p className="text-lg text-gray-800 leading-relaxed mb-4">
                                        {dept?.deptAddress}
                                    </p>
                                    <a 
                                        href={`https://maps.google.com/?q=${encodeURIComponent(dept?.deptAddress)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Globe className="w-4 h-4" />
                                        View on Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Timestamps Card */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <Clock className="w-6 h-6" />
                                    Timestamps
                                </h2>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Created At</p>
                                        <p className="text-sm font-semibold text-gray-900">{formatDate(dept?.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                        <p className="text-sm font-semibold text-gray-900">{formatDate(dept?.updatedAt)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Hash className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Version</p>
                                        <p className="text-sm font-semibold text-gray-900">v{dept?.__v || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Map */}
                    <div className="space-y-6">
                        {/* Map Card */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <MapPin className="w-6 h-6" />
                                    Location Map
                                </h2>
                            </div>
                            
                            <div className="p-6">
                                <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                                    <iframe
                                        src={getMapUrl(`${dept?.deptAddress}, ${dept?.city}, ${dept?.state}`)}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Department Location"
                                        className="rounded-lg"
                                    ></iframe>
                                </div>
                                <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                                    <p className="text-sm text-teal-800">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        {dept?.deptAddress}, {dept?.city}, {dept?.state}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Issues Section */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white">
                                    Issues & Support
                                </h2>
                            </div>
                            
                            <div className="p-6">
                                {dept?.solve_issue && dept.solve_issue.length > 0 ? (
                                    <div className="space-y-2">
                                        {dept.solve_issue.map((issue, index) => (
                                            <div key={index} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                                                <p className="text-sm text-yellow-800">{issue}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                        <p className="text-gray-600">No pending issues</p>
                                        <p className="text-sm text-gray-500">Department is operating smoothly</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DepartmentInfo