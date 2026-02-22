import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TrendingUp, PieChart, Activity, LogOut, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  const navLinks = [
    { to: "/", label: "Dashboard", icon: <Activity size={18} /> },
    { to: "/market", label: "Market", icon: <TrendingUp size={18} /> },
    { to: "/portfolio", label: "Portfolio", icon: <PieChart size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary font-bold text-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            <TrendingUp size={24} />
            <span>TradeSim</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium"
              >
                {/* {link.icon} */}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-secondary">Balance</p>
            <p className="font-semibold text-accent">
              ₹{user.balance?.toLocaleString()}
            </p>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>

          <div className="hidden md:flex items-center gap-2">
            <div className="bg-slate-100 p-2 rounded-full">
              <User size={20} className="text-secondary" />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-danger"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-secondary hover:bg-slate-50 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-200">
          <div className="px-4 py-4 space-y-3">
            <div className="pb-3 mb-3 border-b border-slate-100 flex justify-between items-center px-2">
              <div>
                <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  Account
                </p>
                <p className="font-bold text-slate-900">{user.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">
                  Balance
                </p>
                <p className="font-bold text-accent">
                  ₹{user.balance?.toLocaleString()}
                </p>
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 p-3 text-secondary hover:text-primary hover:bg-primary/5 rounded-xl transition-all font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-danger hover:bg-danger/5 rounded-xl transition-all font-medium border-t border-slate-50 mt-2"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;