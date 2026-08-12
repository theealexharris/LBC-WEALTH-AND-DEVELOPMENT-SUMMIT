export type AgendaItem = {
  id: string;
  time: string;
  title: string;
  type: "keynote" | "featured" | "workshop" | "panel" | "vip" | "break";
};

export type DayAgenda = {
  day: number;
  title: string;
  items: AgendaItem[];
};

export const agenda: DayAgenda[] = [
  {
    day: 1,
    title: "Day 1",
    items: [
      { id: "d1-1", time: "9:00–9:30am", title: "VIP Early Admission", type: "vip" },
      { id: "d1-2", time: "9:30–10:00am", title: "General Admission Check-In", type: "break" },
      { id: "d1-3", time: "10:00–10:15am", title: "Opening Welcome", type: "break" },
      { id: "d1-4", time: "10:15–10:55am", title: "Guest Speaker #1 — Alexander Harris", type: "featured" },
      { id: "d1-5", time: "10:55–11:10am", title: "Interactive Workshop #1", type: "workshop" },
      { id: "d1-6", time: "11:10–11:30am", title: "Networking Break #1", type: "break" },
      { id: "d1-7", time: "11:30–11:45am", title: "Transition / Sponsor Engagement", type: "break" },
      { id: "d1-8", time: "11:45am–12:25pm", title: "Guest Speaker #2 — Lamonte Lee", type: "featured" },
      { id: "d1-9", time: "12:25–1:10pm", title: "Lunch Break & Networking", type: "break" },
      { id: "d1-10", time: "1:10–2:25pm", title: "Keynote Speaker #1 — Ruben Palomares", type: "keynote" },
      { id: "d1-11", time: "2:25–2:40pm", title: "Networking Break #2", type: "break" },
      { id: "d1-12", time: "2:40–3:00pm", title: "Interactive Workshop #2", type: "workshop" },
      { id: "d1-13", time: "3:00–3:40pm", title: "Leadership & Wealth-Building Panel", type: "panel" },
      { id: "d1-14", time: "3:40–4:00pm", title: "Day One Closing Remarks", type: "break" },
      { id: "d1-15", time: "4:00–5:00pm", title: "VIP 1-on-1 Session", type: "vip" },
    ],
  },
  {
    day: 2,
    title: "Day 2",
    items: [
      { id: "d2-1", time: "12:00–12:30pm", title: "VIP Early Admission", type: "vip" },
      { id: "d2-2", time: "12:30–1:00pm", title: "General Admission Check-In", type: "break" },
      { id: "d2-3", time: "1:00–1:10pm", title: "Day Two Opening & Implementation Challenge", type: "break" },
      { id: "d2-4", time: "1:10–1:50pm", title: "Guest Speaker #1 — Quatrell Walker", type: "featured" },
      { id: "d2-5", time: "1:50–2:05pm", title: "Networking Break", type: "break" },
      { id: "d2-6", time: "2:05–2:45pm", title: "Guest Speaker #2 — Gwendolyn V. Arrington", type: "featured" },
      { id: "d2-7", time: "2:45–3:00pm", title: "Transition / Audience Engagement", type: "break" },
      { id: "d2-8", time: "3:00–4:15pm", title: 'Keynote Speaker #2 — Coach Dementrus "Flip" Daniel', type: "keynote" },
      { id: "d2-9", time: "4:15–4:35pm", title: "Guided Implementation Workshop", type: "workshop" },
      { id: "d2-10", time: "4:35–4:50pm", title: "Panel / Audience Q&A", type: "panel" },
      { id: "d2-11", time: "4:50–5:00pm", title: "Final Commitments & Closing", type: "break" },
      { id: "d2-12", time: "5:00–6:00pm", title: "VIP 1-on-1 Session", type: "vip" },
    ],
  },
];
