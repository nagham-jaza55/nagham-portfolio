"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  Code2,
  Database,
  Github,
  Globe2,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  Monitor,
  Network,
  Server,
  Terminal,
  Workflow,
  X,
} from "lucide-react";
import { experience, profile, projects, type Project } from "@/lib/portfolio";
import { ContactForm } from "./contact-form";
import { ProjectPreview } from "./project-preview";

const navigation = [
  ["About", "about"],
  ["Expertise", "expertise"],
  ["Projects", "projects"],
  ["Experience", "experience"],
];
const skillGroups = [
  {
    icon: Monitor,
    name: "Frontend",
    subtitle: "Interfaces people enjoy",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Redux",
    ],
  },
  {
    icon: Server,
    name: "Backend",
    subtitle: "Logic that holds up",
    skills: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "GraphQL",
      "Socket.io",
      "Authentication",
    ],
  },
  {
    icon: Database,
    name: "Databases",
    subtitle: "A solid foundation",
    skills: [
      "MongoDB",
      "Mongoose",
      "PostgreSQL",
      "Redis",
      "Schema design",
      "Indexing",
    ],
  },
  {
    icon: Workflow,
    name: "DevOps & tools",
    subtitle: "From commit to production",
    skills: [
      "Git & GitHub",
      "Docker",
      "GitHub Actions",
      "Vercel",
      "Figma",
      "CI/CD",
    ],
  },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ArchitectureVisual() {
  const [active, setActive] = useState(0);
  const layers = [
    {
      name: "The experience",
      tech: "React / Next.js",
      icon: Monitor,
      code: "interface",
      label: "Fast, accessible interfaces.",
      tag: "FRONTEND",
    },
    {
      name: "The intelligence",
      tech: "Node.js / Express",
      icon: Braces,
      code: "server",
      label: "Purposeful, resilient APIs.",
      tag: "BACKEND",
    },
    {
      name: "The foundation",
      tech: "MongoDB",
      icon: Database,
      code: "database",
      label: "Data designed to grow.",
      tag: "DATABASE",
    },
  ];
  return (
    <div className="architecture-visual">
      <div className="orbit-ring ring-one" />
      <div className="orbit-ring ring-two" />
      <div className="visual-corner corner-top" />
      <div className="visual-corner corner-bottom" />
      <div className="visual-label">
        <span className="status-dot" /> END-TO-END THINKING
      </div>
      <div className="stack-layers">
        {layers.map((layer, index) => (
          <button
            type="button"
            key={layer.tag}
            className={`stack-layer layer-${index} ${active === index ? "layer-active" : ""}`}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
          >
            <span className="stack-icon">
              <layer.icon size={23} strokeWidth={1.5} />
            </span>
            <span className="stack-copy">
              <span className="stack-tag">{layer.tag}</span>
              <strong>{layer.tech}</strong>
            </span>
            <span className="stack-number">0{index + 1}</span>
          </button>
        ))}
      </div>
      <div className="code-caption" aria-live="polite">
        <span className="code-symbol">&lt;/&gt;</span>
        <span>
          <span className="muted">
            {"// "}
            {layers[active].code}
          </span>
          <br />
          {layers[active].label}
        </span>
        <span className="code-cursor" />
      </div>
      <div className="floating-note">
        <span className="note-icon">
          <Check size={13} />
        </span>{" "}
        Built with intention.
      </div>
    </div>
  );
}

function ProjectDialog({
  project,
  close,
}: {
  project: Project;
  close: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      aria-labelledby="dialog-title"
      onCancel={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="dialog-content">
        <div className="dialog-heading">
          <div>
            <span className="eyebrow">INTERACTIVE CONCEPT</span>
            <h2 id="dialog-title">{project.title}</h2>
          </div>
          <button
            className="icon-button"
            onClick={close}
            aria-label="Close project preview"
          >
            <X size={22} />
          </button>
        </div>
        <ProjectPreview theme={project.theme} interactive />
        <p className="dialog-description">{project.description}</p>
        <h3>Architecture direction</h3>
        <ul className="architecture-list">
          {project.architecture.map((item) => (
            <li key={item}>
              <Check size={16} />
              {item}
            </li>
          ))}
        </ul>
        <div className="tech-tags">
          {project.stack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <p className="concept-note">
          An interactive UI concept. Architecture notes describe the proposed
          system; this preview does not run a production backend.
        </p>
      </div>
    </dialog>
  );
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All projects");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const visibleProjects = projects.filter(
    (project) => filter === "All projects" || project.category === filter,
  );

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container nav-inner">
          <a href="#" className="wordmark" aria-label={`${profile.name}, home`}>
            nagham<span className="logo-dot">.</span>
            <span className="wordmark-code">/dev</span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <a href="#contact" className="nav-contact">
            Let’s talk <ArrowUpRight size={16} />
          </a>
          <button
            type="button"
            className="menu-toggle icon-button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-navigation"
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {[...navigation, ["Contact", "contact"]].map(([label, id]) => (
                <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                  {label}
                  <ArrowUpRight size={18} />
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main">
        <section className="hero container" aria-labelledby="hero-title">
          <Reveal className="hero-content">
            <div className="availability">
              <span className="status-dot" /> {profile.availability}
            </div>
            <p className="hero-intro">
              HELLO, I’M {profile.name.toUpperCase()}{" "}
              <span className="intro-line" />
            </p>
            <h1 id="hero-title">
              Thoughtful code.
              <br />
              Remarkable
              <br />
              <span className="accent-text">experiences.</span>
            </h1>
            <p className="hero-description">
              Full-stack development with a product mindset.
              <br className="desktop-break" /> I connect beautiful interfaces
              with the architecture
              <br className="desktop-break" /> that makes them work.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="button button-primary">
                Explore my work <ArrowUpRight size={19} />
              </a>
              <a href="#contact" className="button button-outline">
                Get in touch <ArrowRight size={18} />
              </a>
            </div>
            <div className="hero-footnote">
              <span className="tiny-avatars">
                <span>N</span>
                <span>
                  <Code2 size={13} />
                </span>
              </span>
              <span>A little detail. A lot of intention.</span>
            </div>
          </Reveal>
          <Reveal className="hero-art" delay={0.15}>
            <ArchitectureVisual />
          </Reveal>
          <a className="scroll-hint" href="#about">
            <ArrowDown size={14} />
            <span>SCROLL TO EXPLORE</span>
          </a>
          <span className="hero-index">PORTFOLIO — 2026</span>
        </section>

        <div className="tech-strip">
          <div className="container tech-strip-inner">
            <span className="tech-strip-label">MY EVERYDAY TOOLKIT</span>
            <span>
              <Code2 />
              React
            </span>
            <span className="next-logo">
              N<span>Next.js</span>
            </span>
            <span>
              <Braces />
              Node.js
            </span>
            <span>
              <Database />
              MongoDB
            </span>
            <span className="type-logo">
              TS<span>TypeScript</span>
            </span>
            <span>
              <Workflow />
              Git
            </span>
          </div>
        </div>

        <section id="about" className="section container about-section">
          <Reveal className="about-heading">
            <div className="section-kicker">
              <span>01 / ABOUT ME</span>
              <span className="kicker-line" />
            </div>
            <h2>
              More than code.
              <br />
              <span className="muted-heading">A bigger picture.</span>
            </h2>
            <a
              className="text-link"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              A look at my GitHub <ArrowUpRight size={17} />
            </a>
          </Reveal>
          <Reveal className="about-copy" delay={0.1}>
            <p className="about-lead">
              I care about what happens between
              <br className="desktop-break" /> “what if” and “it works.”
            </p>
            <p>
              From the first database schema to the last interaction, I approach
              development as a connected system. My focus is on thoughtful
              architecture, fast experiences, and code that’s a pleasure to
              build on.
            </p>
            <p>
              I work across the MERN stack, bringing design sensitivity to
              engineering and a practical mindset to every product decision.
            </p>
            <div className="strengths">
              <span>
                <Network size={17} /> Systems thinking
              </span>
              <span>
                <Layers3 size={17} /> End-to-end ownership
              </span>
              <span>
                <Globe2 size={17} /> Accessible by design
              </span>
              <span>
                <Terminal size={17} /> Performance first
              </span>
            </div>
          </Reveal>
        </section>

        <section id="expertise" className="section expertise-section">
          <div className="container">
            <Reveal className="section-top">
              <div>
                <div className="section-kicker">02 / THE TOOLKIT</div>
                <h2>
                  The right tools.
                  <br />
                  <span className="muted-heading">The whole stack.</span>
                </h2>
              </div>
              <p>
                From the pixels you see to the systems you don’t.
                <br />A connected toolkit for complete experiences.
              </p>
            </Reveal>
            <div className="skills-grid">
              {skillGroups.map((group, index) => (
                <Reveal
                  className="skill-card"
                  key={group.name}
                  delay={index * 0.06}
                >
                  <div className="skill-card-top">
                    <group.icon size={24} strokeWidth={1.5} />
                    <span>0{index + 1}</span>
                  </div>
                  <h3>{group.name}</h3>
                  <p>{group.subtitle}</p>
                  <div className="skill-tags">
                    {group.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section container projects-section">
          <Reveal className="section-top">
            <div>
              <div className="section-kicker">03 / SELECTED WORK</div>
              <h2>
                Built to solve.
                <br />
                <span className="muted-heading">Designed to feel right.</span>
              </h2>
            </div>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              View GitHub <Github size={17} />
              <ArrowUpRight size={16} />
            </a>
          </Reveal>
          <div className="projects-toolbar">
            <div
              className="project-filters"
              role="group"
              aria-label="Filter projects"
            >
              {["All projects", "Full-stack", "Frontend"].map((item) => (
                <button
                  key={item}
                  className={filter === item ? "filter-active" : ""}
                  aria-pressed={filter === item}
                  onClick={() => setFilter(item)}
                >
                  {item}
                  {item === "All projects" && (
                    <span>{projects.length.toString().padStart(2, "0")}</span>
                  )}
                </button>
              ))}
            </div>
            <span className="sample-label">INTERACTIVE CONCEPTS</span>
          </div>
          <div className="project-grid" aria-live="polite">
            {visibleProjects.map((project, index) => (
              <Reveal
                className="project-card"
                key={project.slug}
                delay={index * 0.07}
              >
                <div className="project-image">
                  <ProjectPreview theme={project.theme} />
                  <button
                    className="project-preview-trigger"
                    aria-label={`Preview ${project.title}`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <span className="project-open">
                      <ArrowUpRight size={21} />
                    </span>
                  </button>
                </div>
                <div className="project-meta">
                  <span>{project.type}</span>
                  <span>0{projects.indexOf(project) + 1}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tech-tags">
                  {project.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                <div className="project-highlight">
                  <span className="status-dot" />
                  {project.highlight}
                </div>
                <div className="project-actions">
                  {project.demoUrl ? (
                    <a
                      className="text-link"
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live demo <ArrowUpRight size={16} />
                    </a>
                  ) : (
                    <button
                      className="text-link"
                      onClick={() => setSelectedProject(project)}
                    >
                      Explore concept <ArrowUpRight size={16} />
                    </button>
                  )}
                  {project.githubUrl ? (
                    <a
                      className="source-link"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Github size={16} /> Source code
                    </a>
                  ) : (
                    <span
                      className="source-link source-pending"
                      title="This is a UI concept; a project repository has not been linked."
                    >
                      <Code2 size={15} /> UI concept
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="experience" className="section experience-section">
          <div className="container experience-layout">
            <Reveal>
              <div className="section-kicker">04 / THE JOURNEY</div>
              <h2>
                Always building.
                <br />
                <span className="muted-heading">Always growing.</span>
              </h2>
              <p className="experience-intro">
                A focus on thoughtful engineering,
                <br />
                collaboration, and lasting impact.
              </p>
              <span className="sample-label">ILLUSTRATIVE CAREER TIMELINE</span>
            </Reveal>
            <div className="timeline">
              {experience.map((item, index) => (
                <Reveal
                  className="timeline-item"
                  key={item.role}
                  delay={index * 0.1}
                >
                  <div className="timeline-dot" />
                  <div className="timeline-period">
                    {item.period}
                    <span>0{index + 1}</span>
                  </div>
                  <h3>{item.role}</h3>
                  <span className="timeline-company">{item.company}</span>
                  <p>{item.description}</p>
                  <div className="timeline-tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section container contact-section">
          <Reveal className="contact-copy">
            <div className="section-kicker">05 / WHAT’S NEXT?</div>
            <h2>
              Good things start
              <br />
              with a <span className="accent-text">hello.</span>
              <span className="contact-star">✳</span>
            </h2>
            <p>
              Have a project in mind, a role that fits,
              <br />
              or a really good question? I’d love to hear it.
            </p>
            <div className="contact-availability">
              <span className="status-dot" />
              {profile.availability}
            </div>
            <div className="social-links">
              <a href={profile.github} target="_blank" rel="noreferrer">
                <Github size={20} />
                GitHub
                <ArrowUpRight size={14} />
              </a>
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={20} />
                  LinkedIn
                  <ArrowUpRight size={14} />
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`}>
                  <Mail size={20} />
                  Email
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </Reveal>
          <Reveal className="contact-form-wrap" delay={0.1}>
            <ContactForm />
          </Reveal>
        </section>
      </main>

      <footer className="site-footer container">
        <a href="#" className="wordmark">
          nagham<span className="logo-dot">.</span>
        </a>
        <p>
          © {new Date().getFullYear()} {profile.name}. Crafted with care.
        </p>
        <a href="#main" className="back-top">
          Back to top <ArrowUpRight size={16} />
        </a>
      </footer>
      {selectedProject && (
        <ProjectDialog
          project={selectedProject}
          close={() => setSelectedProject(null)}
        />
      )}
    </MotionConfig>
  );
}
