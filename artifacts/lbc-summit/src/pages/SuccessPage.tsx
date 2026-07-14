import { useEffect, useState } from "react";
import { CheckCircle2, Calendar, MapPin, Download, Loader2, AlertCircle } from "lucide-react";
import summitLogo from "@assets/LBC_Summit_pic_1781402272251.png";

interface RegistrationData {
  registrationId: string;
  ticketNumber: string;
  ticketType: string;
  amountPaid: number;
  firstName: string;
  lastName: string;
  email: string;
  qrCode: string;
}

function addToCalendar() {
  const start = "20260815T100000";
  const end = "20260816T180000";
  const title = "LBC Wealth & Development Summit 2026";
  const location = "Hotel Current, 5325 CA-1, Long Beach, CA 90804";
  const details = "Two-day transformational summit presented by Redefined Mindset.";
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(details)}`;
  window.open(url, "_blank");
}

export default function SuccessPage() {
  const [data, setData] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setError("No session ID found. If you completed payment, please contact support.");
      setLoading(false);
      return;
    }

    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((d: Partial<RegistrationData> & { error?: string }) => {
        if (d.error) throw new Error(d.error);
const purchaseData = d as RegistrationData;
setData(purchaseData);

(window as any).dataLayer = (window as any).dataLayer || [];
(window as any).dataLayer.push({
  event: "purchase",
  ecommerce: {
    transaction_id: sessionId,
    value: purchaseData.amountPaid / 100,
    currency: "USD",
    items: [
      {
        item_id: purchaseData.ticketType,
        item_name: purchaseData.ticketType,
        price: purchaseData.amountPaid / 100,
        quantity: 1,
      },
    ],
  },
});
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="text-[#c79d35] animate-spin mx-auto mb-4" />
          <p className="text-white font-semibold text-lg">Confirming your registration...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait, this only takes a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
        <div className="bg-red-900/20 border border-red-500/40 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
          <p className="text-white font-bold text-xl mb-2">Something went wrong</p>
          <p className="text-red-300 text-sm mb-6">{error}</p>
          <p className="text-gray-400 text-xs">
            If you were charged, please email us with your Stripe receipt and we'll manually confirm your registration.
          </p>
          <a href="/" className="mt-4 inline-block text-[#c79d35] hover:underline text-sm">Return to main site</a>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const formatAmount = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <header className="bg-[#0f1729]/95 border-b border-white/10 py-4 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <img src={summitLogo} alt="LBC Summit" className="h-10 w-10 object-contain" />
          <div>
            <p className="text-white font-bold text-sm" style={{ fontFamily: "var(--app-font-heading)" }}>LBC Wealth & Development Summit</p>
            <p className="text-[#c79d35] text-xs">Presented by Redefined Mindset</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Success banner */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-green-900/30 border-2 border-green-500 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--app-font-heading)" }}>
            Congratulations, {data.firstName}!
          </h1>
          <p className="text-gray-300 text-lg">
            Your registration for the LBC Wealth & Development Summit 2026 has been successfully completed.
          </p>
        </div>

        {/* Registration card */}
        <div className="bg-[#0f1729] border border-[#c79d35]/30 rounded-2xl overflow-hidden mb-6">
          <div className="bg-[#c79d35] px-6 py-4">
            <p className="text-[#0a0f1e] font-extrabold text-lg" style={{ fontFamily: "var(--app-font-heading)" }}>
              Registration Confirmed
            </p>
          </div>

          <div className="p-6 space-y-4">
            <Row label="Attendee" value={`${data.firstName} ${data.lastName}`} />
            <Row label="Email" value={data.email} />
            <div className="border-t border-white/10 my-2" />
            <Row label="Registration ID" value={data.registrationId} mono />
            <Row label="Ticket Number" value={data.ticketNumber} mono />
            <Row label="Ticket Type" value={data.ticketType} />
            <Row label="Amount Paid" value={formatAmount(data.amountPaid)} />
            <div className="border-t border-white/10 my-2" />
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar size={14} className="text-[#c79d35]" />
              August 15–16, 2026
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <MapPin size={14} className="text-[#c79d35]" />
              Hotel Current · 5325 CA-1, Long Beach, CA 90804
            </div>
          </div>

          {/* QR Code */}
          {data.qrCode && (
            <div className="border-t border-white/10 p-6 flex flex-col items-center">
              <p className="text-gray-400 text-sm mb-3">Your check-in QR code</p>
              <img src={data.qrCode} alt="Check-in QR Code" className="w-40 h-40 rounded-xl bg-white p-2" />
              <p className="text-gray-500 text-xs mt-2">Present this at event check-in</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <button
            onClick={addToCalendar}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            <Calendar size={16} /> Add to Calendar
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-[#1a56db] hover:bg-[#1e3a8a] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            <Download size={16} /> Download / Print Receipt
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <p className="text-gray-300 text-sm mb-1">
            A confirmation has been sent to <strong className="text-white">{data.email}</strong>.
          </p>
          <p className="text-gray-500 text-xs">
            Questions? Contact us at the event or reply to your confirmation email.
          </p>
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-[#c79d35] hover:text-white text-sm transition-colors hover:underline">
            ← Return to main site
          </a>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-gray-400 text-sm flex-shrink-0">{label}</span>
      <span className={`text-sm text-right ${mono ? "text-[#c79d35] font-mono font-bold" : "text-white font-semibold"}`}>
        {value}
      </span>
    </div>
  );
}
