import React, { useEffect, useRef } from "react";
import "./DialogComponent.css";

/**
 * Reusable dialog component that creates a popup modal
 * @param {boolean} isOpen - Whether the dialog is open
 * @param {function} onClose - Function to call when closing the dialog
 * @param {string} title - Dialog title
 * @param {React.ReactNode} children - Dialog content
 */
const DialogComponent = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    // Focus management for accessibility
    if (isOpen && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent scrolling when dialog is open
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = ""; // Restore scrolling when dialog is closed
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div className="dialog" ref={dialogRef} role="dialog" aria-modal="true">
        <div className="dialog-header">
          <h2 className="dialog-title">{title}</h2>
          <button onClick={onClose} className="dialog-close-button" aria-label="סגור">
            &times;
          </button>
        </div>
        <div className="dialog-content">{children}</div>
      </div>
    </div>
  );
};

export default DialogComponent;