import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { User, BarChart3, Eye, DollarSign, ShieldCheck } from "lucide-react";

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

  useEffect(() => {
    fetchStats();
    fetchAllUsers();
  }, []);

  const fetchStats = async () => {
    const res = await fetch("/api/stats");
    const data = await res.json();
    setStats(data);
    const lineData = [
      {
        name: "Today",
        traffic: data.traffic,
        clicks: data.clicks,
        payments: data.payments,
      },
      {
        name: "Yesterday",
        traffic: data.traffic * 0.8,
        clicks: data.clicks * 0.9,
        payments: data.payments * 1.1,
      },
      {
        name: "Last Week",
        traffic: data.traffic * 0.5,
        clicks: data.clicks * 0.6,
        payments: data.payments * 0.4,
      },
    ];
    setChartData(lineData);
  };

  const fetchAllUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const fetchUserById = async () => {
    const res = await fetch(`/api/users/${userId}`);
    const data = await res.json();
    setUsers([data]);
  };

  const deleteUser = async (id) => {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchAllUsers();
  };

  const forceLogout = async (id) => {
    await fetch(`/api/users/${id}/logout`, { method: "POST" });
    alert(`Forced logout for user ${id}`);
  };

  const promoteUser = async (id) => {
    await fetch(`/api/users/${id}/promote`, { method: "POST" });
    fetchAllUsers();
  };

  const handleMetricClick = (metric) => {
    setSelectedMetric(metric);
  };

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-slate-100 to-white min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-center text-slate-800 mb-10"
      >
        Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <InfoCard icon={<User className="text-blue-500 w-6 h-6" />} label="Total Users" value={stats.totalUsers} color="text-blue-800" />
        <InfoCard icon={<User className="text-green-500 w-6 h-6" />} label="Total Admins" value={stats.totalAdmins} color="text-green-800" />
        <InfoCard icon={<BarChart3 className="text-indigo-500 w-6 h-6" />} label="Engagements" value={stats.traffic + stats.clicks} color="text-indigo-800" />
        <InfoCard icon={<DollarSign className="text-yellow-500 w-6 h-6" />} label="Payments" value={`$${stats.payments}`} color="text-yellow-800" />
      </div>

      <div className="mt-12 bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button onClick={fetchAllUsers} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium w-full">Fetch All Users</button>
          <input
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={fetchUserById} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium w-full">Fetch by ID</button>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">User ID</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-800 font-medium">{user.name}</td>
                  <td className="px-6 py-3 text-gray-600">{user.id}</td>
                  <td className="px-6 py-3 text-center space-x-2">
                    <button onClick={() => deleteUser(user.id)} className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                    <button onClick={() => forceLogout(user.id)} className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Logout</button>
                    <button onClick={() => promoteUser(user.id)} className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">Promote</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-12 p-6 bg-white rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-700">Website Analytics</h2>
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: 10 }} />
            <Legend onClick={(e) => handleMetricClick(e.dataKey)} />
            <Line type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="payments" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-8 text-center text-xl font-semibold text-blue-600"
          >
            Showing detailed analytics for: {selectedMetric.toUpperCase()}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const InfoCard = ({ icon, label, value, color }) => (
  <motion.div whileHover={{ scale: 1.03 }} className="shadow-lg bg-white rounded-xl p-6 flex items-center space-x-4">
    {icon}
    <p className={`text-lg font-semibold ${color}`}>{label}: {value}</p>
  </motion.div>
);

export default AdminDashboard;
