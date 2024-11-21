import { useState } from "react";
import PageNav from "../components/PageNav";
import Footer from "../components/Footer";
import ForgotPassword from "../components/ForgotPassword";
import SignUp from "../components/SignUp";
import axios from "axios";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

const baseURL = "http://localhost:8001";

export default function Login() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("user2@example.com");
  const [password, setPassword] = useState("password2");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseURL}/api/users/login`, {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("authToken", token);

      const profileResponse = await axios.get(`${baseURL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(profileResponse.data.data);

      if (profileResponse.data.data.profileComplete) {
        navigate("/dashboard");
      } else {
        navigate("/userprofile");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error(err);
    }
  };

  return (
    <>
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
            {error && <div className={styles.error}>{error}</div>}{" "}
            {/* Display error message */}
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

      <Footer />
    </>
  );
}
