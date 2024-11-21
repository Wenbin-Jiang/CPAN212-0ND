import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import axios from "axios";
import styles from "./DeleteAccount.module.css";

const baseURL = "http://localhost:8001";

const DeleteAccount = () => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { logout } = useUserContext();
  const navigate = useNavigate();

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setError("");
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      setError("");

      const token = localStorage.getItem("authToken");
      await axios.delete(`${baseURL}/api/users/profile/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      logout(); // Clear user context and local storage
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error deleting account:", error);
      setError(error.response?.data?.message || "Error deleting account");
    } finally {
      setDeleteLoading(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className={styles.deleteSection}>
      <h2>Delete Account</h2>
      <p className={styles.warningText}>
        Warning: This action cannot be undone. All your data will be permanently
        deleted.
      </p>
      {error && <div className={styles.error}>{error}</div>}
      <button
        className={styles.deleteButton}
        onClick={handleDeleteClick}
        disabled={deleteLoading}
      >
        {deleteLoading ? "Deleting Account..." : "Delete Account"}
      </button>

      {showConfirmModal && (
        <>
          <div className={styles.modalOverlay} onClick={handleCancelDelete} />
          <div className={styles.confirmationModal}>
            <h3>Confirm Account Deletion</h3>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete My Account"}
              </button>
              <button
                className={styles.cancelButton}
                onClick={handleCancelDelete}
                disabled={deleteLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeleteAccount;
