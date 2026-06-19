import { useState } from "react";
import { Instagram, Facebook, Linkedin, Twitter, X } from "lucide-react";
import summitLogo from "@assets/LBC_Summit_pic_1781402272251.png";

const SUPPORT_EMAIL = "Support@LBCwealthanddevelopmentsummit.com";

const MODAL_CONTENT: Record<string, { title: string; body: string }> = {
  "Mission & Vision": {
    title: "Mission & Vision",
    body: "A transformational two-day summit centered on mindset renewal, identity rebuilding, financial education, leadership, and purposeful action.",
  },
  "Redefined Mindset": {
    title: "Redefined Mindset",
    body: "Alexander M. Harris is a retired military veteran, transformational speaker, coach, founder of Redefined Mindset. His work is rooted in helping veterans, first responders, leaders, and individuals facing major life transitions rebuild identity, renew their mindset, and move from survival mode into purpose-driven leadership.\n\nWith a background that includes military service, federal law enforcement experience, mental health advocacy, advanced legal training, entrepreneurship, coaching, software development, and veteran advocacy, Alexander brings a rare combination of lived experience, practical strategy, and motivational leadership. He has coached over 100 clients, supported emerging app builders, and delivered hundreds of presentations connected to government training, compliance, personal development, and leadership transformation.\n\nAs a speaker, Alexander delivers powerful, practical, and emotionally grounded messages that challenge audiences to redefine who they are, reclaim their voice, and build a life aligned with purpose, discipline, and legacy. Through Redefined Mindset and his veteran-focused technology work, he equips audiences with the tools, courage, and clarity to turn adversity into authority and personal transformation into lasting impact.",
  },
  "Accessibility": {
    title: "Accessibility",
    body: "We are committed to providing an accessible and inclusive experience. Specific accessibility details will be confirmed and communicated once the venue is finalized. Please contact us with any accessibility requirements or questions.",
  },
};

const LINK_ACTIONS: Record<string, () => void> = {};

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

const footerLinks: Record<string, string[]> = {
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

export default function Footer() {
  const [modal, setModal] = useState<string | null>(null);

  function handleLink(link: string) {
    // Modal popups
    if (MODAL_CONTENT[link]) {
      setModal(link);
      return;
    }
    // Mailto
    if (link === "Contact") {
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=Summit%20Inquiry`;
      return;
    }
    // Section scrolls
    const scrollMap: Record<string, string> = {
      About: "about",
      Speakers: "speakers",
      Agenda: "agenda",
      Tickets: "tickets",
      "VIP Experience": "tickets",
      "Group Tickets": "tickets",
      FAQ: "faq",
      "Sponsor Inquiry": "sponsor",
    };
    const id = scrollMap[link];
    if (id) scrollTo(id);
  }

  const activeModal = modal ? MODAL_CONTENT[modal] : null;

  return (
    <footer className="bg-[#060b17] text-gray-400">
      {/* Info Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-[#0f1729] border border-white/10 rounded-2xl p-8 max-w-lg w-full relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h3
              className="text-white text-xl font-extrabold mb-4"
              style={{ fontFamily: "var(--app-font-heading)" }}
            >
              {activeModal.title}
            </h3>
            {activeModal.body.split("\n\n").map((para, i) => (
              <p key={i} className="text-gray-300 text-sm leading-relaxed mb-3 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
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
                      onClick={() => handleLink(link)}
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
