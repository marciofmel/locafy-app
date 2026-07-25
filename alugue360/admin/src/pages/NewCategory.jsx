import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";
import { ArrowLeft, Save, Tags } from "lucide-react";

export default function NewCategory() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const [form, setForm] = useState({ name: "", slug: "", icon: "", image: "" });

  const create = async () => {
    if (!form.name || !form.slug) return;
    await fetch(`${API}/admin/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    navigate("/categorias");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/categorias")} className="p-2 rounded-lg hover:bg-gray-800 transition text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Tags size={22} className="text-emerald-400" /> Nova Categoria</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Nome</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Slug</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Ícone (opcional)</label>
          <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" placeholder="lucide-icon-name" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">URL da Imagem (opcional)</label>
          <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" placeholder="https://..." />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => navigate("/categorias")} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 text-sm transition">Cancelar</button>
          <button onClick={create} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2 text-sm transition flex items-center gap-1"><Save size={15} /> Salvar</button>
        </div>
      </div>
    </div>
  );
}
