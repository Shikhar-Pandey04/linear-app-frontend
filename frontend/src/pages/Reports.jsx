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

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

const Reports = () => {
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);

  // 🔥 FETCH DATA
  const fetchIssues = async () => {
    try {
      const res = await axios.get("/issues/get-issues");
      const data = res.data.data || [];

      console.log("🔥 DATA:", data); // DEBUG (baad me hata sakta hai)

      processLineData(data);
      processPieData(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // 🔥 LINE CHART (tasks over time)
  const processLineData = (data) => {
    const map = {};

    data.forEach((item) => {
      if (!item.createdAt) return; // ✅ FIX

      const date = new Date(item.createdAt)
        .toISOString()
        .slice(0, 10); // clean format

      if (!map[date]) map[date] = 0;
      map[date]++;
    });

    const formatted = Object.keys(map).map((date) => ({
      date,
      tasks: map[date],
    }));

    setLineData(formatted);
  };

  // 🔥 PIE CHART (priority)
  const processPieData = (data) => {
    const priorityCount = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0, // ✅ FIX
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
    <div className="min-h-screen bg-[#0d1117] text-white p-10">
      
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-5xl font-black">Reports</h1>
        <p className="text-slate-400 mt-2">
          Visual insights of your tasks
        </p>
      </div>

      {/* EMPTY STATE */}
      {lineData.length === 0 && pieData.length === 0 ? (
        <div className="text-center text-slate-500 mt-20">
          No data available. Create some tasks to see reports 📊
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* 🔥 LINE CHART */}
          <div className="bg-[#0b0f14]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold mb-4">
              Tasks Over Time
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#6366f1"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 🔥 PIE CHART */}
          <div className="bg-[#0b0f14]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold mb-4">
              Tasks by Priority
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  );
};

export default Reports;