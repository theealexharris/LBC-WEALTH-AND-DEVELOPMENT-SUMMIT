import { MapPin, Car, Accessibility, Hotel, Plane } from "lucide-react";

const HOTEL_ADDRESS = "5325 CA-1, Long Beach, CA 90804";
const HOTEL_NAME = "Hotel Current";
const HOTEL_PHONE = "(562) 597-1341";

const details = [
  {
    icon: MapPin,
    title: "Venue",
    content: `${HOTEL_NAME} — ${HOTEL_ADDRESS}`,
    note: `Phone: ${HOTEL_PHONE}`,
  },
  {
    icon: Car,
    title: "Parking",
    content: "On-site parking available",
    note: "Hotel Current offers parking for guests and event attendees.",
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
    content: HOTEL_NAME,
    note: "Stay on-site at the event venue. Contact the hotel directly to book your room.",
  },
  {
    icon: Plane,
    title: "Nearest Airport",
    content: "Long Beach Airport (LGB) — also served by LAX & BUR",
    note: "Long Beach Airport is approximately 10 minutes from the venue.",
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
            {HOTEL_NAME} — {HOTEL_ADDRESS}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </section>
  );
}
