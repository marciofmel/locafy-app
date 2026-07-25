import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";
import { Plus, Edit3, Trash2, CreditCard, DollarSign, Calendar, Hash, ListChecks } from "lucide-react";

export default function Plans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const token = localStorage.getItem("adminToken");

  const load = async () => {
    const r = await fetch(`${API}/plans`);
    setPlans(await r.json());
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Excluir plano?")) return;
    await fetch(`${API}/admin/plans/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><CreditCard size={22} className="text-emerald-400" /> Planos</h1>
        <button onClick={() => navigate("/planos/novo")} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 py-2.5 text-sm transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
          <Plus size={16} /> Novo Plano
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4"><div className="flex items-center gap-1.5"><CreditCard size={12} /> Nome</div></th>
                <th className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4"><div className="flex items-center gap-1.5"><DollarSign size={12} /> Preço (R$)</div></th>
                <th className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4"><div className="flex items-center gap-1.5"><Calendar size={12} /> Intervalo</div></th>
                <th className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4"><div className="flex items-center gap-1.5"><Hash size={12} /> Max Anúncios</div></th>
                <th className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4"><div className="flex items-center gap-1.5"><ListChecks size={12} /> Funcionalidades</div></th>
                <th className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {plans.map(p => (
                <tr key={p.id} className={`hover:bg-gray-800/30 transition ${!p.active ? "opacity-50" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${p.active ? "bg-emerald-400" : "bg-gray-600"}`} />
                      <span className="text-sm font-medium text-white">{p.name}</span>
                      {!p.active && <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">Inativo</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">R$ {p.price.toFixed(2)}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.interval === "month" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"}`}>{p.interval === "month" ? "Mensal" : "Anual"}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-300">{p.maxListings}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {p.features?.slice(0, 3).map((f, i) => <span key={i} className="text-[11px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-md truncate">{f}</span>)}
                      {p.features?.length > 3 && <span className="text-[11px] text-gray-500">+{p.features.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => navigate(`/planos/editar/${p.id}`)} className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-400 transition"><Edit3 size={14} /></button>
                      <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {plans.length === 0 && <p className="text-center text-gray-500 py-12 text-sm">Nenhum plano encontrado</p>}
      </div>
    </div>
  );
}
