  import React, { useState, useEffect } from "react";
  import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
  import { Star, User, Trophy, Clock } from "lucide-react";
  import { Link } from "react-router-dom";
  import { collection, query, where, getDocs, orderBy, limit, onSnapshot } from 'firebase/firestore';
  import { auth, db } from '../../../firebase/config'; 
  import { useAuthState } from 'react-firebase-hooks/auth';
  import "./Dashboard.css";

  const Dashboard = () => {
    // State management for Firebase data
    const [user, loading] = useAuthState(auth);
    const [isAdmin, setIsAdmin] = useState(false);
    const [dashboardData, setDashboardData] = useState({
      tasks: { completed: 0, pending: 0 },
      recentSummaries: [],
      recentActivities: [],
      timeSpentData: [],
      summaryUploadData: [],
      summaryRatings: [],
      userEngagement: { visitors: 0, activeUsers: 0, newUsers: 0 },
      currentUserData: {
        name: "משתמש אלמוני",
        tasksCompleted: 0,
        tasksTotal: 0,
        studyHours: 0,
        summariesUploaded: 0,
        lastActive: new Date().toLocaleDateString('he-IL'),
        progress: [],
        topCourses: []
      }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [dataError, setDataError] = useState(null);


    const checkIfAdmin = async (userId) => {
      try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where('uid', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          return userData.isAdmin === true || userData.role === 'admin';
        }
        return false;
      } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
    };
    // Fetch user tasks from Firebase
    const fetchUserTasks = async (userId) => {
      try {
        const tasksRef = collection(db, 'tasks');
        const q = query(tasksRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        let completed = 0;
        let pending = 0;
        let totalTasks = 0;
        
        querySnapshot.forEach((doc) => {
          const task = doc.data();
          totalTasks++;
          if (task.status === 'completed' || task.completed === true) {
            completed++;
          } else {
            pending++;
          }
        });

        return { completed, pending, totalTasks };
      } catch (error) {
        console.error("Error fetching tasks:", error);
        return { completed: 0, pending: 0, totalTasks: 0 };
      }
    };

    // Fetch recent summaries from Firebase (all summaries for general display)
    const fetchRecentSummaries = async () => {
      try {
        const summariesRef = collection(db, 'summaries');
        const q = query(summariesRef, orderBy('createdAt', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);
        
        const summaries = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          summaries.push({
            id: doc.id,
            title: data.title || data.name || 'סיכום ללא כותרת',
            date: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('he-IL') : new Date().toLocaleDateString('he-IL'),
            author: data.authorName || data.uploadedBy || 'משתמש אלמוני'
          });
        });

        return summaries;
      } catch (error) {
        console.error("Error fetching summaries:", error);
        return [];
      }
    };

    const fetchUserSummaries = async (userId) => {
      console.log("🔍 מחפש סיכומים עבור משתמש:", userId);
      
      try {
        const summariesRef = collection(db, 'summaries');
        
        // ראשית, בואו נבדוק כמה סיכומים יש בכלל במסד הנתונים
        const allSummariesSnapshot = await getDocs(summariesRef);
        console.log("📊 סה\"כ סיכומים במסד הנתונים:", allSummariesSnapshot.size);
        
        // בואו נראה את כל הסיכומים ואת השדות שלהם
        allSummariesSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("📄 סיכום:", {
            id: doc.id,
            title: data.title || data.name,
            uploadedBy: data.uploadedBy,
            userId: data.userId,
            authorId: data.authorId,
            createdBy: data.createdBy,
            author: data.author,
            allFields: Object.keys(data) // כל השדות שקיימים
          });
        });
        
        // עכשיו ננסה לחפש עם שדות שונים
        const possibleFields = ['uploadedBy', 'userId', 'authorId', 'createdBy', 'author'];
        
        for (const field of possibleFields) {
          try {
            console.log(`🔎 מנסה לחפש עם השדה: ${field}`);
            const q = query(
              summariesRef, 
              where(field, '==', userId),
              orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            console.log(`✅ נמצאו ${querySnapshot.size} סיכומים עם השדה ${field}`);
            
            if (querySnapshot.size > 0) {
              const summaries = [];
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                summaries.push({
                  id: doc.id,
                  title: data.title || data.name || 'סיכום ללא כותרת',
                  date: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                  createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
                });
              });
              
              console.log(`🎉 מצאנו ${summaries.length} סיכומים עם השדה ${field}!`);
              return summaries;
            }
          } catch (error) {
            console.log(`❌ שגיאה בחיפוש עם השדה ${field}:`, error.message);
          }
        }
        
        // אם לא מצאנו כלום, ננסה בלי orderBy
        for (const field of possibleFields) {
          try {
            console.log(`🔎 מנסה לחפש בלי orderBy עם השדה: ${field}`);
            const q = query(summariesRef, where(field, '==', userId));
            const querySnapshot = await getDocs(q);
            
            console.log(`✅ נמצאו ${querySnapshot.size} סיכומים (בלי orderBy) עם השדה ${field}`);
            
            if (querySnapshot.size > 0) {
              const summaries = [];
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                summaries.push({
                  id: doc.id,
                  title: data.title || data.name || 'סיכום ללא כותרת',
                  date: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                  createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
                });
              });
              
              console.log(`🎉 מצאנו ${summaries.length} סיכומים (בלי orderBy) עם השדה ${field}!`);
              return summaries;
            }
          } catch (error) {
            console.log(`❌ שגיאה בחיפוש בלי orderBy עם השדה ${field}:`, error.message);
          }
        }
        
        console.log("😞 לא מצאנו אף סיכום למשתמש הזה");
        return [];
        
      } catch (error) {
        console.error("💥 שגיאה כללית בפונקציה:", error);
        return [];
      }
    };

    const fetchUserActivities = async (userId) => {
      try {
        const activitiesRef = collection(db, 'activities');
        const q = query(
          activitiesRef, 
          where('userId', '==', userId),
          orderBy('timestamp', 'desc'),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        
        const activities = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // פונקציה להמרת סוג הפעילות לעברית מובנת
          const getActivityText = (activityType, details) => {
            switch(activityType?.toLowerCase()) {
              case 'navigation':
              case 'page_visit':
              case 'route_change':
                // בדיקה אם יש פרטים על הדף שביקר
                if (details) {
                  if (details.includes('summaries') || details.includes('סיכומים')) {
                    return 'ביקור בדף הסיכומים';
                  } else if (details.includes('tasks') || details.includes('משימות')) {
                    return 'ביקור בדף המשימות';
                  } else if (details.includes('dashboard') || details.includes('לוח')) {
                    return 'ביקור בלוח המחוונים';
                  } else if (details.includes('profile') || details.includes('פרופיל')) {
                    return 'ביקור בפרופיל האישי';
                  } else if (details.includes('login') || details.includes('כניסה')) {
                    return 'כניסה למערכת';
                  } else {
                    return 'ניווט באתר';
                  }
                }
                return 'ניווט באתר';
                
              case 'task_created':
              case 'add_task':
                return 'יצירת משימה חדשה';
                
              case 'task_completed':
              case 'complete_task':
                return 'השלמת משימה';
                
              case 'task_updated':
              case 'update_task':
                return 'עדכון משימה';
                
              case 'summary_uploaded':
              case 'upload_summary':
                return 'העלאת סיכום חדש';
                
              case 'summary_viewed':
              case 'view_summary':
                return 'צפייה בסיכום';
                
              case 'summary_downloaded':
              case 'download_summary':
                return 'הורדת סיכום';
                
              case 'login':
              case 'sign_in':
                return 'כניסה למערכת';
                
              case 'logout':
              case 'sign_out':
                return 'יציאה מהמערכת';
                
              case 'profile_updated':
              case 'update_profile':
                return 'עדכון פרופיל אישי';
                
              case 'search':
                return 'חיפוש במערכת';
                
              case 'rating_given':
              case 'rate_summary':
                return 'מתן דירוג לסיכום';
                
              case 'comment_added':
              case 'add_comment':
                return 'הוספת תגובה';
                
              case 'file_uploaded':
              case 'upload_file':
                return 'העלאת קובץ';
                
              case 'study_session':
              case 'study_time':
                return 'מפגש למידה';
                
              default:
                // אם לא מוצא התמה ספציפית, ינסה להבין מהפרטים
                if (details) {
                  if (details.includes('upload') || details.includes('העלה')) {
                    return 'העלאת תוכן';
                  } else if (details.includes('download') || details.includes('הורד')) {
                    return 'הורדת תוכן';
                  } else if (details.includes('view') || details.includes('צפה')) {
                    return 'צפייה בתוכן';
                  } else if (details.includes('create') || details.includes('יצר')) {
                    return 'יצירת תוכן חדש';
                  } else if (details.includes('update') || details.includes('עדכן')) {
                    return 'עדכון תוכן';
                  } else if (details.includes('delete') || details.includes('מחק')) {
                    return 'מחיקת תוכן';
                  }
                }
                return 'פעילות במערכת';
            }
          };
          
          // פונקציה ליצירת תיאור מפורט יותר
          const getActivityDetails = (activityType, details, timestamp) => {
            const timeAgo = getTimeAgo(timestamp);
            
            switch(activityType?.toLowerCase()) {
              case 'task_created':
              case 'add_task':
                return `נוצרה לפני ${timeAgo}`;
                
              case 'task_completed':
              case 'complete_task':
                return `הושלמה לפני ${timeAgo}`;
                
              case 'summary_uploaded':
              case 'upload_summary':
                return `הועלה לפני ${timeAgo}`;
                
              case 'login':
              case 'sign_in':
                return `התחבר לפני ${timeAgo}`;
                
              case 'study_session':
              case 'study_time':
                { const duration = details?.duration || 'זמן לא ידוע';
                return `למד ${duration} לפני ${timeAgo}`; }
                
              case 'rating_given':
              case 'rate_summary':
                { const rating = details?.rating || '';
                return `דירג ${rating} כוכבים לפני ${timeAgo}`; }
                
              default:
                return `בוצעה לפני ${timeAgo}`;
            }
          };
          
          // פונקציה לחישוב זמן שעבר
          const getTimeAgo = (timestamp) => {
            if (!timestamp) return 'זמן לא ידוע';
            
            const now = new Date();
            const activityTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
            
            if (diffInMinutes < 1) return 'זה עתה';
            if (diffInMinutes < 60) return `${diffInMinutes} דקות`;
            if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} שעות`;
            return `${Math.floor(diffInMinutes / 1440)} ימים`;
          };
          
          const activityType = data.activityType || data.type || data.action || 'unknown';
          const details = data.details || data.description || data.info || '';
          
          activities.push({
            id: doc.id,
            activity: getActivityText(activityType, details),
            details: getActivityDetails(activityType, details, data.timestamp),
            date: data.timestamp?.toDate ? data.timestamp.toDate().toLocaleDateString('he-IL') : new Date().toLocaleDateString('he-IL'),
            timestamp: data.timestamp
          });
        });

        return activities;
      } catch (error) {
        console.error("Error fetching activities:", error);
        return [];
      }
    };

    const fetchTimeSpentData = async (userId) => {
      try {
        const timeRef = collection(db, 'studyTime');
        const q = query(timeRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const courseTime = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const courseName = data.courseName || data.course || data.subject || 'קורס כללי';
          const hours = data.hours || data.duration || data.time || 0;
          
          if (courseTime[courseName]) {
            courseTime[courseName] += hours;
          } else {
            courseTime[courseName] = hours;
          }
        });

        const result = Object.entries(courseTime).map(([name, hours]) => ({ name, hours }));
        return result;
      } catch (error) {
        console.error("Error fetching time data:", error);
        return [];
      }
    };

    // Fetch summary ratings from Firebase
    const fetchSummaryRatings = async (userId) => {
      try {
        const ratingsRef = collection(db, 'summaryRatings');
        const q = query(ratingsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const ratings = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ratings.push({
            id: doc.id,
            title: data.summaryTitle || data.title || 'סיכום',
            rating: data.rating || 0
          });
        });

        return ratings;
      } catch (error) {
        console.error("Error fetching ratings:", error);
        return [];
      }
    };

    // Fetch user profile data
    const fetchUserProfile = async (userId) => {
      try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where('uid', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          return {
            name: userData.displayName || userData.name || user?.displayName || 'משתמש אלמוני',
            lastActive: userData.lastActive?.toDate ? userData.lastActive.toDate().toLocaleDateString('he-IL') : new Date().toLocaleDateString('he-IL')
          };
        }

        return { 
          name: user?.displayName || 'משתמש אלמוני', 
          lastActive: new Date().toLocaleDateString('he-IL') 
        };
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return { 
          name: user?.displayName || 'משתמש אלמוני', 
          lastActive: new Date().toLocaleDateString('he-IL') 
        };
      }
    };

    const fetchUserEngagement = async () => {
      try {
        const loginsRef = collection(db, 'logins');
        const usersRef = collection(db, 'users');
        
        // ספירת כל הכניסות למערכת (כולל כניסות כפולות)
        const allLoginsSnapshot = await getDocs(loginsRef);
        const totalLogins = allLoginsSnapshot.size;

        // ספירת משתמשים פעילים יחידים (connected: true)
        const activeUsersQuery = query(usersRef, where('connected', '==', true));
        const activeUsersSnapshot = await getDocs(activeUsersQuery);
        const uniqueActiveUsers = activeUsersSnapshot.size;

        // ספירת משתמשים חדשים (נרשמו בשבוע האחרון)
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const newUsersQuery = query(usersRef, where('createdAt', '>=', lastWeek));
        const newUsersSnapshot = await getDocs(newUsersQuery);

        return {
          visitors: totalLogins, // כל הכניסות למערכת
          activeUsers: uniqueActiveUsers, // משתמשים יחידים עם connected: true
          newUsers: newUsersSnapshot.size // משתמשים חדשים בשבוע האחרון
        };
      } catch (error) {
        console.error("Error fetching user engagement:", error);
        return { visitors: 0, activeUsers: 0, newUsers: 0 };
      }
    };

    const fetchStudyProgress = async (userId) => {
      try {
        const studyRef = collection(db, 'studyTime');
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const q = query(
          studyRef, 
          where('userId', '==', userId),
          where('date', '>=', lastWeek)
        );
        
        const querySnapshot = await getDocs(q);
        
        // יצירת מפה של ימים
        const dailyHours = {};
        const days = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'];
        
        // אתחול כל הימים ל-0
        days.forEach(day => {
          dailyHours[day] = 0;
        });
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.date?.toDate ? data.date.toDate() : new Date();
          const dayName = days[date.getDay()];
          const hours = data.hours || data.duration || 0;
          
          dailyHours[dayName] += hours;
        });
        
        return days.map(day => ({
          day,
          hours: dailyHours[day] || 0
        }));
      } catch (error) {
        console.error("Error fetching study progress:", error);
        const days = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'];
        return days.map(day => ({ day, hours: 0 }));
      }
    };

    // Generate monthly summary upload data based on user's actual uploads
    const generateSummaryUploadData = (userSummaries) => {
      // אם אין סיכומים, החזר נתונים ריקים
      if (userSummaries.length === 0) {
        return [
          { month: "ינואר", uploads: 0 },
          { month: "פברואר", uploads: 0 },
          { month: "מרץ", uploads: 0 },
          { month: "אפריל", uploads: 0 },
          { month: "מאי", uploads: 0 },
          { month: "יוני", uploads: 0 }
        ];
      }

      // קבוצת הסיכומים לפי חודשים
      const monthlyUploads = {};
      const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני"];
      
      // אתחול כל החודשים ל-0
      months.forEach(month => {
        monthlyUploads[month] = 0;
      });

      userSummaries.forEach(summary => {
        const date = summary.createdAt;
        const monthIndex = date.getMonth();
        if (monthIndex < months.length) {
          monthlyUploads[months[monthIndex]]++;
        }
      });
      
      return months.map(month => ({
        month,
        uploads: monthlyUploads[month]
      }));
    };

    // Main data fetching function
    const fetchAllData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setDataError(null);
      
      try {
        const results = await Promise.allSettled([
          fetchUserTasks(user.uid),
          fetchRecentSummaries(),
          fetchUserSummaries(user.uid), // הוספת קריאה לסיכומי המשתמש
          fetchUserActivities(user.uid),
          fetchTimeSpentData(user.uid),
          fetchSummaryRatings(user.uid),
          fetchUserProfile(user.uid),
          fetchUserEngagement(),
          fetchStudyProgress(user.uid)
        ]);

        const [
          tasksResult,
          summariesResult,
          userSummariesResult,
          activitiesResult,
          timeDataResult,
          ratingsResult,
          userProfileResult,
          engagementResult,
          progressResult
        ] = results;

        const tasksData = tasksResult.status === 'fulfilled' ? tasksResult.value : { completed: 0, pending: 0, totalTasks: 0 };
        const summaries = summariesResult.status === 'fulfilled' ? summariesResult.value : [];
        const userSummaries = userSummariesResult.status === 'fulfilled' ? userSummariesResult.value : [];
        const activities = activitiesResult.status === 'fulfilled' ? activitiesResult.value : [];
        const timeData = timeDataResult.status === 'fulfilled' ? timeDataResult.value : [];
        const ratings = ratingsResult.status === 'fulfilled' ? ratingsResult.value : [];
        const userProfile = userProfileResult.status === 'fulfilled' ? userProfileResult.value : { name: 'משתמש אלמוני', lastActive: new Date().toLocaleDateString('he-IL') };
        const engagement = engagementResult.status === 'fulfilled' ? engagementResult.value : { visitors: 0, activeUsers: 0, newUsers: 0 };
        const progressData = progressResult.status === 'fulfilled' ? progressResult.value : [];

        // חישוב נתונים נוספים
        const totalHours = timeData.reduce((sum, course) => sum + course.hours, 0);
        const topCourses = timeData.length > 0 ? timeData.map(course => ({
          name: course.name,
          percent: totalHours > 0 ? Math.round((course.hours / totalHours) * 100) : 0
        })) : [];

        setDashboardData({
          tasks: { completed: tasksData.completed, pending: tasksData.pending },
          recentSummaries: summaries,
          recentActivities: activities,
          timeSpentData: timeData,
          summaryUploadData: generateSummaryUploadData(userSummaries),
          summaryRatings: ratings,
          userEngagement: engagement,
          currentUserData: {
            name: userProfile.name,
            tasksCompleted: tasksData.completed,
            tasksTotal: tasksData.totalTasks,
            studyHours: totalHours,
            summariesUploaded: userSummaries.length, // שימוש בסיכומי המשתמש
            lastActive: userProfile.lastActive,
            progress: progressData,
            topCourses: topCourses
          }
        });

        console.log('Dashboard data loaded successfully');
        const adminStatus = await checkIfAdmin(user.uid);
      setIsAdmin(adminStatus);
        console.log('User summaries count:', userSummaries.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDataError('שגיאה בטעינת הנתונים');
      } finally {
        setIsLoading(false);
      }
    };

    // Setup real-time listeners
    useEffect(() => {
      if (!user) return;

      const unsubscribers = [];

      try {
        // Real-time listener for tasks
        const tasksRef = collection(db, 'tasks');
        const tasksQuery = query(tasksRef, where('userId', '==', user.uid));
        
        const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
          let completed = 0;
          let pending = 0;
          
          snapshot.forEach((doc) => {
            const task = doc.data();
            if (task.status === 'completed' || task.completed === true) {
              completed++;
            } else {
              pending++;
            }
          });

          setDashboardData(prev => ({
            ...prev,
            tasks: { completed, pending },
            currentUserData: {
              ...prev.currentUserData,
              tasksCompleted: completed,
              tasksTotal: completed + pending
            }
          }));
        }, (error) => {
          console.error("Error listening to tasks:", error);
        });

        unsubscribers.push(unsubscribeTasks);

        // Real-time listener for summaries (general)
        const summariesRef = collection(db, 'summaries');
        const summariesQuery = query(summariesRef, orderBy('createdAt', 'desc'), limit(3));
        
        const unsubscribeSummaries = onSnapshot(summariesQuery, (snapshot) => {
          const summaries = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            summaries.push({
              id: doc.id,
              title: data.title || data.name || 'סיכום ללא כותרת',
              date: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('he-IL') : new Date().toLocaleDateString('he-IL'),
              author: data.authorName || data.uploadedBy || 'משתמש אלמוני'
            });
          });

          setDashboardData(prev => ({
            ...prev,
            recentSummaries: summaries
          }));
        }, (error) => {
          console.error("Error listening to summaries:", error);
        });

        unsubscribers.push(unsubscribeSummaries);

        // Real-time listener for user's own summaries
        const userSummariesQuery = query(
          summariesRef, 
          where('uploadedBy', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const unsubscribeUserSummaries = onSnapshot(userSummariesQuery, (snapshot) => {
          const userSummaries = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            userSummaries.push({
              id: doc.id,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
            });
          });

          setDashboardData(prev => ({
            ...prev,
            summaryUploadData: generateSummaryUploadData(userSummaries),
            currentUserData: {
              ...prev.currentUserData,
              summariesUploaded: userSummaries.length
            }
          }));
        }, (error) => {
          console.error("Error listening to user summaries:", error);
          // Try alternative field
          const altQuery = query(
            summariesRef, 
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
          
          const unsubscribeAlt = onSnapshot(altQuery, (snapshot) => {
            const userSummaries = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              userSummaries.push({
                id: doc.id,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
              });
            });

            setDashboardData(prev => ({
              ...prev,
              summaryUploadData: generateSummaryUploadData(userSummaries),
              currentUserData: {
                ...prev.currentUserData,
                summariesUploaded: userSummaries.length
              }
            }));
          });
          
          unsubscribers.push(unsubscribeAlt);
        });

        unsubscribers.push(unsubscribeUserSummaries);

      } catch (error) {
        console.error("Error setting up listeners:", error);
      }

      return () => {
        unsubscribers.forEach(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        });
      };
    }, [user]);

    // Initial data fetch
    useEffect(() => {
      if (user && !loading) {
        fetchAllData();
      }
    }, [user, loading]);

    // Show loading state
    if (loading) {
      return (
        <div className="dashboard-container">
          <div className="loading-state">
            <h2>מתחבר למערכת...</h2>
          </div>
        </div>
      );
    }

    // Show login prompt if not authenticated
    if (!user) {
      return (
        <div className="dashboard-container">
          <div className="auth-required">
            <h2>נדרשת כניסה למערכת</h2>
            <p>כדי לצפות בלוח המחוונים, יש להתחבר למערכת</p>
            <Link to="/Login" className="login-link">
              <button className="navButton">כניסה למערכת</button>
            </Link>
          </div>
        </div>
      );
    }

    // Show loading state for data
    if (isLoading) {
      return (
        <div className="dashboard-container">
          <div className="loading-state">
            <h2>טוען נתונים...</h2>
            <p>אנא המתן, טוען את הנתונים שלך מהמסד נתונים</p>
          </div>
        </div>
      );
    }

    // Show error state
    if (dataError) {
      return (
        <div className="dashboard-container">
          <div className="error-state">
            <h2>שגיאה בטעינת הנתונים</h2>
            <p>{dataError}</p>
            <button onClick={fetchAllData} className="retry-button">נסה שוב</button>
          </div>
        </div>
      );
    }

    const { tasks, recentSummaries, recentActivities, timeSpentData, summaryUploadData, summaryRatings, userEngagement, currentUserData } = dashboardData;

    const pieData = [
      { name: "הושלמו", value: tasks.completed, color: "#10B981" },
      { name: "ממתינות", value: tasks.pending, color: "#EF4444" }
    ];

    const completionRate = currentUserData.tasksTotal > 0 
      ? Math.round((currentUserData.tasksCompleted / currentUserData.tasksTotal) * 100) 
      : 0;

    return (
      <div className="dashboard-container">
        <div>
          <Link to="/" className="dashboard-home-link">חזרה לדף הבית</Link>
        </div>

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">לוח מחוונים מערכתי</h1>
            <p className="dashboard-subtitle">סיכום סטטיסטי של פעילות המערכת</p>
          </div>
        </div>

        {/* מידע על המשתמש הנוכחי */}
        <div className="dashboard-card user-info-card">
          <div className="card-content-dashboard">
            <div className="user-header">
              <h2 className="user-title">
                <User className="icon" />
                הנתונים שלי - {currentUserData.name}
              </h2>
              <span className="last-update">עדכון אחרון: {currentUserData.lastActive}</span>
            </div>
            
            <div className="user-stats-grid">
              <div className="stat-card-dashbord">
                <div className="stat-number">{currentUserData.tasksCompleted}</div>
                <div className="stat-label">משימות שהושלמו</div>
                <div className="stat-sublabel">מתוך {currentUserData.tasksTotal}</div>
              </div>
              <div className="stat-card-dashbord">
                <div className="stat-number">{currentUserData.studyHours}</div>
                <div className="stat-label">שעות למידה</div>
                <div className="stat-sublabel">בסה"כ</div>
              </div>
              <div className="stat-card-dashbord">
                <div className="stat-number">{currentUserData.summariesUploaded}</div>
                <div className="stat-label">סיכומים שהועלו</div>
                <div className="stat-sublabel">בסה"כ</div>
              </div>
              <div className="stat-card-dashbord">
                <div className="stat-number">{completionRate}%</div>
                <div className="stat-label">השלמת משימות</div>
                <div className="stat-sublabel">מתוך היעד</div>
              </div>
            </div>
            
            <div className="charts-grid">
              <div className="chart-section">
                <h3 className="chart-title">
                  <Clock className="chart-icon" />
                  פעילות לפי ימים (שבוע אחרון)
                </h3>
                <div className="chart-container">
                  {currentUserData.progress.length > 0 && currentUserData.progress.some(day => day.hours > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={currentUserData.progress}>
                        <XAxis dataKey="day" />
                        <YAxis direction={"ltr"}/>
                        <Tooltip />
                        <Bar dataKey="hours" fill="#89A8B2" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-chart">אין נתוני פעילות לשבוע האחרון</div>
                  )}
                </div>
              </div>

              <div className="chart-section">
                <h3 className="chart-title">
                  <Trophy className="chart-icon" />
                  התפלגות זמן לפי קורסים
                </h3>
                <div className="chart-container">
                  {currentUserData.topCourses.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentUserData.topCourses}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percent"
                          label={({ name, percent }) => `${name} ${percent}%`}
                        >
                          {currentUserData.topCourses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#89A8B2', '#B3C8CF', '#FDE1D3', '#FEF7CD'][index % 4]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-chart">אין נתוני זמן למידה</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="recommendation-card">
              <div className="recommendation-title">המלצה אישית:</div>
              <p className="recommendation-text">
                {currentUserData.topCourses.length > 0 
                  ? `בהתבסס על הנתונים שלך, כדאי להקדיש יותר זמן לקורס ${currentUserData.topCourses[currentUserData.topCourses.length - 1]?.name || 'הבא'} בשבוע הקרוב`
                  : 'התחל לעקוב אחרי זמני הלמידה שלך כדי לקבל המלצות מותאמות אישית'
                }
              </p>
            </div>
          </div>
        </div>

        {/* סיכום סטטיסטי */}
        <div className="summary-grid">
          {/* גרף עוגה של משימות */}
          <div className="dashboard-card">
            <div className="card-content-dashboard">
              <h2 className="card-title">סטטוס משימות</h2>
              <div className="pie-chart-container">
                {tasks.completed > 0 || tasks.pending > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-chart">אין משימות עדיין</div>
                )}
                <div className="pie-legend">
                  <div className="legend-item">
                    <div className="legend-dot completed"></div>
                    <span>הושלמו ({tasks.completed})</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot pending"></div>
                    <span>ממתינות ({tasks.pending})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* סיכומים חדשים */}
          <div className="dashboard-card">
            <div className="card-content-dashboard">
              <h2 className="card-title">סיכומים חדשים</h2>
              <div className="summaries-list">
                {recentSummaries.length > 0 ? (
                  recentSummaries.map(summary => (
                    <div key={summary.id} className="summary-item">
                      <div className="summary-title-dashboard">{summary.title}</div>
                      <div className="summary-details">
                        <span>מועלה ע"י: {summary.author}</span>
                        <span>{summary.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">אין סיכומים חדשים</div>
                )}
              </div>
            </div>
          </div>

          {/* פעילויות אחרונות */}
          <div className="dashboard-card">
            <div className="card-content-dashboard">
              <h2 className="card-title">פעילות אחרונה</h2>
              <div className="activities-list">
                {recentActivities.length > 0 ? (
                  recentActivities.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-title">{activity.activity}</div>
                      <div className="activity-details">
                        <span>{activity.details}</span>
                        <span>{activity.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">אין פעילות אחרונה</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <h2 className="section-title">מדדי ביצוע מרכזיים</h2>
        
      <div className="kpi-grid">
        {/* זמן שהוקדש לקורסים */}
        <div className="dashboard-card">
          <div className="card-content-dashboard">
            <h2 className="card-title">זמן שהוקדש לקורסים</h2>
            <div className="chart-container">
              {timeSpentData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeSpentData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} direction={"ltr"}/>
                    <Tooltip />
                    <Bar dataKey="hours" fill="#89A8B2" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-chart">אין נתוני זמן למידה</div>
              )}
              <div className="chart-footer">
                סה"כ: {currentUserData.studyHours} שעות למידה השבוע
              </div>
            </div>
          </div>
        </div>

        {/* פידבק וציונים על סיכומים */}
        <div className="dashboard-card">
          <div className="card-content-dashboard">
            <h2 className="card-title">פידבק וציונים על סיכומים</h2>
            <div className="ratings-list">
              {summaryRatings.length > 0 ? (
                summaryRatings.map(summary => (
                  <div key={summary.id} className="rating-item">
                    <span className="rating-title">{summary.title}</span>
                    <div className="rating-stars-dashboard">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < summary.rating ? "star-filled" : "star-empty-dashboard"}
                        />
                      ))}
                      <span className="rating-score">({summary.rating} מתוך 5)</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">אין דירוגים עדיין</div>
              )}
            </div>
            <div className="overall-satisfaction">
              <div className="satisfaction-rate">
                {summaryRatings.length > 0 
                  ? Math.round(summaryRatings.reduce((sum, s) => sum + s.rating, 0) / summaryRatings.length * 20)
                  : 0}%
              </div>
              <div className="satisfaction-label">שביעות רצון כללית</div>
            </div>
          </div>
        </div>

        {/* שיעור השלמת משימות */}
        <div className="dashboard-card">
          <div className="card-content-dashboard">
            <h2 className="card-title">שיעור השלמת משימות</h2>
            <div className="completion-rate-container">
              <div className="completion-circle">
                <div className="completion-inner">
                  <span className="completion-percentage">{completionRate}%</span>
                </div>
              </div>
              <div className="completion-details">
                <div>{currentUserData.tasksCompleted} משימות הושלמו מתוך {currentUserData.tasksTotal}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* מעורבות משתמשים ותדירות העלאת סיכומים */}
      <div className={`engagement-grid ${!isAdmin ? 'single-card' : ''}`}>
        <div className={`dashboard-card ${!isAdmin ? 'full-width-card' : ''}`}>
          <div className="card-content-dashboard">
            <h2 className="card-title">תדירות העלאת סיכומים</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summaryUploadData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                  <XAxis dataKey="month" tick={{ dy: 10 }} />
                  <YAxis tick={{ dy: -10 }} direction={"ltr"}/>
                  <Tooltip />
                  <Line type="monotone" dataKey="uploads" stroke="#89A8B2" />
                </LineChart>
              </ResponsiveContainer>
              <div className="chart-footer">
                {currentUserData.summariesUploaded} סיכומים הועלו בחודש האחרון
              </div>
            </div>
          </div>
        </div>

        {/* מעורבות משתמשים - רק לאדמין */}
        {isAdmin && (
          <div className="dashboard-card">
            <div className="card-content-dashboard">
              <h2 className="card-title">מעורבות משתמשים</h2>
              <div className="engagement-stats">
                <div className="engagement-stat">
                  <div className="engagement-number">{userEngagement.visitors}</div>
                  <div className="engagement-label">כניסות למערכת</div>
                </div>
                <div className="engagement-stat">
                  <div className="engagement-number">{userEngagement.activeUsers}</div>
                  <div className="engagement-label">משתמשים פעילים</div>
                </div>
                <div className="engagement-stat">
                  <div className="engagement-number">{userEngagement.newUsers}</div>
                  <div className="engagement-label">חברים שהצטרפו</div>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-title">טיפ היום:</div>
                <p className="tip-text">הקדשת 30 דקות ללמידה יומית מגדילה ב-40% את סיכויי ההצלחה במבחנים</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`engagement-grid ${!isAdmin ? 'single-card' : ''}`}>
        {/* מעורבות משתמשים - רק לאדמין */}
        {isAdmin && (
          <div className="dashboard-card">
            <div className="card-content-dashboard">
              <h2 className="card-title">מעורבות משתמשים</h2>
              <div className="engagement-stats">
                <div className="engagement-stat">
                  <div className="engagement-number">{userEngagement.visitors}</div>
                  <div className="engagement-label">כניסות למערכת</div>
                </div>
                <div className="engagement-stat">
                  <div className="engagement-number">{userEngagement.activeUsers}</div>
                  <div className="engagement-label">משתמשים פעילים</div>
                </div>
                <div className="engagement-stat">
                  <div className="engagement-number">{userEngagement.newUsers}</div>
                  <div className="engagement-label">חברים שהצטרפו</div>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-title">טיפ היום:</div>
                <p className="tip-text">הקדשת 30 דקות ללמידה יומית מגדילה ב-40% את סיכויי ההצלחה במבחנים</p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    );
  };

  export default Dashboard;