/**
 * portfolio.js
 * -----------
 * Central data file for all portfolio content.
 * Edit this file to update the content of the modals without
 * touching any component logic.
 *
 * Each entry maps to one of the 5 interactive objects in the scene.
 * `id`       — unique identifier (must match object id in scene)
 * `label`    — short label shown as the proximity UI cue above the cube
 * `title`    — modal heading
 * `icon`     — emoji icon shown in the modal header
 * `color`    — cube color in the 3D scene (CSS hex or named color)
 * `position` — [x, z] position on the ground plane (y is always 0)
 * `content`  — free-form content object; shape depends on section type
 */

export const PLAYER_NAME = "Your Name";
export const PLAYER_TAGLINE = "Full-Stack Developer & Creative Coder";
export const PLAYER_AVATAR_INITIAL = "YN"; // shown in HUD avatar circle

export const PORTFOLIO_SECTIONS = [
  {
    id: "about",
    label: "About Me",
    title: "About Me",
    icon: "",
    color: "#6c63ff",   // violet
    position: [-6, -6],
    content: {
      type: "about",
      bio: [
        "Hi there! I'm a passionate developer who loves building interactive experiences at the intersection of code and creativity.",
        "I specialize in full-stack web development, real-time 3D on the web, and game-adjacent tooling.",
        "When I'm not coding I enjoy game design, generative art, and long hikes.",
      ],
      highlights: [
        { label: "Based in", value: "Your City, Country" },
        { label: "Open to", value: "Full-time / Freelance" },
        { label: "Interests", value: "Web, Games, Creative Tech" },
      ],
    },
  },
  {
    id: "projects",
    label: "Projects",
    title: "Projects",
    icon: "",
    color: "#ff6584",   // pink-red
    position: [6, -6],
    content: {
      type: "projects",
      items: [
        {
          name: "Project Alpha",
          description: "A real-time collaborative whiteboard built with WebSockets and Canvas API.",
          tags: ["React", "Node.js", "WebSockets"],
          link: "#",
        },
        {
          name: "Project Beta",
          description: "An isometric puzzle game built entirely in the browser using Three.js.",
          tags: ["Three.js", "TypeScript", "Vite"],
          link: "#",
        },
        {
          name: "Project Gamma",
          description: "A generative art platform that converts audio input into visual patterns.",
          tags: ["WebAudio API", "Canvas", "Python"],
          link: "#",
        },
      ],
    },
  },
  {
    id: "skills",
    label: "Skills",
    title: "Skills",
    icon: "",
    color: "#43e97b",   // green
    position: [0, 5],
    content: {
      type: "skills",
      categories: [
        {
          name: "Frontend",
          skills: ["React", "Three.js / R3F", "TypeScript", "CSS / Tailwind", "WebGL / GLSL"],
        },
        {
          name: "Backend",
          skills: ["Node.js", "Express", "PostgreSQL", "REST / GraphQL", "Docker"],
        },
        {
          name: "Tools & Other",
          skills: ["Git", "Vite", "Figma", "Blender (basics)", "Unity (basics)"],
        },
      ],
    },
  },
  {
    id: "experience",
    label: "Experience",
    title: "Work Experience",
    icon: "",
    color: "#f7971e",   // orange
    position: [-6, 4],
    content: {
      type: "experience",
      jobs: [
        {
          role: "Senior Frontend Developer",
          company: "Awesome Tech Co.",
          period: "2022 – Present",
          bullets: [
            "Led a team of 4 building a real-time dashboard serving 50k+ users.",
            "Introduced Three.js visualisations that increased user engagement by 30%.",
            "Owned the design system and component library.",
          ],
        },
        {
          role: "Frontend Developer",
          company: "Startup Studio",
          period: "2020 – 2022",
          bullets: [
            "Shipped 3 products from 0 to 1 in a fast-paced startup environment.",
            "Built internal tooling that reduced QA time by 40%.",
          ],
        },
        {
          role: "Freelance Developer",
          company: "Self-Employed",
          period: "2018 – 2020",
          bullets: [
            "Delivered 10+ web projects for clients across e-commerce, media, and SaaS.",
          ],
        },
      ],
    },
  },
  {
    id: "contact",
    label: "Contact",
    title: "Contact Me",
    icon: "✉️",
    color: "#38bdf8",   // sky blue
    position: [6, 4],
    content: {
      type: "contact",
      intro: "I'm currently open to new opportunities. Whether it's a job, a collaboration, or just a chat - my inbox is always open.",
      links: [
        { label: "Email", href: "mailto:you@example.com", icon: "📧" },
        { label: "GitHub", href: "https://github.com/yourhandle", icon: "🐙" },
        { label: "LinkedIn", href: "https://linkedin.com/in/yourhandle", icon: "💼" },
        { label: "Twitter", href: "https://twitter.com/yourhandle", icon: "🐦" },
      ],
    },
  },
];
