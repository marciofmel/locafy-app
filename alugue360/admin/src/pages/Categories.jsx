import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";
import { Plus, Edit3, Trash2, Tags } from "lucide-react";

export default function Categories() {
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const token = localStorage.getItem("adminToken");

  const load = async () => {
    const r = await fetch(`${API}/categories`);
    setCats(await r.json());
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Excluir categoria?")) return;
    await fetch(`${API}/admin/categories/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <button onClick={() => navigate("/categorias/nova")} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2 text-sm transition flex items-center gap-1.5">
          <Plus size={16} /> Criar nova
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
              <th className="text-left p-3">Imagem</th>
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Ícone</th>
              <th className="text-right p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(cat => (
              <tr key={cat.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                <td className="p-3">
                  {cat.image ? <img src={cat.image} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center"><Tags size={14} className="text-gray-500" /></div>}
                </td>
                <td className="p-3 font-medium">{cat.name}</td>
                <td className="p-3 text-gray-400">/{cat.slug}</td>
                <td className="p-3 text-gray-400">{cat.icon || "—"}</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => navigate(`/categorias/editar/${cat.id}`)} className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"><Edit3 size={15} /></button>
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
