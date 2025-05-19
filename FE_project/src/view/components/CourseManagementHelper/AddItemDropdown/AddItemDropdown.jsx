import React, { useState, useRef, useEffect } from "react";
import "./AddItemDropdown.css";

const AddItemDropdown = ({ onAddCourse, onAddProject, onAddTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAddItem = (action) => {
    setIsOpen(false);
    action();
  };

  // סגירת הדרופדאון כאשר לוחצים מחוץ לאזור שלו
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="add-item-dropdown" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="add-item-button">
        + הוסף פריט
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={() => handleAddItem(onAddCourse)} className="dropdown-item">
            הוסף קורס
          </button>
          <button onClick={() => handleAddItem(onAddProject)} className="dropdown-item">
            הוסף פרויקט
          </button>
          <button onClick={() => handleAddItem(onAddTask)} className="dropdown-item">
            הוסף משימה
          </button>
        </div>
      )}
    </div>
  );
};

export default AddItemDropdown;