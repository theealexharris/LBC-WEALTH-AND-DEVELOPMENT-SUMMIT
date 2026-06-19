import { useState, useEffect } from "react";
import { X, Tag, Copy, Check } from "lucide-react";

const PROMO_CODE = "Y5IiGdUD";
const EXPIRY = "July 1, 2026";
const SESSION_KEY = "lbc_early_bird_dismissed";

export default function EarlyBirdPopup() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
  }

  function copyCode() {
    navigator.clipboard.writeText(PROMO_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={dismiss}
    >
      <div
        className="bg-white rounded-2xl border-2 border-[#1a56db] shadow-2xl max-w-md w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Icon + heading */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-[#1a56db]/10 flex items-center justify-center flex-shrink-0">
            <Tag size={20} className="text-[#1a56db]" />
          </div>
          <div>
            <p className="text-[#1a56db] text-xs font-bold uppercase tracking-widest">Limited Time Offer</p>
            <h2
              className="text-xl font-extrabold text-[#0f1729] leading-tight"
              style={{ fontFamily: "var(--app-font-heading)" }}
            >
              Early Bird Discount
            </h2>
          </div>
        </div>

        {/* Offer details */}
        <div className="bg-[#1a56db]/5 border border-[#1a56db]/20 rounded-xl px-5 py-4 mb-5 text-center">
          <p className="text-4xl font-extrabold text-[#1a56db] mb-1" style={{ fontFamily: "var(--app-font-heading)" }}>
            25% OFF
          </p>
          <p className="text-gray-600 text-sm">your summit ticket — all ticket types</p>
          <p className="text-red-500 text-xs font-semibold mt-2 uppercase tracking-wide">
            Offer expires {EXPIRY}
          </p>
        </div>

        {/* Promo code */}
        <p className="text-gray-500 text-sm mb-2 text-center">
          Use this code at checkout on the Stripe payment page:
        </p>
        <div className="flex items-center gap-2 bg-gray-50 border-2 border-dashed border-[#1a56db]/40 rounded-xl px-4 py-3 mb-5">
          <span
            className="flex-1 text-center text-lg font-extrabold text-[#0f1729] tracking-widest"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            {PROMO_CODE}
          </span>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 bg-[#1a56db] hover:bg-[#1e3a8a] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
          >
            {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
          </button>
        </div>

        {/* CTA */}
        <a
          href="/register"
          onClick={dismiss}
          className="block w-full bg-[#1a56db] hover:bg-[#1e3a8a] text-white text-center font-bold py-3.5 rounded-xl transition-colors"
          style={{ fontFamily: "var(--app-font-heading)" }}
        >
          Reserve My Seat — Save 25%
        </a>
        <p className="text-center text-gray-400 text-xs mt-3">
          Code applied at checkout. One use per attendee.
        </p>
      </div>
    </div>
  );
}
