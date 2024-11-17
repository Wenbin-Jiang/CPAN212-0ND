import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
import Footer from "../components/Footer";
import styles from "./Dashboard.module.css";

const Dashboard = ({ user }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setShowPopup(true);
  };

  const handleOptionSelect = (path) => {
    setShowPopup(false);
    navigate(path);
  };

  return (
    <div className={styles.dashboardContainer}>
      <PageNav />
      {/* Header Profile Section */}
      <div className={styles.profileSection}>
        <div className={styles.profileInfo}>
          <img
            src={user.profileImage}
            alt="Profile"
            className={styles.profileImage}
          />
          <div className={styles.welcomeText}>
            <h1>Hi {user.name},</h1>
            <p>Welcome to SnowPool!</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <i className="fas fa-road"></i>
            <span>No km shared, yet</span>
          </div>
          <div className={styles.statItem}>
            <i className="fas fa-car"></i>
            <span>You've not driven, yet</span>
          </div>
        </div>

        <div className={styles.getStartedContainer}>
          <button
            className={styles.getStartedButton}
            onClick={handleGetStarted}
          >
            Get started
          </button>

          {showPopup && (
            <>
              <div
                className={styles.overlay}
                onClick={() => setShowPopup(false)}
              />
              <div className={styles.popup}>
                <button
                  className={styles.popupOption}
                  onClick={() => handleOptionSelect("/postride")}
                >
                  <i className="fas fa-car-side"></i>
                  Post a ride
                </button>
                <button
                  className={styles.popupOption}
                  onClick={() => handleOptionSelect("/findride")}
                >
                  <i className="fas fa-search"></i>
                  Find a ride
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Community Section */}
      <div className={styles.communitySection}>
        <h2>Get involved in the community</h2>
        <div className={styles.cardContainer}>
          {/* Referral Card */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <span className={styles.creditAmount}>$5.00</span>
            </div>
            <h3>Refer your friends</h3>
            <p>Give $5 and receive $5 for each friend you refer to Poparide.</p>
            <button className={styles.cardButton}>Start referring now</button>
          </div>

          {/* Social Media Card */}
          <div className={styles.card}>
            <div className={styles.socialIcons}>
              <i className="fab fa-tiktok"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-facebook"></i>
            </div>
            <h3>Get featured</h3>
            <p>Tag #snowboard and get featured in our Instagram and TikTok.</p>
            <button className={styles.cardButton}>
              Follow us on Instagram
            </button>
          </div>

          {/* Reviews Card */}
          <div className={styles.card}>
            <div className={styles.ratingStars}>⭐⭐⭐⭐⭐</div>
            <h3>We love reviews</h3>
            <p>
              Share your experience on social media and the app stores to help
              us grow.
            </p>
            <button className={styles.cardButton}>Give us a review</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
