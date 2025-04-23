import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="notfound-container">
      <div className="notfound-box">
        <div className="notfound-icon">📁</div>
        <h1 className="notfound-title">404</h1>
        <p className="notfound-message">אופס! העמוד שחיפשת לא נמצא</p>
        <Link to="/">
          <button className="notfound-button">חזרה לדף הבית</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
