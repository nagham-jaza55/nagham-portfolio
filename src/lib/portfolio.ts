// Identity supplied by Nagham; GitHub profile verified at github.com/nagham-jaza55.
// The public profile currently has no bio, contact details, or public repositories.
// Project concepts and illustrative experience below should be replaced with real work.
export const profile = {
  name: "Nagham Jaza",
  role: "Senior Full-Stack Developer",
  email: "naghamjaza5@gmail.com", // Provided by Nagham.
  github: "https://github.com/nagham-jaza55",
  linkedin: "", // Your complete LinkedIn profile URL.
  availability: "Open to meaningful collaborations",
};

export type Project = {
  slug: string;
  title: string;
  category: "Full-stack" | "Frontend";
  type: string;
  description: string;
  stack: string[];
  highlight: string;
  architecture: string[];
  demoUrl: string | null;
  githubUrl: string | null;
  theme: "orbit" | "forma" | "pulse";
};

export const projects: Project[] = [
  {
    slug: "orbit",
    title: "Orbit",
    category: "Full-stack",
    type: "PROJECT MANAGEMENT PLATFORM",
    description:
      "A calmer workspace for ambitious teams. Projects, conversations, and progress, beautifully connected.",
    stack: ["Next.js", "Node.js", "MongoDB", "Socket.io"],
    highlight: "Real-time collaboration · Role-based access",
    architecture: [
      "Isolated team workspaces with role-based permissions",
      "Socket.io events for live task updates",
      "Indexed MongoDB queries and cursor-based pagination",
    ],
    demoUrl: null,
    githubUrl: null,
    theme: "orbit",
  },
  {
    slug: "forma",
    title: "Forma",
    category: "Full-stack",
    type: "HEADLESS COMMERCE EXPERIENCE",
    description:
      "Considered objects. Effortless shopping. A storefront concept that puts product and performance first.",
    stack: ["React", "Express", "MongoDB", "Stripe"],
    highlight: "Optimistic cart · Accessible checkout",
    architecture: [
      "Server-rendered product pages and cached catalog queries",
      "Optimistic cart updates with server reconciliation",
      "Webhook-based payment fulfillment and idempotent order processing",
    ],
    demoUrl: null,
    githubUrl: null,
    theme: "forma",
  },
  {
    slug: "pulse",
    title: "Pulse",
    category: "Frontend",
    type: "ANALYTICS & INSIGHTS DASHBOARD",
    description:
      "Complex data, clear decisions. An expressive analytics interface built to make every metric meaningful.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Recharts"],
    highlight: "Responsive data views · Keyboard accessible",
    architecture: [
      "Composable chart and metric components",
      "URL-based filtering and shareable dashboard views",
      "Progressive loading and accessible data summaries",
    ],
    demoUrl: null,
    githubUrl: null,
    theme: "pulse",
  },
];

// Illustrative roles, not claims about the owner's employment history.
export const experience = [
  {
    period: "Most recent",
    role: "Senior Full-Stack Developer",
    company: "Product engineering · Sample role",
    description:
      "Own technical direction from architecture through release. Partner with design and product to turn complex requirements into considered experiences.",
    tags: ["System architecture", "Technical mentorship", "Product delivery"],
  },
  {
    period: "Previously",
    role: "Full-Stack Developer",
    company: "Digital products · Sample role",
    description:
      "Build resilient APIs and responsive interfaces, improve database queries, and bring confidence to delivery with automated pipelines.",
    tags: ["API development", "Performance", "CI/CD"],
  },
];
