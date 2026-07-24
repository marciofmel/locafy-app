import { useEffect, useState } from "react";
import { API } from "../config";
import { Search, Trash2, ExternalLink } from "lucide-react";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("adminToken");
  const limit = 20;

  const load = async (p = page, s = search) => {
    const params = new URLSearchParams({ page: p, limit });
    if (s) params.set("search", s);
    const r = await fetch(`${API}/admin/listings?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await r.json();
    setListings(data.listings);
    setTotal(data.total);
  };

  useEffect(() => { load(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load(1, search);
  };

  const deleteListing = async (id) => {
    if (!confirm("Excluir este anúncio?")) return;
    await fetch(`${API}/admin/listings/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Anúncios</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por título..." className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 w-60" />
          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition"><Search size={16} /></button>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                <th className="text-left p-3 w-12">Foto</th>
                <th className="text-left p-3">Título</th>
                <th className="text-left p-3">Categoria</th>
                <th className="text-left p-3">Proprietário</th>
                <th className="text-left p-3">Preço</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(l => (
                <tr key={l.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="p-3">
                    {l.images?.[0] ? <img src={l.images[0]} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-lg">📷</div>}
                  </td>
                  <td className="p-3 font-medium max-w-[200px] truncate">{l.title}</td>
                  <td className="p-3 text-gray-400">{l.category?.name}</td>
                  <td className="p-3 text-gray-400">{l.user?.name}<br /><span className="text-xs">{l.user?.email}</span></td>
                  <td className="p-3 text-emerald-400 font-medium">R$ {l.price.toFixed(2)}/{l.priceType === "daily" ? "dia" : "mês"}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${l.active ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-700 text-gray-500"}`}>{l.active ? "Ativo" : "Inativo"}</span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/anuncio/${l.id}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"><ExternalLink size={15} /></a>
                      <button onClick={() => deleteListing(l.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {listings.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-gray-500">Nenhum anúncio encontrado</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {total > limit && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg bg-gray-800 disabled:opacity-30 text-sm">Anterior</button>
          <span className="text-sm text-gray-400">Página {page} de {Math.ceil(total / limit)}</span>
          <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg bg-gray-800 disabled:opacity-30 text-sm">Próxima</button>
        </div>
      )}
    </div>
  );
}
