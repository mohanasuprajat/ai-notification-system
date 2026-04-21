const {
  createAndSendNotification,
} = require("../services/notificationService");

const messages = [
  // 🔴 HIGH (Critical / urgent)
  "Payment failed for order #45821",
  "Unauthorized login attempt detected",
  "Server CPU usage exceeded 95%",
  "Database connection lost unexpectedly",
  "Security alert: multiple failed login attempts",

  // 🟡 MEDIUM (Warnings / attention needed)
  "Disk space is running low on server",
  "Memory usage is above normal levels",
  "Unusual activity detected in user account",
  "Backup delayed due to network latency",
  "API response time is slower than expected",

  // 🟢 LOW (Informational)
  "New user registered successfully",
  "User profile updated",
  "Daily backup completed successfully",
  "New message received from support team",
  "User logged in from known device",

  // 🚨 SPAM (Promotional / suspicious)
  "Congratulations! You’ve won a free iPhone 🎉",
  "Click here to claim your reward now!!!",
  "Limited time offer: 90% discount on premium plan",
  "Earn money fast with this simple trick",
  "You have been selected for an exclusive prize",
];

function startGenerating() {
  console.log("Starting notification generator...");

  setInterval(() => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    createAndSendNotification(msg);
  }, 3000);
}

module.exports = { startGenerating };
