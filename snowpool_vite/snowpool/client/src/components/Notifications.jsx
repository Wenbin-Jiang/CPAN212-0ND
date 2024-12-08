import React, { useState, useEffect } from "react";
import api from "../services/api";
import styles from "./Notifications.module.css";
import { getFirstPart, formatDate } from "./utils";

const PAGE_SIZE = 3;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadExpanded, setUnreadExpanded] = useState(false);
  const [readExpanded, setReadExpanded] = useState(false);
  const [currentUnreadPage, setCurrentUnreadPage] = useState(1);
  const [currentReadPage, setCurrentReadPage] = useState(1);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/api/users/notifications");
        if (response.success) {
          setNotifications(response.data);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const response = await api.put(
        `/api/users/notifications/${notificationId}/read`
      );
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const toggleUnreadExpand = () => {
    setUnreadExpanded((prev) => !prev);
  };

  const toggleReadExpand = () => {
    setReadExpanded((prev) => !prev);
  };

  const handlePageChange = (page, type) => {
    if (type === "unread") {
      setCurrentUnreadPage(page);
    } else if (type === "read") {
      setCurrentReadPage(page);
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  // Separate unread and read notifications
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  // Paginate unread notifications
  const paginatedUnreadNotifications = unreadNotifications.slice(
    (currentUnreadPage - 1) * PAGE_SIZE,
    currentUnreadPage * PAGE_SIZE
  );

  // Paginate read notifications
  const paginatedReadNotifications = readNotifications.slice(
    (currentReadPage - 1) * PAGE_SIZE,
    currentReadPage * PAGE_SIZE
  );

  return (
    <div className={styles.notificationsContainer}>
      <h1>Notifications</h1>

      {/* Unread Notifications */}
      {unreadNotifications.length === 0 ? (
        <p>No unread notifications.</p>
      ) : (
        <>
          <button onClick={toggleUnreadExpand} className={styles.expandButton}>
            {unreadExpanded
              ? "Hide Unread Notifications"
              : "Show Unread Notifications"}
          </button>
          {unreadExpanded && (
            <>
              <ul>
                {paginatedUnreadNotifications.map((notification) => (
                  <li
                    key={notification._id}
                    className={`${styles.notificationItem} ${
                      notification.read ? styles.read : ""
                    }`}
                  >
                    <p>{notification.message}</p>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className={styles.markAsReadButton}
                      >
                        Mark as read
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <div className={styles.paginationControls}>
                {currentUnreadPage > 1 && (
                  <button
                    onClick={() =>
                      handlePageChange(currentUnreadPage - 1, "unread")
                    }
                    className={styles.pageButton}
                  >
                    Previous
                  </button>
                )}
                {unreadNotifications.length > currentUnreadPage * PAGE_SIZE && (
                  <button
                    onClick={() =>
                      handlePageChange(currentUnreadPage + 1, "unread")
                    }
                    className={styles.pageButton}
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <>
          <button onClick={toggleReadExpand} className={styles.expandButton}>
            {readExpanded
              ? "Hide Read Notifications"
              : "Show Read Notifications"}
          </button>
          {readExpanded && (
            <>
              <ul>
                {paginatedReadNotifications.map((notification) => (
                  <li
                    key={notification._id}
                    className={styles.notificationItem}
                  >
                    <p>{notification.message}</p>
                    <span className={styles.alreadyReadMessage}>
                      Already read
                    </span>
                  </li>
                ))}
              </ul>
              <div className={styles.paginationControls}>
                {currentReadPage > 1 && (
                  <button
                    onClick={() =>
                      handlePageChange(currentReadPage - 1, "read")
                    }
                    className={styles.pageButton}
                  >
                    Previous
                  </button>
                )}
                {readNotifications.length > currentReadPage * PAGE_SIZE && (
                  <button
                    onClick={() =>
                      handlePageChange(currentReadPage + 1, "read")
                    }
                    className={styles.pageButton}
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;
