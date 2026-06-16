import { useState } from "react";
import { speakers, type Speaker } from "@/data/speakers";
import SpeakerModal from "@/components/SpeakerModal";

function SpeakerAvatar({ name, photo, isKeynote }: { name: string; photo?: string; isKeynote?: boolean }) {
  if (photo) {
    return (
      <div className={`mx-auto mb-5 overflow-hidden rounded-2xl border border-[#1a56db]/20 shadow-md bg-gray-50 ${isKeynote ? "w-full h-96" : "w-full h-44"}`}>
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-contain object-center"
        />
      </div>
    );
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1a56db] to-[#0f1729] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-5"
      style={{ fontFamily: "var(--app-font-heading)" }}
      aria-label={`${name} speaker photo placeholder`}
    >
      {initials}
    </div>
  );
}

function SpeakerCard({
  speaker,
  onView,
}: {
  speaker: Speaker;
  onView: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border p-7 text-center flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
        speaker.isKeynote ? "border-[#1a56db]/40 shadow-md" : "border-gray-200"
      }`}
    >
      {speaker.isKeynote && (
        <div className="flex justify-center mb-3">
          <span className="bg-[#1a56db] text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide uppercase">
            {speaker.dayLabel ?? "Keynote Speaker"}
          </span>
        </div>
      )}
      {!speaker.isKeynote && (
        <div className="flex justify-center mb-3">
          <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-4 py-1 rounded-full tracking-wide uppercase">
            Featured — {speaker.duration}
          </span>
        </div>
      )}

      <SpeakerAvatar name={speaker.name} photo={speaker.photo} isKeynote={speaker.isKeynote} />

      <h3
        className="text-lg font-extrabold text-[#0f1729] mb-1"
        style={{ fontFamily: "var(--app-font-heading)" }}
      >
        {speaker.name}
      </h3>
      <p className="text-sm text-gray-500 mb-1">{speaker.title}</p>
      <p className="text-xs text-[#1a56db] font-semibold mb-3">{speaker.category}</p>

      <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 flex-1">
        <p className="text-sm font-semibold text-[#0f1729] italic leading-snug">
          "{speaker.sessionTitle}"
        </p>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed mb-5">
        {speaker.transformationPromise}
      </p>

      <button
        onClick={onView}
        className="border border-[#1a56db] text-[#1a56db] hover:bg-[#1a56db] hover:text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
        data-testid={`button-view-bio-${speaker.id}`}
      >
        View Full Bio
      </button>
    </div>
  );
}

export default function SpeakerGrid() {
  const [selected, setSelected] = useState<Speaker | null>(null);
  const keynotes = speakers.filter((s) => s.isKeynote);
  const featured = speakers.filter((s) => !s.isKeynote);

  return (
    <section id="speakers" className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#1a56db] text-sm font-semibold tracking-widest uppercase mb-3">
            The Lineup
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold text-[#0f1729] mb-4"
            style={{ fontFamily: "var(--app-font-heading)" }}
          >
            Seven Voices. One Mission: Helping You Build What Comes Next.
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Each speaker was selected to equip, challenge, and move you forward —
            not simply to inspire.
          </p>
        </div>

        <div className="mb-8">
          <p className="text-xs font-bold text-[#c79d35] uppercase tracking-widest text-center mb-6">
            Keynote Speakers
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {keynotes.map((s) => (
              <SpeakerCard key={s.id} speaker={s} onView={() => setSelected(s)} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-6">
            Featured Speakers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {featured.map((s) => (
              <SpeakerCard key={s.id} speaker={s} onView={() => setSelected(s)} />
            ))}
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-10 italic">
          Speaker lineup and session topics are subject to change.
        </p>
      </div>

      <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
