// SearchBar.jsx
import React from 'react';
import "./SearchBar.css";

const SearchBar = ({ onAddCourse, onAddProject }) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  return (
    <div className="search-container">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="חפש פרויקט, פרטים, נושאים..."
          className="search-input"
          dir="rtl"
        />
        <div className="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
      <div className="add-container">
        <div className="popover-container">
          <button 
            className="add-button"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>הוספת קורס/פרויקט</span>
          </button>
          
          {isPopoverOpen && (
            <div className="popover-content">
              <button 
                className="popover-item" 
                onClick={onAddCourse}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
                <span>הוספת קורס</span>
              </button>
              <button 
                className="popover-item" 
                onClick={onAddProject}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
                <span>הוספת פרויקט</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;