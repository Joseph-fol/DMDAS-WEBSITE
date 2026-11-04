const Notification = require("../models/notification.model");

const getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    if (notifications.length === 0) {
      const welcomeNotification = await Notification.create({
        user: req.user._id,
        title: "Welcome to DMDAS",
        message: "Your student account is ready for manual purchases and pickup.",
        type: "welcome",
      });
      notifications = [welcomeNotification.toObject()];
    }

    return res.json({
      notifications: notifications.map((notification) => ({
        id: String(notification._id),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        createdAt: notification.createdAt,
        read: notification.read,
      })),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Unable to load notifications." });
  }
};

const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } },
    );
    return res.json({ message: "Notifications marked as read." });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return res
      .status(500)
      .json({ message: "Unable to mark notifications as read." });
  }
};

module.exports = { getNotifications, markNotificationsRead };
