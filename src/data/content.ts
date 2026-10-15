/**
 * content.ts — Single source of truth for all portfolio copy.
 * Edit this file to update any text on the site.
 * Fields marked TODO must be filled in before launch.
 */

export const meta = {
  title: "Panca Nugraha Wicaksana — Fullstack AI Engineer",
  description:
    "Fullstack AI Engineer (backend-focused) with DevOps, frontend and ML/data experience. Building scalable, secure, end-to-end solutions.",
  ogImage: "/og.png", // TODO: add a 1200×630 og image to /public
  siteUrl: "https://pancanugraha.dev", // TODO: update to production URL
};

export const hero = {
  name: "Panca Nugraha\nWicaksana",
  title: "Fullstack AI Engineer",
  tagline:
    "Backend-focused engineer with DevOps, frontend and ML/data experience.\nBuilding scalable, secure, end-to-end solutions.",
  cta: { label: "See my work", href: "#projects" },
  scrollHint: "Scroll",
};

export const about = {
  heading: "About",
  body: [
    "Computer Science undergraduate with strong expertise in backend development and hands-on experience across backend, DevOps and frontend. Skilled in machine learning and data applications.",
    "I deliver scalable, secure, end-to-end solutions and thrive in cross-functional teams. Currently interning as a Data Scientist & AI/ML Engineer while finishing my degree at Binus University.",
  ],
  location: "Blitar, East Java, Indonesia",
  highlights: [
    { value: 50, suffix: "+", label: "Certifications" },
    { value: 2, suffix: "", label: "AI competition placements" },
    { value: 2, suffix: " yrs 5 mos", label: "at POSDIGI as core backend engineer" },
  ],
};

export type ExperienceItem = {
  role: string;
  company: string;
  type: string;
  period: string;
  duration?: string;
  bullets: string[];
  stack: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Data Scientist & AI/ML Engineer",
    company: "VINIX7",
    type: "Internship",
    period: "Aug 2026 – Present",
    bullets: [
      "Python, advanced SQL, NumPy, Pandas — EDA and feature engineering pipelines.",
      "Built and evaluated Decision Tree, Random Forest, XGBoost, K-Means models.",
      "Deep learning fundamentals; deployed models as production apps with Streamlit, Flask and Docker.",
    ],
    stack: ["Python", "Pandas", "NumPy", "XGBoost", "Streamlit", "Flask", "Docker"],
  },
  {
    role: "Backend Engineer",
    company: "PT Pos Finansial Indonesia (POSDIGI)",
    type: "Contract",
    period: "Mar 2024 – Jul 2026",
    duration: "2 yrs 5 mos",
    bullets: [
      "Core engineer owning projects end-to-end: client communication, technical planning, implementation and maintenance.",
      "Designed and shipped scalable, secure backend systems serving production traffic.",
      "Managed DevOps deployment workflows and contributed frontend work for integration and UX polish.",
    ],
    stack: ["Node.js", "Golang", "PostgreSQL", "Docker", "GitLab"],
  },
  {
    role: "Backend Engineer",
    company: "Telkom Indonesia DDS",
    type: "Internship",
    period: "Jun 2022 – Jul 2023",
    bullets: [
      "Built and maintained authentication flows and server-side logic on VM infrastructure.",
      "Primary language: Rust; secondary Node.js applications.",
      "Used GitHub Projects and Jira for sprint tracking.",
    ],
    stack: ["Rust", "Node.js", "GitHub Projects", "Jira"],
  },
  {
    role: "Backend Engineer",
    company: "DOT Indonesia",
    type: "Internship",
    period: "Mar 2022 – Jun 2022",
    bullets: [
      "Top-performing intern, awarded A-grade evaluation.",
      "Followed Agile Scrum with Jira and Slack.",
      "Implemented backend features with Laravel; contributed Vue frontend.",
    ],
    stack: ["Laravel", "Vue", "PHP", "Jira"],
  },
  {
    role: "Frontend Developer",
    company: "Mokleters",
    type: "Part-time",
    period: "2021 – 2022",
    bullets: [
      "Built the Mokleters company website from scratch.",
      "Stack: React, jQuery, Craco, Bootstrap.",
    ],
    stack: ["React", "jQuery", "Bootstrap"],
  },
];

export type EducationItem = {
  degree: string;
  institution: string;
  period: string;
  detail: string;
};

export const education: EducationItem[] = [
  {
    degree: "B.Sc. Computer Science (candidate)",
    institution: "Binus University Online Learning",
    period: "2023 – present (expected 2027)",
    detail: "GPA 3.86 / 4.0",
  },
  {
    degree: "Software Engineering",
    institution: "SMK Telkom Malang (Vocational High School)",
    period: "2020 – 2023",
    detail: "Final average score 88",
  },
];

export type SkillGroup = {
  label: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["JavaScript", "PHP", "Golang", "Python", "Rust", "HTML + CSS"],
  },
  {
    label: "Backend & Frameworks",
    items: ["Node.js", "Express", "Laravel", "CodeIgniter", "gRPC", "RabbitMQ"],
  },
  {
    label: "Frontend",
    items: ["React.js", "Vue", "Bootstrap"],
  },
  {
    label: "Data & AI",
    items: ["Python", "Pandas", "NumPy", "XGBoost", "Streamlit", "Flask"],
  },
  {
    label: "Databases",
    items: ["MySQL", "PostgreSQL", "MongoDB"],
  },
  {
    label: "Tooling",
    items: ["Git + GitHub", "GitLab", "Docker", "Postman", "Jira", "Figma"],
  },
];

export type ProjectItem = {
  title: string;
  problem: string;
  stack: string[];
  role: string;
  link?: string;
  image?: string;
};

export const projects: ProjectItem[] = [
  {
    // TODO: replace with real project
    title: "TODO: Project Title 1",
    problem: "TODO: One-line description of the problem this project solved.",
    stack: ["TODO", "Stack", "Here"],
    role: "TODO: Your role (e.g. Sole engineer, Lead backend)",
    link: undefined,
    image: "/placeholders/project-01.svg",
  },
  {
    // TODO: replace with real project
    title: "TODO: Project Title 2",
    problem: "TODO: One-line description of the problem this project solved.",
    stack: ["TODO", "Stack", "Here"],
    role: "TODO: Your role",
    link: undefined,
    image: "/placeholders/project-02.svg",
  },
  {
    // TODO: replace with real project
    title: "TODO: Project Title 3",
    problem: "TODO: One-line description of the problem this project solved.",
    stack: ["TODO", "Stack", "Here"],
    role: "TODO: Your role",
    link: undefined,
    image: "/placeholders/project-03.svg",
  },
];

export type Achievement = {
  title: string;
  issuer: string;
  date: string;
};

export const achievements: Achievement[] = [
  {
    title: "2nd Place — Provincial Level AI Competition (LKS AI)",
    issuer: "East Java Province",
    date: "May 2023",
  },
  {
    title: "1st Place — City-level AI Competition",
    issuer: "TODO: issuer / city name",
    date: "TODO: date",
  },
  {
    title: "Certificate of Competency — Node.js & React (Very Competent)",
    issuer: "DOT Indonesia",
    date: "Apr 2023",
  },
  {
    title: "Certificate of Competence Web Development",
    issuer: "BNSP",
    date: "Feb 2023",
  },
  {
    title: "IT Specialist — Databases",
    issuer: "Certiport",
    date: "Dec 2022",
  },
  {
    title: "Additional courses (Udemy, HackerRank, Coding Studio, Progate)",
    issuer: "Various",
    date: "2020 – 2022",
  },
];

export const certificatesLink =
  "https://drive.google.com/drive/folders/1_aRqESfESfhKBJ-lagS9zBXwswIh2MOD?usp=drive_link";

export const contact = {
  heading: "Get in touch",
  body: "I am open to full-time roles, contract work and interesting side projects. The best way to reach me is by email.",
  email: "pancanugrahawicaksana@gmail.com",
  linkedin: "https://www.linkedin.com/in/panca-nugraha-wicaksana/",
};

export const footer = {
  copy: `© ${new Date().getFullYear()} Panca Nugraha Wicaksana`,
  linkedin: "https://www.linkedin.com/in/panca-nugraha-wicaksana/",
};
