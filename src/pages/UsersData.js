import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, User, Mail, Shield, Trash2, AlertCircle, Loader, CheckCircle2, XCircle } from "lucide-react";
import API from "../utils/axiosInstance"; // Import the axios instance


const UsersData = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get("/api/admin/usersdata", {
          headers: { Authorization: `${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setDeleteLoading(userId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await API.delete(`/api/admin/user-delete/${userId}`, {
        headers: { 
          Authorization: `${token}` 
        }
      });

      if (response.status === 200) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      setError(error.response?.data?.message || error.message || "Failed to delete user");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading users data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-900/50 rounded-lg">
                <User className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Users Management</h1>
                <p className="text-sm text-slate-400">Manage and monitor user accounts</p>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Total Users: <span className="font-semibold text-emerald-400">{users.length}</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-900/50 border border-rose-700 rounded-lg text-rose-300">
              <AlertCircle className="h-5 w-5 inline-block mr-2" />
              {error}
            </div>
          )}

          {/* Users List */}
          <div className="overflow-hidden rounded-xl border border-slate-700">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-700/50 transition-colors duration-300">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                            <User className="h-5 w-5 text-slate-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-violet-900/50 text-violet-300' 
                          : 'bg-slate-700/50 text-slate-300'
                      }`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={deleteLoading === user._id}
                            className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                              deleteLoading === user._id
                                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                : "bg-rose-900/50 text-rose-300 hover:bg-rose-900/70"
                            } transition-colors duration-300`}
                          >
                            {deleteLoading === user._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-rose-300"></div>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </>
                            )}
                          </button>
                        )}
                        {user.role === 'admin' && (
                          <span className="text-xs text-slate-400">Admin accounts cannot be deleted</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && users.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300">No users found</h3>
              <p className="mt-1 text-sm text-slate-400">There are currently no users in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersData;
