import React from "react";
import NotificationItem from "./NotificationItem";

const NotificationList = ({ notifications, toggleRead, toggleSelect, selected }) => {
    if (!notifications.length) {
        return (
            <div
                style={{
                    textAlign: "center",
                    marginTop: "40px",
                    color: "#999",
                    fontSize: "14px",
                }}
            >
                No notifications yet 📭
            </div>
        );
    }

    return (
        <div style={{ marginTop: "10px" }}>
            {notifications.map((n) => (
                <NotificationItem
                    key={n.id}
                    notification={n}
                    toggleRead={toggleRead}
                    toggleSelect={toggleSelect}
                    selected={selected}
                />
            ))}
        </div>
    );
};

export default NotificationList;    