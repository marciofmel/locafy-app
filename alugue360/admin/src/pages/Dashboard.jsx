import { useEffect, useState } from "react";
import { API } from "../config";
import { Users, Home, Tags, CreditCard, Activity, UserPlus, LayoutList, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetch(`${API}/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <p className="text-gray-400">Carregando...</p>;

  const cards = [
    { label: "Usuários", value: data.stats.totalUsers, icon: Users, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { label: "Anúncios", value: data.stats.totalListings, icon: Home, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { label: "Categorias", value: data.stats.totalCategories, icon: Tags, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    { label: "Planos", value: data.stats.totalPlans, icon: CreditCard, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    { label: "Assinaturas", value: data.stats.totalSubscriptions, icon: Activity, color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    { label: "Ativas", value: data.stats.activeSubscriptions, icon: Activity, color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  ];

  const chartData = [
    { name: "Usuários", total: data.stats.totalUsers },
    { name: "Anúncios", total: data.stats.totalListings },
    { name: "Assinaturas", total: data.stats.totalSubscriptions },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map(card => (
          <div key={card.label} className={`${card.color} border rounded-xl p-4`}>
            <card.icon size={20} />
            <p className="text-2xl font-bold mt-2">{card.value}</p>
            <p className="text-xs opacity-80 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Visão Geral</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 8, color: "#f3f4f6" }} />
              <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Users */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300">Últimos Usuários</h2>
            <Link to="/admin/usuarios" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">Ver todos <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-2">
            {data.recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">{u.name?.[0]?.toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{u.name}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${u.role === "admin" ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-700 text-gray-400"}`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300">Últimos Anúncios</h2>
            <Link to="/admin/anuncios" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">Ver todos <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-2">
            {data.recentListings.map(l => (
              <div key={l.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition">
                {l.images?.[0] ? <img src={l.images[0]} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-lg">📷</div>}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{l.title}</p>
                  <p className="text-xs text-gray-500">{l.user?.name} · {l.category?.name}</p>
                </div>
                <span className="text-xs text-emerald-400">R$ {l.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
