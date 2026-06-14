import {
  Briefcase,
  TrendingUp,
  Shield,
  RefreshCw,
  BookOpen,
  Users,
  Heart,
  Building2,
} from "lucide-react";

interface AudienceSectionProps {
  onOpenModal: (type: "general" | "vip") => void;
}

const audiences = [
  {
    icon: Briefcase,
    title: "Entrepreneurs & Business Owners",
    description: "At any stage — from idea to established company",
  },
  {
    icon: TrendingUp,
    title: "Professionals & Emerging Leaders",
    description: "Ready to step into their next level of impact",
  },
  {
    icon: Shield,
    title: "Veterans & First Responders",
    description: "Translating service, discipline, and strength into civilian success",
  },
  {
    icon: RefreshCw,
    title: "People Rebuilding After Adversity",
    description: "Reclaiming momentum after setbacks, transitions, or loss",
  },
  {
    icon: BookOpen,
    title: "Wealth-Development Learners",
    description: "Seeking practical financial education and wealth-building principles",
  },
  {
    icon: Users,
    title: "Coaches & Community Leaders",
    description: "Expanding their capacity to guide and serve others",
  },
  {
    icon: Heart,
    title: "Purpose-Driven Individuals",
    description: "Aligning their values, gifts, and goals into meaningful work",
  },
  {
    icon: Building2,
    title: "Organizations & Groups",
    description: "Investing in employee, veteran, or community development",
  },
];

export default function AudienceSection({ onOpenModal }: AudienceSectionProps) {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#1a56db] text-sm font-semibold tracking-widest uppercase mb-3">
            Who Belongs Here
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-[#0f1729] mb-4"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            This Summit Was Built for People Ready to Move Forward.
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Regardless of background, profession, or where you are on your
            journey — if you are committed to growth, you belong in this room.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {audiences.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="border border-gray-200 rounded-2xl p-6 hover:border-[#1a56db]/40 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0f1729] flex items-center justify-center mb-4">
                <Icon size={22} className="text-[#c79d35]" />
              </div>
              <h3
                className="text-base font-bold text-[#0f1729] mb-2"
                style={{ fontFamily: "var(--app-font-heading)" }}
              >
                {title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#0f1729] rounded-3xl p-10 text-center max-w-3xl mx-auto">
          <p className="text-white text-xl font-semibold italic leading-relaxed mb-6" style={{ fontFamily: "var(--app-font-heading)" }}>
            "You do not need to have everything figured out. You need the
            willingness to learn, confront old patterns, and take intentional
            action."
          </p>
          <button
            onClick={() => onOpenModal("general")}
            className="bg-[#c79d35] hover:bg-[#b8891e] text-[#0a0f1e] font-bold px-8 py-4 rounded-xl transition-all"
            data-testid="button-audience-reserve"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            I'm Ready — Reserve My Seat
          </button>
        </div>
      </div>
    </section>
  );
}
