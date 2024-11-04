import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import PrivateRoutes from "./components/RouteRestriction/PrivateRoutes";
import PublicRoutes from "./components/RouteRestriction/PublicRoutes";
import Profile from "./pages/Profile/Profile";
import PasswordReset from "./pages/Auth/PasswordReset";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Home from "./pages/Home/Home";

const MainRoutes = () => (
  <Routes>
    {/* Rotas públicas */}
    <Route path="/" element={<PublicRoutes />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<PasswordReset />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup" element={<Signup />} />
    </Route>

    {/* Rotas privadas */}
    <Route path="/" element={<PrivateRoutes />}>
      <Route path="/dashboard" element={<Dashboard />} /> 
      <Route path="/profile" element={<Profile />} />
    </Route>
  </Routes>
);

export default MainRoutes;
