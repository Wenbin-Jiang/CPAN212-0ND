import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import PageNav from "../components/PageNav";
import Footer from "../components/Footer";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { userData, loading } = useUserContext();

  useEffect(() => {
    if (!loading && !userData) {
      navigate("/login");
    }
  }, [userData, loading, navigate]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>Loading...</div>
      </div>
    );
  }

  if (!userData) return null;

  const renderProfileSection = () => (
    <div className={styles.profileSection}>
      <div className={styles.profileInfo}>
        <img
          src={userData.profilePicture || "../profile-icon.jpeg"}
          alt="Profile"
          className={styles.profileImage}
        />
        <div className={styles.welcomeText}>
          <h1>Hi {userData.name},</h1>
          <p>Welcome to SnowPool!</p>
        </div>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <i className="fas fa-road"></i>
          <span>{userData.totalKm || "No km shared, yet"}</span>
        </div>
        <div className={styles.statItem}>
          <i className="fas fa-car"></i>
          <span>
            {userData.totalRides
              ? `${userData.totalRides} rides`
              : "You've not driven, yet"}
          </span>
        </div>
      </div>

      <div className={styles.getStartedContainer}>
        <button
          className={styles.getStartedButton}
          onClick={() => setShowPopup(true)}
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
                onClick={() => {
                  setShowPopup(false);
                  navigate("/postride");
                }}
              >
                <i className="fas fa-car-side"></i>
                Post a ride
              </button>
              <button
                className={styles.popupOption}
                onClick={() => {
                  setShowPopup(false);
                  navigate("/findride");
                }}
              >
                <i className="fas fa-search"></i>
                Find a ride
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderCommunitySection = () => (
    <div className={styles.communitySection}>
      <h2>Get involved in the community</h2>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <span className={styles.creditAmount}>$5.00</span>
          </div>
          <h3>Refer your friends</h3>
          <p>Give $5 and receive $5 for each friend you refer to Poparide.</p>
          <button className={styles.cardButton}>Start referring now</button>
        </div>

        <div className={styles.card}>
          <div className={styles.socialIcons}>
            <i className="fab fa-tiktok"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-facebook"></i>
          </div>
          <h3>Get featured</h3>
          <p>Tag #snowboard and get featured in our Instagram and TikTok.</p>
          <button className={styles.cardButton}>Follow us on Instagram</button>
        </div>

        <div className={styles.card}>
          <div className={styles.ratingStars}>⭐⭐⭐⭐⭐</div>
          <h3>We love reviews</h3>
          <p>
            Share your experience on social media and the app stores to help us
            grow.
          </p>
          <button className={styles.cardButton}>Give us a review</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      <PageNav />
      {renderProfileSection()}
      {renderCommunitySection()}
      <Footer />
    </div>
  );
};

export default Dashboard;
