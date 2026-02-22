import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from "recharts";
import {ArrowUpRight,ArrowDownRight,IndianRupee,Briefcase,TrendingUp} from "lucide-react";
import api from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState([]);
  const [marketPrices, setMarketPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, stocksRes] = await Promise.all([
          api.get("/user/profile"),
          api.get("/stocks"),
        ]);

        setHoldings(profileRes.data.holdings);

        const priceMap = {};
        stocksRes.data.forEach((s) => {
          priceMap[s.symbol] = s.price;
        });
        setMarketPrices(priceMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalInvestment = holdings.reduce(
    (acc, curr) => acc + curr.quantity * curr.averagePrice,
    0,
  );
  const currentValue = holdings.reduce((acc, curr) => {
    const marketPrice = marketPrices[curr.symbol] || curr.averagePrice;
    return acc + curr.quantity * marketPrice;
  }, 0);
  const totalPnL = currentValue - totalInvestment;
  const pnlPercent =
    totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  const chartData = [
    { name: "Mon", value: 98000 },
    { name: "Tue", value: 99500 },
    { name: "Wed", value: 97000 },
    { name: "Thu", value: 101000 },
    { name: "Fri", value: 100000 + totalPnL },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold">Good Day, {user.name} 👋</h1>
        <p className="text-secondary">
          Here's what's happening with your portfolio today.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-secondary font-medium">Net Worth</span>
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Briefcase size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold">
            ₹{(user.balance + currentValue).toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2 text-sm text-accent">
            <ArrowUpRight size={16} />
            <span>+2.4% from last week</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-secondary font-medium">Holdings Value</span>
            <div className="bg-accent/10 p-2 rounded-lg text-accent">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold">₹{currentValue.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-secondary">
            <span>Invested: ₹{totalInvestment.toLocaleString()}</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-secondary font-medium">Total P&L</span>
            <div
              className={`p-2 rounded-lg ${totalPnL >= 0 ? "bg-accent/10 text-accent" : "bg-danger/10 text-danger"}`}
            >
              <IndianRupee size={20} />
            </div>
          </div>
          <p
            className={`text-3xl font-bold ${totalPnL >= 0 ? "text-accent" : "text-danger"}`}
          >
            {totalPnL >= 0 ? "+" : ""}₹{totalPnL.toLocaleString()}
          </p>
          <div
            className={`flex items-center gap-1 mt-2 text-sm ${totalPnL >= 0 ? "text-accent" : "text-danger"}`}
          >
            {totalPnL >= 0 ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            <span>{pnlPercent.toFixed(2)}% (all time)</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-lg font-bold mb-6">Performance Trajectory</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                itemStyle={{ color: "#3b82f6", fontWeight: "bold" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;