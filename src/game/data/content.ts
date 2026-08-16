export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  thumbnail: string;
  images: string[]; // minimum 3 entries
  liveLink?: string;
  githubLink?: string;
}

export interface SectionContent {
  title: string;
  subtitle: string;
  icon: string;
  bio?: string;
  items?: string[];
  projects?: ProjectItem[];
}

export const PORTFOLIO_CONTENT: Record<string, SectionContent> = {
  about: {
    title: 'About Me',
    subtitle: 'Full-Stack Developer & Interactive Systems Engineer',
    icon: '💻',
    bio: 'Hi there! I am a passionate developer with expertise in building responsive web applications, interactive 2D/3D systems, and high-performance game mechanics. I love blending clean code with rich UI/UX experiences.',
    items: [
      '📍 Location: Dhaka, Bangladesh',
      '🎓 Degree: B.Sc. in Computer Science & Engineering',
      '⚡ Focus: Full-Stack Web Development & Game Systems',
      '💡 Passions: Pixel Art, Clean Architecture, UI Motion Design',
    ],
  },
  education: {
    title: 'Education & Achievements',
    subtitle: 'Academic background and honors',
    icon: '🎓',
    items: [
      '🎓 B.Sc. in Computer Science & Engineering — Ahsanullah University of Science & Technology',
      '📜 Publication: Depression Detection Through Smartphone Sensing: A Federated Learning Approach',
      '🏆 Joint Secretary of AUST Innovation and Design Club',
      '🥇 Competitive Programming & Hackathon Participant',
    ],
  },
  experience: {
    title: 'Work Experience',
    subtitle: '3+ years of building software solutions',
    icon: '💼',
    items: [
      '🚀 Software & Game Engineer (3+ Years): Designed and implemented core gameplay systems, UI/UX mechanics, and RESTful web backend API services.',
      '🛠️ Full-Stack Project Development: Built responsive web applications using React, Node.js, Express, and Vite.',
      '🤝 Agile Team Lead: Collaborated in cross-functional teams with version control, automated testing, and CI/CD pipelines.',
    ],
  },
  skills: {
    title: 'Skills & Tech Stack',
    subtitle: 'Technologies & tools I work with daily',
    icon: '⚡',
    items: [
      'Frontend: React, TypeScript, Vite, PixiJS, HTML5, CSS3, Framer Motion',
      'Backend: Node.js, Express, REST APIs, MongoDB, Postman',
      'Languages: C#, JavaScript / TypeScript, C++, SQL, Python',
      'Tools: Git, GitHub, VS Code, Figma, Unity Engine, Render / Vercel',
    ],
  },
  projects: {
    title: 'Featured Projects',
    subtitle: 'Browse interactive showcases and live demos',
    icon: '🎮',
    projects: [
      {
        id: 'proj-1',
        title: 'Pixel Art Portfolio Room',
        category: 'Interactive Web',
        description: 'A playable top-down 2D portfolio game built using Vite, React, TypeScript, and PixiJS v8. Features WASD/touch movement, AABB collisions, and interactive hotspots.',
        tags: ['React', 'TypeScript', 'PixiJS v8', 'Vite', 'CSS3'],
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
        ],
        liveLink: 'https://github.com/nushoRaat',
        githubLink: 'https://github.com/nushoRaat',
      },
      {
        id: 'proj-2',
        title: 'Cyberpunk Tactical RPG Prototype',
        category: 'Game Engine',
        description: 'Grid-based tactical strategy game prototype created in Unity (C#) featuring pathfinding AI, skill cooldown systems, and customizable isometric tilemaps.',
        tags: ['Unity', 'C#', 'Game AI', 'Pathfinding', 'Shader Graph'],
        thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        ],
        liveLink: 'https://github.com/nushoRaat',
        githubLink: 'https://github.com/nushoRaat',
      },
      {
        id: 'proj-3',
        title: 'Full-Stack Portfolio CMS & Admin Panel',
        category: 'Web App',
        description: 'RESTful admin management portal with JWT authentication, image upload management, and project status tracking built with Node.js and Express.',
        tags: ['Node.js', 'Express', 'React', 'REST API', 'JSON Store'],
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
        ],
        liveLink: 'https://github.com/nushoRaat',
        githubLink: 'https://github.com/nushoRaat',
      },
    ],
  },
  contact: {
    title: 'Contact Me',
    subtitle: 'Let\'s collaborate and build something awesome!',
    icon: '📬',
    bio: 'Feel free to reach out for project inquiries, freelance work, software engineering roles, or tech discussions.',
    items: [
      '📧 Email: nusrat.jahan.portfolio@gmail.com',
      '🌐 GitHub: github.com/nushoRaat',
      '💼 LinkedIn: linkedin.com/in/nushoRaat',
      '💬 Discord / Telegram: @nushoRaat',
    ],
  },
};
