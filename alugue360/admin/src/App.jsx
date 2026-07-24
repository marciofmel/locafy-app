import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Listings from "./pages/Listings";
import Categories from "./pages/Categories";
import Plans from "./pages/Plans";

function Protected({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Protected><Dashboard /></Protected>} />
        <Route path="/admin/usuarios" element={<Protected><Users /></Protected>} />
        <Route path="/admin/anuncios" element={<Protected><Listings /></Protected>} />
        <Route path="/admin/categorias" element={<Protected><Categories /></Protected>} />
        <Route path="/admin/planos" element={<Protected><Plans /></Protected>} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
