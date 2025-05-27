import React from "react";
import SocialHeader from "../../components/SocialNetworkHelper/SocialHeader/SocialHeader";
import ProfileSidebar from "../../components/SocialNetworkHelper/ProfileSidebar/ProfileSidebar";
import EventList from "../../components/SocialNetworkHelper/EventList/EventList";
import PostFeed from "../../components/SocialNetworkHelper/PostFeed/PostFeed";
import PostForm from "../../components/SocialNetworkHelper/PostForm/PostForm";

import "./SocialNetwork.css";

const SocialNetwork = () => {
  const events = [
    { id: 1, title: "בחינת אמצע בפיזיקה", date: "היום", time: "14:00" },
    { id: 2, title: "הגשת עבודה במתמטיקה", date: "15 ביוני, 2025", time: "" },
  ];

  const posts = [
    {
      id: 1,
      author: "רחל לוי",
      role: "לפני שעתיים",
      content:
        "שיתפתי את סיכומי השיעור האחרון בנושא דיפרנציאליים. כדאי לעבור עליהם לפני המבחן ביום שני. בהצלחה לכולם!",
      likes: 24,
      comments: 8,
      attachment: {
        name: "סיכום_מבוא_מתמטי_שיעור_12_רביעי.pdf",
        size: "2.3 מגהבייט",
      },
    },
    {
      id: 2,
      author: "יואב שמעון",
      role: "לפני 5 שעות",
      content:
        "מישהו משתתף בסדנת לימוד לקראת המבחן באלגוריתמים? מי רוצה להיפגש בספרייה לפני?",
      likes: 15,
      comments: 12,
      attachment: null,
    },
  ];

  return (
    <div className="social-container">
      <SocialHeader />

      <div className="social-layout">
        {/* Sidebar */}
        <div className="social-sidebar">
          <ProfileSidebar />
          <EventList events={events} />
        </div>

        {/* Main Feed */}
        <div className="social-main">
          <PostForm />
          <PostFeed posts={posts} />
        </div>
      </div>
    </div>
  );
};

export default SocialNetwork;