const stats = [
  { value: "2", label: "Transformative Days" },
  { value: "7", label: "Expert Speakers" },
  { value: "2", label: "One-Hour Keynotes" },
  { value: "5", label: "Featured Sessions" },
  { value: "2", label: "Exclusive VIP Experiences" },
  { value: "1", label: "Personal Action Plan" },
];

export default function CredibilityStrip() {
  return (
    <section className="bg-white border-b border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-[#1a56db] tracking-widest uppercase mb-8">
          What You'll Experience
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p
                className="text-4xl font-extrabold text-[#0f1729] mb-1"
                style={{ fontFamily: "var(--app-font-heading)" }}
              >
                {value}
              </p>
              <div className="w-8 h-0.5 bg-[#c79d35] mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
