import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Github, Linkedin, Mail, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-primary font-bold text-2xl"
            >
              <TrendingUp size={28} />
              <span>TradeSim</span>
            </Link>
            <p className="text-secondary leading-relaxed">
              Experience the excitement of the stock market without the risk.
              Our premium simulator provides real-time data and professional
              tools for aspiring traders.
            </p>
            <div className="flex items-center gap-4 text-secondary">
              <a
                href="https://github.com/leoabhay"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
                title="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/abhay-chaudhary-95b751181/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Markets Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Markets</h4>
            <ul className="space-y-4 text-secondary">
              <li>
                <Link
                  to="/market"
                  className="hover:text-primary transition-colors"
                >
                  Equity Trading
                </Link>
              </li>
              <li>
                <Link
                  to="/market"
                  className="hover:text-primary transition-colors"
                >
                  Index Funds
                </Link>
              </li>
              <li>
                <Link
                  to="/market"
                  className="hover:text-primary transition-colors"
                >
                  Market Heatmap
                </Link>
              </li>
              <li>
                <Link
                  to="/market"
                  className="hover:text-primary transition-colors"
                >
                  Simulation Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Account</h4>
            <ul className="space-y-4 text-secondary">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="hover:text-primary transition-colors"
                >
                  My Holdings
                </Link>
              </li>
              <li>
                <Link
                  to="/market"
                  className="hover:text-primary transition-colors"
                >
                  Market
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Stay Updated</h4>
            <p className="text-secondary mb-4 text-sm">
              Get the latest market insights and feature updates.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button className="absolute right-2 top-1.5 p-1.5 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary text-sm">
            © {new Date().getFullYear()} TradeSim Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-secondary">
            <a
              href="#"
              className="hover:text-primary transition-colors font-medium"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors font-medium"
            >
              Terms of Service
            </a>
            <div className="flex items-center gap-1.5 text-accent font-bold">
              <ShieldCheck size={16} />
              <span>Certified Simulator</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;