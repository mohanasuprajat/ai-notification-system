import React, { useState } from "react";

const getPriorityStyles = (priority) => {
    if (priority === "HIGH") return { bg: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "#ef4444" };
    if (priority === "MEDIUM") return { bg: "rgba(245, 158, 11, 0.2)", color: "#f59e0b", border: "#f59e0b" };
    return { bg: "rgba(16, 185, 129, 0.2)", color: "#10b981", border: "#10b981" };
};

const NotificationItem = ({
    notification,
    toggleRead,
    toggleSelect,
    selected,
    deleteNotification
}) => {
    const [openMenu, setOpenMenu] = useState(false);
    const priorityStyle = getPriorityStyles(notification.priority);

    return (
        <div
            className={`notification-item ${notification.read ? 'read' : ''}`}
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                padding: "18px 24px",
                marginBottom: "16px",
                // Glassmorphism logic
                background: notification.read ? "rgba(15, 23, 42, 0.6)" : "rgba(30, 41, 59, 0.7)",
                backdropFilter: "blur(12px)",
                borderRadius: "12px",
                borderLeft: `4px solid ${priorityStyle.border}`,
                border: notification.read ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(255, 255, 255, 0.1)",
                borderLeftWidth: "4px",
                borderLeftColor: priorityStyle.border,
                opacity: notification.isSpam ? 0.4 : 1, // Dim spam heavily in dark mode
                filter: notification.isSpam ? "grayscale(80%) blur(1px)" : "none",
                transition: "all 0.3s ease",
                position: "relative",
                width: "100%",
                boxSizing: "border-box",
                boxShadow: notification.read ? "none" : "0 8px 24px rgba(0, 0, 0, 0.2)",
            }}
            onMouseEnter={(e) => {
                if (notification.isSpam) {
                    e.currentTarget.style.opacity = 1;
                    e.currentTarget.style.filter = "none";
                }
            }}
            onMouseLeave={(e) => {
                if (notification.isSpam) {
                    e.currentTarget.style.opacity = 0.4;
                    e.currentTarget.style.filter = "grayscale(80%) blur(1px)";
                }
            }}
        >
            {/* Checkbox */}
            <input
                type="checkbox"
                checked={selected.includes(notification.id)}
                onChange={() => toggleSelect(notification.id)}
                style={{
                    marginTop: "4px",
                    accentColor: "#38bdf8",
                    width: "16px",
                    height: "16px",
                    cursor: "pointer"
                }}
            />

            {/* Content */}
            <div
                style={{ flex: 1, cursor: "pointer" }}
                onClick={() => toggleRead(notification.id)}
            >
                <div
                    style={{
                        fontSize: "15px",
                        fontWeight: notification.read ? "400" : "500",
                        color: notification.read ? "#94a3b8" : "#f1f5f9",
                        lineHeight: "1.5"
                    }}
                >
                    {notification.message}
                </div>

                <div
                    style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "8px",
                        fontWeight: "500",
                        fontFamily: "source-code-pro, Menlo, monospace",
                        letterSpacing: "0.5px"
                    }}
                >
                    {new Date(notification.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </div>

                {/* AI Confidence Meter */}
                {notification.confidence !== undefined && (
                    <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>AI CONFIDENCE</span>
                        <div style={{ 
                            flex: 1, 
                            maxWidth: "150px", 
                            height: "4px", 
                            background: "rgba(255,255,255,0.1)", 
                            borderRadius: "4px",
                            overflow: "hidden"
                        }}>
                            <div style={{
                                width: `${notification.confidence * 100}%`,
                                height: "100%",
                                background: notification.confidence > 0.8 ? "#10b981" : notification.confidence > 0.5 ? "#f59e0b" : "#ef4444",
                                borderRadius: "4px",
                                animation: "progress-fill 1s ease-out forwards",
                                boxShadow: "0 0 8px rgba(255,255,255,0.2)"
                            }}></div>
                        </div>
                        <span style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: "600" }}>
                            {(notification.confidence * 100).toFixed(0)}%
                        </span>
                    </div>
                )}
            </div>

            {/* RIGHT SECTION */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                {/* Tracking Badges */}
                {notification.isSpam && (
                    <span
                        style={{
                            fontSize: "10px",
                            fontWeight: "700",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            background: "rgba(239, 68, 68, 0.15)",
                            color: "#ef4444",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            letterSpacing: "0.5px"
                        }}
                    >
                        🚨 SPAM
                    </span>
                )}

                <span
                    style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        background: priorityStyle.bg,
                        color: priorityStyle.color,
                        border: `1px solid ${priorityStyle.border}40`,
                        letterSpacing: "0.5px"
                    }}
                >
                    {notification.priority}
                </span>

                {/* 3 DOT MENU */}
                <div style={{ position: "relative" }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu((prev) => !prev);
                        }}
                        style={{
                            border: "none",
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: "50%",
                            width: "28px",
                            height: "28px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "16px",
                            color: "#94a3b8",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                    >
                        ⋮
                    </button>

                    {openMenu && (
                        <div
                            style={{
                                position: "absolute",
                                right: 0,
                                top: "34px",
                                background: "#1e293b",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "8px",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                                zIndex: 100,
                                minWidth: "120px",
                                overflow: "hidden"
                            }}
                        >
                            <div
                                onClick={() => {
                                    toggleRead(notification.id);
                                    setOpenMenu(false);
                                }}
                                style={{
                                    padding: "10px 14px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    color: "#e2e8f0",
                                    cursor: "pointer",
                                    transition: "background 0.2s",
                                    borderBottom: "1px solid rgba(255,255,255,0.05)"
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                                {notification.read ? "Mark as unread" : "Mark as read"}
                            </div>
                            <div
                                onClick={() => {
                                    if(deleteNotification) deleteNotification(notification.id);
                                    setOpenMenu(false);
                                }}
                                style={{
                                    padding: "10px 14px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    color: "#ef4444",
                                    cursor: "pointer",
                                    transition: "background 0.2s"
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                                🗑️ Delete
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;