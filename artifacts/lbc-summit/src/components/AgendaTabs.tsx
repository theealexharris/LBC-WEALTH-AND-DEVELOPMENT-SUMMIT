import { useState } from "react";
import { agenda, type AgendaItem } from "@/data/agenda";
import { Star } from "lucide-react";

const typeConfig: Record<
  AgendaItem["type"],
  { label: string; color: string; border: string }
> = {
  keynote: {
    label: "Keynote",
    color: "bg-blue-600 text-white",
    border: "border-l-blue-600",
  },
  featured: {
    label: "Featured",
    color: "bg-purple-600 text-white",
    border: "border-l-purple-600",
  },
  workshop: {
    label: "Workshop",
    color: "bg-teal-600 text-white",
    border: "border-l-teal-600",
  },
  panel: {
    label: "Panel",
    color: "bg-orange-500 text-white",
    border: "border-l-orange-500",
  },
  vip: {
    label: "VIP Only",
    color: "bg-[#c79d35] text-[#0a0f1e]",
    border: "border-l-[#c79d35]",
  },
  break: {
    label: "",
    color: "bg-gray-100 text-gray-500",
    border: "border-l-gray-200",
  },
};

function AgendaRow({ item }: { item: AgendaItem }) {
  const config = typeConfig[item.type];
  const isVip = item.type === "vip";

  return (
    <div
      className={`flex flex-col sm:flex-row gap-2 sm:gap-4 items-start py-4 border-b border-gray-100 last:border-0 border-l-4 pl-4 ${config.border} ${isVip ? "bg-amber-50/50" : ""}`}
    >
      <div className="sm:w-28 flex-shrink-0">
        <p className="text-xs text-gray-500 leading-tight">{item.time}</p>
      </div>
      <div className="flex-1 flex items-start gap-3">
        {item.type !== "break" && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${config.color}`}>
            {config.label}
          </span>
        )}
        {isVip && <Star size={14} className="text-[#c79d35] flex-shrink-0 mt-1" />}
        <p className={`text-sm font-medium ${isVip ? "text-[#c79d35] font-semibold" : "text-gray-800"}`}>
          {item.title}
          {isVip && <span className="ml-2 text-xs text-gray-400">(VIP Ticket Required)</span>}
        </p>
      </div>
    </div>
  );
}

export default function AgendaTabs() {
  const [activeDay, setActiveDay] = useState(1);
  const dayData = agenda.find((d) => d.day === activeDay);

  return (
    <section id="agenda" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#1a56db] text-sm font-semibold tracking-widest uppercase mb-3">
            Schedule
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-[#0f1729] mb-4"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Full Summit Agenda
          </h2>
          <p className="text-gray-500 text-base">
            All times are subject to adjustment. VIP sessions require a VIP ticket.
          </p>
        </div>

        <div className="flex gap-2 bg-gray-100 rounded-xl p-1 mb-8 max-w-sm mx-auto">
          {agenda.map((day) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(day.day)}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeDay === day.day
                  ? "bg-[#1a56db] text-white shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              data-testid={`button-agenda-day${day.day}`}
            >
              Day {day.day}
            </button>
          ))}
        </div>

        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className={`px-6 py-4 ${activeDay === 1 ? "bg-[#1a56db]" : "bg-[#0f1729]"}`}>
            <p className="text-white font-bold" style={{ fontFamily: "var(--app-font-heading)" }}>
              {activeDay === 1
                ? "Day One — Transformation, Vision & Wealth Development"
                : "Day Two — Implementation & Development Training"}
            </p>
            <p className="text-white/70 text-xs mt-0.5">
              {activeDay === 1 ? "General Session: 10:00am–4:00pm · VIP: 4:00–5:00pm" : "General Session: 9:00am–1:00pm · VIP: 1:15–2:15pm"}
            </p>
          </div>
          <div className="px-6 divide-y divide-gray-100">
            {dayData?.items.map((item) => (
              <AgendaRow key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-8">
          {Object.entries(typeConfig)
            .filter(([k]) => k !== "break")
            .map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
                  {cfg.label}
                </span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
