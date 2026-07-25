import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../config";
import { ArrowLeft, Save, CreditCard, Tag, DollarSign, Calendar, Hash, CheckCircle2, XCircle, ListChecks, Sparkles } from "lucide-react";

export default function EditPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const [form, setForm] = useState({ name: "", price: "", interval: "month", maxListings: 2, features: "", active: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/plans`)
      .then(r => r.json())
      .then(plans => {
        const p = plans.find(x => x.id === id);
        if (p) {
          setForm({ name: p.name, price: String(p.price), interval: p.interval, maxListings: p.maxListings, features: p.features.join("\n"), active: p.active });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const save = async () => {
    if (!form.name || !form.price) return;
    await fetch(`${API}/admin/plans/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, price: Number(form.price), features: form.features.split("\n").filter(Boolean), maxListings: Number(form.maxListings) })
    });
    navigate("/planos");
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/planos")} className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 transition text-gray-400 hover:text-white">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CreditCard size={20} className="text-white" />
            </span>
            Editar Plano
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[52px]">Altere as informações do plano</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Card Header */}
        <div className="px-8 py-5 border-b border-gray-800/50 bg-gradient-to-r from-gray-900 to-gray-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">Informações do Plano</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${form.active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-gray-800 text-gray-500 border border-gray-700"}`}>
              {form.active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              {form.active ? "Ativo" : "Inativo"}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-8 space-y-7">
          {/* Grid Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5"><Tag size={12} /> Nome do Plano</label>
              <div className="relative">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Profissional" className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 pl-4 text-sm text-white outline-none focus:border-emerald-500/50 focus:bg-gray-800 transition placeholder:text-gray-600" />
              </div>
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

          {/* Features */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5"><ListChecks size={12} /> Funcionalidades</label>
            <div className="relative">
              <textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} rows={5} placeholder="Uma funcionalidade por linha&#10;Ex:&#10;2 anúncios inclusos&#10;Fotos ilimitadas&#10;WhatsApp direto" className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 focus:bg-gray-800 transition placeholder:text-gray-600 resize-none" />
              <div className="absolute right-3 bottom-3 text-[10px] text-gray-600 bg-gray-800/80 px-2 py-0.5 rounded-md">
                {form.features.split("\n").filter(Boolean).length} itens
              </div>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/30 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.active ? "bg-emerald-500/10" : "bg-gray-800"}`}>
                {form.active ? <Sparkles size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-gray-500" />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">Plano Ativo</p>
                <p className="text-xs text-gray-500">{form.active ? "Disponível para novos assinantes" : "Oculto da página de planos"}</p>
              </div>
            </div>
            <button
              onClick={() => setForm({ ...form, active: !form.active })}
              className={`relative w-12 h-7 rounded-full transition-all duration-300 ${form.active ? "bg-emerald-500" : "bg-gray-700"}`}
            >
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${form.active ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-800/50">
            <button onClick={() => navigate("/planos")} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 hover:text-white transition">
              Cancelar
            </button>
            <button onClick={save} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/20 transition flex items-center gap-2">
              <Save size={15} /> Salvar Alterações
            </button>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="mt-6 bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Sparkles size={14} /> Preview do Plano</h3>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50 max-w-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-bold text-white">{form.name || "Nome do Plano"}</p>
              <p className="text-3xl font-bold text-white mt-2">
                R$ {form.price || "0.00"}
                <span className="text-sm font-normal text-gray-500">/{form.interval === "year" ? "ano" : "mês"}</span>
              </p>
            </div>
            {form.active && <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">Ativo</span>}
          </div>
          <p className="text-xs text-gray-500 mt-4">Até {form.maxListings} anúncios</p>
          {form.features.split("\n").filter(Boolean).length > 0 && (
            <ul className="mt-4 space-y-2">
              {form.features.split("\n").filter(Boolean).map((f, i) => (
                <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
