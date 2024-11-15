import { useState } from "react";
import PageNav from "../components/PageNav";
import ForgotPassword from "../components/ForgotPassword";
import SignUp from "../components/SignUp";
import styles from "./Login.module.css";

export default function Login() {
  const [view, setView] = useState("login"); // "login", "forgotPassword", or "signUp"
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Logged in as ${email}`);
  };

  return (
    <main className={styles.login}>
      <PageNav />
      {view === "login" && (
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.row}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.row}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.buttons}>
            <button type="submit">Login</button>
            <h5 onClick={() => setView("forgotPassword")}>
              Forgot your password?
            </h5>
            <br />
            <h3 onClick={() => setView("signUp")}>
              Not registered yet? Sign up
            </h3>
          </div>
        </form>
      )}
      {view === "forgotPassword" && (
        <ForgotPassword onBack={() => setView("login")} />
      )}
      {view === "signUp" && <SignUp onBack={() => setView("login")} />}
    </main>
  );
}
