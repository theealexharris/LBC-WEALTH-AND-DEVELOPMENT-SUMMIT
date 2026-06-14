import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import summitLogo from "@assets/LBC_Summit_pic_1781402272251.png";

const footerLinks = {
  "About the Summit": ["About", "Mission & Vision", "Redefined Mindset"],
  "Program": ["Speakers", "Agenda", "VIP Experience"],
  "Attend": ["Tickets", "Group Tickets", "FAQ"],
  "Connect": ["Contact", "Sponsor Inquiry", "Accessibility"],
};

const legalLinks = [
  "Privacy Policy",
  "Terms & Conditions",
  "Accessibility",
  "Refund Policy",
];

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  return (
    <footer className="bg-[#060b17] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={summitLogo}
                alt="LBC Wealth and Development Summit"
                className="h-12 w-12 object-contain"
              />
              <div>
                <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "var(--app-font-heading)" }}>
                  LBC Wealth & Development Summit
                </p>
                <p className="text-[#c79d35] text-xs">Presented by Redefined Mindset</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              A transformational two-day summit centered on mindset renewal,
              identity rebuilding, financial education, leadership, and
              purposeful action.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Twitter, label: "Twitter/X" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#1a56db] flex items-center justify-center transition-colors"
                >
                  <Icon size={16} className="text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">
                {heading}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        const id = link.toLowerCase().replace(/[^a-z]/g, "");
                        scrollTo(id);
                      }}
                      className="text-gray-500 hover:text-white text-sm transition-colors text-left"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8">
          <div className="bg-white/3 rounded-xl p-5 mb-8 border border-white/5">
            <p className="text-gray-500 text-xs leading-relaxed">
              <strong className="text-gray-400">Disclaimer:</strong> The LBC Wealth and
              Development Summit provides educational and informational content
              concerning personal development, leadership, entrepreneurship and
              general financial principles. It does not provide individualized
              legal, tax, investment or financial advice and does not guarantee
              business, income or investment results. All speaker sessions,
              schedules, pricing, and event details are subject to change and
              will be confirmed prior to the event launch.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600 text-xs">
              © 2026 Redefined Mindset. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4">
              {legalLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
