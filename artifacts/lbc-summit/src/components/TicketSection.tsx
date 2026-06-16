import { CheckCircle2, Star } from "lucide-react";
import { tickets } from "@/data/tickets";

interface TicketSectionProps {
  onOpenModal: (type: "general" | "vip") => void;
}

export default function TicketSection({ onOpenModal }: TicketSectionProps) {
  return (
    <section id="tickets" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#1a56db] text-sm font-semibold tracking-widest uppercase mb-3">
            Reserve Your Place
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-[#0f1729] mb-4"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Choose Your Summit Experience
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Every ticket option is designed to deliver real value. Choose the
            level of access that aligns with your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start mb-8">
          {tickets.map((ticket) => {
            const isVip = ticket.id === "vip";
            const isGroup = ticket.id === "group";

            return (
              <div
                key={ticket.id}
                className={`rounded-2xl p-8 flex flex-col relative ${
                  isVip
                    ? "bg-[#0f1729] border-2 border-[#c79d35] shadow-2xl"
                    : isGroup
                    ? "bg-gray-50 border border-gray-200"
                    : "bg-white border-2 border-[#1a56db]/20 shadow-sm"
                }`}
                data-testid={`card-ticket-${ticket.id}`}
              >
                {isVip && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[#c79d35] text-[#0a0f1e] text-xs font-bold px-5 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                      <Star size={12} />
                      Most Complete
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className={`text-xl font-extrabold mb-2 ${isVip ? "text-[#c79d35]" : "text-[#0f1729]"}`}
                    style={{ fontFamily: "var(--app-font-heading)" }}
                  >
                    {ticket.name}
                  </h3>
                  <div className={`text-3xl font-extrabold ${isVip ? "text-white" : "text-[#1a56db]"}`} style={{ fontFamily: "var(--app-font-heading)" }}>
                    {ticket.price}
                  </div>
                  {isGroup && (
                    <p className="text-xs text-gray-500 mt-1">Contact us for group pricing</p>
                  )}
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {ticket.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2
                        size={16}
                        className={`flex-shrink-0 mt-0.5 ${isVip ? "text-[#c79d35]" : "text-[#1a56db]"}`}
                      />
                      <span className={`text-sm ${isVip ? "text-gray-300" : "text-gray-600"}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {ticket.id === "general" && (
                  <button
                    onClick={() => onOpenModal("general")}
                    className="w-full border-2 border-[#1a56db] text-[#1a56db] hover:bg-[#1a56db] hover:text-white font-bold py-3.5 rounded-xl transition-all"
                    data-testid="button-ticket-general"
                    style={{ fontFamily: "var(--app-font-heading)" }}
                  >
                    Reserve General Admission
                  </button>
                )}
                {isVip && (
                  <button
                    onClick={() => onOpenModal("vip")}
                    className="w-full bg-[#c79d35] hover:bg-[#b8891e] text-[#0a0f1e] font-bold py-3.5 rounded-xl transition-all"
                    data-testid="button-ticket-vip"
                    style={{ fontFamily: "var(--app-font-heading)" }}
                  >
                    Upgrade to VIP
                  </button>
                )}
                {isGroup && (
                  <a
                    href="mailto:Support@lbcwealthanddevelopmentsummit.com?subject=Group%20Ticket%20Inquiry%20%E2%80%94%20LBC%20Wealth%20%26%20Development%20Summit%202026"
                    className="w-full border-2 border-gray-300 text-gray-700 hover:border-[#1a56db] hover:text-[#1a56db] font-bold py-3.5 rounded-xl transition-all text-center block"
                    data-testid="button-ticket-group"
                    style={{ fontFamily: "var(--app-font-heading)" }}
                  >
                    Request Group Information
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center max-w-2xl mx-auto">
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>Young Adult Discount:</strong> Ages 17–20 pay $15 — must pay at event registration.
            Contact us at{" "}
            <a href="mailto:Support@lbcwealthanddevelopmentsummit.com" className="underline font-semibold">
              Support@lbcwealthanddevelopmentsummit.com
            </a>{" "}
            for group inquiries.
          </p>
        </div>
      </div>
    </section>
  );
}
