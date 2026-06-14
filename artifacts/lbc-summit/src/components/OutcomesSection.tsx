import { CheckCircle2 } from "lucide-react";

interface OutcomesSectionProps {
  onOpenModal: (type: "general" | "vip") => void;
}

const outcomes = [
  "A renewed personal vision and sense of direction",
  "Greater confidence and clarity about your next steps",
  "A clearer understanding of your financial habits and patterns",
  "Practical wealth-development principles you can apply immediately",
  "A stronger leadership identity and communication framework",
  "New professional and community relationships and accountability partners",
  "A written 30-, 60-, and 90-day implementation plan",
  "Tools and frameworks for continued personal and financial development",
  "A commitment to purposeful, consistent action beyond the event",
  "The mindset and identity shift needed to sustain long-term growth",
];

export default function OutcomesSection({ onOpenModal }: OutcomesSectionProps) {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#1a56db] text-sm font-semibold tracking-widest uppercase mb-3">
            What You Take Home
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-[#0f1729] mb-4"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Leave With More Than Inspiration. Leave With a Plan.
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Every section of the summit is designed to produce something you can
            use — not just something you can feel.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="grid sm:grid-cols-2 gap-4">
            {outcomes.map((outcome, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <CheckCircle2 size={18} className="text-[#1a56db] flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-sm leading-relaxed">{outcome}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-[#0f1729] rounded-3xl p-10">
              <p className="text-[#c79d35] text-xs font-bold uppercase tracking-widest mb-4">
                Sample Attendee Action Plan
              </p>
              <div className="space-y-4">
                {[
                  { label: "30-Day Priority", value: "Define financial baseline & set savings target" },
                  { label: "60-Day Priority", value: "Launch or formalize business concept" },
                  { label: "90-Day Priority", value: "Establish wealth-building habit & accountability partner" },
                ].map(({ label, value }) => (
                  <div key={label} className="border border-white/10 rounded-xl p-4">
                    <p className="text-[#c79d35] text-xs font-bold mb-1">{label}</p>
                    <p className="text-white text-sm">{value}</p>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-4">
                  <p className="text-gray-400 text-xs italic text-center">
                    Your personal implementation plan will be developed during the summit.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => onOpenModal("general")}
                className="bg-[#1a56db] hover:bg-[#1e3a8a] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg"
                data-testid="button-outcomes-reserve"
                style={{ fontFamily: "var(--app-font-heading)" }}
              >
                Build My Plan at the Summit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
