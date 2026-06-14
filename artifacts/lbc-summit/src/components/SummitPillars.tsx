import {
  Brain,
  User,
  TrendingUp,
  Lightbulb,
  Award,
  Target,
} from "lucide-react";
import { pillars } from "@/data/pillars";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Brain,
  User,
  TrendingUp,
  Lightbulb,
  Award,
  Target,
};

export default function SummitPillars() {
  return (
    <section className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#1a56db] text-sm font-semibold tracking-widest uppercase mb-3">
            What You'll Build
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-[#0f1729] mb-4"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Six Pillars of Transformation
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Every session, workshop, and keynote is designed around these six
            interconnected pillars — the foundation of a purposeful,
            wealth-building life.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = iconMap[pillar.icon];
            return (
              <div
                key={pillar.id}
                className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-[#1a56db] hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 cursor-default"
              >
                <div className="w-14 h-14 rounded-xl bg-[#1a56db]/10 group-hover:bg-[#1a56db] flex items-center justify-center mb-6 transition-colors duration-300">
                  <Icon
                    size={26}
                    className="text-[#1a56db] group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3
                  className="text-xl font-bold text-[#0f1729] mb-3"
                  style={{ fontFamily: "var(--app-font-heading)" }}
                >
                  {pillar.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
