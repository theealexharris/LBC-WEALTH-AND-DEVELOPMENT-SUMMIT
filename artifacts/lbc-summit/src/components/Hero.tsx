import { Calendar, MapPin, Users, Clock, Star, Shield } from "lucide-react";
import summitLogo from "@assets/LBC_Summit_pic_1781402272251.png";

interface HeroProps {
  onOpenModal: (type: "general" | "vip") => void;
}

const stats = [
  { icon: Users, value: "7", label: "Expert Speakers" },
  { icon: Clock, value: "10", label: "Programming Hours" },
  { icon: Star, value: "2", label: "Keynotes" },
  { icon: Shield, value: "2", label: "VIP Experiences" },
];

export default function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0f1e]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(26,86,219,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(199,157,53,0.15) 0%, transparent 50%), linear-gradient(135deg, #0a0f1e 0%, #0f1729 50%, #0a0f1e 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.4) 60px, rgba(255,255,255,0.4) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.4) 60px, rgba(255,255,255,0.4) 61px)",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={summitLogo}
            alt="LBC Wealth and Development Summit 2026"
            className="h-32 w-32 sm:h-44 sm:w-44 md:h-52 md:w-52 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Event Info Badge */}
        <div className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 sm:px-8 py-4 mb-6 w-full max-w-xl mx-auto">

          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c79d35] animate-pulse flex-shrink-0" />
            <span className="text-white text-base sm:text-lg md:text-xl font-semibold tracking-wide text-center" style={{ fontFamily: "var(--app-font-heading)" }}>
              Two-Day Transformational Summit &nbsp;·&nbsp; Long Beach, CA.
            </span>
          </div>

          <div className="w-full border-t border-white/15" />

          {/* Venue */}
          <div className="flex flex-col items-center gap-0.5 text-center">
            <a
              href="https://www.hotelcurrent.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c79d35] font-bold text-base sm:text-lg hover:text-[#e0b84a] transition-colors hover:underline underline-offset-2 leading-tight"
              style={{ fontFamily: "var(--app-font-heading)" }}
            >
              Hotel Current
            </a>
            <span className="text-gray-300 text-xs sm:text-sm leading-snug">
              5325 CA-1, Long Beach, CA 90804 &nbsp;·&nbsp; Ph: (562) 597-1341
            </span>
          </div>

          <div className="w-full border-t border-white/15" />

          {/* Dates */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-center w-full">
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[#c79d35] text-xs font-bold uppercase tracking-widest">Day 1</span>
              <span className="text-gray-200 text-xs sm:text-sm font-semibold">
                Aug 15, 2026 @ 10am–4pm <span className="text-gray-400 font-normal">| VIP: 4pm–5pm</span>
              </span>
            </div>
            <div className="hidden sm:block w-px bg-white/20 self-stretch" />
            <div className="w-full sm:hidden border-t border-white/10" />
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[#c79d35] text-xs font-bold uppercase tracking-widest">Day 2</span>
              <span className="text-gray-200 text-xs sm:text-sm font-semibold">
                Aug 16, 2026 @ 1pm–5pm <span className="text-gray-400 font-normal">| VIP: 5pm–6pm</span>
              </span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5"
          style={{ fontFamily: "var(--app-font-heading)" }}
        >
          Your Next Level Requires a{" "}
          <span className="text-[#1a56db]">New Mindset,</span> a Stronger
          Identity and a{" "}
          <span className="text-[#c79d35]">Clearer Wealth Strategy.</span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Join entrepreneurs, professionals, veterans, community leaders and
          purpose-driven individuals for two transformative days of mindset
          renewal, financial development, leadership training and practical
          implementation.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={() => onOpenModal("general")}
            className="bg-[#1a56db] hover:bg-[#1e3a8a] text-white font-bold text-base sm:text-lg px-7 py-4 rounded-xl transition-all shadow-lg shadow-blue-900/40 hover:-translate-y-0.5"
            data-testid="button-hero-reserve"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Reserve Your Seat
          </button>
          <button
            onClick={() => onOpenModal("vip")}
            className="border-2 border-[#c79d35] text-[#c79d35] hover:bg-[#c79d35] hover:text-[#0a0f1e] font-bold text-base sm:text-lg px-7 py-4 rounded-xl transition-all"
            data-testid="button-hero-vip"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Explore the VIP Experience
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl py-3 px-2">
              <Icon className="mx-auto mb-1 text-[#c79d35]" size={18} />
              <p className="text-xl font-extrabold text-white" style={{ fontFamily: "var(--app-font-heading)" }}>
                {value}
              </p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Date + Location footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-gray-400 text-sm">
          <span className="flex items-center gap-2">
            <Calendar size={14} className="text-[#c79d35]" />
            August 15–16, 2026
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={14} className="text-[#c79d35]" />
            Long Beach, California
          </span>
        </div>

        <p className="mt-3 text-gray-500 text-xs">Presented by Redefined Mindset</p>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-0.5 h-6 bg-gradient-to-b from-gray-500 to-transparent" />
      </div>
    </section>
  );
}
