interface TransformationSectionProps {
  onOpenModal: (type: "general" | "vip") => void;
}

const challenges = [
  "Feeling stuck despite working hard every day",
  "Carrying outdated beliefs that no longer serve your future",
  "Lacking a clear financial direction or wealth-building strategy",
  "Struggling to turn great ideas into consistent action",
  "Rebuilding your life, career, or confidence after adversity",
  "Wanting to lead — but lacking a clear plan or structure",
  "Earning income without developing long-term, generational wealth",
  "Having vision and drive, but missing the framework and accountability",
];

export default function TransformationSection({ onOpenModal }: TransformationSectionProps) {
  return (
    <section id="about" className="bg-[#0f1729] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#c79d35] text-sm font-semibold tracking-widest uppercase mb-4">
              The Reality We Address
            </p>
            <h2
              className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-8"
              style={{ fontFamily: "var(--app-font-heading)" }}
            >
              You Were Not Created to Remain in Survival Mode.
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Too many talented, capable people remain stuck — not because they
              lack potential, but because no one gave them the tools, the
              framework, or the community to move forward with clarity and
              confidence.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-10">
              The LBC Wealth and Development Summit exists to change that. We
              will help you replace confusion with clarity, hesitation with
              intentional action, and short-term survival thinking with a
              lasting strategy for personal and financial growth.
            </p>
            <button
              onClick={() => onOpenModal("general")}
              className="bg-[#1a56db] hover:bg-[#1e3a8a] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-900/40"
              data-testid="button-transformation-reserve"
              style={{ fontFamily: "var(--app-font-heading)" }}
            >
              Reserve Your Seat
            </button>
          </div>

          <div>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-6">
              Do any of these sound familiar?
            </p>
            <div className="space-y-3">
              {challenges.map((challenge, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-[#1a56db]/40 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-[#c79d35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#c79d35]" />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{challenge}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
