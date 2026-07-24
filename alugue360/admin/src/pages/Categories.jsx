import { useEffect, useState } from "react";
import { API } from "../config";
import { Plus, Edit3, Trash2, Check, X, Tags } from "lucide-react";

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", icon: "" });
  const token = localStorage.getItem("adminToken");

  const load = async () => {
    const r = await fetch(`${API}/categories`);
    setCats(await r.json());
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name || !form.slug) return;
    await fetch(`${API}/admin/categories`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    setForm({ name: "", slug: "", icon: "" });
    load();
  };

  const update = async (id) => {
    await fetch(`${API}/admin/categories/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    setEditingId(null);
    setForm({ name: "", slug: "", icon: "" });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Excluir categoria?")) return;
    await fetch(`${API}/admin/categories/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", slug: "", icon: "" });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categorias</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2"><Plus size={16} /> {editingId ? "Editar" : "Nova"} Categoria</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nome</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Slug</label>
            <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Ícone (opcional)</label>
            <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" placeholder="lucide-icon-name" />
          </div>
          {editingId ? (
            <div className="flex gap-2">
              <button onClick={() => update(editingId)} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2 text-sm transition flex items-center gap-1"><Check size={15} /> Salvar</button>
              <button onClick={cancelEdit} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 text-sm transition flex items-center gap-1"><X size={15} /> Cancelar</button>
            </div>
          ) : (
            <button onClick={create} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2 text-sm transition flex items-center gap-1"><Plus size={15} /> Criar</button>
          )}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Ícone</th>
              <th className="text-right p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(cat => (
              <tr key={cat.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                <td className="p-3 font-medium flex items-center gap-2"><Tags size={14} className="text-gray-400" /> {cat.name}</td>
                <td className="p-3 text-gray-400">/{cat.slug}</td>
                <td className="p-3 text-gray-400">{cat.icon || "—"}</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"><Edit3 size={15} /></button>
                    <button onClick={() => remove(cat.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
