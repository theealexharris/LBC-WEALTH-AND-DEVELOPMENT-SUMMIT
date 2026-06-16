import { useState, useEffect } from "react";
import { Menu, X, Mail } from "lucide-react";
import summitLogo from "@assets/LBC_Summit_pic_1781402272251.png";

const SUPPORT_EMAIL = "Support@LBCwealthanddevelopmentsummit.com";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Speakers", href: "#speakers" },
  { label: "Experience", href: "#experience" },
  { label: "Agenda", href: "#agenda" },
  { label: "VIP", href: "#vip" },
  { label: "Tickets", href: "#tickets" },
  { label: "FAQ", href: "#faq" },
];


interface HeaderProps {
  onOpenModal: (type: "general" | "vip") => void;
}

export default function Header({ onOpenModal }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0f1729]/95 backdrop-blur-md shadow-xl py-2"
          : "bg-[#0f1729]/80 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={summitLogo}
              alt="LBC Wealth and Development Summit"
              className={`object-contain transition-all duration-300 ${scrolled ? "h-10 w-10" : "h-12 w-12"}`}
            />
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "var(--app-font-heading)" }}>
                LBC Wealth & Development Summit
              </p>
              <p className="text-[#c79d35] text-xs">Presented by Redefined Mindset</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </button>
            ))}
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Summit%20Inquiry`}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm font-medium transition-colors"
              data-testid="nav-contact-support"
            >
              <Mail size={14} />
              Contact Support
            </a>
            <button
              onClick={() => onOpenModal("general")}
              className="bg-[#1a56db] hover:bg-[#1e3a8a] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-lg"
              data-testid="button-reserve-seat-nav"
              style={{ fontFamily: "var(--app-font-heading)" }}
            >
              Reserve Your Seat
            </button>
          </nav>

          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#0f1729] border-t border-white/10 px-4 pt-4 pb-6 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="block w-full text-left text-gray-300 hover:text-white py-3 px-2 text-base font-medium border-b border-white/5 transition-colors"
              data-testid={`nav-mobile-${link.label.toLowerCase()}`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 flex flex-col gap-2">
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Summit%20Inquiry`}
              className="w-full border border-white/20 text-gray-300 font-semibold py-3 rounded-lg text-center transition-colors hover:bg-white/5 flex items-center justify-center gap-2"
              onClick={() => setMobileOpen(false)}
              data-testid="nav-contact-support-mobile"
            >
              <Mail size={16} />
              Contact Support
            </a>
            <button
              onClick={() => { onOpenModal("general"); setMobileOpen(false); }}
              className="w-full bg-[#1a56db] hover:bg-[#1e3a8a] text-white font-semibold py-3 rounded-lg transition-colors"
              data-testid="button-reserve-seat-mobile"
              style={{ fontFamily: "var(--app-font-heading)" }}
            >
              Reserve Your Seat
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
