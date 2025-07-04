import React, { useEffect, useState } from "react";
import {getCsrfToken} from '../utils/func' 
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { User, BarChart3, DollarSign, Trash2, UserCheck, RefreshCw, Search } from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    traffic: 0,
    clicks: 0,
    payments: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [operationLoading, setOperationLoading] = useState({});

  useEffect(() => {
    fetchStats();
    fetchAllUsers();
  }, []);

  const fetchStats = async () => {
    // Simulate API call
    const lineData = [
      {
        name: "Today",
        traffic: stats.traffic,
        clicks: stats.clicks,
        payments: stats.payments,
      },
      {
        name: "Yesterday",
        traffic: Math.floor(stats.traffic * 0.8),
        clicks: Math.floor(stats.clicks * 0.9),
        payments: Math.floor(stats.payments * 1.1),
      },
      {
        name: "Last Week",
        traffic: Math.floor(stats.traffic * 0.5),
        clicks: Math.floor(stats.clicks * 0.6),
        payments: Math.floor(stats.payments * 0.4),
      },
    ];
    setChartData(lineData);
  };

  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
    } else {
      setError(message);
      setSuccess('');
    }
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 3000);
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    setError('');
   try {
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed");
      }

      setUsers(data);
      showMessage("ALL USERS FETCHED SUCCESSFULLY");
    } catch (err) {
      showMessage(`${err.message} \n FAILED TO FETCH ALL USERS`, 'error')
    } finally {
      setLoading(false);  
    }
  };

  const fetchUserById = async () => {
    setOperationLoading(prev => ({ ...prev, [userId]: 'fetching' }));

    try {
      console.log(userId);
      if (!userId.trim()){
        setError("User ID is required.");
        return;
      }
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed");
      }
      showMessage(`FETCH USER ${userId} SUCCESSFULLY`);
      setUsers([data]);
    } catch (err) {
      showMessage(`${err.message} \n FAILED TO FETCH ${userId}`,'error');
    } finally {    
      setOperationLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  const deleteUser = async (id) => {
    setOperationLoading(prev => ({ ...prev, [id]: 'deleting' }));

    setError('');
    try {
      if (!id.trim()){
        setError("User ID is required.");
        return;
      }
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed");
      }
      
      setUsers(prev => prev.filter(user => user._id !== id));
      showMessage(`USER ${id} DELETED SUCCESSFULLY`);

    } catch (err) {
      showMessage(`${err.message} \n Failed to delete user`, 'error');
    } finally {
      setOperationLoading(prev => ({ ...prev, [id]: null }));
    }
  };


  const promoteUser = async (id) => {
    setOperationLoading(prev => ({ ...prev, [id]: "promoting" }));
    try {
      if (!id.trim()){
        setError("User ID is required.");
        return;
      }
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${id}/promote`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken
        },
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed");
      }
      setUsers(prev => prev.map(user => 
        user._id === id ? { ...user, role: 'admin' } : user
      ));
        showMessage(`USER ${id} PROMOTED SUCCESSFULLY`);
    } catch (err) {
    
      showMessage(`FAILED TO PROMOTE USER ${id}`,'error');
    
      } finally {
        setOperationLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  const demoteUser = async (id) => {
    setOperationLoading(prev => ({ ...prev, [id]: "demoting" }));
    try {
      if (!id.trim()){
        setError("User ID is required.");
        return;
      }
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${id}/demote`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken
        },
        credentials: 'include',
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed");
      }
      
      setUsers(prev => prev.map(user => 
        user._id === id ? { ...user, role: 'user' } : user
      ));

      showMessage(`USER ${id} DEMOTED SUCCESSFULLY`);
    } catch (err) {
    
      showMessage(`FAILED TO DEMOTE USER ${id}`,'error');
    
      } finally {
        setOperationLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleMetricClick = (metric) => {
    setSelectedMetric(metric);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Manage users and monitor analytics</p>
        </div>

        {/* Alert Messages */}
        {(error || success) && (
          <div className={`mb-6 p-4 rounded-lg ${
            success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {success || error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InfoCard 
            icon={<User className="w-6 h-6 text-blue-600" />} 
            label="Total Users" 
            value={stats.totalUsers.toLocaleString()} 
            color="text-blue-800"
            bgColor="bg-blue-100"
          />
          <InfoCard 
            icon={<User className="w-6 h-6 text-green-600" />} 
            label="Total Admins" 
            value={stats.totalAdmins.toLocaleString()} 
            color="text-green-800"
            bgColor="bg-green-100"
          />
          <InfoCard 
            icon={<BarChart3 className="w-6 h-6 text-purple-600" />} 
            label="Total Clicks" 
            value={stats.clicks.toLocaleString()} 
            color="text-purple-800"
            bgColor="bg-purple-100"
          />
          <InfoCard 
            icon={<DollarSign className="w-6 h-6 text-yellow-600" />} 
            label="Revenue" 
            value={`$${stats.payments.toLocaleString()}`} 
            color="text-yellow-800"
            bgColor="bg-yellow-100"
          />
        </div>

        {/* User Management */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <User className="w-6 h-6" />
            User Management
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <button 
              onClick={fetchAllUsers} 
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Fetch All Users'}
            </button>
            
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                onClick={fetchUserById} 
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">User ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Job</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Created</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      {loading ? 'Loading users...' : 'No users found. Click "Fetch All Users" to load data.'}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-600 border-b font-mono">{user._id}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 border-b font-medium">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-b">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-b">{user.job}</td>
                      <td className="px-4 py-3 text-sm border-b">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-b">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-center border-b">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => user.role === 'admin' ? demoteUser(user._id) : promoteUser(user._id) }
                            disabled={operationLoading[user._id]}
                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            {operationLoading[user._id] === 'promoting' ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <UserCheck className="w-3 h-3" />
                            )}
                            {user.role === 'admin' ? 'Demote' : 'Promote'}
                          </button>
                          <button 
                            onClick={() => deleteUser(user._id)}
                            disabled={operationLoading[user._id]}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            {operationLoading[user._id] === 'deleting' ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Website Analytics
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="traffic" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="payments" 
                  stroke="#f59e0b" 
                  strokeWidth={3} 
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {selectedMetric && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-semibold text-blue-800">
                Showing detailed analytics for: {selectedMetric.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value, color, bgColor }) => (
  <div className={`${bgColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;

