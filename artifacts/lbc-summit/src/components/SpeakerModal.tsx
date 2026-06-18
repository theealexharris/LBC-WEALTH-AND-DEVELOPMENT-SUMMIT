import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Linkedin, Twitter, Globe } from "lucide-react";
import { type Speaker } from "@/data/speakers";

interface SpeakerModalProps {
  speaker: Speaker | null;
  onClose: () => void;
}

function InitialsAvatar({ name, large }: { name: string; large?: boolean }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const size = large ? "w-24 h-24 text-3xl" : "w-16 h-16 text-xl";
  return (
    <div
      className={`${size} rounded-full bg-gradient-to-br from-[#1a56db] to-[#0f1729] flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ fontFamily: "var(--app-font-heading)" }}
      aria-label={`${name} profile`}
    >
      {initials}
    </div>
  );
}

export default function SpeakerModal({ speaker, onClose }: SpeakerModalProps) {
  if (!speaker) return null;

  return (
    <Dialog open={!!speaker} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-5 mb-2">
            {speaker.photo ? (
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#1a56db]/20 shadow-md flex-shrink-0 bg-gray-50">
                <img src={speaker.photo} alt={speaker.name} className="w-full h-full object-cover object-center" />
              </div>
            ) : (
              <InitialsAvatar name={speaker.name} large />
            )}
            <div>
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 ${speaker.isKeynote ? "bg-[#1a56db] text-white" : speaker.isFeaturedHost ? "bg-[#c79d35] text-white" : "bg-gray-100 text-[#0f1729]"}`}>
                {speaker.isKeynote ? (speaker.dayLabel ?? `Keynote — ${speaker.duration}`) : speaker.isFeaturedHost ? "Featured Host" : `Featured — ${speaker.duration}`}
              </span>
              <DialogTitle
                className="text-xl font-extrabold text-[#0f1729]"
                style={{ fontFamily: "var(--app-font-heading)" }}
              >
                {speaker.name}
              </DialogTitle>
              <p className="text-gray-500 text-sm">{speaker.title}</p>
              {speaker.company && (
                <p className="text-[#1a56db] text-sm font-medium">{speaker.company}</p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-[#0f1729] rounded-xl p-5">
            <p className="text-[#c79d35] text-xs font-semibold uppercase tracking-widest mb-1">
              Session
            </p>
            <p className="text-white font-semibold text-base" style={{ fontFamily: "var(--app-font-heading)" }}>
              {speaker.sessionTitle}
            </p>
          </div>

          {speaker.transformationPromise && (
            <div>
              <p className="text-[#1a56db] text-xs font-semibold uppercase tracking-widest mb-1">
                What You'll Gain
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {speaker.transformationPromise}
              </p>
            </div>
          )}

          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">
              About
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">{speaker.bio}</p>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <p className="text-gray-400 text-xs">Connect:</p>
            <a href="#" className="text-gray-400 hover:text-[#1a56db] transition-colors" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#1a56db] transition-colors" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#1a56db] transition-colors" aria-label="Website">
              <Globe size={18} />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
