import { Link } from "react-router-dom";
import { XCircle, RotateCcw, ArrowRight } from "lucide-react";

export default function PaymentCancel() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <XCircle size={48} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pagamento cancelado</h1>
        <p className="text-gray-500 mb-8">O pagamento foi cancelado ou não foi concluído. Seu plano não foi ativado.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/planos" className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition">
            <RotateCcw size={18} /> Tentar novamente
          </Link>
          <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
            Dashboard <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
