import React from "react";
import Dashboard from "./pages/Dashboard";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <Dashboard />
    </NotificationProvider>
  );
}

export default App;
