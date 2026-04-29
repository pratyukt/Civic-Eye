import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2, MapPin, Clock, AlertCircle, Building2 } from "lucide-react";

export default function UserComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${import.meta.env.VITE_BASEURL}/complain/get-complain-by-user`,{
        filter:""
      } ,{
        headers: { token: token },
      });

      if (res.data.status === "OK") {
        const complaints=res.data.data.filter((f)=> f.status!== "Reject")
        setComplaints(complaints);
      } else {
        toast.error("Failed to fetch user complaints");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error fetching user complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Complaints
          </h1>
          <p className="text-gray-600">View all your submitted complaints and their status</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 py-16">
            <AlertCircle className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-600">No complaints found</p>
            <p className="text-sm text-gray-400 mt-1">You haven’t submitted any complaints yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
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
                        : "bg-gray-500/90 text-white"
                    }`}
                  >
                    {complaint.status}
                  </div>
                </div>

                {/* Complaint Info */}
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
                        {complaint.location?.areaName}, {complaint.location?.district}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span>
                        {new Date(complaint.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {complaint.departmentId?.state && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {complaint.departmentId.state}
                        </span>
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
