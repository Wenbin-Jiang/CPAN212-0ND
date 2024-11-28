import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import PageNav from "../components/PageNav";
import Footer from "../components/Footer";
import DeleteAccount from "../components/DeleteAccount";
import ProfileCompletion from "../components/profileCompletion";
import styles from "./ProfilePage.module.css";
import axios from "axios";

const ProfilePage = () => {
  const { profileComplete, userData, setUser, loading } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );

        if (response.data && response.data.data) {
          setUser({
            ...response.data.data,
            profileComplete: response.data.data.profileComplete,
          });

          if (!response.data.data.profileComplete) {
            navigate("/userprofile");
          }
        }
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          console.error("Request timed out");
          return;
        }
        console.error("Error fetching profile:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, []);

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading || !userData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>Loading...</div>
      </div>
    );
  }

  if (!profileComplete) {
    return <ProfileCompletion />;
  }

  return (
    <div className={styles.userProfile}>
      <PageNav />
      <div className={styles.profileContainer}>
        <div className={styles.profileSection}>
          <div className={styles.leftColumn}>
            <div className={styles.avatarContainer}>
              <img
                src={userData?.profilePicture || "/profile-icon.jpeg"}
                alt="Profile"
                className={styles.avatar}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/profile-icon.jpeg";
                }}
              />
              <label className={styles.cameraButton}>
                <i className="fa fa-camera"></i>
                <input type="file" accept="image/*" hidden />
              </label>
            </div>

            <h1 className={styles.userName}>{userData.name}</h1>
            <p className={styles.joinDate}>
              Joined {formatJoinDate(userData.createdAt)}
            </p>
            <p className={styles.userInfo}>
              {userData.gender}, {calculateAge(userData.birthday)} years old
            </p>
          </div>

          <div className={styles.descriptionSection}>
            <textarea
              className={styles.descriptionTextbox}
              value={userData.bio}
              readOnly
            />
            <button className={styles.editDescription}>
              <span className={styles.editIcon}>✏️</span>
              Edit description
            </button>
          </div>
        </div>

        <div className={styles.driverInfo}>
          <h2>Driver Information</h2>
          <div className={styles.driverDetails}>
            <div className={styles.driverItem}>
              <span className={styles.icon}>🚘</span>
              <span className={styles.driverText}>Car Model:</span>
              <span className={styles.driverValue}>{userData.carModel}</span>
              <span className={styles.editLink}>Edit</span>
            </div>
            <div className={styles.driverItem}>
              <span className={styles.icon}>🪪</span>
              <span className={styles.driverText}>License Plate:</span>
              <span className={styles.driverValue}>
                {userData.licensePlate}
              </span>
              <span className={styles.editLink}>Edit</span>
            </div>
            <div className={styles.driverItem}>
              <span className={styles.icon}>📋</span>
              <span className={styles.driverText}>Driver History:</span>
              <p className={styles.driverValue}>{userData.driverHistory}</p>
              <span className={styles.editLink}>Edit</span>
            </div>
          </div>
        </div>

        <div className={styles.contacts}>
          <h2>Contacts</h2>
          <div className={styles.contactsList}>
            <div className={styles.contactsItem}>
              <span className={styles.icon}>✉️</span>
              <span className={styles.contactsText}>Email address</span>
              <span className={styles.contactsValue}>{userData.email}</span>
              <span className={styles.editLink}>Edit</span>
            </div>
            <div className={styles.contactsItem}>
              <span className={styles.icon}>💬</span>
              <span className={styles.contactsText}>Phone number</span>
              <span className={styles.contactsValue}>{userData.phone}</span>
              <span className={styles.editLink}>Edit</span>
            </div>
            <div className={styles.contactsItem}>
              <span className={styles.icon}>📋</span>
              <span className={styles.contactsText}>Community agreement</span>
              <span className={styles.status}>Signed</span>
            </div>
          </div>
        </div>
        <DeleteAccount />
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
