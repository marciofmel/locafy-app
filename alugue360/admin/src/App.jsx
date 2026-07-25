import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Listings from "./pages/Listings";
import Categories from "./pages/Categories";
import Plans from "./pages/Plans";
import EditPlan from "./pages/EditPlan";
import NewPlan from "./pages/NewPlan";
import EditCategory from "./pages/EditCategory";
import NewCategory from "./pages/NewCategory";

function Protected({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protected><Dashboard /></Protected>} />
        <Route path="/usuarios" element={<Protected><Users /></Protected>} />
        <Route path="/anuncios" element={<Protected><Listings /></Protected>} />
        <Route path="/categorias" element={<Protected><Categories /></Protected>} />
        <Route path="/categorias/nova" element={<Protected><NewCategory /></Protected>} />
        <Route path="/categorias/editar/:id" element={<Protected><EditCategory /></Protected>} />
        <Route path="/planos" element={<Protected><Plans /></Protected>} />
        <Route path="/planos/novo" element={<Protected><NewPlan /></Protected>} />
        <Route path="/planos/editar/:id" element={<Protected><EditPlan /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
