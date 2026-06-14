import { useState } from "react";
import { Building2, Heart, Shield, Tv, Users, GraduationCap, Globe, Store } from "lucide-react";

const opportunities = [
  { icon: Building2, title: "Corporate Sponsors", desc: "Brand your company alongside a transformational community event." },
  { icon: Store, title: "Local Businesses", desc: "Connect with entrepreneurs and professionals in Long Beach and beyond." },
  { icon: Heart, title: "Financial Institutions", desc: "Support financial literacy and wealth development education." },
  { icon: Shield, title: "Veteran Organizations", desc: "Serve and celebrate those who have served our communities." },
  { icon: Users, title: "Nonprofits & Community Groups", desc: "Amplify your mission alongside an audience committed to growth." },
  { icon: GraduationCap, title: "Educational Organizations", desc: "Position your institution as a leader in professional development." },
  { icon: Tv, title: "Media Partners", desc: "Reach an engaged, growth-oriented audience through co-promotion." },
  { icon: Globe, title: "Vendors & Exhibitors", desc: "Place your products and services in front of motivated attendees." },
];

export default function SponsorSection() {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.organization.trim()) errs.organization = "Organization is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Valid email required.";
    if (!form.interest) errs.interest = "Please select a partnership type.";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  return (
    <section className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#1a56db] text-sm font-semibold tracking-widest uppercase mb-3">
            Partnership Opportunities
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-[#0f1729] mb-4"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Partner With a Movement Focused on Transformation and Development.
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Align your organization with a community committed to personal
            growth, financial development, and purposeful leadership.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {opportunities.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#1a56db]/40 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#1a56db]/10 flex items-center justify-center mb-4">
                <Icon size={20} className="text-[#1a56db]" />
              </div>
              <h3 className="text-sm font-bold text-[#0f1729] mb-1" style={{ fontFamily: "var(--app-font-heading)" }}>{title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-10 max-w-3xl mx-auto">
          <h3 className="text-2xl font-extrabold text-[#0f1729] mb-2" style={{ fontFamily: "var(--app-font-heading)" }}>
            Sponsor Inquiry
          </h3>
          <p className="text-gray-500 text-sm mb-8">
            Sponsor logos and confirmed partners will appear on this page. Complete this form to learn about partnership opportunities.
          </p>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-400 flex items-center justify-center mx-auto mb-4">
                <Building2 size={24} className="text-green-500" />
              </div>
              <p className="text-[#0f1729] font-bold text-lg mb-2">Inquiry Received</p>
              <p className="text-gray-500 text-sm">Thank you for your interest in partnering with the LBC Wealth and Development Summit. We'll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sp-name" className="block text-sm font-semibold text-gray-700 mb-1">Contact Name <span className="text-red-500">*</span></label>
                  <input id="sp-name" type="text" value={form.name} onChange={set("name")} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]" data-testid="input-sponsor-name" placeholder="Your name" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="sp-org" className="block text-sm font-semibold text-gray-700 mb-1">Organization <span className="text-red-500">*</span></label>
                  <input id="sp-org" type="text" value={form.organization} onChange={set("organization")} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]" data-testid="input-sponsor-org" placeholder="Your organization" />
                  {errors.organization && <p className="text-red-500 text-xs mt-1">{errors.organization}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sp-email" className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input id="sp-email" type="email" value={form.email} onChange={set("email")} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]" data-testid="input-sponsor-email" placeholder="email@company.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="sp-phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input id="sp-phone" type="tel" value={form.phone} onChange={set("phone")} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]" data-testid="input-sponsor-phone" placeholder="(555) 000-0000" />
                </div>
              </div>
              <div>
                <label htmlFor="sp-interest" className="block text-sm font-semibold text-gray-700 mb-1">Partnership Interest <span className="text-red-500">*</span></label>
                <select id="sp-interest" value={form.interest} onChange={set("interest")} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db] bg-white" data-testid="select-sponsor-interest">
                  <option value="">Select type of partnership</option>
                  <option value="corporate">Corporate Sponsorship</option>
                  <option value="local">Local Business Partner</option>
                  <option value="financial">Financial Institution</option>
                  <option value="nonprofit">Nonprofit / Community Group</option>
                  <option value="veteran">Veteran Organization</option>
                  <option value="media">Media Partner</option>
                  <option value="vendor">Vendor / Exhibitor</option>
                  <option value="other">Other</option>
                </select>
                {errors.interest && <p className="text-red-500 text-xs mt-1">{errors.interest}</p>}
              </div>
              <div>
                <label htmlFor="sp-message" className="block text-sm font-semibold text-gray-700 mb-1">Message <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea id="sp-message" value={form.message} onChange={set("message")} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db] resize-none" data-testid="textarea-sponsor-message" placeholder="Tell us more about your organization or interest..." />
              </div>
              <button type="submit" className="w-full bg-[#1a56db] hover:bg-[#1e3a8a] text-white font-bold py-3.5 rounded-xl transition-colors" data-testid="button-sponsor-submit" style={{ fontFamily: "var(--app-font-heading)" }}>
                Submit Partnership Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
