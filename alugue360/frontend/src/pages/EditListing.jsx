import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, X, Send, Upload, FileVideo, Loader } from "lucide-react";

import { API } from "../config";

export default function EditListing() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "", categoryId: "", price: "", priceType: "daily",
    description: "", whatsapp: "", street: "", number: "", neighborhood: "", city: "", state: "",
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!token) return navigate("/login");
    Promise.all([
      fetch(`${API}/categories`).then(r => r.json()),
      fetch(`${API}/listings/${id}`).then(r => r.json()),
    ]).then(([cats, listing]) => {
      setCategories(cats);
      setForm({
        title: listing.title,
        categoryId: listing.categoryId,
        price: listing.price.toString(),
        priceType: listing.priceType,
        description: listing.description,
        whatsapp: listing.whatsapp || "",
        city: listing.city || "",
        state: listing.state || "",
        street: listing.street || "",
        number: listing.number || "",
        neighborhood: listing.neighborhood || "",
      });
      setImages(listing.images || []);
      setVideos(listing.videos || []);
      setFeatures(listing.features || []);
    }).catch(() => navigate("/dashboard")).finally(() => setLoading(false));
  }, [id, token]);

  async function uploadFiles(files, type) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      for (const f of files) formData.append("files", f);
      const res = await fetch(`${API}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar");
      if (type === "image") setImages(prev => [...prev, ...data.urls]);
      else setVideos(prev => [...prev, ...data.urls]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          images,
          videos,
          features,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  function addFeature() {
    const f = featureInput.trim();
    if (f && !features.includes(f)) setFeatures([...features, f]);
    setFeatureInput("");
  }

  if (loading) return <div className="flex justify-center py-20"><Loader className="animate-spin text-emerald-600" size={32} /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Anúncio</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {uploading && <p className="text-emerald-600 text-sm flex items-center gap-2"><Loader size={16} className="animate-spin" /> Enviando arquivos...</p>}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select required value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
              <option value="">Selecione</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
            <input type="number" step="0.01" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select value={form.priceType} onChange={e => setForm({ ...form, priceType: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
              <option value="daily">Por dia</option>
              <option value="monthly">Por mês</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea rows={4} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fotos</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((url, i) => (
              <div key={i} className="relative w-24 h-24">
                <img src={url} className="w-full h-full object-cover rounded-lg border" />
                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={14} /></button>
              </div>
            ))}
            <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 text-gray-400 hover:text-emerald-600">
              <Upload size={20} />
              <span className="text-xs mt-1">Add foto</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={e => { if (e.target.files?.length) uploadFiles(e.target.files, "image"); e.target.value = ""; }} />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vídeos</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {videos.map((url, i) => (
              <div key={i} className="relative w-32 h-24">
                <video src={url} className="w-full h-full object-cover rounded-lg border" controls />
                <button type="button" onClick={() => setVideos(videos.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={14} /></button>
              </div>
            ))}
            <label className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 text-gray-400 hover:text-emerald-600">
              <FileVideo size={20} />
              <span className="text-xs mt-1">Add vídeo</span>
              <input type="file" accept="video/*" multiple className="hidden" onChange={e => { if (e.target.files?.length) uploadFiles(e.target.files, "video"); e.target.value = ""; }} />
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input type="tel" required value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="(11) 99999-8888" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <input type="text" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} maxLength={2} placeholder="SP" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
            <input type="text" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
            <input type="text" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
            <input type="text" value={form.neighborhood} onChange={e => setForm({ ...form, neighborhood: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Itens inclusos</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {features.map((f, i) => (
              <span key={i} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                {f} <button type="button" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="hover:text-red-600"><X size={14} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())} placeholder="Ex: Wi-Fi, Piscina, Ar condicionado" className="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
            <button type="button" onClick={addFeature} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"><Plus size={20} /></button>
          </div>
        </div>

        <button type="submit" disabled={uploading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition text-lg disabled:opacity-50">
          <Send size={20} /> Salvar Alterações
        </button>
      </form>
    </div>
  );
}
