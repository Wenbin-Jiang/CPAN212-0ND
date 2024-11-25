import { useState } from "react";
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

const ProfileCompletion = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setFormData((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const profileData = {
        ...formData,
        profileComplete: true,
      };
      delete profileData.profilePicture;

      const response = await api.put("/api/users/profile/update", profileData);

      if (formData.profilePicture) {
        const pictureFormData = new FormData();
        pictureFormData.append("profilePicture", formData.profilePicture);
        await api.put("/api/users/profile/update", pictureFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const updatedProfile = await api.get("/api/users/profile");
      setUser({
        ...updatedProfile.data.data,
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
      </form>
    </div>
  );
};

export default ProfileCompletion;
