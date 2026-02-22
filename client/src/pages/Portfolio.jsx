import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Briefcase, TrendingUp, TrendingDown, Clock } from "lucide-react";

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [trades, setTrades] = useState([]);
  const [marketPrices, setMarketPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [holdingsRes, tradesRes, stocksRes] = await Promise.all([
          api.get("/user/profile"),
          api.get("/trades/history"),
          api.get("/stocks"),
        ]);
        setHoldings(holdingsRes.data.holdings);
        setTrades(tradesRes.data);

        // Create a lookup map for current market prices
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

  if (loading) return <div>Loading Portfolio...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <Briefcase size={24} />
          </div>
          <h2 className="text-2xl font-bold">Your Holdings</h2>
        </div>

        {holdings.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl">
            <p className="text-secondary mb-4">
              You don't have any holdings yet.
            </p>
            <a
              href="/market"
              className="text-primary font-bold hover:underline"
            >
              Explore Market
            </a>
          </div>
        ) : (
          <div className="overflow-hidden glass-card rounded-2xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-secondary">
                    Symbol
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary text-right">
                    Qty
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary text-right">
                    Avg. Price
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary text-right">
                    LTP (Market)
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary text-right">
                    Current Value
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary text-right">
                    P&L
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {holdings.map((h) => {
                  const currentPrice = marketPrices[h.symbol] || h.averagePrice;
                  const currentVal = h.quantity * currentPrice;
                  const pnl = currentVal - h.quantity * h.averagePrice;
                  return (
                    <tr
                      key={h.symbol}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold">{h.symbol}</td>
                      <td className="px-6 py-4 text-right">{h.quantity}</td>
                      <td className="px-6 py-4 text-right font-medium">
                        ₹{h.averagePrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        ₹{currentPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        ₹{currentVal.toLocaleString()}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-bold ${pnl >= 0 ? "text-accent" : "text-danger"}`}
                      >
                        {pnl >= 0 ? "+" : ""}₹{pnl.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-slate-100 p-2 rounded-xl text-secondary">
            <Clock size={24} />
          </div>
          <h2 className="text-2xl font-bold">Recent Activity</h2>
        </div>

        <div className="space-y-4">
          {trades.map((trade) => (
            <div
              key={trade._id}
              className="glass-card p-4 rounded-xl flex items-center justify-between border-l-4"
              style={{
                borderLeftColor: trade.type === "BUY" ? "#10b981" : "#ef4444",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-lg ${trade.type === "BUY" ? "bg-accent/10 text-accent" : "bg-danger/10 text-danger"}`}
                >
                  {trade.type === "BUY" ? (
                    <TrendingUp size={20} />
                  ) : (
                    <TrendingDown size={20} />
                  )}
                </div>
                <div>
                  <h4 className="font-bold">{trade.symbol}</h4>
                  <p className="text-secondary text-xs">
                    {new Date(trade.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  ₹{trade.totalAmount.toLocaleString()}
                </p>
                <p className="text-secondary text-xs">
                  {trade.quantity} shares @ ₹{trade.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Portfolio;