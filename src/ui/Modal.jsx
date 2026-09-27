/* =============================================================
   Modal.jsx
   Slide-in portfolio section modal.
   - Closes on: X button, Escape key, click-outside
   - Animated in/out with CSS transitions (no Framer Motion needed)
   - Scrollable body for long content

   Props:
     section  — PORTFOLIO_SECTIONS entry (or null when closed)
     onClose  — called when modal should close
   ============================================================= */
import { useEffect, useRef } from "react";
import ModalContent from "./ModalContent";

export default function Modal({ section, onClose }) {
  const backdropRef = useRef();

  // Close on Escape key
  useEffect(() => {
    if (!section) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [section, onClose]);

  // Click-outside closes modal
  function handleBackdropClick(e) {
    if (e.target === backdropRef.current) onClose();
  }

  // Render null when no section — CSS animation will handle the fade
  if (!section) return null;

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={section.title}
    >
      <div className="modal-panel modal-enter">
        {/* Header */}
        <div
          className="modal-header"
          style={{ borderColor: section.color }}
        >
          <div className="modal-title-row">
            <span className="modal-icon">{section.icon}</span>
            <h2 className="modal-title">{section.title}</h2>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body (type-specific content) */}
        <div className="modal-scroll-area">
          <ModalContent content={section.content} />
        </div>
      </div>
    </div>
  );
}
