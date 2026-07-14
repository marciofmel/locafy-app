import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";

import { API, imgUrl } from "../config";

export default function Favorites() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/favorites`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setListings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function unlike(id) {
    const token = localStorage.getItem("token");
    await fetch(`${API}/favorites/${id}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    setListings(listings.filter(l => l.id !== id));
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Carregando...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Heart className="text-red-500" size={24} /> Meus Favoritos
      </h1>

      {listings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Heart size={48} className="mx-auto mb-4 opacity-30" />
          <p>Nenhum favorito ainda</p>
          <Link to="/" className="text-emerald-600 hover:underline mt-2 inline-block">Ver anúncios</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {listings.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow overflow-hidden border">
              {item.images?.[0] && (
                <img src={imgUrl(item.images[0])} alt={item.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <Link to={`/anuncio/${item.id}`} className="font-semibold text-gray-800 hover:text-emerald-600">{item.title}</Link>
                <p className="text-sm text-gray-500 mt-1">{item.category?.name}</p>
                <p className="text-emerald-600 font-bold mt-2">R$ {item.price}/dia</p>
                <button onClick={() => unlike(item.id)} className="mt-3 text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                  <Heart size={16} fill="currentColor" /> Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
