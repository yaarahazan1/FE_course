import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", direction: "rtl" }}>
      <div style={{ textAlign: "center", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📁</div>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>404</h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>אופס! העמוד שחיפשת לא נמצא</p>
        <Link to="/">
          <button style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>חזרה לדף הבית</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
