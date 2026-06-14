import { testimonials } from "@/data/testimonials";

export default function TestimonialsSection() {
  return (
    <section className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#1a56db] text-sm font-semibold tracking-widest uppercase mb-3">
            Community Voices
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-[#0f1729] mb-4"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Stories From the Community
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Verified testimonials and attendee stories will be featured here
            once the summit launches. Join us and share your story.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 flex flex-col"
            >
              <div className="flex-1">
                <div className="w-8 h-0.5 bg-[#c79d35] mb-5" />
                <p className="text-gray-400 text-sm italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-bold">
                    —
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-semibold">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-semibold">
                    Testimonial Placeholder — Pending Verification
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-xs mt-10 italic">
          Only verified testimonials from confirmed attendees will be published
          on this page.
        </p>
      </div>
    </section>
  );
}
