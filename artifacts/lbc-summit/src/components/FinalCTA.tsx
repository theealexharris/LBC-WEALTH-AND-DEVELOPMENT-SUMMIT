import { Calendar, MapPin } from "lucide-react";

interface FinalCTAProps {
  onOpenModal: (type: "general" | "vip") => void;
}

export default function FinalCTA({ onOpenModal }: FinalCTAProps) {
  return (
    <section className="relative bg-[#0a0f1e] py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 60%, rgba(26,86,219,0.2) 0%, transparent 55%), radial-gradient(ellipse at 75% 30%, rgba(199,157,53,0.12) 0%, transparent 50%)",
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="w-20 h-0.5 bg-[#c79d35] mx-auto mb-8" />

        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-8"
          style={{ fontFamily: "var(--app-font-heading)" }}
        >
          The Future You Want Will Require a Decision From the Person You Are Today.
        </h2>

        <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Two days can introduce a new way of thinking, stronger relationships
          and a practical plan for what comes next. Reserve your place at the
          LBC Wealth and Development Summit and begin building with greater
          clarity, confidence and purpose.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => onOpenModal("general")}
            className="bg-[#1a56db] hover:bg-[#1e3a8a] text-white font-bold text-lg px-10 py-4 rounded-xl transition-all shadow-lg shadow-blue-900/40"
            data-testid="button-finalcta-general"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Reserve General Admission
          </button>
          <button
            onClick={() => onOpenModal("vip")}
            className="bg-[#c79d35] hover:bg-[#b8891e] text-[#0a0f1e] font-bold text-lg px-10 py-4 rounded-xl transition-all"
            data-testid="button-finalcta-vip"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Upgrade to VIP
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-gray-400 text-sm">
          <span className="flex items-center gap-2">
            <Calendar size={16} className="text-[#c79d35]" />
            Event Date: To Be Confirmed — 2026
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-[#c79d35]" />
            Long Beach, California
          </span>
        </div>

        <p className="text-gray-600 text-xs mt-6">
          Presented by Redefined Mindset &nbsp;·&nbsp; info@redefinedmindset.com
        </p>
      </div>
    </section>
  );
}
