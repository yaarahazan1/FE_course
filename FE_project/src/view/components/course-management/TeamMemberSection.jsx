// TeamMemberSection.jsx
import React from "react";
import "./TeamMemberSection.css";

const TeamMembersSection = ({ members }) => {
  return (
    <div className="team-members-card">
      <div className="team-members-header">
        <h2 className="team-members-title">חברי הקבוצה</h2>
      </div>
      <div className="team-members-content">
        {members.map((member) => (
          <div key={member.id} className="team-member-item">
            <div className="task-count">3</div>
            <div className="member-profile">
              <div className="member-text">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
              </div>
              <div className="member-avatar">
                {member.name.charAt(0)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembersSection;