import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Portfolio from "./pages/Portfolio";
import Footer from "./components/Footer";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />
          <main className="container mx-auto px-4 py-8 flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/market"
                element={
                  <PrivateRoute>
                    <Market />
                  </PrivateRoute>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <PrivateRoute>
                    <Portfolio />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;