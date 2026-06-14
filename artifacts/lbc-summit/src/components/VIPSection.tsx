import { CheckCircle2, Star } from "lucide-react";

interface VIPSectionProps {
  onOpenModal: (type: "general" | "vip") => void;
}

const vipBenefits = [
  "Admission to both full summit days",
  "Access to both one-hour private VIP sessions",
  "Preferred seating in the main room",
  "Early venue access and priority check-in",
  "Exclusive VIP credential and lanyard",
  "Private keynote debrief sessions",
  "Extended speaker Q&A access",
  "Guided implementation workbook",
  "VIP-only networking experience",
  "Professional group photograph",
  "Exclusive summit gift",
  "Dedicated VIP concierge during the event",
];

const gaInclusions = [
  "Both summit days (General Session)",
  "All seven speaker sessions",
  "Workshops, panels & guided exercises",
  "General networking access",
  "Digital or printed summit workbook",
];

const vipInclusions = [
  "Everything in General Admission",
  "Two private one-hour VIP sessions",
  "Preferred seating & priority check-in",
  "Enhanced speaker access & Q&A",
  "VIP networking & exclusive reception",
  "Premium summit materials",
  "Exclusive gift or VIP experience",
];

export default function VIPSection({ onOpenModal }: VIPSectionProps) {
  return (
    <section id="vip" className="bg-[#0a0f1e] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#c79d35]/20 border border-[#c79d35]/40 rounded-full px-5 py-1.5 mb-6">
            <Star size={14} className="text-[#c79d35]" />
            <span className="text-[#c79d35] text-sm font-semibold">VIP Experience</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Go Beyond the Main Stage With the VIP Experience.
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            VIP admission is designed for attendees seeking deeper access,
            stronger connections, and additional implementation support beyond
            the main summit.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <p className="text-[#c79d35] text-sm font-bold uppercase tracking-widest mb-6">
              VIP Benefits Include
            </p>
            <div className="space-y-3">
              {vipBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#c79d35] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">{benefit}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-6 italic">
              * VIP benefits are subject to confirmation prior to event launch.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-white/10 rounded-2xl p-8">
              <h3
                className="text-lg font-extrabold text-white mb-5"
                style={{ fontFamily: "var(--app-font-heading)" }}
              >
                General Admission
              </h3>
              <ul className="space-y-3">
                {gaInclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onOpenModal("general")}
                className="mt-6 w-full border border-white/20 text-white hover:border-white/50 hover:bg-white/5 font-semibold py-3 rounded-xl transition-all text-sm"
                data-testid="button-vip-ga"
              >
                Reserve General Admission
              </button>
            </div>

            <div className="border-2 border-[#c79d35] rounded-2xl p-8 bg-[#c79d35]/5 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#c79d35] text-[#0a0f1e] text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-wider">
                  Recommended
                </span>
              </div>
              <h3
                className="text-lg font-extrabold text-[#c79d35] mb-5"
                style={{ fontFamily: "var(--app-font-heading)" }}
              >
                VIP Admission
              </h3>
              <ul className="space-y-3">
                {vipInclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-[#c79d35] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onOpenModal("vip")}
                className="mt-6 w-full bg-[#c79d35] hover:bg-[#b8891e] text-[#0a0f1e] font-bold py-3 rounded-xl transition-all"
                data-testid="button-vip-upgrade"
                style={{ fontFamily: "var(--app-font-heading)" }}
              >
                Upgrade to VIP
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
