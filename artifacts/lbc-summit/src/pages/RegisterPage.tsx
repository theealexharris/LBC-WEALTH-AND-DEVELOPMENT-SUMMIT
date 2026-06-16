import { useState } from "react";
import { CheckCircle2, Star, Users, Shield, Crown, Building2, ArrowLeft, Loader2 } from "lucide-react";
import summitLogo from "@assets/LBC_Summit_pic_1781402272251.png";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

interface Ticket {
  id: string;
  name: string;
  price: string;
  amount: number;
  badge?: string;
  description: string;
  inclusions: string[];
  icon: typeof CheckCircle2;
  featured?: boolean;
}

const tickets: Ticket[] = [
  {
    id: "general",
    name: "General Admission",
    price: "$25",
    amount: 25,
    icon: Users,
    description:
      "For the person who knows they need a shift, a new environment, and a fresh start. Access a two-day experience designed to help you break limiting beliefs, rebuild confidence, and begin developing a new life strategy.",
    inclusions: ["2-Day Summit Access", "Networking Sessions", "General Seating"],
  },
  {
    id: "general_plus_one",
    name: "General Admission + Guest",
    price: "$35",
    amount: 35,
    icon: Users,
    description:
      "Transformation is stronger when you don't walk alone. Bring a friend, spouse, family member, mentee, or accountability partner for just $10 more.",
    inclusions: [
      "Two General Admission Tickets",
      "2-Day Summit Access for Both",
      "Networking Sessions",
      "General Seating for Both",
    ],
  },
  {
    id: "vip",
    name: "VIP Admission",
    price: "$97",
    amount: 97,
    badge: "Most Complete",
    icon: Star,
    featured: true,
    description:
      "For attendees serious about transformation who want more than just a seat in the room. Closer access, better positioning, and a deeper summit experience for those ready to take action.",
    inclusions: [
      "2-Day VIP Admission",
      "Priority Check-In",
      "Preferred Seating",
      "1-Hour Private Extended Session After Summit",
      "VIP Networking Access",
      "Speaker Meet-and-Greet (if available)",
      "All Keynote & Financial Development Sessions",
      "Mindset, AI Opportunity & Live Q&A Access",
      "Digital Summit Workbook",
      "Redefined Mindset Action-Plan Worksheet",
      "Early Access to Coaching Enrollment",
    ],
  },
  {
    id: "vip_plus_one",
    name: "VIP Admission + Guest",
    price: "$145",
    amount: 145,
    icon: Shield,
    description:
      "Share the full VIP experience with someone in your corner. All VIP benefits for two attendees.",
    inclusions: [
      "All VIP Benefits for Two Guests",
      "Two-Day VIP Admission",
      "Priority Check-In for Both",
      "Preferred Seating for Both",
      "Private Extended Session After Summit",
      "VIP Networking & Speaker Meet-and-Greet",
    ],
  },
  {
    id: "executive",
    name: "Executive Sponsor Pass",
    price: "$250",
    amount: 250,
    icon: Crown,
    description:
      "Premium access and visibility for organizations who want to align with a movement. Includes VIP benefits plus sponsorship recognition and exhibit space.",
    inclusions: [
      "Two VIP Admission Tickets",
      "Sponsor Recognition",
      "Premium Networking Access",
      "Sponsor Space / Table",
      "Free 2-Day B2B/B2C Marketing & Networking",
    ],
  },
];

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  company: string; jobTitle: string; city: string; state: string;
  accessibilityNeeds: string; emergencyContactName: string; emergencyContactPhone: string;
  agreeTerms: boolean; agreeUpdates: boolean; agreeSms: boolean;
}

interface FormErrors {
  firstName?: string; lastName?: string; email?: string; phone?: string;
  agreeTerms?: string; [key: string]: string | undefined;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.firstName.trim()) errors.firstName = "First name is required.";
  if (!data.lastName.trim()) errors.lastName = "Last name is required.";
  if (!data.email.trim() || !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(data.email))
    errors.email = "A valid email address is required.";
  if (!data.phone.trim()) errors.phone = "Phone number is required.";
  if (!data.agreeTerms) errors.agreeTerms = "You must agree to the Terms & Conditions.";
  return errors;
}

export default function RegisterPage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    company: "", jobTitle: "", city: "", state: "",
    accessibilityNeeds: "", emergencyContactName: "", emergencyContactPhone: "",
    agreeTerms: false, agreeUpdates: false, agreeSms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketType: selectedTicket, ...form }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Checkout failed. Please try again.");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const ticket = tickets.find((t) => t.id === selectedTicket);

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Header */}
      <header className="bg-[#0f1729]/95 backdrop-blur-md border-b border-white/10 py-4 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <img src={summitLogo} alt="LBC Summit" className="h-10 w-10 object-contain" />
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "var(--app-font-heading)" }}>
                LBC Wealth & Development Summit
              </p>
              <p className="text-[#c79d35] text-xs">Presented by Redefined Mindset</p>
            </div>
          </a>
          <a href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back to Site
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {!selectedTicket ? (
          <>
            {/* Step 1: Select Ticket */}
            <div className="text-center mb-10">
              <p className="text-[#c79d35] text-xs font-bold uppercase tracking-widest mb-2">
                August 15–16, 2026 · Hotel Current, Long Beach, CA
              </p>
              <h1
                className="text-3xl sm:text-4xl font-extrabold text-white mb-3"
                style={{ fontFamily: "var(--app-font-heading)" }}
              >
                Choose Your Summit Experience
              </h1>
              <p className="text-gray-400 text-base max-w-xl mx-auto">
                Select the ticket that best fits your goals. No payment is taken on this step.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {tickets.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t.id)}
                    className={`relative rounded-2xl p-6 text-left flex flex-col transition-all hover:-translate-y-0.5 border-2 ${
                      t.featured
                        ? "bg-[#0f1729] border-[#c79d35] shadow-2xl shadow-yellow-900/20"
                        : "bg-white/5 border-white/10 hover:border-[#1a56db]/60"
                    }`}
                  >
                    {t.badge && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c79d35] text-[#0a0f1e] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                        {t.badge}
                      </span>
                    )}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${t.featured ? "bg-[#c79d35]/20" : "bg-[#1a56db]/20"}`}>
                      <Icon size={18} className={t.featured ? "text-[#c79d35]" : "text-[#1a56db]"} />
                    </div>
                    <p className={`text-lg font-extrabold mb-1 ${t.featured ? "text-[#c79d35]" : "text-white"}`} style={{ fontFamily: "var(--app-font-heading)" }}>
                      {t.name}
                    </p>
                    <p className={`text-3xl font-extrabold ${t.featured ? "text-white" : "text-[#1a56db]"}`} style={{ fontFamily: "var(--app-font-heading)" }}>
                      {t.price}
                    </p>
                    {t.id === "general" && (
                      <p className="text-[#c79d35] text-xs font-semibold mt-1 mb-3 leading-snug">
                        $15 — Young Adult (17–20 y/o)<br />
                        <span className="text-gray-400 font-normal">Must pay at event registration</span>
                      </p>
                    )}
                    {t.id !== "general" && <div className="mb-3" />}
                    <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">{t.description}</p>
                    <ul className="space-y-1.5">
                      {t.inclusions.slice(0, 4).map((inc) => (
                        <li key={inc} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 size={12} className={`flex-shrink-0 mt-0.5 ${t.featured ? "text-[#c79d35]" : "text-[#1a56db]"}`} />
                          <span className={t.featured ? "text-gray-300" : "text-gray-400"}>{inc}</span>
                        </li>
                      ))}
                      {t.inclusions.length > 4 && (
                        <li className={`text-xs ${t.featured ? "text-[#c79d35]" : "text-[#1a56db]"}`}>
                          +{t.inclusions.length - 4} more benefits
                        </li>
                      )}
                    </ul>
                    <div className={`mt-4 w-full py-2.5 rounded-xl text-center text-sm font-bold transition-colors ${
                      t.featured
                        ? "bg-[#c79d35] text-[#0a0f1e]"
                        : "bg-[#1a56db]/20 text-[#1a56db] group-hover:bg-[#1a56db] group-hover:text-white"
                    }`}>
                      Select {t.name}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-gray-500 text-xs">
              Secure payment powered by Stripe. Credit card, Apple Pay, and Google Pay accepted.
            </p>
          </>
        ) : (
          <>
            {/* Step 2: Registration Form */}
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setSelectedTicket(null)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
              >
                <ArrowLeft size={14} /> Change Ticket Selection
              </button>

              {/* Selected ticket summary */}
              <div className="bg-[#0f1729] border border-[#c79d35]/30 rounded-2xl p-5 mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[#c79d35] text-xs font-bold uppercase tracking-widest mb-1">Selected Ticket</p>
                  <p className="text-white font-extrabold text-lg" style={{ fontFamily: "var(--app-font-heading)" }}>
                    {ticket?.name}
                  </p>
                  <p className="text-gray-400 text-sm">{ticket?.description?.split(".")[0]}.</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[#c79d35] text-2xl font-extrabold" style={{ fontFamily: "var(--app-font-heading)" }}>
                    {ticket?.price}
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-6" style={{ fontFamily: "var(--app-font-heading)" }}>
                Your Information
              </h2>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name" required error={errors.firstName}>
                    <input id="f-first" type="text" value={form.firstName} onChange={set("firstName")} placeholder="First name" className={inputCls} />
                  </Field>
                  <Field label="Last Name" required error={errors.lastName}>
                    <input id="f-last" type="text" value={form.lastName} onChange={set("lastName")} placeholder="Last name" className={inputCls} />
                  </Field>
                </div>

                <Field label="Email Address" required error={errors.email}>
                  <input id="f-email" type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" className={inputCls} />
                </Field>

                <Field label="Mobile Phone Number" required error={errors.phone}>
                  <input id="f-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="(555) 000-0000" className={inputCls} />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Company Name">
                    <input id="f-company" type="text" value={form.company} onChange={set("company")} placeholder="Company or organization" className={inputCls} />
                  </Field>
                  <Field label="Job Title">
                    <input id="f-title" type="text" value={form.jobTitle} onChange={set("jobTitle")} placeholder="Your role or title" className={inputCls} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="City">
                    <input id="f-city" type="text" value={form.city} onChange={set("city")} placeholder="City" className={inputCls} />
                  </Field>
                  <Field label="State">
                    <select id="f-state" value={form.state} onChange={set("state")} className={inputCls}>
                      <option value="">Select state</option>
                      {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Accessibility Needs" hint="Optional">
                  <textarea id="f-access" value={form.accessibilityNeeds} onChange={set("accessibilityNeeds")} rows={2} placeholder="Please describe any accessibility accommodations needed" className={`${inputCls} resize-none`} />
                </Field>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white text-sm font-semibold mb-3">Emergency Contact</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Contact Name">
                      <input id="f-ec-name" type="text" value={form.emergencyContactName} onChange={set("emergencyContactName")} placeholder="Full name" className={inputCls} />
                    </Field>
                    <Field label="Contact Phone">
                      <input id="f-ec-phone" type="tel" value={form.emergencyContactPhone} onChange={set("emergencyContactPhone")} placeholder="(555) 000-0000" className={inputCls} />
                    </Field>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.agreeTerms} onChange={set("agreeTerms")} className="mt-0.5 h-4 w-4 rounded border-gray-600 text-[#1a56db] focus:ring-[#1a56db]" />
                    <span className="text-sm text-gray-300">
                      I agree to the <a href="#" className="text-[#c79d35] underline hover:text-white">Terms & Conditions</a> <span className="text-red-400">*</span>
                    </span>
                  </label>
                  {errors.agreeTerms && <p className="text-red-400 text-xs ml-7">{errors.agreeTerms}</p>}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.agreeUpdates} onChange={set("agreeUpdates")} className="mt-0.5 h-4 w-4 rounded border-gray-600 text-[#1a56db] focus:ring-[#1a56db]" />
                    <span className="text-sm text-gray-300">I agree to receive summit updates and announcements from Redefined Mindset.</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.agreeSms} onChange={set("agreeSms")} className="mt-0.5 h-4 w-4 rounded border-gray-600 text-[#1a56db] focus:ring-[#1a56db]" />
                    <span className="text-sm text-gray-300">I consent to receive SMS reminders about the event. Message and data rates may apply.</span>
                  </label>
                </div>

                {submitError && (
                  <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 text-red-300 text-sm">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#c79d35] hover:bg-[#b8891e] disabled:opacity-60 disabled:cursor-not-allowed text-[#0a0f1e] font-extrabold text-lg py-4 rounded-xl transition-all shadow-lg shadow-yellow-900/30"
                  style={{ fontFamily: "var(--app-font-heading)" }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" /> Redirecting to Payment...
                    </span>
                  ) : (
                    `Proceed to Payment — ${ticket?.price}`
                  )}
                </button>

                <p className="text-gray-500 text-xs text-center">
                  You will be redirected to Stripe's secure checkout. Credit card, Apple Pay, and Google Pay accepted.
                </p>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:border-transparent";

function Field({
  label, required, hint, error, children,
}: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-400 ml-0.5"> *</span>}
        {hint && <span className="text-gray-500 font-normal ml-1">({hint})</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
