const {
  createAndSendNotification,
} = require("../services/notificationService");

exports.sendNotification = async (req, res) => {
  const { message } = req.body;

  const notification = await createAndSendNotification(message);

  res.json({
    success: true,
    data: notification,
  });
};
