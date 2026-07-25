import { useEffect, useState } from "react";
import { API } from "../config";
import {
  Users, Home, Tags, CreditCard, Activity, UserPlus, Eye, Star, Heart,
  TrendingUp, TrendingDown, BarChart3, PieChart, CalendarDays,
  ArrowRight, DollarSign, Shield, UserCheck
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { Link } from "react-router-dom";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetch(`${API}/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
    </div>
  );

  const cards = [
    { label: "Usuários", value: data.stats.totalUsers, icon: Users, color: "from-blue-500 to-blue-600", change: "+12%" },
    { label: "Anúncios", value: data.stats.totalListings, icon: Home, color: "from-emerald-500 to-emerald-600", change: `+${data.stats.totalListings - data.stats.inactiveListings} ativos` },
    { label: "Assinaturas", value: data.stats.totalSubscriptions, icon: CreditCard, color: "from-violet-500 to-violet-600", sub: `${data.stats.activeSubscriptions} ativas` },
    { label: "Favoritos", value: data.stats.totalFavorites, icon: Heart, color: "from-rose-500 to-rose-600", change: "+5%" },
    { label: "Categorias", value: data.stats.totalCategories, icon: Tags, color: "from-amber-500 to-amber-600" },
    { label: "Planos", value: data.stats.totalPlans, icon: DollarSign, color: "from-cyan-500 to-cyan-600" },
  ];

  const usersChart = (data.monthlyUsers || []).reverse().map(u => ({ month: u.month?.substring(5) || u.month, novos: u.count }));
  const listingsChart = (data.monthlyListings || []).reverse().map(l => ({ month: l.month?.substring(5) || l.month, novos: l.count }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Visão geral da plataforma Locafy</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800">
          <CalendarDays size={14} />
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {cards.map((card, i) => (
          <div key={card.label} className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-gray-900/50">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-lg`}>
              <card.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            {card.change && <p className="text-[10px] text-emerald-400 mt-1 font-medium">{card.change}</p>}
            {card.sub && <p className="text-[10px] text-gray-500 mt-0.5">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Monthly Users Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2"><TrendingUp size={16} className="text-emerald-400" /> Cadastros por Mês</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={usersChart}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 12, color: "#f3f4f6", fontSize: 12 }} />
              <Area type="monotone" dataKey="novos" stroke="#10b981" fill="url(#colorUsers)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Listings Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2"><BarChart3 size={16} className="text-blue-400" /> Anúncios por Mês</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={listingsChart}>
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 12, color: "#f3f4f6", fontSize: 12 }} />
              <Bar dataKey="novos" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Listings per Category - Pie */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2"><PieChart size={16} className="text-purple-400" /> Anúncios por Categoria</h2>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <RPieChart>
                <Pie data={data.listingsByCategory} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="_count.listings" nameKey="name" paddingAngle={3}>
                  {data.listingsByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 12, color: "#f3f4f6", fontSize: 12 }} />
              </RPieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {data.listingsByCategory.map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {cat.name}
                  </span>
                  <span className="text-white font-medium">{cat._count.listings}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plans Popularity */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2"><Star size={16} className="text-amber-400" /> Planos x Assinantes</h2>
          </div>
          <div className="space-y-3">
            {data.plansBySubs.map((plan, i) => (
              <div key={plan.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">{plan.name}</span>
                  <span className="text-white font-medium">{plan._count.subscriptions} assinantes</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (plan._count.subscriptions / Math.max(...data.plansBySubs.map(p => p._count.subscriptions), 1)) * 100)}%`, backgroundColor: COLORS[i % COLORS.length] }}
                  />
                </div>
              </div>
            ))}
            {data.plansBySubs.length === 0 && <p className="text-xs text-gray-500 text-center py-4">Nenhuma assinatura ainda</p>}
          </div>
        </div>

      </div>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Recent Users */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2"><UserPlus size={16} className="text-emerald-400" /> Últimos Usuários</h2>
            <Link to="/usuarios" className="text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1">Ver todos <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-1">
            {data.recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800/50 transition group">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${u.role === "admin" ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white" : "bg-gray-800 text-gray-400"}`}>
                  {u.role === "admin" ? <Shield size={14} /> : (u.name?.[0]?.toUpperCase() || "?")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{u.name}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-800 text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2"><Eye size={16} className="text-blue-400" /> Últimos Anúncios</h2>
            <Link to="/anuncios" className="text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1">Ver todos <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-1">
            {data.recentListings.map(l => (
              <div key={l.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800/50 transition group">
                <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-sm overflow-hidden flex-shrink-0">
                  {l.images?.[0] ? <img src={l.images[0]} className="w-full h-full object-cover" /> : <Home size={14} className="text-gray-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{l.title}</p>
                  <p className="text-xs text-gray-500 truncate">{l.user?.name} · {l.category?.name}</p>
                </div>
                <span className="text-xs font-medium text-emerald-400">R$ {l.price?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><UserCheck size={18} className="text-emerald-400" /></div>
          <div><p className="text-lg font-bold text-white">{data.stats.usersWithListings}</p><p className="text-[10px] text-gray-500">Anunciantes</p></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><Eye size={18} className="text-blue-400" /></div>
          <div><p className="text-lg font-bold text-white">{data.stats.featuredListings}</p><p className="text-[10px] text-gray-500">Destaques</p></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center"><TrendingDown size={18} className="text-red-400" /></div>
          <div><p className="text-lg font-bold text-white">{data.stats.inactiveListings}</p><p className="text-[10px] text-gray-500">Inativos</p></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center"><Users size={18} className="text-amber-400" /></div>
          <div>
            <p className="text-lg font-bold text-white">
              {data.usersByRole?.find(r => r.role === "admin")?._count || 0}
            </p>
            <p className="text-[10px] text-gray-500">Admins</p>
          </div>
        </div>
      </div>
    </div>
  );
}
