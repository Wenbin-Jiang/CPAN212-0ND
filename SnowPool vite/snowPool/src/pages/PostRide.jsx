import React, { useState } from "react";
import Footer from "../components/Footer";
import PageNav from "../components/PageNav";
import PostAsDriver from "../components/PostAsDriver";
import PostCarpoolRequest from "../components/PostCarpoolRequest";
import styles from "./PostRide.module.css";

function PostRide() {
  const [selectedOption, setSelectedOption] = useState(null); // Toggle between forms

  return (
    <>
      <main className={styles.postride}>
        <PageNav />
        <div className={styles.row}>
          {!selectedOption && <h1>Howdy! What are you looking to do today?</h1>}
          {!selectedOption && (
            <div className={styles.buttons}>
              <div
                className={`${styles.option} ${styles.driverpost}`}
                onClick={() => setSelectedOption("driver")}
              >
                <h2>
                  I'm driving <i className="fas fa-car"></i>
                </h2>
                <p>I want to fill empty seats in my car</p>
              </div>
              <div
                className={`${styles.option} ${styles.carpoolpost}`}
                onClick={() => setSelectedOption("request")}
              >
                <h2>
                  Post a request <i className="fas fa-bell"></i>{" "}
                </h2>
                <p>Notify me when a ride is available</p>
              </div>
            </div>
          )}
          {/* Dynamically render the selected form */}
          {selectedOption === "driver" && (
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
          {selectedOption === "request" && (
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
