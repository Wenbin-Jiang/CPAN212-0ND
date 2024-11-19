import { useState } from "react";
import styles from "./SignUp.module.css";

export default function SignUp({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    alert(`Account created for ${email}`);
    onBack(); // Navigate back to the login form
  };

  return (
    <form className={styles.form} onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
        <button type="button" onClick={onBack} className={styles.backButton}>
          Back
        </button>
      </div>
    </form>
  );
}
