export type Speaker = {
  id: string;
  name: string;
  title: string;
  company: string;
  isKeynote: boolean;
  isFeaturedHost?: boolean;
  duration: string;
  dayLabel?: string;
  category: string;
  sessionTitle: string;
  transformationPromise: string;
  bio: string;
  photo?: string;
};

export const speakers: Speaker[] = [
  {
    id: "keynote-1",
    name: "Pastor Ruben Palomares",
    title: "Author | Speaker | Redemption Story",
    company: "Redefined Mindset",
    isKeynote: true,
    duration: "60 Minutes",
    dayLabel: "Day 1 Keynote Speaker",
    category: "Mindset, Identity & Transformational Leadership",
    sessionTitle: "Redefining Mindset: You Are Not Your Past",
    transformationPromise: "Learn to overcome limiting beliefs and unlock your true potential.",
    bio: "Pastor Ruben Palomares is the author of 'Redemption of a L.A.P.D. Rogue Cop' — a powerful story of transformation, redemption, and rebuilding identity after adversity. His message challenges audiences to stop being defined by their past and start building the future they deserve.",
    photo: "/IMG_2453.jpeg",
  },
  {
    id: "keynote-2",
    name: 'Coach Dementrus "Flip" Daniel',
    title: "Peer Coach | Speaker | Redemption Story",
    company: "Placeholder Co",
    isKeynote: true,
    duration: "60 Minutes",
    dayLabel: "Day 2 Keynote Speaker",
    category: "Wealth Development, & Mindset Implementation",
    sessionTitle: "From Survival To Strategy: Breaking The Survival Mindset",
    transformationPromise: "Discover practical strategies for wealth accumulation and asset building.",
    bio: "Bio coming soon.",
    photo: "/Flip and snoop.png",
  },
  {
    id: "featured-host",
    name: "Dr. Vicki Wright Hamilton",
    title: "Host",
    company: "LBC Wealth & Development Summit",
    isKeynote: false,
    isFeaturedHost: true,
    duration: "40 Minutes",
    dayLabel: "Featured Host",
    category: "AI, Leadership & Innovation",
    sessionTitle: "Aug. 15 – 16, 2026",
    transformationPromise: "",
    bio: "Dr. Vicki Wright Hamilton is a speaker, strategist, certified AI consultant, app builder, and founder of VWH Consulting, where she helps organizations lead people-first technology adoption, AI readiness, and culture-centered change. She is also the creator of PeacefulCare.ai, a caregiving technology app designed to help families stay informed, share responsibility, and manage care in one secure, connected place.\n\nHer work sits at the intersection of leadership, AI, innovation, and the future of work. Known for making complex technology feel practical, human, and actionable, Dr. Vicki equips leaders, teams, and communities to stay relevant, valuable, and distinctly human in the age of intelligent machines.\n\nAs a recognized leader, award-winning professional, and engaging host, Dr. Vicki brings warmth, credibility, strategic insight, and commanding executive presence to every stage. Whether leading a keynote, facilitating a conversation, or serving as MC, she creates experiences that connect technology, people, and purpose.",
    photo: "/Dr. Vicki Headshot.jpg",
  },
  {
    id: "featured-1",
    name: "Alexander Harris",
    title: "To Be Announced",
    company: "Placeholder Co",
    isKeynote: false,
    duration: "40 Minutes",
    category: "Personal Transformation",
    sessionTitle: "Reclaiming Your Story: Identity After Adversity",
    transformationPromise: "Rebuild your sense of self and harness past challenges as strengths.",
    bio: "Bio coming soon.",
    photo: "/Alex.jpeg",
  },
  {
    id: "featured-2",
    name: "Quatrell Walker",
    title: "To Be Announced",
    company: "Placeholder Co",
    isKeynote: false,
    duration: "40 Minutes",
    category: "Purpose, Resilience & Execution",
    sessionTitle: "From Vision to Action: The Implementation Framework",
    transformationPromise: "Turn inspiration into a concrete, executable plan.",
    bio: "Bio coming soon.",
    photo: "/Walker.jpeg",
  },
  {
    id: "featured-3",
    name: "Lamont Lee",
    title: "To Be Announced",
    company: "Placeholder Co",
    isKeynote: false,
    duration: "40 Minutes",
    category: "Leadership & Influence",
    sessionTitle: "Leading With Clarity: Communication, Resilience & Vision",
    transformationPromise: "Elevate your leadership presence and inspire teams to action.",
    bio: "Bio coming soon.",
    photo: "/Lamont.png",
  },
  {
    id: "featured-4",
    name: "Gwen Arrington",
    title: "To Be Announced",
    company: "Placeholder Co",
    isKeynote: false,
    duration: "40 Minutes",
    category: "Entrepreneurship",
    sessionTitle: "Turning Your Idea Into a Revenue-Generating Business",
    transformationPromise: "A step-by-step framework to launch and scale a profitable enterprise.",
    bio: "Bio coming soon.",
    photo: "/Gwen.jpeg",
  },
];
