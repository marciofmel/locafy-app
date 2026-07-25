import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";
import { ArrowLeft, Save, CreditCard, Tag, DollarSign, Calendar, Hash, ListChecks, Sparkles, CheckCircle2 } from "lucide-react";

export default function NewPlan() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const [form, setForm] = useState({ name: "", price: "", interval: "month", maxListings: 2, features: "", active: true });
  const [saving, setSaving] = useState(false);

  const create = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    await fetch(`${API}/admin/plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, price: Number(form.price), features: form.features.split("\n").filter(Boolean), maxListings: Number(form.maxListings) })
    });
    setSaving(false);
    navigate("/planos");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/planos")} className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 transition text-gray-400 hover:text-white">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CreditCard size={20} className="text-white" />
            </span>
            Novo Plano
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Crie um novo plano de assinatura</p>
        </div>
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="px-8 py-5 border-b border-gray-800/50 bg-gradient-to-r from-gray-900 to-gray-800/30">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-gray-300">Informações do Plano</span>
          </div>
        </div>

        <div className="p-8 space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5"><Tag size={12} /> Nome do Plano</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Profissional" className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 focus:bg-gray-800 transition placeholder:text-gray-600" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5"><DollarSign size={12} /> Preço</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} type="number" step="0.01" placeholder="49.99" className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 pl-10 text-sm text-white outline-none focus:border-emerald-500/50 focus:bg-gray-800 transition placeholder:text-gray-600" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5"><Calendar size={12} /> Intervalo</label>
              <select value={form.interval} onChange={e => setForm({ ...form, interval: e.target.value })} className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 focus:bg-gray-800 transition">
                <option value="month">Mensal</option>
                <option value="year">Anual</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5"><Hash size={12} /> Máx. Anúncios</label>
              <input value={form.maxListings} onChange={e => setForm({ ...form, maxListings: e.target.value })} type="number" className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 focus:bg-gray-800 transition" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5"><ListChecks size={12} /> Funcionalidades</label>
            <textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} rows={5} placeholder="Uma funcionalidade por linha" className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 focus:bg-gray-800 transition placeholder:text-gray-600 resize-none" />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/30 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.active ? "bg-emerald-500/10" : "bg-gray-800"}`}>
                {form.active ? <Sparkles size={18} className="text-emerald-400" /> : <CheckCircle2 size={18} className="text-gray-500" />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">Plano Ativo</p>
                <p className="text-xs text-gray-500">Disponível para novos assinantes</p>
              </div>
            </div>
            <button onClick={() => setForm({ ...form, active: !form.active })} className={`relative w-12 h-7 rounded-full transition-all duration-300 ${form.active ? "bg-emerald-500" : "bg-gray-700"}`}>
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${form.active ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-800/50">
            <button onClick={() => navigate("/planos")} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 hover:text-white transition">Cancelar</button>
            <button onClick={create} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 disabled:opacity-50">
              <Save size={15} /> {saving ? "Salvando..." : "Criar Plano"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
