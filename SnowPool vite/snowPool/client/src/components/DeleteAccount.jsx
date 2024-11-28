import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import api from "../services/api";
import styles from "./DeleteAccount.module.css";

const DeleteAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { logout } = useUserContext();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.delete("/api/users/profile");

      if (response.success) {
        logout();
        navigate("/");
      } else {
        throw new Error(response.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setError(error.response?.data?.message || "Error deleting account");
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };
  const Modal = () => (
    <>
      <div
        className={styles.modalOverlay}
        onClick={() => setShowModal(false)}
      />
      <div className={styles.confirmationModal}>
        <h3>Confirm Account Deletion</h3>
        <p>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        <div className={styles.modalButtons}>
          <button
            className={styles.confirmButton}
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Yes, Delete My Account"}
          </button>
          <button
            className={styles.cancelButton}
            onClick={() => setShowModal(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );

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
        onClick={() => setShowModal(true)}
        disabled={isLoading}
      >
        {isLoading ? "Deleting Account..." : "Delete Account"}
      </button>

      {showModal && <Modal />}
    </div>
  );
};

export default DeleteAccount;
