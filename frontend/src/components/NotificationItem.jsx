import React, { useState } from "react";

const getColor = (priority) => {
    if (priority === "HIGH") return "#ff4d4f";
    if (priority === "MEDIUM") return "#faad14";
    return "#52c41a";
};

const NotificationItem = ({
    notification,
    toggleRead,
    toggleSelect,
    selected,
}) => {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <div
            className={`notification-item ${notification.read ? 'read' : ''}`}
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                padding: "18px 24px",
                marginBottom: "16px",
                background: notification.read ? "#f8fafc" : "#ffffff",
                borderRadius: "12px",
                borderLeft: `5px solid ${getColor(notification.priority)}`,
                boxShadow: notification.read ? "none" : "0 8px 24px rgba(149, 157, 165, 0.12)",
                border: notification.read ? "1px solid #e2e8f0" : "1px solid transparent",
                opacity: notification.isSpam ? 0.7 : 1, // 🔥 dim spam
                transition: "all 0.3s ease",
                position: "relative",
                width: "100%",
                boxSizing: "border-box"
            }}
        >
            {/* Checkbox */}
            <input
                type="checkbox"
                checked={selected.includes(notification.id)}
                onChange={() => toggleSelect(notification.id)}
                style={{ marginTop: "4px" }}
            />

            {/* Content */}
            <div
                style={{ flex: 1, cursor: "pointer" }}
                onClick={() => toggleRead(notification.id)}
            >
                <div
                    style={{
                        fontSize: "15px",
                        fontWeight: notification.read ? "500" : "600",
                        color: notification.read ? "#475569" : "#1e293b",
                        lineHeight: "1.5"
                    }}
                >
                    {notification.message}
                </div>

                <div
                    style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        marginTop: "6px",
                        fontWeight: "500"
                    }}
                >
                    {new Date(notification.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </div>

                {/* 🔥 Confidence (AI transparency) */}
                {notification.confidence !== undefined && (
                    <div style={{ fontSize: "11px", color: "#aaa" }}>
                        Confidence: {(notification.confidence * 100).toFixed(0)}%
                    </div>
                )}
            </div>

            {/* RIGHT SECTION */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

                {/* Priority Badge */}
                <span
                    style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        background: getColor(notification.priority),
                        color: "#fff",
                    }}
                >
                    {notification.priority}
                </span>

                {/* 🔥 SPAM Badge */}
                {notification.isSpam && (
                    <span
                        style={{
                            fontSize: "10px",
                            fontWeight: "600",
                            padding: "3px 6px",
                            borderRadius: "6px",
                            background: "#fff1f0",
                            color: "#ff4d4f",
                        }}
                    >
                        🚨 SPAM
                    </span>
                )}

                {/* 3 DOT MENU */}
                <div style={{ position: "relative" }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu((prev) => !prev);
                        }}
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: "16px",
                            color: "#666",
                        }}
                    >
                        ⋮
                    </button>

                    {openMenu && (
                        <div
                            style={{
                                position: "absolute",
                                right: 0,
                                top: "22px",
                                background: "#fff",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                                zIndex: 100,
                            }}
                        >
                            <div
                                onClick={() => {
                                    toggleRead(notification.id);
                                    setOpenMenu(false);
                                }}
                                style={{
                                    padding: "8px 12px",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                }}
                            >
                                {notification.read
                                    ? "Mark as unread"
                                    : "Mark as read"}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;