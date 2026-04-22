# 🚀 AI-Powered Operations Center

## 📌 Overview

The **AI-Powered Operations Center** is an intelligent, real-time notification dashboard designed to handle massive influxes of system events or alerts gracefully. Instead of simply presenting chronological lists of alerts, this architecture intercepts every event, passes it through a Large Language Model (Together AI), and uses **Generative AI** to instantly classify its priority, detect spam, and calculate an AI confidence metric.

This categorized data is then streamed in real-time via WebSockets to a React frontend. The client application boasts a stunning dark-mode glassmorphic interface, state persistence via `localStorage`, and intelligent productivity features like a background queuing "Focus Mode" (DND).

---

## 🏛️ Architecture Overview

The project relies on a pipeline architecture heavily decoupling the UI from data simulation and AI rendering:

```text
[ Simulator ] 
     ↓ (Raw Text Event)
[ Backend (Node.js/Express) ] 
     ↓ (HTTP Request)
[ Together AI API (LLaMA 3.1) ] 
     ↓ (Returns strict JSON)
[ Backend Parser ] -> Emits via Socket.io
     ↓ (WebSockets stream)
[ Frontend (React Context API) ] 
     ↓
[ Operations Center UI / LocalStorage ]
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/mohanasuprajat/ai-notification-system-project.git
cd ai-notification-system
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```
**Configure Environment:**  
Create a `.env` file inside the `/backend` folder and add your Together AI key:
```env
TOGETHER_API_KEY=your_together_api_key_here
```
**Start the Backend Server:**
```bash
node src/server.js
```
*The backend runs on `http://localhost:5000` and instantly begins polling the AI.*

### 3️⃣ Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm start
```
*The React app runs on `http://localhost:3000`.*

---

## 📂 Folder Structure

```text
ai-notification-system/
│
├── backend/
│   ├── src/
│   │   ├── config/                  # Socket.io configuration setup
│   │   ├── services/
│   │   │   ├── aiService.js         # Integration with Together AI LLM
│   │   │   └── notificationService.js # AI bridging & socket emitting
│   │   ├── utils/
│   │   │   └── generateNotifications.js # Simulated event generator
│   │   ├── app.js                   # Express application setup
│   │   └── server.js                # Entry point, initializes backend server
│   ├── .env                         # Backend API keys
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NotificationItem.jsx # Interactive notification UI cards
│   │   │   └── NotificationList.jsx # Main list rendering
│   │   ├── context/
│   │   │   └── NotificationContext.jsx # Global State & LocalStorage Hub
│   │   ├── pages/
│   │   │   └── Dashboard.jsx        # The Operations Center layout
│   │   ├── App.js                   # Application provider wrapper
│   │   ├── index.css                # Glassmorphic dark themes & animations
│   │   └── index.js                 # React root
│   └── package.json
```

---

## 🏗️ Implemented Features

### 🖥️ Frontend
* **Premium Glassmorphic UI:** A dark-themed (slate/navy) dashboard utilizing CSS backdrop blurs, subtle glowing gradients, and fluid micro-animations designed to look like a high-tech control center.
* **Context API & State Persistence:** Application data isn't lost on refresh. The `NotificationContext` seamlessly writes the main event list and Do-Not-Disturb queues directly into the browser's `localStorage` engine in real time.
* **Focus Mode (DND):** Users can activate a DND toggle. This elegantly intercepts the live WebSocket stream and halts notifications from appearing on-screen, placing them into a hidden queue sequence. A minimalist banner tracks how many notifications are being held back.
* **AI Visualizations:** Custom animated progress bars visually interpret the generative AI's confidence levels (e.g., 90% confidence renders in green, lower in amber/red).
* **Robust Status Controls:**
  * **Interactive Tabs:** Split notifications between general operations and an AI-detected Spam quarantine bin.
  * **Action Bar:** Bulk-select items via checkboxes to mass-mark as read, unread, or permanently delete.
  * **3-Dot Menus:** Per-card dropdown menus control individual payload deletions or status overrides.

### ⚙️ Backend
* **Real-time Pipeline:** Utilizes `Socket.IO` attached to an Express server to stream data out to the frontend with zero-latency polling.
* **AI NLP Analyzer:** Uses a `Services` architectural pattern to bridge incoming data strings with a strict prompt-engineered LLM call. The AI forces a deterministic JSON payload outcome containing:
  * `priority`: HIGH, MEDIUM, LOW
  * `isSpam`: Boolean (true/false)
  * `confidence`: Decimal score 0.0 - 1.0
* **Unique Identification Engine:** All backend notifications are assigned tracking timestamps securely to prevent React UI rendering freezes.
* **Simulator Mechanism:** An internal data generator randomly simulates varying levels of critical failures, warnings, harmless user actions, and deceptive promo/spam text strings to feed the system.

---

## 🧠 AI Approach Used

This system uses **Prompt Engineering** and **Deterministic JSON Parsing** mapped to Together AI's open-source models (e.g. LLaMA 3.1). 
* **Zero-shot/Few-shot Classification:** We pass strict definitions of what constitutes a "HIGH" priority alert (servers failing, auth hacks) vs a "LOW" priority alert (user successfully logging in).
* **Defensive Prompting:** The prompt physically demands the LLM to return `JSON-only` strings, preventing conversational hallucinations. 
* **Dual-Layer Fallback:** If the LLM throws an error or breaks the JSON output format due to rate-limit timing, the backend service uses `try/catch` fallback mechanics to assign a default `"MEDIUM" / isSpam: false` to ensure the WebSocket pipeline never crashes.

---

## 🛤️ Entire Walkthrough

1. **System Initialization:** You start the backend server (`npm run dev`) and React frontend (`npm start`). As the dashboard boots, the `NotificationContext` provider verifies if you've used the application before and immediately restores your previously compiled data from `localStorage`. 
2. **Event Simulation:** The backend's `generateNotifications.js` automatically begins firing random text payloads locally (e.g., *"Database connection lost"*, *"Win a free iPhone"*).
3. **AI Classification Stage:** The backend pauses the output, forwards the text string to the Together AI API, and says: *Analyze this threat level and return JSON*. The LLM evaluates it and constructs the priority and spam data cleanly.
4. **Broadcast Phase:** `socket.emit` fires the completed JSON payload out linearly to any connected UI clients.
5. **UI Reception:** 
   * If **Focus Mode** is ACTIVE: The frontend catches the WebSocket signal and pushes the payload into an invisible state queue. The UI reveals a purple banner acknowledging holding elements.
   * If **Focus Mode** is INACTIVE: The payload drops seamlessly into the main Priority tab, visually animating via a slide-in effect, instantly mapping its priority badge and rendering the AI's confidence score graph.
6. **User Interaction:** The Operations Manager (You) can select the notification via checkbox to bulk-delete it, hover over the "Spam" section to analyze quarantined items, or just enjoy watching the real-time AI logic operate automatically!

---

## ⚠️ Assumptions

* **Browser Storage:** The frontend relies on the browser's `localStorage` being unblocked and accessible payload limits (typically 5MB).
* **Port Availability:** It is assumed ports `3000` (React) and `5000` (Express) are not already bound by other local processes.
* **AI Rate Limiting:** Since the local event generator dispatches a new string every 3 seconds, the Together AI free-tier API parameters must accommodate synchronous rapid calls without flagging.
* **Network Execution:** Network latency is considered largely instantaneous in this internal WebSocket architecture.

---

## 📌 Conclusion

The AI-Powered Operations Center is a highly scalable solution demonstrating how modern Generative AI models can transition from being conversational chatbots into rigid, programmatic logical filters. Paired closely with WebSockets and a highly optimized React front-end, it proves that "noise" in modern infrastructure (massive warning logs, security alerts, user influx) can be intelligently categorized without causing operator fatigue.
