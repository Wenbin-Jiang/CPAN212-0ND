import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import api from "../services/api";
import styles from "./ProfileCompletion.module.css";

const initialFormData = {
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
};

// Error Alert Component
const ErrorAlert = ({ message, onClose }) => (
  <div className={styles.alertOverlay}>
    <div className={styles.alertBox}>
      <p>{message}</p>
      <button onClick={onClose}>OK</button>
    </div>
  </div>
);

const ProfileCompletion = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setError("");

    if (name === "profilePicture" && files[0]) {
      const file = files[0];

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        e.target.value = ""; // Clear the file input
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setError("Only .png, .jpg and .jpeg formats are allowed");
        e.target.value = ""; // Clear the file input
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: file,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      // Append all profile data
      Object.keys(formData).forEach((key) => {
        if (key === "profilePicture" && formData[key]) {
          formDataToSend.append("profilePicture", formData[key]); // Changed from 'image' to 'profilePicture'
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      formDataToSend.append("profileComplete", true);

      // Single request to update profile with image
      const response = await api.put("/api/users/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token if needed
        },
      });

      setUser({
        ...response.data.data,
        profileComplete: true,
      });

      navigate("/userprofile", { replace: true });
    } catch (error) {
      console.error("Profile completion error:", error);
      setError(error.response?.data?.message || "Error completing profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cleanup function to revoke object URLs
    return () => {
      if (
        formData.profilePicture &&
        typeof formData.profilePicture === "object"
      ) {
        URL.revokeObjectURL(URL.createObjectURL(formData.profilePicture));
      }
    };
  }, [formData.profilePicture]);

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
                name="profilePicture"
                accept="image/*"
                onChange={handleInputChange}
                hidden
              />
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Address *</label>
          <input
            type="text"
            name="address"
            required
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Gender *</label>
            <select
              name="gender"
              required
              value={formData.gender}
              onChange={handleInputChange}
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
              name="birthday"
              required
              value={formData.birthday}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Driver History *</label>
          <input
            type="text"
            name="driverHistory"
            required
            placeholder="Enter your driver license class and history"
            value={formData.driverHistory}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Car Model *</label>
            <input
              type="text"
              name="carModel"
              required
              placeholder="Enter your car model"
              value={formData.carModel}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>License Plate *</label>
            <input
              type="text"
              name="licensePlate"
              required
              placeholder="Enter your license plate"
              value={formData.licensePlate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Bio</label>
          <textarea
            name="bio"
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={handleInputChange}
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
        {error && <ErrorAlert message={error} onClose={() => setError("")} />}
      </form>
    </div>
  );
};

export default ProfileCompletion;
