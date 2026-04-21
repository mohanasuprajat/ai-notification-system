# 🚀 AI-Powered Real-Time Notification System

## 📌 Overview

This project is a **real-time notification system** enhanced with **AI-based prioritization and spam detection**. It demonstrates how modern applications can intelligently filter and highlight important notifications using **LLMs (Large Language Models)**.

The system uses:

- **WebSockets** for real-time communication
- **LLM (Together AI)** for intelligent classification
- **React** for an interactive frontend dashboard

---

## 🎯 Objective

Build a system where:

- Users receive **real-time notifications**
- AI determines:
  - **Priority** (High / Medium / Low)
  - **Spam detection** (true / false)

- UI highlights important notifications and enables user interaction

---

## 🧠 Key Features

### 🔴 AI Capabilities

- **Priority Classification**
  - HIGH → Critical alerts (errors, failures, security issues)
  - MEDIUM → Warnings / performance issues
  - LOW → Informational updates

- **Spam Detection**
  - Detects promotional / irrelevant / suspicious messages
  - Flags them visually in UI

---

### ⚡ Real-Time System

- WebSocket-based communication using Socket.IO
- Instant notification delivery from backend → frontend

---

### 🖥️ Frontend (React)

- Live notification dashboard
- Priority-based highlighting
- Spam badge display
- Confidence score (AI transparency)
- Gmail-style bulk actions:
  - Select notifications
  - Mark as read/unread

- Per-notification actions (3-dot menu)
- Pause / Resume real-time updates

---

### ⚙️ Backend (Node.js)

- REST API to trigger notifications
- WebSocket server for real-time updates
- Notification processing pipeline
- AI integration via Together API

---

## 🏗️ Architecture

```text
Client (React)
    ↓ WebSocket
Backend (Node.js + Socket.IO)
    ↓
AI Service (Together LLM)
    ↓
Classification (priority + spam)
    ↓
Emit to frontend
```

---

## 🧩 Tech Stack

| Layer     | Technology              |
| --------- | ----------------------- |
| Frontend  | React                   |
| Backend   | Node.js (Express)       |
| Real-time | Socket.IO               |
| AI        | Together AI (LLaMA 3.1) |
| State     | React Hooks             |

---

## 📂 Project Structure

```text
ai-notification-system/
│
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   └── notificationService.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── config/
│   │   ├── app.js
│   │   └── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NotificationItem.jsx
│   │   │   └── NotificationList.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   └── services/socket.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/ai-notification-system
cd ai-notification-system
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

#### Create `.env`

```env
TOGETHER_API_KEY=your_api_key_here
```

#### Run Backend

```bash
node src/server.js
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🧪 How It Works

1. Backend generates or receives a notification
2. Notification is sent to **AI service**
3. AI returns:

   ```json
   {
     "priority": "HIGH",
     "isSpam": false,
     "confidence": 0.92
   }
   ```

4. Backend emits notification via WebSocket
5. Frontend updates UI in real-time

---

## 🧠 AI Approach

### 🔹 Prompt Engineering

- Strict JSON output enforcement
- Defined classification rules
- Few-shot examples included
- Edge-case handling (fallback defaults)

### 🔹 Validation Layer

- Ensures output consistency
- Fallback logic applied if LLM fails

### 🔹 Hybrid Strategy

```text
LLM → Validate → Fallback → Emit
```

## 🔐 Environment Variables

| Variable         | Description             |
| ---------------- | ----------------------- |
| TOGETHER_API_KEY | API key for Together AI |

---

## 📌 Conclusion

This project demonstrates:

- Real-time system design
- AI integration using LLMs
- Prompt engineering techniques
- Interactive frontend UX

It showcases how intelligent systems can enhance user experience by prioritizing and filtering information effectively.

---
