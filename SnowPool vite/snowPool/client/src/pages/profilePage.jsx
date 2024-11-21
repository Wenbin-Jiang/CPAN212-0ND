import React from "react";
import PageNav from "../components/PageNav";
import Footer from "../components/Footer";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  return (
    <div className={styles.userProfile}>
      <PageNav />
      <div className={styles.profileContainer}>
        <div className={styles.profileSection}>
          <div className={styles.leftColumn}>
            <div className={styles.avatarContainer}>
              <img
                src="../profile-pic.png"
                alt="Profile"
                className={styles.avatar}
              />
              <button className={styles.cameraButton}>
                <i className="fa fa-camera"></i>
              </button>
            </div>

            <h1 className={styles.userName}>Wen Bin</h1>
            <p className={styles.joinDate}>Joined November 2024</p>
            <p className={styles.userInfo}>Male, 31 years old</p>
          </div>

          <div className={styles.descriptionSection}>
            <textarea
              className={styles.descriptionTextbox}
              defaultValue='"looking to share rides for snowboard trips to MSL"'
              readOnly
            />
            <button className={styles.editDescription}>
              <span className={styles.editIcon}>✏️</span>
              Edit description
            </button>
          </div>
        </div>

        <div className={styles.verifications}>
          <h2>Verifications</h2>
          <div className={styles.verificationsList}>
            <div className={styles.verificationItem}>
              <span className={styles.icon}>📋</span>
              <span className={styles.verificationText}>
                Community agreement
              </span>
              <span className={styles.status}>Signed</span>
            </div>
            <div className={styles.verificationItem}>
              <span className={styles.icon}>✉️</span>
              <span className={styles.verificationText}>Email address</span>
              <span className={styles.editLink}>Edit</span>
              <span className={styles.status}>Verified</span>
            </div>
            <div className={styles.verificationItem}>
              <span className={styles.icon}>💬</span>
              <span className={styles.verificationText}>Phone number</span>
              <span className={styles.editLink}>Edit</span>
              <span className={styles.status}>Verified</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
