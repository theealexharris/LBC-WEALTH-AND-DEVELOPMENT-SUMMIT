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
      { id: "d1-1a", time: "9:00–9:30am", title: "Registration, networking, music and sponsor engagement — VIP Early Admission", type: "vip" },
      { id: "d1-1b", time: "9:30–10:00am", title: "Registration, networking, music and sponsor engagement — General Admission", type: "break" },
      { id: "d1-2", time: "9:00–9:15am", title: "Summit opening and welcome", type: "break" },
      { id: "d1-3", time: "9:15–10:15am", title: "Keynote Speaker 1", type: "keynote" },
      { id: "d1-4", time: "10:15–10:30am", title: "Break and networking", type: "break" },
      { id: "d1-5", time: "10:30–11:10am", title: "Featured Speaker 1", type: "featured" },
      { id: "d1-6", time: "11:10–11:50am", title: "Featured Speaker 2", type: "featured" },
      { id: "d1-7", time: "11:50am–12:30pm", title: "Lunch and networking", type: "break" },
      { id: "d1-8", time: "12:30–1:10pm", title: "Featured Speaker 3", type: "featured" },
      { id: "d1-9", time: "1:10–1:25pm", title: "Audience reflection and implementation exercise", type: "workshop" },
      { id: "d1-10", time: "1:25–2:05pm", title: "Leadership and wealth-building panel", type: "panel" },
      { id: "d1-11", time: "2:05–2:20pm", title: "Break", type: "break" },
      { id: "d1-12", time: "2:20–2:50pm", title: "Transformation workshop", type: "workshop" },
      { id: "d1-13", time: "2:50–3:00pm", title: "Day One closing", type: "break" },
      { id: "d1-14", time: "4:00–5:00pm", title: "Private keynote debrief, Q&A, speaker networking", type: "vip" },
    ],
  },
  {
    day: 2,
    title: "Day 2",
    items: [
      { id: "d2-1a", time: "12:00–12:30pm", title: "Registration, networking, music and sponsor engagement — VIP Early Admission", type: "vip" },
      { id: "d2-1b", time: "12:30–1:00pm", title: "Registration, networking, music and sponsor engagement — General Admission", type: "break" },
      { id: "d2-2", time: "9:00–9:10am", title: "Day Two opening and implementation challenge", type: "break" },
      { id: "d2-3", time: "9:10–10:10am", title: "Keynote Speaker 2", type: "keynote" },
      { id: "d2-4", time: "10:10–10:25am", title: "Break", type: "break" },
      { id: "d2-5", time: "10:25–11:05am", title: "Featured Speaker 4", type: "featured" },
      { id: "d2-6", time: "11:05–11:45am", title: "Featured Speaker 5", type: "featured" },
      { id: "d2-7", time: "11:45am–12:15pm", title: "Guided implementation workshop", type: "workshop" },
      { id: "d2-8", time: "12:15–12:45pm", title: "Seven-speaker panel and audience Q&A", type: "panel" },
      { id: "d2-9", time: "12:45–1:00pm", title: "Commitments and closing message", type: "break" },
      { id: "d2-10", time: "5:00–6:00pm", title: "Private implementation lab, direct speaker access, VIP closing reception", type: "vip" },
    ],
  },
];
