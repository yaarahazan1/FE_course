import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../PageHeader";

const AddTask = () => {
  return (
    <div style={{ padding: "2rem", direction: "rtl" }}>
      <PageHeader />

      <div style={{ maxWidth: "600px", margin: "0 auto", border: "1px solid #ccc", padding: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>הוספת משימה חדשה</h1>

        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label htmlFor="task-name">שם המשימה</label>
            <input type="text" id="task-name" placeholder="לדוגמה: הכנת מצגת" style={{ width: "100%", padding: "0.5rem" }} />
          </div>

          <div>
            <label htmlFor="description">תיאור</label>
            <textarea id="description" placeholder="הוסף תיאור למשימה" style={{ width: "100%", padding: "0.5rem" }}></textarea>
          </div>

          <div>
            <label htmlFor="due-date">תאריך יעד</label>
            <input type="date" id="due-date" style={{ width: "100%", padding: "0.5rem" }} />
          </div>

          <div>
            <label htmlFor="priority">עדיפות</label>
            <select id="priority" style={{ width: "100%", padding: "0.5rem" }}>
              <option value="">בחר עדיפות</option>
              <option value="high">גבוהה</option>
              <option value="medium">בינונית</option>
              <option value="low">נמוכה</option>
            </select>
          </div>

          <div>
            <label htmlFor="status">סטטוס</label>
            <select id="status" style={{ width: "100%", padding: "0.5rem" }}>
              <option value="">בחר סטטוס</option>
              <option value="todo">ממתין לביצוע</option>
              <option value="in-progress">בתהליך</option>
              <option value="completed">הושלם</option>
            </select>
          </div>

          <button type="submit" style={{ width: "100%", padding: "0.75rem", marginTop: "1rem" }}>
            📅 הוסף משימה
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
