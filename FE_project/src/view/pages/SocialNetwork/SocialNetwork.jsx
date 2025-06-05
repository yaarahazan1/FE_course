import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, orderBy, query, updateDoc, doc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import SocialHeader from "../../components/SocialNetworkHelper/SocialHeader/SocialHeader";
import ProfileSidebar from "../../components/SocialNetworkHelper/ProfileSidebar/ProfileSidebar";
import EventList from "../../components/SocialNetworkHelper/EventList/EventList";
import PostFeed from "../../components/SocialNetworkHelper/PostFeed/PostFeed";
import PostForm from "../../components/SocialNetworkHelper/PostForm/PostForm";
import StudyGroupDialog from "../../components/SocialNetworkHelper/StudyGroupDialog/StudyGroupDialog";
import EventDialog from "../../components/SocialNetworkHelper/EventDialog/EventDialog";

import "./SocialNetwork.css";

const SocialNetwork = () => {
  const [user] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);

  // טעינת נתונים מ-Firebase
  useEffect(() => {
    if (user) {
      loadPosts();
      loadEvents();
      loadStudyGroups();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      const postsQuery = query(
        collection(db, "socialPosts"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(postsQuery);
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: new Date()
      }));
      setPosts(postsData);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const loadEvents = async () => {
    try {
      const eventsQuery = query(
        collection(db, "social_events"),
        orderBy("eventDate", "asc")
      );
      const snapshot = await getDocs(eventsQuery);
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudyGroups = async () => {
    try {
      const groupsQuery = query(
        collection(db, "study_groups"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(groupsQuery);
      const groupsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setStudyGroups(groupsData);
    } catch (error) {
      console.error("Error loading study groups:", error);
    }
  };

  // הוספת פוסט חדש
  const handleAddPost = async (postData) => {
    if (!user) return;

    try {
      const newPost = {
        ...postData,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        authorEmail: user.email,
        createdAt: new Date(),
        likes: [],
        comments: [],
        shares: 0
      };

      const docRef = await addDoc(collection(db, "socialPosts"), newPost);
      
      // עדכון מקומי
      setPosts(prev => [{
        id: docRef.id,
        ...newPost
      }, ...prev]);

    } catch (error) {
      console.error("Error adding post:", error);
      alert("שגיאה בשמירת הפוסט");
    }
  };

  // הוספת אירוע חדש
  const handleAddEvent = async (eventData) => {
    if (!user) return;

    try {
      const newEvent = {
        ...eventData,
        creatorId: user.uid,
        creatorName: user.displayName || user.email,
        createdAt: new Date(),
        participants: [user.uid],
        reminders: []
      };

      const docRef = await addDoc(collection(db, "social_events"), newEvent);
      
      setEvents(prev => [...prev, {
        id: docRef.id,
        ...newEvent
      }].sort((a, b) => a.eventDate - b.eventDate));

    } catch (error) {
      console.error("Error adding event:", error);
      alert("שגיאה בשמירת האירוע");
    }
  };

  // הוספת קבוצת לימוד
  const handleAddStudyGroup = async (groupData) => {
    if (!user) return;

    try {
      const newGroup = {
        ...groupData,
        creatorId: user.uid,
        creatorName: user.displayName || user.email,
        createdAt: new Date(),
        members: [user.uid],
        status: 'active'
      };

      const docRef = await addDoc(collection(db, "study_groups"), newGroup);
      
      setStudyGroups(prev => [{
        id: docRef.id,
        ...newGroup
      }, ...prev]);

    } catch (error) {
      console.error("Error adding study group:", error);
      alert("שגיאה ביצירת קבוצת הלימוד");
    }
  };

  // טיפול בלייק/אנלייק
  const handleToggleLike = async (postId) => {
    if (!user) return;

    try {
      const postRef = doc(db, "socialPosts", postId);
      const post = posts.find(p => p.id === postId);
      
      if (!post) return;

      const userLiked = post.likes?.includes(user.uid);
      
      if (userLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid)
        });
        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, likes: p.likes.filter(id => id !== user.uid) }
            : p
        ));
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid)
        });
        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, likes: [...(p.likes || []), user.uid] }
            : p
        ));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // הוספת תגובה
  const handleAddComment = async (postId, commentText) => {
    if (!user || !commentText.trim()) return;

    try {
      const comment = {
        id: Date.now().toString(),
        authorId: user.uid,
        authorName: user.displayName || user.email,
        text: commentText.trim(),
        createdAt: new Date()
      };

      const postRef = doc(db, "socialPosts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion(comment)
      });

      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, comments: [...(p.comments || []), comment] }
          : p
      ));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // הצטרפות לאירוע
  const handleJoinEvent = async (eventId) => {
    if (!user) return;

    try {
      const eventRef = doc(db, "social_events", eventId);
      await updateDoc(eventRef, {
        participants: arrayUnion(user.uid)
      });

      setEvents(prev => prev.map(e => 
        e.id === eventId 
          ? { ...e, participants: [...(e.participants || []), user.uid] }
          : e
      ));
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  // הצטרפות לקבוצת לימוד
  const handleJoinStudyGroup = async (groupId) => {
    if (!user) return;

    try {
      const groupRef = doc(db, "study_groups", groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(user.uid)
      });

      setStudyGroups(prev => prev.map(g => 
        g.id === groupId 
          ? { ...g, members: [...(g.members || []), user.uid] }
          : g
      ));
    } catch (error) {
      console.error("Error joining study group:", error);
    }
  };

  // מחיקת פוסט (רק למחבר)
  const handleDeletePost = async (postId) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post || post.authorId !== user.uid) return;

    if (window.confirm("האם אתה בטוח שברצונך למחוק את הפוסט?")) {
      try {
        await deleteDoc(doc(db, "socialPosts", postId));
        setPosts(prev => prev.filter(p => p.id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (!user) {
    return (
      <div className="social-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>נדרשת התחברות</h2>
          <p>עליך להתחבר כדי לגשת לרשת החברתית</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="social-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>טוען...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="social-container">
      <SocialHeader 
        onCreateGroup={() => setShowGroupDialog(true)}
        onCreateEvent={() => setShowEventDialog(true)}
      />

      <div className="social-layout">
        {/* Sidebar */}
        <div className="social-sidebar">
          <ProfileSidebar 
            user={user}
            studyGroups={studyGroups.filter(g => g.members?.includes(user.uid))}
            onJoinStudyGroup={handleJoinStudyGroup}
          />
          <EventList 
            events={events} 
            currentUser={user}
            onCreateEvent={() => setShowEventDialog(true)}  
            onJoinEvent={handleJoinEvent}
          />
        </div>

        {/* Main Feed */}
        <div className="social-main">
          <PostForm 
            onSubmit={handleAddPost}
            currentUser={user} 
          />
          <PostFeed 
            posts={posts}
            currentUser={user}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            onDeletePost={handleDeletePost}
          />
        </div>
      </div>

      {/* Dialogs */}
      {showGroupDialog && (
        <StudyGroupDialog
          isOpen={showGroupDialog}
          onClose={() => setShowGroupDialog(false)}
          onSubmit={handleAddStudyGroup}
        />
      )}

      {showEventDialog && (
        <EventDialog
          isOpen={showEventDialog}
          onClose={() => setShowEventDialog(false)}
          onSubmit={handleAddEvent}
        />
      )}
    </div>
  );
};

export default SocialNetwork;