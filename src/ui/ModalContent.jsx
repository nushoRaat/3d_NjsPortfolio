/* =============================================================
   ModalContent.jsx
   Renders the body of each portfolio modal based on content.type.
   Adding a new section type = add a new case here.
   ============================================================= */

/* ── About ─────────────────────────────────────────────────── */
function AboutContent({ content }) {
  return (
    <div className="modal-body about-content">
      {content.bio.map((p, i) => (
        <p key={i} className="about-bio">{p}</p>
      ))}
      <div className="about-highlights">
        {content.highlights.map((h) => (
          <div key={h.label} className="highlight-row">
            <span className="highlight-label">{h.label}</span>
            <span className="highlight-value">{h.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Projects ───────────────────────────────────────────────── */
function ProjectsContent({ content }) {
  return (
    <div className="modal-body projects-content">
      {content.items.map((proj) => (
        <div key={proj.name} className="project-card">
          <div className="project-header">
            <h3 className="project-name">{proj.name}</h3>
            {proj.link && proj.link !== "#" && (
              <a
                href={proj.link}
                target="_blank"
                rel="noreferrer"
                className="project-link"
                aria-label={`Open ${proj.name}`}
              >
                ↗
              </a>
            )}
          </div>
          <p className="project-desc">{proj.description}</p>
          <div className="project-tags">
            {proj.tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Skills ─────────────────────────────────────────────────── */
function SkillsContent({ content }) {
  return (
    <div className="modal-body skills-content">
      {content.categories.map((cat) => (
        <div key={cat.name} className="skill-category">
          <h3 className="skill-cat-name">{cat.name}</h3>
          <div className="skill-chips">
            {cat.skills.map((s) => (
              <span key={s} className="skill-chip">{s}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Experience ─────────────────────────────────────────────── */
function ExperienceContent({ content }) {
  return (
    <div className="modal-body experience-content">
      {content.jobs.map((job) => (
        <div key={job.company} className="job-card">
          <div className="job-header">
            <div>
              <div className="job-role">{job.role}</div>
              <div className="job-company">{job.company}</div>
            </div>
            <div className="job-period">{job.period}</div>
          </div>
          <ul className="job-bullets">
            {job.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ── Contact ────────────────────────────────────────────────── */
function ContactContent({ content }) {
  return (
    <div className="modal-body contact-content">
      <p className="contact-intro">{content.intro}</p>
      <div className="contact-links">
        {content.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("mailto") ? "_self" : "_blank"}
            rel="noreferrer"
            className="contact-link-btn"
          >
            <span className="contact-icon">{link.icon}</span>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Router ─────────────────────────────────────────────────── */
export default function ModalContent({ content }) {
  if (!content) return null;
  switch (content.type) {
    case "about": return <AboutContent content={content} />;
    case "projects": return <ProjectsContent content={content} />;
    case "skills": return <SkillsContent content={content} />;
    case "experience": return <ExperienceContent content={content} />;
    case "contact": return <ContactContent content={content} />;
    default: return <p>Unknown section type: {content.type}</p>;
  }
}
