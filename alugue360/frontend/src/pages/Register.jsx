import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Camera, IdCard, Loader, Upload, CheckCircle, ArrowRight, User } from "lucide-react";
import { API } from "../config";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan");
  const [plan, setPlan] = useState(null);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    cpf: "", city: "", state: "", street: "", number: "", neighborhood: "",
  });

  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [rgFile, setRgFile] = useState(null);
  const [rgPreview, setRgPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!planId) return;
    fetch(`${API}/plans`).then(r => r.json()).then(plans => {
      const p = plans.find(pl => pl.id === planId);
      if (p) setPlan(p);
    }).catch(() => {});
  }, [planId]);

  function handleSelfie(e) {
    const file = e.target.files?.[0];
    if (file) { setSelfieFile(file); setSelfiePreview(URL.createObjectURL(file)); }
  }

  function handleRg(e) {
    const file = e.target.files?.[0];
    if (file) { setRgFile(file); setRgPreview(URL.createObjectURL(file)); }
  }

  function handleAvatar(e) {
    const file = e.target.files?.[0];
    if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
  }

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append("files", file);
    const res = await fetch(`${API}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao enviar arquivo");
    return data.urls?.[0];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setUploading(true);
    try {
      let selfieUrl = "", rgUrl = "", avatarUrl = "";
      let body = { ...form };

      if (selfieFile) selfieUrl = await uploadFile(selfieFile);
      if (rgFile) rgUrl = await uploadFile(rgFile);
      if (avatarFile) avatarUrl = await uploadFile(avatarFile);

      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          selfie: selfieUrl || undefined,
          rgDocument: rgUrl || undefined,
          avatar: avatarUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("storage"));

      if (planId) {
        setSuccess(true);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Cadastro concluído!</h2>
          <p className="text-gray-500 mt-2">Seus dados foram salvos com sucesso.</p>
          {plan && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-6">
              <p className="text-emerald-800 font-medium">Plano {plan.name}</p>
              <p className="text-emerald-600 text-sm">R$ {plan.price.toFixed(2)}/mês</p>
            </div>
          )}
          <button onClick={() => navigate(`/checkout/${planId}`)} className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2 text-lg">
            Continuar para pagamento <ArrowRight size={20} />
          </button>
          <p className="text-xs text-gray-400 mt-3">Seu cadastro já foi salvo. Se sair agora, entraremos em contato depois.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        {planId ? "Criar conta" : "Criar conta"}
      </h1>
      {plan && <p className="text-center text-gray-500 mb-6">Plano {plan.name} — R$ {plan.price.toFixed(2)}/mês</p>}

      {planId && (
        <div className="flex gap-2 mb-6">
          <button onClick={() => setStep(1)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${step === 1 ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"}`}>Dados</button>
          <button onClick={() => setStep(2)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${step === 2 ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"}`}>Endereço</button>
          <button onClick={() => setStep(3)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${step === 3 ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"}`}>Documentos</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {(!planId || step === 1) && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-8888" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} placeholder="000.000.000-00" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </>
        )}

        {planId && step === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <input placeholder="00000-000" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
              <input required value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <input required value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <input required value={form.neighborhood} onChange={e => setForm({ ...form, neighborhood: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <input required maxLength={2} placeholder="SP" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </>
        )}

        {planId && step === 3 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto de perfil</label>
              <div className="flex items-center gap-4">
                {avatarPreview ? (
                  <img src={avatarPreview} className="w-20 h-20 object-cover rounded-full border" />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><User size={24} /></div>
                )}
                <label className="flex-1 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3 text-center text-sm text-gray-600 transition">
                  <Upload size={18} className="inline mr-1" /> Escolher foto
                  <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selfie (foto do rosto)</label>
              <div className="flex items-center gap-4">
                {selfiePreview ? (
                  <img src={selfiePreview} className="w-20 h-20 object-cover rounded-lg border" />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"><Camera size={24} /></div>
                )}
                <label className="flex-1 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3 text-center text-sm text-gray-600 transition">
                  <Camera size={18} className="inline mr-1" /> Selfie
                  <input type="file" accept="image/*" capture="user" onChange={handleSelfie} className="hidden" />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Documento (RG)</label>
              <div className="flex items-center gap-4">
                {rgPreview ? (
                  <img src={rgPreview} className="w-20 h-20 object-cover rounded-lg border" />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"><IdCard size={24} /></div>
                )}
                <label className="flex-1 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3 text-center text-sm text-gray-600 transition">
                  <Camera size={18} className="inline mr-1" /> Foto do RG
                  <input type="file" accept="image/*" capture="environment" onChange={handleRg} className="hidden" />
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-400">* CNH será solicitada se for alugar veículos.</p>
          </>
        )}

        {!planId ? (
          <button type="submit" disabled={uploading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
            {uploading ? <><Loader size={18} className="animate-spin" /> Criando conta...</> : "Cadastrar"}
          </button>
        ) : (
          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition">
                Voltar
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition">
                Próximo
              </button>
            ) : (
              <button type="submit" disabled={uploading} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {uploading ? <><Loader size={18} className="animate-spin" /> Salvando...</> : "Finalizar cadastro"}
              </button>
            )}
          </div>
        )}

        <p className="text-center text-sm text-gray-500">Já tem conta? <Link to="/login" className="text-emerald-600 hover:underline">Entrar</Link></p>
      </form>
    </div>
  );
}
