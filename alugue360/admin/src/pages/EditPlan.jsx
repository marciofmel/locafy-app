import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../config";
import { ArrowLeft, Save, CreditCard } from "lucide-react";

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

  if (loading) return <p className="text-gray-400 p-6">Carregando...</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/planos")} className="p-2 rounded-lg hover:bg-gray-800 transition text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2"><CreditCard size={22} className="text-emerald-400" /> Editar Plano</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nome</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Preço (R$)</label>
            <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} type="number" step="0.01" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Intervalo</label>
            <select value={form.interval} onChange={e => setForm({ ...form, interval: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500">
              <option value="month">Mensal</option>
              <option value="year">Anual</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Max Anúncios</label>
            <input value={form.maxListings} onChange={e => setForm({ ...form, maxListings: e.target.value })} type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Funcionalidades (uma por linha)</label>
          <textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="accent-emerald-500" /> Ativo
          </label>
          <div className="flex gap-2">
            <button onClick={() => navigate("/planos")} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 text-sm transition">Cancelar</button>
            <button onClick={save} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2 text-sm transition flex items-center gap-1"><Save size={15} /> Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
