import { useState, useRef } from "react";
import { API } from "../config";
import { Upload, X, Loader2 } from "lucide-react";

export default function ImageUpload({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("files", file);
      const r = await fetch(`${API}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        body: fd,
      });
      const data = await r.json();
      if (data.urls?.[0]) onChange(data.urls[0]);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label || "Imagem"}</label>
      {value ? (
        <div className="relative inline-block">
          <img src={value} className="w-32 h-32 rounded-xl object-cover border border-gray-700" />
          <button onClick={() => onChange("")} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition">
            <X size={12} className="text-white" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-700 hover:border-emerald-500 bg-gray-800/50 flex flex-col items-center justify-center gap-1.5 transition disabled:opacity-50"
        >
          {uploading ? <Loader2 size={20} className="animate-spin text-emerald-400" /> : <Upload size={20} className="text-gray-500" />}
          <span className="text-[10px] text-gray-500">{uploading ? "Enviando..." : "Clique p/ upload"}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
