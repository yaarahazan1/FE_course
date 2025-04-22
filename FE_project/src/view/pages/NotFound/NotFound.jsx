
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./NotFound.css";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.iconContainer}>
          <i className={styles.icon}>📂</i>
        </div>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>אופס! העמוד שחיפשת לא נמצא</p>
        <Link to="/" className={styles.homeLink}>
          <button className={styles.button}>
            חזרה לדף הבית
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
