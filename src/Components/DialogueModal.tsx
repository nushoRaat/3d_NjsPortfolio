import React, { useState, useEffect } from 'react';
import { PORTFOLIO_CONTENT, ProjectItem } from '../game/data/content';
import { FaExternalLinkAlt, FaGithub, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

interface DialogueModalProps {
  sectionId: string;
  onClose: () => void;
}

export default function DialogueModal({ sectionId, onClose }: DialogueModalProps) {
  const content = PORTFOLIO_CONTENT[sectionId];
  const [projectIndex, setProjectIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Trigger the slide-up animation on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!content) return null;

  const isProjectsSection = sectionId === 'projects' && content.projects && content.projects.length > 0;
  const currentProject: ProjectItem | undefined = isProjectsSection ? content.projects![projectIndex] : undefined;

  const handleNextProject = () => {
    if (content.projects) {
      setProjectIndex((prev) => (prev + 1) % content.projects!.length);
      setActiveImageIndex(0);
    }
  };

  const handlePrevProject = () => {
    if (content.projects) {
      setProjectIndex((prev) => (prev - 1 + content.projects!.length) % content.projects!.length);
      setActiveImageIndex(0);
    }
  };

  // Multi-screenshot navigation for current project
  const projectImages = currentProject?.images && currentProject.images.length > 0
    ? currentProject.images
    : [currentProject?.thumbnail || ''];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  // Derive panel classes: always 'dialogue-panel', add 'open' when mounted, 'project-mode' for projects
  const panelClasses = [
    'dialogue-panel',
    isOpen ? 'open' : '',
    isProjectsSection ? 'project-mode' : '',
  ].filter(Boolean).join(' ');

  return (
    // Transparent full-screen click-catcher — no flex centering
    <div style={backdropStyle} onClick={onClose}>
      <div
        className={panelClasses}
        style={dialoguePanelStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={headerStyle}>
          <div>
            {/* Tag Pill Above Title */}
            <span style={sectionTagPillStyle}>
              {sectionId.toUpperCase()} SECTION
            </span>
            <div style={titleRowStyle}>
              <span style={{ fontSize: '1.4rem', marginRight: '8px' }}>{content.icon}</span>
              <h2 style={titleStyle}>{content.title}</h2>
            </div>
            <p style={subtitleStyle}>{content.subtitle}</p>
          </div>
          <button style={{ ...closeBtnStyle, border: `2px solid ${isProjectsSection ? '#4ecdc4' : '#ff6b9d'}` }} onClick={onClose} aria-label="Close modal">
            <FaTimes style={{ marginRight: '4px' }} /> CLOSE
          </button>
        </div>

        {/* Content Body */}
        <div style={bodyStyle}>
          {content.bio && <p style={bioStyle}>{content.bio}</p>}

          {/* Standard Dialogue Section (About, Education, Experience, Skills, Contact) */}
          {!isProjectsSection && content.items && (
            <ul style={listStyle}>
              {content.items.map((item, idx) => (
                <li key={idx} style={listItemStyle}>
                  <span style={bulletStyle}>◆</span> {item}
                </li>
              ))}
            </ul>
          )}

          {/* Project Showcase Panel (Multi-Screenshot Gallery + Outer Project Carousel) */}
          {isProjectsSection && currentProject && (
            <div style={projectShowcaseContainerStyle}>
              {/* Outer Project-to-Project Carousel Controls */}
              <div style={outerCarouselHeaderStyle}>
                <span style={projectCounterStyle}>
                  PROJECT {projectIndex + 1} OF {content.projects!.length}: <strong style={{ color: 'var(--accent-gold)' }}>{currentProject.title.toUpperCase()}</strong>
                </span>
                <div style={outerNavBtnGroupStyle}>
                  <button style={navBtnStyle} onClick={handlePrevProject} aria-label="Previous project">
                    <FaChevronLeft style={{ marginRight: '2px' }} /> PREV PROJ
                  </button>
                  <button style={navBtnStyle} onClick={handleNextProject} aria-label="Next project">
                    NEXT PROJ <FaChevronRight style={{ marginLeft: '2px' }} />
                  </button>
                </div>
              </div>

              {/* Main Screenshot Gallery */}
              <div style={galleryContainerStyle}>
                {/* 16:9 Main Image View */}
                <div style={mainImageWrapperStyle}>
                  <img
                    src={projectImages[activeImageIndex]}
                    alt={`${currentProject.title} screenshot ${activeImageIndex + 1}`}
                    style={mainImageStyle}
                    onError={(e) => {
                      // Fallback placeholder if image link is broken
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="337" viewBox="0 0 600 337"><rect width="600" height="337" fill="%2316283e"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%234ecdc4" font-family="monospace" font-size="20">ADD SCREENSHOT %23' + (activeImageIndex + 1) + '</text></svg>';
                    }}
                  />

                  {/* Inner Gallery Arrows */}
                  {projectImages.length > 1 && (
                    <>
                      <button style={galleryLeftArrowStyle} onClick={handlePrevImage} aria-label="Previous screenshot">
                        <FaChevronLeft />
                      </button>
                      <button style={galleryRightArrowStyle} onClick={handleNextImage} aria-label="Next screenshot">
                        <FaChevronRight />
                      </button>
                    </>
                  )}

                  {/* Screenshot Overlay Counter */}
                  <div style={imageCounterBadgeStyle}>
                    SHOT {activeImageIndex + 1}/{projectImages.length}
                  </div>
                </div>

                {/* Thumbnail Row */}
                <div style={thumbnailRowStyle}>
                  {projectImages.map((imgUrl, idx) => {
                    const isSelected = idx === activeImageIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        style={{
                          ...thumbnailButtonStyle,
                          border: isSelected ? '2px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.2)',
                          opacity: isSelected ? 1 : 0.6,
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          style={thumbnailImgStyle}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" fill="%2316283e"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffd23f" font-family="monospace" font-size="10">%23' + (idx + 1) + '</text></svg>';
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Project Meta Information */}
              <div style={projectDetailsStyle}>
                {/* Category Badge & Tags Row */}
                <div style={tagsContainerStyle}>
                  <span style={categoryTagStyle}>{currentProject.category.toUpperCase()}</span>
                  {currentProject.tags.map((tag, idx) => (
                    <span key={idx} style={tagPillStyle}>
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 style={projectTitleStyle}>{currentProject.title}</h3>
                <p style={projectDescStyle}>{currentProject.description}</p>

                {/* Action Links */}
                <div style={linksContainerStyle}>
                  {currentProject.liveLink && (
                    <a
                      href={currentProject.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={liveDemoBtnStyle}
                    >
                      ▶ LIVE DEMO
                    </a>
                  )}
                  {currentProject.githubLink && (
                    <a
                      href={currentProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={sourceCodeBtnStyle}
                    >
                      ◆ SOURCE CODE
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Transparent full-screen click-catcher — no centering, no flex */
const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(8, 17, 25, 0.55)',
  zIndex: 999,
};

/*
 * Bottom-anchored RPG dialogue panel.
 * Closed state: transform: translate(-50%, 140%) — pushed fully below viewport.
 * Open state (.open class): transform: translate(-50%, 0%) — slides up into view.
 * Project-mode (.project-mode class): narrower width + teal border.
 *
 * CSS classes are injected via a <style> tag rendered once by this component.
 */
const dialoguePanelStyle: React.CSSProperties = {
  /* Base layout — scrollable body */
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  color: 'var(--parchment)',
  maxHeight: '82vh',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '16px 20px 12px 20px',
  borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
  backgroundColor: 'rgba(13, 27, 42, 0.5)',
};

const sectionTagPillStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: 'var(--accent-gold)',
  color: 'var(--bg-deep)',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '9px',
  padding: '3px 8px',
  marginBottom: '6px',
  boxShadow: '2px 2px 0 #000',
};

const titleRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const titleStyle: React.CSSProperties = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '14px',
  color: 'var(--parchment)',
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontFamily: "'VT323', monospace",
  fontSize: '16px',
  color: 'var(--accent-blue)',
  margin: '4px 0 0 0',
};

const closeBtnStyle: React.CSSProperties = {
  backgroundColor: 'var(--wall-mid)',
  color: 'var(--parchment)',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '10px',
  padding: '6px 12px',
  boxShadow: '2px 2px 0 #000',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};

const bodyStyle: React.CSSProperties = {
  padding: '20px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const bioStyle: React.CSSProperties = {
  fontFamily: "'VT323', monospace",
  fontSize: '19px',
  lineHeight: '1.35',
  color: 'var(--parchment)',
  margin: 0,
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const listItemStyle: React.CSSProperties = {
  fontFamily: "'VT323', monospace",
  fontSize: '19px',
  lineHeight: '1.35',
  color: 'var(--parchment)',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
};

const bulletStyle: React.CSSProperties = {
  color: 'var(--accent-gold)',
  fontSize: '14px',
};

const projectShowcaseContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
};

const outerCarouselHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '8px',
};

const projectCounterStyle: React.CSSProperties = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '10px',
  color: 'var(--parchment)',
};

const outerNavBtnGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
};

const navBtnStyle: React.CSSProperties = {
  backgroundColor: 'var(--wall-mid)',
  border: '2px solid var(--accent-teal)',
  color: 'var(--parchment)',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '9px',
  padding: '5px 10px',
  boxShadow: '2px 2px 0 #000',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};

const galleryContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const mainImageWrapperStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  backgroundColor: 'var(--bg-deep)',
  border: '2px solid var(--accent-teal)',
  boxShadow: '3px 3px 0 #000',
  overflow: 'hidden',
};

const mainImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const galleryLeftArrowStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '8px',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(13, 27, 42, 0.85)',
  border: '2px solid var(--accent-gold)',
  color: 'var(--accent-gold)',
  width: '32px',
  height: '32px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  boxShadow: '2px 2px 0 #000',
};

const galleryRightArrowStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  right: '8px',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(13, 27, 42, 0.85)',
  border: '2px solid var(--accent-gold)',
  color: 'var(--accent-gold)',
  width: '32px',
  height: '32px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  boxShadow: '2px 2px 0 #000',
};

const imageCounterBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '8px',
  right: '8px',
  backgroundColor: 'var(--bg-deep)',
  border: '1px solid var(--accent-gold)',
  color: 'var(--accent-gold)',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '8px',
  padding: '3px 6px',
};

const thumbnailRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  paddingBottom: '4px',
};

const thumbnailButtonStyle: React.CSSProperties = {
  width: '64px',
  height: '48px',
  padding: 0,
  backgroundColor: 'var(--bg-deep)',
  boxShadow: '2px 2px 0 #000',
  cursor: 'pointer',
  flexShrink: 0,
  overflow: 'hidden',
};

const thumbnailImgStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const projectDetailsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginTop: '4px',
};

const tagsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
};

const categoryTagStyle: React.CSSProperties = {
  backgroundColor: 'var(--accent-teal)',
  color: 'var(--bg-deep)',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '8px',
  padding: '3px 8px',
  boxShadow: '2px 2px 0 #000',
};

const tagPillStyle: React.CSSProperties = {
  backgroundColor: 'var(--accent-pink)',
  color: 'var(--bg-deep)',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '8px',
  padding: '3px 8px',
  boxShadow: '2px 2px 0 #000',
};

const projectTitleStyle: React.CSSProperties = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '13px',
  color: 'var(--parchment)',
  margin: 0,
};

const projectDescStyle: React.CSSProperties = {
  fontFamily: "'VT323', monospace",
  fontSize: '18px',
  lineHeight: '1.35',
  color: 'var(--parchment)',
  margin: 0,
};

const linksContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginTop: '6px',
};

const liveDemoBtnStyle: React.CSSProperties = {
  backgroundColor: 'var(--accent-gold)',
  color: 'var(--bg-deep)',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '9px',
  padding: '8px 14px',
  boxShadow: '2px 2px 0 #000',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
};

const sourceCodeBtnStyle: React.CSSProperties = {
  backgroundColor: 'var(--accent-teal)',
  color: 'var(--bg-deep)',
  fontFamily: "'Press Start 2P', monospace",
  fontSize: '9px',
  padding: '8px 14px',
  boxShadow: '2px 2px 0 #000',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
};
