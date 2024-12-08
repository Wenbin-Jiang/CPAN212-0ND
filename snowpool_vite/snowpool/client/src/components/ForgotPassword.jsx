import styles from "./ForgotPassword.module.css";
import { useState } from "react";

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(`Reset link sent to ${email}`);
    onBack(); // Navigate back to the login form
  };

  return (
    <form className={styles.form} onSubmit={handleForgotPassword}>
      <h2>Enter your email to reset password</h2>
      <div className={styles.row}>
        <label htmlFor="reset-email">Email address</label>
        <input
          type="email"
          id="reset-email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.buttons}>
        <button type="submit">Reset</button>
        <button type="button" onClick={onBack} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}
