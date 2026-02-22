import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Search, TrendingUp, TrendingDown, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Market = () => {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { fetchUserProfile } = useAuth();
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await api.get("/stocks");
        setStocks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStocks();
    const interval = setInterval(fetchStocks, 5000); // Update every 5s
    return () => clearInterval(interval);
  }, []);

  const handleTrade = async (type) => {
    try {
      const res = await api.post("/trades/place", {
        symbol: selectedStock.symbol,
        type,
        quantity: parseInt(quantity),
        price: selectedStock.price,
      });
      setMessage({
        text: `Success: ${type} ${quantity} ${selectedStock.symbol}`,
        type: "success",
      });
      fetchUserProfile();
      setSelectedStock(null);
      setQuantity(1);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Trade failed",
        type: "error",
      });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const filteredStocks = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Market Explorer</h1>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search stocks..."
            className="pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-white ${message.type === "success" ? "bg-accent" : "bg-danger"} animate-in slide-in-from-top duration-300`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStocks.map((stock) => (
          <div
            key={stock.symbol}
            className="glass-card p-4 rounded-xl hover:shadow-lg transition-all border-l-4 border-l-primary/10"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg">{stock.symbol}</h3>
                <p className="text-secondary text-sm">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  ₹{stock.price.toLocaleString()}
                </p>
                <p
                  className={`text-sm flex items-center justify-end gap-1 ${stock.change >= 0 ? "text-accent" : "text-danger"}`}
                >
                  {stock.change >= 0 ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {stock.change > 0 ? "+" : ""}
                  {stock.change}%
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedStock(stock)}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-100 hover:bg-primary hover:text-white text-secondary font-medium py-2 rounded-lg transition-colors"
            >
              <ShoppingCart size={18} />
              <span>Trade</span>
            </button>
          </div>
        ))}
      </div>

      {/* Trade Modal */}
      {selectedStock && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Trade {selectedStock.symbol}
              </h2>
              <button
                onClick={() => setSelectedStock(null)}
                className="text-secondary hover:text-slate-800 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-secondary">Market Price</span>
                <span className="font-bold">
                  ₹{selectedStock.price.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-secondary font-medium">
                  Estimated Total
                </span>
                <span className="text-xl font-bold text-primary">
                  ₹{(quantity * selectedStock.price).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() => handleTrade("BUY")}
                  className="bg-accent hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-200"
                >
                  BUY
                </button>
                <button
                  onClick={() => handleTrade("SELL")}
                  className="bg-danger hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-rose-200"
                >
                  SELL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;