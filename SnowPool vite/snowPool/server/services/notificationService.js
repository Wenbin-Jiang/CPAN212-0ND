const User = require("../models/userModel");

/**
 * Adds a notification for a user.
 * @param {ObjectId} userId - The ID of the user to notify.
 * @param {Object} notification - The notification object to add.
 */

const addNotification = async (userId, notification) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.notifications.push({
      ...notification,
      createdAt: new Date(),
    });
    await user.save();
  } catch (error) {
    console.error(
      `Failed to send notification to user ${userId}:`,
      error.message
    );
    throw error;
  }
};

module.exports = { addNotification };
