export type Speaker = {
  id: string;
  name: string;
  title: string;
  company: string;
  isKeynote: boolean;
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
    name: "Keynote Speaker 2",
    title: "To Be Announced",
    company: "Placeholder Co",
    isKeynote: true,
    duration: "60 Minutes",
    dayLabel: "Day 2 Keynote Speaker",
    category: "Wealth Development, Entrepreneurship & Implementation",
    sessionTitle: "From Income to Wealth: Building Assets That Work While You Sleep",
    transformationPromise: "Discover practical strategies for wealth accumulation and asset building.",
    bio: "Bio coming soon. This placeholder text will be updated once the speaker is finalized.",
    photo: "/IMG_keynote2.jpeg",
  },
  {
    id: "featured-1",
    name: "Featured Speaker 1",
    title: "To Be Announced",
    company: "Placeholder Co",
    isKeynote: false,
    duration: "40 Minutes",
    category: "Personal Transformation",
    sessionTitle: "Reclaiming Your Story: Identity After Adversity",
    transformationPromise: "Rebuild your sense of self and harness past challenges as strengths.",
    bio: "Bio coming soon.",
  },
  {
    id: "featured-2",
    name: "Featured Speaker 2",
    title: "To Be Announced",
    company: "Placeholder Co",
    isKeynote: false,
    duration: "40 Minutes",
    category: "Financial Development",
    sessionTitle: "The Fundamentals of Financial Intelligence",
    transformationPromise: "Master the core principles of money management and strategic investing.",
    bio: "Bio coming soon.",
  },
  {
    id: "featured-3",
    name: "Featured Speaker 3",
    title: "To Be Announced",
    company: "Placeholder Co",
    isKeynote: false,
    duration: "40 Minutes",
    category: "Entrepreneurship",
    sessionTitle: "Turning Your Idea Into a Revenue-Generating Business",
    transformationPromise: "A step-by-step framework to launch and scale a profitable enterprise.",
    bio: "Bio coming soon.",
  },
  {
    id: "featured-4",
    name: "Featured Speaker 4",
    title: "To Be Announced",
    company: "Placeholder Co",
    isKeynote: false,
    duration: "40 Minutes",
    category: "Leadership & Influence",
    sessionTitle: "Leading With Clarity: Communication, Resilience & Vision",
    transformationPromise: "Elevate your leadership presence and inspire teams to action.",
    bio: "Bio coming soon.",
  },
  {
    id: "featured-5",
    name: "Featured Speaker 5",
    title: "To Be Announced",
    company: "Placeholder Co",
    isKeynote: false,
    duration: "40 Minutes",
    category: "Purpose, Resilience & Execution",
    sessionTitle: "From Vision to Action: The Implementation Framework",
    transformationPromise: "Turn inspiration into a concrete, executable plan.",
    bio: "Bio coming soon.",
  },
];
