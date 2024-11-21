import React, { useEffect } from "react";
import PageNav from "../components/PageNav";
import Footer from "../components/Footer";
import ProfileCompletion from "../components/profileCompletion";
import styles from "./ProfilePage.module.css";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseURL = "http://localhost:8001";

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
        const response = await axios.get(`${baseURL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser({
          ...response.data.data,
          profileComplete: response.data.data.profileComplete,
        });

        if (!response.data.data.profileComplete) {
          navigate("/userprofile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, setUser]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>Loading...</div>
      </div>
    );
  }

  if (!profileComplete) {
    return <ProfileCompletion />;
  }

  // Calculate age from birthday
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

  // Format join date
  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleEditDescription = async () => {
    // Implementation for editing description
  };

  const handleProfilePictureUpdate = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${baseURL}/api/users/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser({
        ...userData,
        profilePicture: response.data.user.profilePicture,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  return (
    <div className={styles.userProfile}>
      <PageNav />
      <div className={styles.profileContainer}>
        <div className={styles.profileSection}>
          <div className={styles.leftColumn}>
            <div className={styles.avatarContainer}>
              <img
                src={userData.profilePicture || "../profile-icon.jpeg"}
                alt="Profile"
                className={styles.avatar}
              />
              <label className={styles.cameraButton}>
                <i className="fa fa-camera"></i>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpdate}
                  hidden
                />
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
              defaultValue={userData.bio}
              readOnly
            />
            <button
              className={styles.editDescription}
              onClick={handleEditDescription}
            >
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
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
