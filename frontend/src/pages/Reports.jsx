import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

const Reports = () => {
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const fetchIssues = async () => {
    try {
      const res = await axios.get("/issues/get-issues");
      const data = res.data.data || [];

      processLineData(data);
      processPieData(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const processLineData = (data) => {
    const map = {};

    data.forEach((item) => {
      if (!item.createdAt) return;

      const date = new Date(item.createdAt)
        .toISOString()
        .slice(0, 10);

      if (!map[date]) map[date] = 0;
      map[date]++;
    });

    const formatted = Object.keys(map).map((date) => ({
      date,
      tasks: map[date],
    }));

    setLineData(formatted);
  };

  const processPieData = (data) => {
    const priorityCount = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0,
    };

    data.forEach((item) => {
      const p = item.priority?.toUpperCase();
      if (priorityCount[p] !== undefined) {
        priorityCount[p]++;
      }
    });

    const formatted = Object.keys(priorityCount).map((key) => ({
      name: key,
      value: priorityCount[key],
    }));

    setPieData(formatted);
  };

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-5xl font-black">Reports</h1>
          <p className="text-slate-400 mt-2">
            Visual insights of your tasks
          </p>
        </div>

        {/* 🔥 STATS CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111318] p-4 rounded-xl border border-white/10">
            <p className="text-sm text-gray-400">Total Tasks</p>
            <h3 className="text-2xl font-bold">
              {lineData.reduce((a, b) => a + b.tasks, 0)}
            </h3>
          </div>

          <div className="bg-[#111318] p-4 rounded-xl border border-white/10">
            <p className="text-sm text-gray-400">High Priority</p>
            <h3 className="text-2xl font-bold text-red-400">
              {pieData.find(p => p.name === "HIGH")?.value || 0}
            </h3>
          </div>

          <div className="bg-[#111318] p-4 rounded-xl border border-white/10">
            <p className="text-sm text-gray-400">Low Priority</p>
            <h3 className="text-2xl font-bold text-blue-400">
              {pieData.find(p => p.name === "LOW")?.value || 0}
            </h3>
          </div>
        </div>

        {/* EMPTY STATE */}
        {lineData.length === 0 && pieData.length === 0 ? (
          <div className="text-center text-slate-500 mt-20">
            No data available. Create some tasks to see reports 📊
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* 🔥 LINE CHART */}
            <div className="relative group bg-gradient-to-br from-[#0b0f14]/80 to-[#0b0f14]/40 
            border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-hidden">

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 
              bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-2xl"></div>

              <h2 className="text-lg font-semibold mb-4 text-white">
                Tasks Over Time
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />

                  <Tooltip
                    contentStyle={{
                      background: "#111318",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      color: "white"
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="tasks"
                    stroke="url(#gradient)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />

                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 🔥 PIE CHART */}
            <div className="relative group bg-gradient-to-br from-[#0b0f14]/80 to-[#0b0f14]/40 
            border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-hidden">

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 
              bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-2xl"></div>

              <h2 className="text-lg font-semibold mb-4 text-white">
                Tasks by Priority
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background: "#111318",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      color: "white"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;