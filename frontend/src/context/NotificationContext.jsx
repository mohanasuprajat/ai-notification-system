import React, { createContext, useState, useEffect } from "react";
import socket from "../services/socket";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    // Initialize state from LocalStorage if available
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem("notifications");
        return saved ? JSON.parse(saved) : [];
    });

    const [dndQueue, setDndQueue] = useState(() => {
        const saved = localStorage.getItem("dndQueue");
        return saved ? JSON.parse(saved) : [];
    });

    const [dndMode, setDndMode] = useState(() => {
        const saved = localStorage.getItem("dndMode");
        return saved ? JSON.parse(saved) : false;
    });

    const [connected, setConnected] = useState(false);

    // Save state to LocalStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem("dndQueue", JSON.stringify(dndQueue));
    }, [dndQueue]);

    useEffect(() => {
        localStorage.setItem("dndMode", JSON.stringify(dndMode));
    }, [dndMode]);

    // Handle Socket Connections
    useEffect(() => {
        const handleConnect = () => setConnected(true);
        const handleDisconnect = () => setConnected(false);

        const handleNotification = (data) => {
            // Give data a unique ID just in case the backend pushes too fast
            const uniqueData = { ...data, ui_key: Math.random().toString(36).substr(2, 9) };
            
            if (dndMode) {
                setDndQueue((prev) => [uniqueData, ...prev]);
            } else {
                setNotifications((prev) => [uniqueData, ...prev]);
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
    }, [dndMode]);

    // Handle exiting DND mode (flushing queue)
    useEffect(() => {
        if (!dndMode && dndQueue.length > 0) {
            setNotifications((prev) => [...dndQueue, ...prev]);
            setDndQueue([]);
        }
    }, [dndMode, dndQueue]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                setNotifications,
                dndMode,
                setDndMode,
                dndQueue,
                setDndQueue,
                connected
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
