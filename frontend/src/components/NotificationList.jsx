import React from "react";
import NotificationItem from "./NotificationItem";

const NotificationList = ({ notifications, toggleRead, toggleSelect, selected, deleteNotification }) => {
    if (!notifications.length) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    background: "rgba(30, 41, 59, 0.3)",
                    border: "1px dashed rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    marginTop: "20px",
                    color: "#64748b",
                    fontSize: "15px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                    backdropFilter: "blur(10px)"
                }}
            >
                <div style={{ fontSize: "32px", opacity: 0.5 }}>📭</div>
                <div style={{ fontWeight: "500" }}>System Online: No new notifications</div>
            </div>
        );
    }

    return (
        <div style={{ marginTop: "10px" }}>
            {notifications.map((n) => (
                <NotificationItem
                    key={n.ui_key || n.id}
                    notification={n}
                    toggleRead={toggleRead}
                    toggleSelect={toggleSelect}
                    selected={selected}
                    deleteNotification={deleteNotification}
                />
            ))}
        </div>
    );
};

export default NotificationList;    