import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Camera, Loader, ArrowLeft } from "lucide-react";

import { API } from "../config";

export default function Documents() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("return") || "/";
  const [cnhFile, setCnhFile] = useState(null);
  const [cnhPreview, setCnhPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (file) {
      setCnhFile(file);
      setCnhPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cnhFile) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("files", cnhFile);
      const res = await fetch(`${API}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar");

      const cnhUrl = data.urls?.[0];
      if (!cnhUrl) throw new Error("Não foi possível obter a URL da CNH");

      await fetch(`${API}/auth/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ cnh: cnhUrl, docStatus: "pending" }),
      });

      navigate(returnTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-emerald-600 hover:underline mb-6">
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">CNH necessária</h1>
        <p className="text-gray-500 mb-6">
          Para alugar <strong>carros ou motos</strong>, precisamos da foto da sua Carteira Nacional de Habilitação (CNH).
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto da CNH (frente e verso)</label>
            <div className="flex items-center gap-4">
              {cnhPreview ? (
                <img src={cnhPreview} className="w-24 h-24 object-cover rounded-lg border" />
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-3xl">🪪</div>
              )}
              <label className="flex-1 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3 text-center text-sm text-gray-600 transition">
                <Camera size={18} className="inline mr-1" /> Foto da CNH
                <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" required />
              </label>
            </div>
          </div>

          <button type="submit" disabled={uploading || !cnhFile} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
            {uploading ? <><Loader size={18} className="animate-spin" /> Enviando...</> : "Enviar CNH"}
          </button>
        </form>
      </div>
    </div>
  );
}
