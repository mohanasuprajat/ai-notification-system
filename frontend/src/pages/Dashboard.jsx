
import React, { useState, useMemo, useContext } from "react";
import NotificationList from "../components/NotificationList";
import { NotificationContext } from "../context/NotificationContext";

const Dashboard = () => {
    // Consume global state from context
    const {
        notifications,
        setNotifications,
        dndMode,
        setDndMode,
        dndQueue,
        connected
    } = useContext(NotificationContext);

    // Local UI state
    const [filter, setFilter] = useState("ALL");
    const [activeTab, setActiveTab] = useState("PRIORITY");
    const [selected, setSelected] = useState([]);

    // Counts (include dndQueue so user knows overall stats, or just use notifications? Let's just use visible notifications for tabs)
    const counts = useMemo(() => {
        const result = { HIGH: 0, MEDIUM: 0, LOW: 0, SPAM: 0 };
        notifications.forEach((n) => {
            if (n.isSpam) {
                result.SPAM++;
            } else {
                if (result[n.priority] !== undefined) result[n.priority]++;
            }
        });
        return result;
    }, [notifications]);

    // Filtering
    const filteredNotifications = useMemo(() => {
        if (activeTab === "SPAM") {
            return notifications.filter((n) => n.isSpam);
        }

        // Only show non-spam in priority tab
        let data = notifications.filter((n) => !n.isSpam);

        if (filter !== "ALL") {
            data = data.filter((n) => n.priority === filter);
        }

        return data;
    }, [notifications, filter, activeTab]);

    // Toggle read
    const toggleRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, read: !n.read } : n
            )
        );
    };

    // Selection
    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selected.length === filteredNotifications.length && filteredNotifications.length > 0) {
            setSelected([]);
        } else {
            setSelected(filteredNotifications.map((n) => n.id));
        }
    };

    const markSelected = (readStatus) => {
        setNotifications((prev) =>
            prev.map((n) =>
                selected.includes(n.id)
                    ? { ...n, read: readStatus }
                    : n
            )
        );
        setSelected([]);
    };

    const deleteSelected = () => {
        setNotifications((prev) => prev.filter((n) => !selected.includes(n.id)));
        setSelected([]);
    };

    const deleteNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setSelected((prev) => prev.filter((s) => s !== id));
    };

    return (
        <div style={{ background: "transparent", minHeight: "100vh" }}>

            {/* TELEMETRY HEADER */}
            <div style={{
                padding: "16px 30px",
                background: "rgba(15, 23, 42, 0.8)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                zIndex: 50
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "20px", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "16px" }}>🔔</span>
                        Operations Center
                    </h2>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>

                    {/* DND Toggle Node */}
                    <div
                        onClick={() => setDndMode(p => !p)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            background: dndMode ? "rgba(139, 92, 246, 0.2)" : "rgba(255,255,255,0.05)",
                            border: `1px solid ${dndMode ? "rgba(139, 92, 246, 0.5)" : "rgba(255,255,255,0.1)"}`,
                            transition: "all 0.3s"
                        }}
                    >
                        <div style={{
                            width: "10px", height: "10px", borderRadius: "50%",
                            background: dndMode ? "#8b5cf6" : "#64748b",
                            boxShadow: dndMode ? "0 0 8px #8b5cf6" : "none"
                        }}></div>
                        <span style={{ fontSize: "13px", color: dndMode ? "#c4b5fd" : "#94a3b8", fontWeight: "600" }}>
                            {dndMode ? "DND MODE" : "FOCUS MODE"}
                        </span>
                    </div>

                    {/* Connection Status */}
                    <span style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{
                            width: "8px", height: "8px", borderRadius: "50%",
                            background: connected ? "#10b981" : "#ef4444",
                            animation: connected ? "pulse-ring 2s infinite" : "none"
                        }}></span>
                        <span style={{
                            color: connected ? "#34d399" : "#f87171",
                            fontWeight: "600",
                            letterSpacing: "0.5px"
                        }}>
                            {connected ? "SYS.ONLINE" : "OFFLINE"}
                        </span>
                    </span>
                </div>
            </div>

            {/* DND BANNER */}
            {dndMode && dndQueue.length > 0 && (
                <div style={{
                    margin: "24px 30px 0",
                    padding: "16px",
                    background: "linear-gradient(90deg, rgba(139,92,246,0.15) 0%, rgba(109,40,217,0.05) 100%)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "20px" }}>🌙</span>
                        <div>
                            <div style={{ color: "#e2e8f0", fontWeight: "600", fontSize: "14px" }}>Do Not Disturb is ON</div>
                            <div style={{ color: "#a78bfa", fontSize: "13px", marginTop: "2px" }}>
                                {dndQueue.length} notification{dndQueue.length > 1 ? "s" : ""} held back.
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setDndMode(false)}
                        className="interactive-btn"
                        style={{
                            padding: "8px 16px",
                            background: "#8b5cf6",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "13px",
                            cursor: "pointer"
                        }}
                    >
                        View Now
                    </button>
                </div>
            )}

            {/* MAIN CARD */}
            <div style={{
                margin: "24px 30px",
                background: "rgba(30, 41, 59, 0.4)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)"
            }}>

                {/* TABS */}
                <div style={{
                    display: "flex",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    marginBottom: "20px"
                }}>
                    {[
                        { key: "PRIORITY", label: "Operations" },
                        { key: "SPAM", label: "Spam" }
                    ].map((tab) => (
                        <div
                            key={tab.key}
                            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: "12px 20px",
                                cursor: "pointer",
                                borderBottom: "3px solid transparent",
                                color: activeTab === tab.key ? "#f8fafc" : "#64748b",
                                fontWeight: "600",
                                fontSize: "14px",
                                transition: "color 0.3s"
                            }}
                        >
                            {tab.label}
                            {tab.key === "SPAM" && ` (${counts.SPAM})`}
                        </div>
                    ))}
                </div>

                {/* PRIORITY FILTER */}
                {activeTab === "PRIORITY" && (
                    <div style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px"
                    }}>
                        {["ALL", "HIGH", "MEDIUM", "LOW"].map((type) => {
                            const isActive = filter === type;
                            return (
                                <button
                                    key={type}
                                    className="interactive-btn"
                                    onClick={() => setFilter(type)}
                                    style={{
                                        padding: "8px 18px",
                                        borderRadius: "20px",
                                        border: isActive ? "1px solid rgba(56, 189, 248, 0.5)" : "1px solid rgba(255,255,255,0.1)",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        background: isActive ? "rgba(56, 189, 248, 0.1)" : "rgba(15, 23, 42, 0.6)",
                                        color: isActive ? "#38bdf8" : "#94a3b8",
                                        boxShadow: isActive ? "0 0 12px rgba(56, 189, 248, 0.2)" : "none",
                                        letterSpacing: "0.5px"
                                    }}
                                >
                                    {type} {type !== "ALL" && `(${counts[type]})`}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ACTION BAR */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                    alignItems: "center"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                            type="checkbox"
                            checked={
                                selected.length === filteredNotifications.length &&
                                filteredNotifications.length > 0
                            }
                            onChange={toggleSelectAll}
                            style={{ accentColor: "#38bdf8", width: "16px", height: "16px", cursor: "pointer" }}
                        />

                        <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                            {selected.length > 0
                                ? `${selected.length} payload(s) selected`
                                : `${filteredNotifications.length} active event(s)`}
                        </span>
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            className="interactive-btn"
                            onClick={() => markSelected(true)}
                            style={{
                                padding: "6px 16px",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                background: "rgba(255,255,255,0.05)",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#cbd5e1"
                            }}
                        >
                            ✓ Mark read
                        </button>
                        <button
                            className="interactive-btn"
                            onClick={() => markSelected(false)}
                            style={{
                                padding: "6px 16px",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                background: "rgba(255,255,255,0.05)",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#cbd5e1"
                            }}
                        >
                            ↺ Mark unread
                        </button>
                        {selected.length > 0 && (
                            <button
                                className="interactive-btn"
                                onClick={deleteSelected}
                                style={{
                                    padding: "6px 16px",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(239, 68, 68, 0.3)",
                                    background: "rgba(239, 68, 68, 0.1)",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#ef4444"
                                }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                {/* LIST */}
                <NotificationList
                    notifications={filteredNotifications}
                    toggleRead={toggleRead}
                    toggleSelect={toggleSelect}
                    selected={selected}
                    deleteNotification={deleteNotification}
                />
            </div>
        </div>
    );
};

export default Dashboard;