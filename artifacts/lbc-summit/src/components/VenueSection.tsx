import { MapPin, Car, Accessibility, Hotel, Plane } from "lucide-react";

const details = [
  {
    icon: MapPin,
    title: "Venue",
    content: "To Be Confirmed — Long Beach, California",
    note: "Full address and venue details will be shared with registered attendees.",
  },
  {
    icon: Car,
    title: "Parking",
    content: "To Be Confirmed",
    note: "Parking options and any associated costs will be communicated prior to the event.",
  },
  {
    icon: Accessibility,
    title: "Accessibility",
    content: "Fully accessible venue",
    note: "We are committed to providing an inclusive experience. Contact us with specific accessibility needs.",
  },
  {
    icon: Hotel,
    title: "Recommended Hotel",
    content: "To Be Confirmed",
    note: "Discounted room blocks may be available for registered attendees.",
  },
  {
    icon: Plane,
    title: "Nearest Airport",
    content: "Long Beach Airport (LGB) — also served by LAX & BUR",
    note: "Detailed travel information will be provided once the venue is confirmed.",
  },
];

export default function VenueSection() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#1a56db] text-sm font-semibold tracking-widest uppercase mb-3">
            Getting Here
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-[#0f1729] mb-4"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Summit Location
          </h2>
          <p className="text-gray-600 text-lg">
            Long Beach, California — Venue details to be confirmed
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {details.map(({ icon: Icon, title, content, note }) => (
            <div
              key={title}
              className="border border-gray-200 rounded-2xl p-7 hover:border-[#1a56db]/40 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1a56db]/10 flex items-center justify-center mb-5">
                <Icon size={22} className="text-[#1a56db]" />
              </div>
              <h3
                className="text-base font-bold text-[#0f1729] mb-1"
                style={{ fontFamily: "var(--app-font-heading)" }}
              >
                {title}
              </h3>
              <p className="text-gray-700 text-sm font-medium mb-2">{content}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{note}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center mb-8 border border-dashed border-gray-300">
          <div className="text-center">
            <MapPin size={32} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">Interactive Map — Coming Soon</p>
            <p className="text-gray-400 text-sm">Map will be embedded once venue is confirmed</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {[
            { label: "View Map (Coming Soon)", testId: "button-view-map" },
            { label: "Get Directions (Coming Soon)", testId: "button-get-directions" },
            { label: "Explore Accommodations (Coming Soon)", testId: "button-accommodations" },
          ].map(({ label, testId }) => (
            <button
              key={label}
              className="border border-gray-300 text-gray-600 hover:border-[#1a56db] hover:text-[#1a56db] px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
              data-testid={testId}
              disabled
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-center text-gray-400 text-xs mt-6 italic">
          Venue and logistics details will be confirmed and updated prior to the event launch.
        </p>
      </div>
    </section>
  );
}
