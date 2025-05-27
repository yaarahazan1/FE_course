export const mockUsers = [
    { 
      id: 1, 
      name: "אריאל כהן", 
      email: "ariel@example.com", 
      studyField: "פסיכולוגיה", 
      status: "פעיל",
      institution: "אוניברסיטת תל אביב",
      recentActivities: [
        { id: 1, action: "העלאת סיכום", date: "10/04/2025", details: "מבוא לפסיכולוגיה - פרק 1" },
        { id: 2, action: "הוספת מטלה", date: "08/04/2025", details: "עבודה מסכמת בקורס התפתחות הילד" },
        { id: 3, action: "הגיב לשאלה", date: "05/04/2025", details: "בפורום של קורס שיטות מחקר" }
      ]
    },
    { 
      id: 2, 
      name: "תמר לוי", 
      email: "tamar@example.com", 
      studyField: "הנדסת תוכנה", 
      status: "פעיל",
      institution: "הטכניון",
      recentActivities: [
        { id: 1, action: "העלאת סיכום", date: "11/04/2025", details: "מבנה נתונים - עצים בינאריים" },
        { id: 2, action: "הוספת קורס", date: "07/04/2025", details: "תכנות מונחה עצמים" }
      ]
    },
    { 
      id: 3, 
      name: "דניאל שלום", 
      email: "daniel@example.com", 
      studyField: "רפואה", 
      status: "מוקפא",
      institution: "האוניברסיטה העברית",
      recentActivities: [
        { id: 1, action: "העלאת סיכום", date: "10/03/2025", details: "אנטומיה - מערכת העצבים" },
        { id: 2, action: "הוספת מטלה", date: "01/03/2025", details: "בחינה בקורס פיזיולוגיה" }
      ]
    },
    { 
      id: 4, 
      name: "מיכל ברק", 
      email: "michal@example.com", 
      studyField: "משפטים", 
      status: "פעיל",
      institution: "אוניברסיטת בר אילן",
      recentActivities: [
        { id: 1, action: "העלאת סיכום", date: "09/04/2025", details: "חוקי חוזים - סיכום הרצאה" },
        { id: 2, action: "הגיב בפורום", date: "07/04/2025", details: "שאלה בנושא דיני עונשין" },
        { id: 3, action: "עדכון פרופיל", date: "05/04/2025", details: "עדכון תמונת פרופיל" }
      ]
    },
    { 
      id: 5, 
      name: "נועה אברהם", 
      email: "noa@example.com", 
      studyField: "חינוך", 
      status: "פעיל",
      institution: "מכללת סמינר הקיבוצים",
      recentActivities: [
        { id: 1, action: "העלאת סיכום", date: "08/04/2025", details: "שיטות הוראה מתקדמות" },
        { id: 2, action: "הוספת קורס", date: "05/04/2025", details: "פסיכולוגיה חינוכית" }
      ]
    },
  ];
  
  export const mockSummaries = [
    { id: 1, title: "מבוא לפסיכולוגיה - פרק 1", author: "אריאל כהן", status: "ממתין", date: "12/4/2025" },
    { id: 2, title: "מבנה נתונים - עצים בינאריים", author: "תמר לוי", status: "ממתין", date: "11/4/2025" },
    { id: 3, title: "אנטומיה - מערכת העצבים", author: "דניאל שלום", status: "ממתין", date: "10/4/2025" },
    { id: 4, title: "חוקי חוזים - סיכום הרצאה", author: "מיכל ברק", status: "ממתין", date: "9/4/2025" },
    { id: 5, title: "שיטות הוראה מתקדמות", author: "נועה אברהם", status: "ממתין", date: "8/4/2025" },
  ];