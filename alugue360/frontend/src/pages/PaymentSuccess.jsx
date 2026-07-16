import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const paymentId = params.get("payment_id") || params.get("preapproval_id");
    if (paymentId) {
      console.log("Pagamento aprovado:", paymentId);
    }
    const t = setInterval(() => setCountdown((c) => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; }), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pagamento aprovado!</h1>
        <p className="text-gray-500 mb-2">Seu plano foi ativado com sucesso. Você já pode anunciar.</p>
        <p className="text-sm text-gray-400 mb-8">Redirecionando em {countdown}s</p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition">
          Ir para o Dashboard <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
