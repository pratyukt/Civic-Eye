import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  Loader2,
  MapPin,
  Clock,
  AlertCircle,
  User,
  X,
} from "lucide-react";

export default function DepartmentComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const deptData = useSelector((store) => store.departmentData);
  const [complaintId, setComplaintId] = useState("");

  const fetchDepartmentComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BASEURL}/complain/get-complain-by-department`,
        {
          departmentName: deptData.DepartmentName,
          state: deptData.state,
          district: deptData.city,
        },
        { headers: { token } }
      );

      if (res.data.status === "OK") {
        const pendingComplaints = res.data.data.filter(
          (f) => f.status === "Pending"
        );
        setComplaints(pendingComplaints);
      } else {
        toast.error("Failed to fetch department complaints");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error fetching complaints");
    } finally {
      setLoading(false);
    }
  };

  // ACCEPT HANDLER
  const updateComplaintStatus = async (id, newStatus) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASEURL}/department/active-complain`,
        {
          _id: id,
          status: "Active",
        }
      );

      if (res.data.status === "OK") {
        toast.success("Complaint accepted successfully");
        fetchDepartmentComplaints();
      } else {
        toast.error(res.data.message || "Failed to update complaint");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error updating complaint");
    }
  };

  // Reject handler
  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASEURL}/department/reject-complain`,
        {
          _id: complaintId,
          reason: rejectReason,
          status: "Reject",
        }
      );

      if (res.data.status === "OK") {
        toast.success("Complaint rejected successfully");
        setShowRejectModal(false);
        setRejectReason("");
        fetchDepartmentComplaints();
      } else {
        toast.error(res.data.message || "Failed to reject complaint");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error rejecting complaint");
    }
  };

  const handleModalClose = () => {
    setShowRejectModal(false);
    setRejectReason("");
  };

  useEffect(() => {
    fetchDepartmentComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Department Complaints
          </h1>
          <p className="text-gray-600">
            Manage and track complaints related to your department
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 py-16">
            <AlertCircle className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-600">
              No complaints found
            </p>
            <p className="text-sm text-gray-400 mt-1">
              There are currently no complaints for your department
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={
                      complaint.image?.url ||
                      "https://via.placeholder.com/400x200"
                    }
                    alt="complaint"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm bg-amber-500/90 text-white">
                    Pending
                  </div>
                </div>

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
                        {complaint.location?.areaName},{" "}
                        {complaint.location?.district}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span>
                        {new Date(complaint.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      <span>{complaint.userId?.userName}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <label className="text-sm text-gray-700 font-medium">
                      Update Status:
                    </label>

                    <select
                      className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value === "Reject") {
                          setComplaintId(complaint._id);
                          setShowRejectModal(true);
                        } else if (e.target.value === "Active") {
                          updateComplaintStatus(complaint._id, "Active");
                        }
                      }}
                    >
                      <option value="" disabled>Select Action</option>
                      <option value="Active">Active</option>
                      <option value="Reject">Reject</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Reject Complaint
              </h3>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Please provide a reason for rejecting this complaint:
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none resize-none"
              rows={4}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleModalClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
