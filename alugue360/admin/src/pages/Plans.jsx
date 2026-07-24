import { useEffect, useState } from "react";
import { API } from "../config";
import { Plus, Edit3, Trash2, Check, X, CreditCard } from "lucide-react";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", interval: "month", maxListings: 2, features: "", active: true });
  const token = localStorage.getItem("adminToken");

  const load = async () => {
    const r = await fetch(`${API}/plans`);
    setPlans(await r.json());
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name || !form.price) return;
    await fetch(`${API}/admin/plans`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...form, price: Number(form.price), features: form.features.split("\n").filter(Boolean), maxListings: Number(form.maxListings) }) });
    setForm({ name: "", price: "", interval: "month", maxListings: 2, features: "", active: true });
    load();
  };

  const update = async (id) => {
    await fetch(`${API}/admin/plans/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...form, price: Number(form.price), features: form.features.split("\n").filter(Boolean), maxListings: Number(form.maxListings) }) });
    setEditingId(null);
    setForm({ name: "", price: "", interval: "month", maxListings: 2, features: "", active: true });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Excluir plano?")) return;
    await fetch(`${API}/admin/plans/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price), interval: p.interval, maxListings: p.maxListings, features: p.features.join("\n"), active: p.active });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", price: "", interval: "month", maxListings: 2, features: "", active: true });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Planos</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2"><Plus size={16} /> {editingId ? "Editar" : "Novo"} Plano</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
        <div className="mt-3">
          <label className="text-xs text-gray-500 mb-1 block">Funcionalidades (uma por linha)</label>
          <textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
        </div>
        <div className="flex items-center gap-3 mt-3">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="accent-emerald-500" /> Ativo
          </label>
          {editingId ? (
            <div className="flex gap-2 ml-auto">
              <button onClick={() => update(editingId)} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2 text-sm transition flex items-center gap-1"><Check size={15} /> Salvar</button>
              <button onClick={cancelEdit} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 text-sm transition flex items-center gap-1"><X size={15} /> Cancelar</button>
            </div>
          ) : (
            <button onClick={create} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2 text-sm transition flex items-center gap-1 ml-auto"><Plus size={15} /> Criar</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.id} className={`bg-gray-900 border rounded-xl p-5 ${p.active ? "border-gray-800" : "border-gray-800/50 opacity-60"}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><CreditCard size={16} className="text-emerald-400" /> {p.name}</h3>
                <p className="text-2xl font-bold mt-1">R$ {p.price.toFixed(2)} <span className="text-sm font-normal text-gray-500">/{p.interval === "year" ? "ano" : "mês"}</span></p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"><Edit3 size={15} /></button>
                <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"><Trash2 size={15} /></button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Até {p.maxListings} anúncios</p>
            {p.features?.length > 0 && (
              <ul className="mt-3 space-y-1">
                {p.features.map((f, i) => <li key={i} className="text-xs text-gray-400 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-400" />{f}</li>)}
              </ul>
            )}
            {!p.active && <span className="text-xs text-gray-500 mt-2 block">Inativo</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
