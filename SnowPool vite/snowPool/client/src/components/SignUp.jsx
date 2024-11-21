import { useState } from "react";
import styles from "./SignUp.module.css";
import axios from "axios";

const baseURL = "http://localhost:8001";

export default function SignUp({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/users/register`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if registration was successful
      if (response.data) {
        // Clear form
        setEmail("");
        setPassword("");

        // Show success message and redirect to login
        alert("Registration successful! Please login.");
        onBack(); // Navigate back to the login form
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSignUp}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.row}>
        <label htmlFor="signup-email">Email address</label>
        <input
          type="email"
          id="signup-email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="signup-password">Password</label>
        <input
          type="password"
          id="signup-password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className={styles.buttons}>
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className={styles.backButton}
          disabled={loading}
        >
          Back
        </button>
      </div>
    </form>
  );
}
