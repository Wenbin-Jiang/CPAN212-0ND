import { useState } from "react";
import styles from "./ProfileCompletion.module.css";
import { useUserContext } from "../contexts/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseURL = "http://localhost:8001";

const ProfileCompletion = () => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    gender: "",
    birthday: "",
    phone: "",
    driverHistory: "",
    carModel: "",
    licensePlate: "",
    bio: "",
    profilePicture: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");

      // Create the profile data object with profileComplete flag
      const profileData = {
        ...formData,
        profileComplete: true, // Explicitly set profileComplete to true
      };
      delete profileData.profilePicture; // Remove profilePicture from JSON data

      // First, update profile data
      const response = await axios.put(
        `${baseURL}/api/users/profile/update`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // If there's a profile picture, handle it separately
      if (formData.profilePicture) {
        const pictureFormData = new FormData();
        pictureFormData.append("profilePicture", formData.profilePicture);

        await axios.put(
          `${baseURL}/api/users/profile/update`,
          pictureFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // Update the user context with the response data and ensure profileComplete is true
      setUser({
        ...response.data.user,
        profileComplete: true,
      });

      // Force a reload of the profile data
      const updatedProfile = await axios.get(`${baseURL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser({
        ...updatedProfile.data.data,
        profileComplete: true,
      });

      // Navigate to the profile page
      navigate("/userprofile", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error completing profile. Please try again."
      );
      console.error("Profile completion error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.completionForm}>
      <h1>Complete Your Profile</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.photoSection}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatarPreview}>
              {formData.profilePicture ? (
                <img
                  src={URL.createObjectURL(formData.profilePicture)}
                  alt="Profile Preview"
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <i className="fa fa-user"></i>
                </div>
              )}
            </div>
            <label className={styles.uploadButton}>
              <i className="fa fa-camera"></i>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profilePicture: e.target.files[0],
                  })
                }
                hidden
              />
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Full Name *</label>
          <input
            type="text"
            required
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Address *</label>
          <input
            type="text"
            required
            placeholder="Enter your address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Gender *</label>
            <select
              required
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Birthday *</label>
            <input
              type="date"
              required
              value={formData.birthday}
              onChange={(e) =>
                setFormData({ ...formData, birthday: e.target.value })
              }
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Phone Number *</label>
          <input
            type="tel"
            required
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label>Driver History *</label>
          <input
            type="text"
            required
            placeholder="Enter your driver license class and history"
            value={formData.driverHistory}
            onChange={(e) =>
              setFormData({ ...formData, driverHistory: e.target.value })
            }
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Car Model *</label>
            <input
              type="text"
              required
              placeholder="Enter your car model"
              value={formData.carModel}
              onChange={(e) =>
                setFormData({ ...formData, carModel: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>License Plate *</label>
            <input
              type="text"
              required
              placeholder="Enter your license plate"
              value={formData.licensePlate}
              onChange={(e) =>
                setFormData({ ...formData, licensePlate: e.target.value })
              }
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Bio</label>
          <textarea
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <div className={styles.agreements}>
          <label className={styles.checkbox}>
            <input type="checkbox" required />
          </label>
          <span className={styles.agreementsText}>
            I agree to the community guidelines
          </span>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Completing Profile..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileCompletion;
