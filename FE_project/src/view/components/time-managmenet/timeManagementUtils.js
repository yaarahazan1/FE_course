// Constants
export const CalendarView = {
    MONTHLY: "חודשי",
    WEEKLY: "שבועי",
  };
  
  export const EventType = {
    ALL: "הכל",
    STUDY: "לימודים",
    PERSONAL: "אישי",
  };
  
  export const Priority = {
    URGENT: "דחוף מאוד",
    HIGH: "דחוף",
    IMPORTANT: "חשוב",
    LESS_URGENT: "פחות דחוף",
  };
  
  // Helper functions
  export const getPriorityColor = (priority) => {
    switch (priority) {
      case Priority.URGENT:
        return "bg-red-500";
      case Priority.HIGH:
        return "bg-orange-500";
      case Priority.IMPORTANT:
        return "bg-blue-500";
      case Priority.LESS_URGENT:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };
  
  export const getTypeColor = (type) => {
    switch (type) {
      case EventType.STUDY:
        return "bg-purple-500";
      case EventType.PERSONAL:
        return "bg-green-500";
      case EventType.ALL:
      default:
        return "bg-blue-500";
    }
  };
  
  // Helper function to create a week view
  export const getWeekDays = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const weekDays = [];
  
    for (let i = 0; i < 7; i++) {
      weekDays.push(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
    }
  
    return weekDays;
  };
  
  // Helper function to get all days in a month view
  export const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
  
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
  
    let firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7;
  
    const days = [];
  
    const daysFromPrevMonth = firstDayOfWeek - 1;
    for (let i = daysFromPrevMonth; i > 0; i--) {
      days.push(new Date(year, month, -i + 1));
    }
  
    const daysInMonth = lastDay.getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
  
    const totalDays = 42;
    const remainingDays = totalDays - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
  
    return days;
  };
  
  // Sample tasks data
  export const sampleTasks = [
    {
      id: 1,
      title: "הגשת מטלה בסטטיסטיקה",
      description: "לסיים את כל התרגילים בפרק 5",
      deadline: new Date(2025, 3, 15),
      priority: Priority.URGENT,
      color: "bg-red-500",
      type: EventType.STUDY,
      course: "סטטיסטיקה",
    },
    {
      id: 2,
      title: "מבחן אמצע סמסטר",
      description: "לסכם את כל החומר עד כה",
      deadline: new Date(2025, 3, 20),
      priority: Priority.HIGH,
      color: "bg-orange-500",
      type: EventType.STUDY,
      course: "פסיכולוגיה חברתית",
    },
    {
      id: 3,
      title: "פגישה עם המנחה",
      description: "להכין שאלות ונושאים לשיחה",
      deadline: new Date(2025, 3, 18),
      priority: Priority.IMPORTANT,
      color: "bg-blue-500",
      type: EventType.STUDY,
    },
    {
      id: 4,
      title: "הכנת מצגת",
      description: "לסיים את המצגת לקורס שיטות מחקר",
      deadline: new Date(2025, 3, 25),
      priority: Priority.LESS_URGENT,
      color: "bg-green-500",
      type: EventType.STUDY,
      course: "שיטות מחקר",
    },
    {
      id: 5,
      title: "פגישה משפחתית",
      description: "ארוחת ערב משפחתית",
      deadline: new Date(2025, 3, 17),
      priority: Priority.IMPORTANT,
      color: "bg-purple-500",
      type: EventType.PERSONAL,
    },
    {
      id: 6,
      title: "תורת לרופא",
      description: "בדיקה שנתית",
      deadline: new Date(2025, 3, 22),
      priority: Priority.IMPORTANT,
      color: "bg-green-500",
      type: EventType.PERSONAL,
    },
  ];
  