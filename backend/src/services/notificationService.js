const { classifyNotification } = require("./aiService");
const { getIO } = require("../config/socket");

async function createAndSendNotification(message) {
  const aiResult = await classifyNotification(message);

  const notification = {
    id: Date.now(),
    message,
    priority: aiResult.priority,
    isSpam: aiResult.isSpam,
    read: false,
    timestamp: new Date(),
  };

  const io = getIO();
  io.emit("notification", notification);

  return notification;
}

module.exports = { createAndSendNotification };
