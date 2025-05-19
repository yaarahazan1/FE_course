import React from "react";
import AddItemDropdown from "../AddItemDropdown/AddItemDropdown";
import "./SearchBar.css";

const SearchBar = ({ onAddCourse, onAddProject, onAddTask }) => {
  return (
    <div className="search-bar-container">
      <div className="search-bar-buttons">
        <AddItemDropdown 
          onAddCourse={onAddCourse} 
          onAddProject={onAddProject} 
          onAddTask={onAddTask}
        />
      </div>
      <input
        type="text"
        className="search-input"
        placeholder="חפש לפי שם משימה, קורס או פרויקט..."
      />
    </div>
  );
};

export default SearchBar;