
import React, { useEffect, useState, useMemo } from "react";
import socket from "../services/socket";
import NotificationList from "../components/NotificationList";

const Dashboard = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [activeTab, setActiveTab] = useState("PRIORITY");
    const [connected, setConnected] = useState(false);
    const [paused, setPaused] = useState(false);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const handleConnect = () => setConnected(true);
        const handleDisconnect = () => setConnected(false);

        const handleNotification = (data) => {
            if (!paused) {
                setNotifications((prev) => [data, ...prev]);
            }
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("notification", handleNotification);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("notification", handleNotification);
        };
    }, [paused]);

    // Counts
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
        if (selected.length === filteredNotifications.length) {
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

    return (
        <div style={{ background: "#f4f6f9", minHeight: "100vh", fontFamily: "Inter" }}>

            {/* HEADER */}
            <div style={{
                padding: "16px 30px",
                background: "#fff",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <h2 style={{ margin: 0 }}>🔔 Notifications</h2>

                <span style={{ fontSize: "12px" }}>
                    Status:{" "}
                    <span style={{
                        color: connected ? "#52c41a" : "#ff4d4f",
                        fontWeight: "600"
                    }}>
                        {connected ? "Live" : "Disconnected"}
                    </span>
                </span>
            </div>

            {/* MAIN CARD */}
            <div style={{
                margin: "24px 30px",
                background: "#fff",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.02)"
            }}>

                {/* TABS */}
                <div style={{
                    display: "flex",
                    borderBottom: "1px solid #eee",
                    marginBottom: "15px"
                }}>
                    {[
                        { key: "PRIORITY", label: "Priority" },
                        { key: "SPAM", label: "Spam" }
                    ].map((tab) => (
                        <div
                            key={tab.key}
                            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: "10px 16px",
                                cursor: "pointer",
                                borderBottom:
                                    activeTab === tab.key
                                        ? "3px solid #1677ff"
                                        : "3px solid transparent",
                                color:
                                    activeTab === tab.key
                                        ? "#1677ff"
                                        : "#666",
                                fontWeight: "600",
                                fontSize: "13px"
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
                        gap: "8px",
                        marginBottom: "15px"
                    }}>
                        {["ALL", "HIGH", "MEDIUM", "LOW"].map((type) => (
                            <button
                                key={type}
                                className="filter-btn interactive-btn"
                                onClick={() => setFilter(type)}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "24px",
                                    border: filter === type ? "none" : "1px solid #e2e8f0",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    background:
                                        filter === type ? "linear-gradient(135deg, #1677ff, #597ef7)" : "#fff",
                                    color:
                                        filter === type ? "#fff" : "#475569",
                                    boxShadow: filter === type ? "0 4px 10px rgba(22, 119, 255, 0.2)" : "none",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                {type} {type !== "ALL" && `(${counts[type]})`}
                            </button>
                        ))}
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
                        />

                        <span style={{ fontSize: "12px", color: "#888" }}>
                            {selected.length > 0
                                ? `${selected.length} selected`
                                : `${filteredNotifications.length} items`}
                        </span>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button 
                            className="interactive-btn"
                            onClick={() => markSelected(true)}
                            style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #d9d9d9", background: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "500", color: "#333" }}
                        >
                            Mark read
                        </button>
                        <button 
                            className="interactive-btn"
                            onClick={() => markSelected(false)}
                            style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #d9d9d9", background: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "500", color: "#333" }}
                        >
                            Mark unread
                        </button>
                        <button 
                            className="interactive-btn"
                            onClick={() => setPaused((p) => !p)}
                            style={{ padding: "6px 14px", borderRadius: "6px", border: paused ? "none" : "1px solid #ff4d4f", background: paused ? "#52c41a" : "#fff", color: paused ? "#fff" : "#ff4d4f", cursor: "pointer", fontSize: "13px", fontWeight: "600", transition: "all 0.3s" }}
                        >
                            {paused ? "▶ Resume" : "⏸ Pause"}
                        </button>
                    </div>
                </div>

                {/* LIST */}
                <NotificationList
                    notifications={filteredNotifications}
                    toggleRead={toggleRead}
                    toggleSelect={toggleSelect}
                    selected={selected}
                />
            </div>
        </div>
    );
};

export default Dashboard;