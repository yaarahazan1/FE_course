import React from "react";
import "./TeamMembersSection.css";

const TeamMembersSection = ({ members }) => {
  return (
    <div className="team-card">
      <div className="team-header">
        <h3 className="team-title">חברי הקבוצה</h3>
      </div>
      <div className="team-content">
        <ul className="members-list">
          {members.map((member) => (
            <li key={member.id} className="member-item">
              <div className="member-info">
                <div className="member-avatar">
                  {member.name.charAt(0)}
                </div>
                <div className="member-details">
                  <p className="member-name">{member.name}</p>
                  <p className="member-role">{member.role}</p>
                </div>
              </div>
              <span className="member-badge">3</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamMembersSection;