import React, { useEffect, useState } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  ChartContainer,
  ChartsXAxis,
  ChartsYAxis,
  ChartsTooltip,
  ChartsLegend,
  ChartsReferenceLine,
  ChartsAxisHighlight,
  ChartsClipPath,
  AreaPlot,
  LinePlot,
  MarkPlot,
} from '@mui/x-charts';

import { User, BarChart3, DollarSign, Trash2, UserCheck, RefreshCw, Search, Users, TrendingUp, Activity, Shield } from "lucide-react";
import { getCsrfToken } from "../utils/func";
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalAdmins: 23,
    traffic: 12845,
    clicks: 8934,
    payments: 45680,
  });
  const [chartData, setChartData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [visibleMetrics, setVisibleMetrics] = useState({
    traffic: true,
    clicks: true,
    payments: true
  });
  const [chartType, setChartType] = useState('area');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [operationLoading, setOperationLoading] = useState({});

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!pageLoading) {
      fetchStats();
      fetchAllUsers();
    }
  }, [pageLoading]);

  const fetchStats = async () => {
    const lineData = [
      { name: "Jan", traffic: 12000, clicks: 8500, payments: 42000 },
      { name: "Feb", traffic: 13200, clicks: 9200, payments: 45000 },
      { name: "Mar", traffic: 11800, clicks: 8100, payments: 38000 },
      { name: "Apr", traffic: 14500, clicks: 10200, payments: 52000 },
      { name: "May", traffic: 13800, clicks: 9800, payments: 48000 },
      { name: "Jun", traffic: 15200, clicks: 11000, payments: 55000 },
      { name: "Jul", traffic: 10000, clicks: 10000, payments: 10000 },
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
    }, 4000);
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

  const toggleMetric = (metric) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };
  
  const getMetricStats = (metric) => {
    const values = chartData.map(item => item[metric]);
    const current = values[values.length - 1];
    const previous = values[values.length - 2];
    const change = previous ? ((current - previous) / previous * 100).toFixed(1) : 0;
    
    return {
      current,
      change,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
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

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <motion.div
        className="fixed top-20 left-20 w-72 h-72 bg-gradient-to-br from-indigo-300 to-purple-500 rounded-full opacity-40"
        animate={{
          y: [0, -50, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="fixed bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-500 rounded-full opacity-40"
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-gray-600 text-lg font-medium">Manage users and monitor analytics with ease</p>
          </div>

          {/* Alert Messages */}
          {(error || success) && (
            <div className={`mb-8 p-4 rounded-xl backdrop-blur-sm border animate-slide-down ${
              success 
                ? 'bg-green-50/80 text-green-700 border-green-200 shadow-green-100' 
                : 'bg-red-50/80 text-red-700 border-red-200 shadow-red-100'
            } shadow-lg`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${success ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                {success || error}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatsCard 
              icon={<Users className="w-6 h-6" />} 
              label="Total Users" 
              value={stats.totalUsers.toLocaleString()} 
              gradient="from-blue-500 to-blue-600"
            />
            <StatsCard 
              icon={<Shield className="w-6 h-6" />} 
              label="Total Admins" 
              value={stats.totalAdmins.toLocaleString()} 
              gradient="from-purple-500 to-purple-600"
            />
            <StatsCard 
              icon={<Activity className="w-6 h-6" />} 
              label="Total Clicks" 
              value={stats.clicks.toLocaleString()} 
              gradient="from-indigo-500 to-indigo-600"
            />
            <StatsCard 
              icon={<TrendingUp className="w-6 h-6" />} 
              label="Revenue" 
              value={`$${stats.payments.toLocaleString()}`} 
              gradient="from-violet-500 to-violet-600"
            />
          </div>

          {/* User Management */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-12 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              User Management
            </h2>
            
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <button 
                onClick={fetchAllUsers} 
                disabled={loading}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Fetch All Users'}
              </button>
              
              <div className="flex-1 flex gap-3">
                <input
                  type="text"
                  placeholder="Enter User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="flex-1 border-2 border-gray-200 px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                />
                <button 
                  onClick={fetchUserById} 
                  disabled={operationLoading[userId]}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {operationLoading[userId] === 'fetching' ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  Search
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Job</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        {loading ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            <span>Loading users...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <Users className="w-12 h-12 text-gray-300" />
                            <span>No users found. Click "Fetch All Users" to load data.</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr 
                        key={user._id} 
                        className="hover:bg-gray-50/80 transition-all duration-200 border-b border-gray-100 animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono bg-gray-50 rounded-lg mx-2 my-1">{user._id}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.job}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800' 
                              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => user.role === 'admin' ? demoteUser(user._id) : promoteUser(user._id) }
                              disabled={operationLoading[user._id]}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              {operationLoading[user._id] === 'promoting' || operationLoading[user._id] === 'demoting' ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )}
                              {user.role === 'admin' ? 'Demote' : 'Promote'}
                            </button>
                            <button 
                              onClick={() => deleteUser(user._id)}
                              disabled={operationLoading[user._id]}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              {operationLoading[user._id] === 'deleting' ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-4 lg:mb-0">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                Website Analytics
              </h2>
              
              {/* Chart Type Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType('area')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    chartType === 'area' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Area Chart
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    chartType === 'line' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Line Chart
                </button>
              </div>
            </div>

            {/* Metric Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Traffic Control */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-blue-800">Traffic</span>
                    <button
                      onClick={() => toggleMetric('traffic')}
                      className={`text-xs px-2 py-1 rounded-full font-medium transition-all duration-300 ${
                        visibleMetrics.traffic 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {visibleMetrics.traffic ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    {getMetricStats('traffic').trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />
                    )}
                    <span className={`text-sm font-medium ${
                      getMetricStats('traffic').trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {getMetricStats('traffic').change}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {getMetricStats('traffic').current?.toLocaleString()}
                </div>
              </div>

              {/* Clicks Control */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-green-800">Clicks</span>
                    <button
                      onClick={() => toggleMetric('clicks')}
                      className={`text-xs px-2 py-1 rounded-full font-medium transition-all duration-300 ${
                        visibleMetrics.clicks 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {visibleMetrics.clicks ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    {getMetricStats('clicks').trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />
                    )}
                    <span className={`text-sm font-medium ${
                      getMetricStats('clicks').trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {getMetricStats('clicks').change}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {getMetricStats('clicks').current?.toLocaleString()}
                </div>
              </div>

              {/* Payments Control */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <span className="font-semibold text-purple-800">Payments</span>
                    <button
                      onClick={() => toggleMetric('payments')}
                      className={`text-xs px-2 py-1 rounded-full font-medium transition-all duration-300 ${
                        visibleMetrics.payments 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {visibleMetrics.payments ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    {getMetricStats('payments').trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />
                    )}
                    <span className={`text-sm font-medium ${
                      getMetricStats('payments').trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {getMetricStats('payments').change}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-800">
                  ${getMetricStats('payments').current?.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="h-96">
              {chartType === 'area' ? (
                <LineChart
                  series={[
                    ...(visibleMetrics.traffic ? [{
                      data: chartData.map(item => item.traffic),
                      label: 'Traffic',
                      area: true,
                      color: 'rgba(59, 130, 246, 0.5)', // blue, 30% opacity
                    }] : []),
                    ...(visibleMetrics.clicks ? [{
                      data: chartData.map(item => item.clicks),
                      label: 'Clicks',
                      area: true,
                      color: 'rgba(16, 185, 129, 0.6)', // green, 30% opacity
                    }] : []),
                    ...(visibleMetrics.payments ? [{
                      data: chartData.map(item => item.payments),
                      label: 'Payments',
                      area: true,
                      color: 'rgba(139, 92, 246, 0.3)', // purple, 30% opacity
                    }] : []),
                  ]}

                  xAxis={[{ scaleType: 'point', data: chartData.map(item => item.name) }]}
                  >
                </LineChart>
                
              ) : (
                <LineChart
                  series={[
                    ...(visibleMetrics.traffic ? [{
                      data: chartData.map(item => item.traffic),
                      label: 'Traffic',
                      color: '#3b82f6',
                    }] : []),
                    ...(visibleMetrics.clicks ? [{
                      data: chartData.map(item => item.clicks),
                      label: 'Clicks',
                      color: '#10b981',
                    }] : []),
                    ...(visibleMetrics.payments ? [{
                      data: chartData.map(item => item.payments),
                      label: 'Payments',
                      color: '#8b5cf6',
                    }] : []),
                  ]}
                  xAxis={[{ scaleType: 'point', data: chartData.map(item => item.name) }]}
                  slotProps={{
                    legend: {
                      // Correct legend styling
                      mark: {
                        width: 10,
                        height: 10,
                      },
                      label: {
                        style: {
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        },
                      },
                    },
                    tooltip: {
                      style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)'
                      },
                    },
                  }}
                  
                >
                </LineChart>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PageLoader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center z-50">
    <div className="text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Loading Dashboard
        </h2>
        <p className="text-gray-600 mt-2">Please wait while we prepare your data...</p>
      </div>
    </div>
  </div>
);

const StatsCard = ({ icon, label, value, gradient }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/50">
    <div className="flex items-center gap-4">
      <div className={`p-4 bg-gradient-to-r ${gradient} rounded-xl shadow-lg`}>
        {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;