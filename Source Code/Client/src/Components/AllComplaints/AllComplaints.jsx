import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2, MapPin, User, Clock, AlertCircle, Building2 } from "lucide-react";

export default function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BASEURL}/complain/get-all-complain`, {
        headers: { token:token },
      });

      if (res.data.status === "OK") {
        setComplaints(res.data.data);
      } else {
        toast.error("Failed to fetch complaints");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = statusFilter === "All" 
    ? complaints 
    : complaints.filter(complaint => complaint.status === statusFilter);

  const statusCounts = {
    All: complaints.length,
    Pending: complaints.filter(c => c.status === "Pending").length,
    Active: complaints.filter(c => c.status === "Active").length,
    Resolved: complaints.filter(c => c.status === "Resolved").length,
    Reject: complaints.filter(c => c.status === "Reject").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            All Complaints
          </h1>
          <p className="text-gray-600">View and track all submitted complaints</p>
          
          {/* Status Filter Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            {["All", "Pending", "Active", "Resolved", "Reject"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  statusFilter === status
                    ? status === "All"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : status === "Pending"
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                      : status === "Active"
                      ? "bg-red-500 text-white shadow-lg shadow-red-200"
                      : status === "Resolved"
                      ? "bg-green-500 text-white shadow-lg shadow-green-200"
                      : "bg-gray-600 text-white shadow-lg shadow-gray-200"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                {status} {statusCounts[status] > 0 && `(${statusCounts[status]})`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 py-16">
            <AlertCircle className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-600">
              {statusFilter === "All" ? "No complaints found" : `No ${statusFilter.toLowerCase()} complaints found`}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {statusFilter === "All" ? "Check back later for updates" : "Try selecting a different status"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image with Status Badge */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={complaint.image?.url || "https://via.placeholder.com/400x200"}
                    alt="complaint"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                      complaint.status === "Pending"
                        ? "bg-amber-500/90 text-white"
                        : complaint.status === "Resolved"
                        ? "bg-green-500/90 text-white"
                        : complaint.status === "Active"
                        ? "bg-red-500/90 text-white"
                        : "bg-gray-600/90 text-white"
                    }`}
                  >
                    {complaint.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {complaint.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {complaint.description}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {complaint.location.areaName}, {complaint.location.district}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span className="line-clamp-1">{complaint.userId?.userName || "Anonymous"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span>
                        {new Date(complaint.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    {complaint.departmentId?.state && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        <span className="line-clamp-1">{complaint.departmentId.state}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}