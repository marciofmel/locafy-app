import { useEffect, useState } from "react";
import { API } from "../config";
import { Search, Trash2, Shield, Ban } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("adminToken");
  const limit = 20;

  const load = async (p = page, s = search) => {
    const params = new URLSearchParams({ page: p, limit });
    if (s) params.set("search", s);
    const r = await fetch(`${API}/admin/users?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await r.json();
    setUsers(data.users);
    setTotal(data.total);
  };

  useEffect(() => { load(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load(1, search);
  };

  const updateUser = async (id, body) => {
    await fetch(`${API}/admin/users/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
    load();
  };

  const deleteUser = async (id) => {
    if (!confirm("Tem certeza?")) return;
    await fetch(`${API}/admin/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou email..." className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 w-60" />
          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition"><Search size={16} /></button>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                <th className="text-left p-3">Nome</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Documentos</th>
                <th className="text-left p-3">Anúncios</th>
                <th className="text-left p-3">Criado em</th>
                <th className="text-right p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3 text-gray-400">{u.email}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${u.role === "admin" ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-700 text-gray-300"}`}>{u.role}</span>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${u.docStatus === "verified" ? "bg-emerald-500/20 text-emerald-400" : u.docStatus === "pending" ? "bg-amber-500/20 text-amber-400" : "bg-gray-700 text-gray-500"}`}>{u.docStatus}</span>
                  </td>
                  <td className="p-3 text-gray-400">{u._count?.listings || 0}</td>
                  <td className="p-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {u.role !== "admin" && (
                        <>
                          <button onClick={() => updateUser(u.id, { role: "admin" })} title="Tornar admin" className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition"><Shield size={15} /></button>
                          <button onClick={() => deleteUser(u.id)} title="Excluir" className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"><Trash2 size={15} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-gray-500">Nenhum usuário encontrado</td></tr>}
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
