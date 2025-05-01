import React, { useEffect, useState } from "react";
import { Mail, MessageSquare, Calendar, User, AlertCircle, Loader } from "lucide-react";
import API from "../utils/axiosInstance";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await API.get("/api/contact/contacts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        setContacts(response.data);
      } catch (error) {
        console.error("Fetch contacts error:", error);
        setError(error.response?.data?.message || "Failed to fetch contacts. Make sure you are an admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-900/50 rounded-lg">
                <Mail className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
                <p className="text-sm text-slate-400">View and manage contact form submissions</p>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Total Submissions: <span className="font-semibold text-emerald-400">{contacts.length}</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-900/50 border border-rose-700 rounded-lg text-rose-300 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-hidden rounded-xl border border-slate-700">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Name
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Subject
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Date
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-slate-700/50 transition-colors duration-300">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {contact.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {contact.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {contact.subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        <div className="max-w-xs truncate">
                          {contact.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {new Date(contact.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && contacts.length === 0 && (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300">No contact submissions</h3>
              <p className="mt-1 text-sm text-slate-400">There are currently no contact form submissions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;