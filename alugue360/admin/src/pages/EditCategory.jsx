import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../config";
import ImageUpload from "../components/ImageUpload";
import { ArrowLeft, Save, Tags } from "lucide-react";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const [form, setForm] = useState({ name: "", slug: "", image: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(cats => {
        const c = cats.find(x => x.id === id);
        if (c) setForm({ name: c.name, slug: c.slug, image: c.image || "" });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const save = async () => {
    if (!form.name || !form.slug) return;
    await fetch(`${API}/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    navigate("/categorias");
  };

  if (loading) return <p className="text-gray-400 p-6">Carregando...</p>;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/categorias")} className="p-2 rounded-lg hover:bg-gray-800 transition text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Tags size={22} className="text-emerald-400" /> Editar Categoria</h1>
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
        <ImageUpload value={form.image} onChange={url => setForm({ ...form, image: url })} label="Imagem da Categoria" />
        <div className="flex justify-end gap-2">
          <button onClick={() => navigate("/categorias")} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 text-sm transition">Cancelar</button>
          <button onClick={save} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2 text-sm transition flex items-center gap-1"><Save size={15} /> Salvar</button>
        </div>
      </div>
    </div>
  );
}
