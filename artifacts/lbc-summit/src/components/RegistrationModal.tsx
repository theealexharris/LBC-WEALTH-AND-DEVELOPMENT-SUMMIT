import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface RegistrationModalProps {
  open: boolean;
  ticketType: "general" | "vip";
  onClose: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ticketPreference: string;
  organization: string;
  consent: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  ticketPreference?: string;
  consent?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.firstName.trim()) errors.firstName = "First name is required.";
  if (!data.lastName.trim()) errors.lastName = "Last name is required.";
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "A valid email address is required.";
  if (!data.phone.trim()) errors.phone = "Phone number is required.";
  if (!data.ticketPreference)
    errors.ticketPreference = "Please select a ticket type.";
  if (!data.consent) errors.consent = "Please confirm your consent to continue.";
  return errors;
}

export default function RegistrationModal({
  open,
  ticketType,
  onClose,
}: RegistrationModalProps) {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ticketPreference: ticketType === "vip" ? "vip" : "general",
    organization: "",
    consent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // TODO: Connect Stripe Checkout via summitConfig.stripeGeneralLink / stripeVipLink before launch
    // TODO: Connect email platform (Mailchimp/ConvertKit) for lead capture before launch
    console.log("Registration prototype submission:", form);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      ticketPreference: "general",
      organization: "",
      consent: false,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-lg w-[calc(100vw-2rem)] max-h-[90dvh] overflow-y-auto mx-4 sm:mx-auto">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2
              className="text-2xl font-extrabold text-[#0f1729] mb-3"
              style={{ fontFamily: "var(--app-font-heading)" }}
            >
              You're on the List
            </h2>
            <p className="text-gray-600 mb-2">
              Thank you, {form.firstName}! We've received your interest in the
              LBC Wealth and Development Summit.
            </p>
            <p className="text-gray-500 text-sm">
              We'll be in touch with registration details, ticket pricing, and
              event information as soon as they are confirmed.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 bg-[#1a56db] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#1e3a8a] transition-colors"
              data-testid="button-modal-close-success"
              style={{ fontFamily: "var(--app-font-heading)" }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle
                className="text-2xl font-extrabold text-[#0f1729]"
                style={{ fontFamily: "var(--app-font-heading)" }}
              >
                Reserve Your Seat
              </DialogTitle>
              <p className="text-gray-500 text-sm mt-1">
                Complete this form to express interest. Ticket details will be
                confirmed before any payment is processed.
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="reg-firstName"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-firstName"
                    type="text"
                    value={form.firstName}
                    onChange={set("firstName")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:border-transparent"
                    data-testid="input-firstName"
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="reg-lastName"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-lastName"
                    type="text"
                    value={form.lastName}
                    onChange={set("lastName")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:border-transparent"
                    data-testid="input-lastName"
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:border-transparent"
                  data-testid="input-email"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-phone"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:border-transparent"
                  data-testid="input-phone"
                  placeholder="(555) 000-0000"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-ticket"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Ticket Preference <span className="text-red-500">*</span>
                </label>
                <select
                  id="reg-ticket"
                  value={form.ticketPreference}
                  onChange={set("ticketPreference")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:border-transparent bg-white"
                  data-testid="select-ticket"
                >
                  <option value="">Select ticket type</option>
                  <option value="general">General Admission</option>
                  <option value="vip">VIP Admission</option>
                  <option value="group">Group / Organization</option>
                </select>
                {errors.ticketPreference && (
                  <p className="text-red-500 text-xs mt-1">{errors.ticketPreference}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-org"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Organization{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="reg-org"
                  type="text"
                  value={form.organization}
                  onChange={set("organization")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:border-transparent"
                  data-testid="input-organization"
                  placeholder="Company, nonprofit, or organization"
                />
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={set("consent")}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1a56db] focus:ring-[#1a56db]"
                    data-testid="checkbox-consent"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to receive event communications from Redefined
                    Mindset. I understand I can unsubscribe at any time.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-red-500 text-xs mt-1">{errors.consent}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#1a56db] hover:bg-[#1e3a8a] text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg"
                data-testid="button-submit-registration"
                style={{ fontFamily: "var(--app-font-heading)" }}
              >
                Reserve My Seat
              </button>

              <p className="text-gray-400 text-xs text-center">
                No payment is collected at this stage. Ticket confirmation and
                pricing details will be communicated prior to launch.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
