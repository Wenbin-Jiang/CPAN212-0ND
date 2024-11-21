import { useState } from "react";
import styles from "./ProfileCompletion.module.css";

const ProfileCompletion = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    gender: "",
    birthday: "",
    phoneNumber: "",
    driverHistory: "",
    carModel: "",
    licensePlate: "",
    bio: "",
    profilePicture: null,
  });

  return (
    <div className={styles.completionForm}>
      <h1>Complete Your Profile</h1>

      <form className={styles.form}>
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
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label>Driver History *</label>
          <textarea
            required
            placeholder="Enter your driving experience and history"
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
            <span>I agree to the community guidelines</span>
          </label>
        </div>

        <button type="submit" className={styles.submitButton}>
          Complete Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileCompletion;
