import { CheckCircle2 } from "lucide-react";

interface ExperienceSectionProps {
  onOpenModal: (type: "general" | "vip") => void;
}

const day1Highlights = [
  "6 hours of general programming",
  "Opening keynote (60 minutes)",
  "Three featured speaker sessions",
  "Moderated leadership & wealth-building panel",
  "Audience reflection & guided exercises",
  "Networking throughout the day",
  "1-hour VIP session (VIP ticket holders)",
];

const day2Highlights = [
  "4 hours of concentrated general training",
  "Closing keynote (60 minutes)",
  "Two featured speaker sessions",
  "Guided implementation workshop",
  "Seven-speaker summit panel & Q&A",
  "Personal commitment exercise",
  "1-hour VIP implementation lab (VIP ticket holders)",
];

export default function ExperienceSection({ onOpenModal }: ExperienceSectionProps) {
  return (
    <section id="experience" className="bg-[#0f1729] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#c79d35] text-sm font-semibold tracking-widest uppercase mb-3">
            The Two-Day Journey
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Two Days. One Transformation.
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Each day is intentionally designed — Day One builds your foundation,
            Day Two puts it into motion.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-[#1a56db]/40 rounded-3xl p-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#1a56db] flex items-center justify-center text-white font-extrabold text-lg" style={{ fontFamily: "var(--app-font-heading)" }}>
                1
              </div>
              <span className="text-[#1a56db] text-sm font-bold uppercase tracking-widest">Day One</span>
            </div>
            <h3
              className="text-2xl font-extrabold text-white mb-2"
              style={{ fontFamily: "var(--app-font-heading)" }}
            >
              Transformation, Vision & Wealth Development
            </h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              The foundation-building day. You'll examine your mindset, clarify
              your identity and purpose, and begin developing your financial and
              leadership direction.
            </p>
            <ul className="space-y-3">
              {day1Highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#1a56db] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 border border-[#c79d35]/40 rounded-3xl p-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#c79d35] flex items-center justify-center text-[#0a0f1e] font-extrabold text-lg" style={{ fontFamily: "var(--app-font-heading)" }}>
                2
              </div>
              <span className="text-[#c79d35] text-sm font-bold uppercase tracking-widest">Day Two</span>
            </div>
            <h3
              className="text-2xl font-extrabold text-white mb-2"
              style={{ fontFamily: "var(--app-font-heading)" }}
            >
              Implementation & Development Training
            </h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              The action day. Four concentrated hours of training, workshops, and
              a seven-speaker panel — designed to move you from insight to a
              clear, written plan.
            </p>
            <ul className="space-y-3">
              {day2Highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#c79d35] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => {
              document.querySelector("#agenda")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="border-2 border-white/30 text-white hover:border-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all"
            data-testid="button-explore-agenda"
          >
            Explore the Full Agenda
          </button>
        </div>
      </div>
    </section>
  );
}
