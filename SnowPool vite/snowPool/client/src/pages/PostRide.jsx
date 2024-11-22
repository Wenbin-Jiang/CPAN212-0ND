import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import PageNav from "../components/PageNav";
import PostAsDriver from "../components/PostAsDriver";
import PostCarpoolRequest from "../components/PostCarpoolRequest";
import styles from "./PostRide.module.css";
import { useUserContext } from "../contexts/UserContext";

function PostRide() {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const { userData, loading } = useUserContext();

  const handleOptionSelect = (option) => {
    if (!userData) {
      alert("Please log in to post a ride or request");
      navigate("/login", {
        state: {
          from: "/post-ride",
          message: "Please log in to post a ride or request",
        },
      });
      return;
    }

    // Check if profile is complete
    if (!userData.profileComplete) {
      alert("Please complete your profile before posting");
      navigate("/complete-profile", {
        state: {
          from: "/post-ride",
          message: "Please complete your profile before posting",
        },
      });
      return;
    }

    setSelectedOption(option);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <main className={styles.postride}>
        <PageNav />
        <div className={styles.row}>
          {!selectedOption && (
            <>
              <h1>Howdy! What are you looking to do today?</h1>
              <div className={styles.buttons}>
                <div
                  className={`${styles.option} ${styles.driverpost}`}
                  onClick={() => handleOptionSelect("driver")}
                >
                  <h2>
                    I'm driving <i className="fas fa-car"></i>
                  </h2>
                  <p>I want to fill empty seats in my car</p>
                </div>
                <div
                  className={`${styles.option} ${styles.carpoolpost}`}
                  onClick={() => handleOptionSelect("request")}
                >
                  <h2>
                    Post a request <i className="fas fa-bell"></i>{" "}
                  </h2>
                  <p>Notify me when a ride is available</p>
                </div>
              </div>
            </>
          )}

          {selectedOption === "driver" &&
            userData &&
            userData.profileComplete && (
              <div className={styles.formContainer}>
                <PostAsDriver />
                <div
                  className={styles.backButton}
                  onClick={() => setSelectedOption(null)}
                >
                  Go Back
                </div>
              </div>
            )}

          {selectedOption === "request" &&
            userData &&
            userData.profileComplete && (
              <div className={styles.formContainer}>
                <PostCarpoolRequest />
                <div
                  className={styles.backButton}
                  onClick={() => setSelectedOption(null)}
                >
                  Go Back
                </div>
              </div>
            )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PostRide;
