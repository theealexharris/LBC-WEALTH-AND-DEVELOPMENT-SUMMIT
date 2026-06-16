import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/faqs";

export default function FAQSection() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#1a56db] text-sm font-semibold tracking-widest uppercase mb-3">
            Questions & Answers
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-[#0f1729] mb-4"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-base">
            Don't see your question? Contact us at{" "}
            <a href="mailto:Support@lbcwealthanddevelopmentsummit.com" className="text-[#1a56db] hover:underline">
              Support@lbcwealthanddevelopmentsummit.com
            </a>
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq) => {
            const isOpen = open === faq.id;
            return (
              <div
                key={faq.id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  isOpen
                    ? "border-[#1a56db]/40 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                  className="w-full text-left px-6 py-5 flex items-start gap-4 group"
                  aria-expanded={isOpen}
                  data-testid={`faq-toggle-${faq.id}`}
                >
                  <span
                    className="flex-1 text-sm font-semibold text-[#0f1729] leading-relaxed group-hover:text-[#1a56db] transition-colors"
                    style={{ fontFamily: "var(--app-font-heading)" }}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 mt-0.5 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#1a56db]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5">
                    <div className="w-full h-px bg-gray-100 mb-4" />
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
