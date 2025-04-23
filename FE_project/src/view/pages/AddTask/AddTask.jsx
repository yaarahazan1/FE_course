const AddTask = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "center",
      alignItems: "center", zIndex: 1000
    }}>
      <div style={{ background: "#fff", padding: "2rem", width: "100%", maxWidth: "600px", borderRadius: "8px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>הוספת משימה חדשה</h2>
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

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" onClick={onClose}>ביטול</button>
            <button type="submit">📅 הוסף משימה</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
