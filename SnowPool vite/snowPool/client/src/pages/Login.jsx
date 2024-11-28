import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import api from "../services/api";
import PageNav from "../components/PageNav";
import Footer from "../components/Footer";
import ForgotPassword from "../components/ForgotPassword";
import SignUp from "../components/SignUp";
import styles from "./Login.module.css";

const ErrorAlert = ({ message, onClose }) => (
  <div className={styles.alertOverlay}>
    <div className={styles.alertBox}>
      <p>{message}</p>
      <button onClick={onClose}>OK</button>
    </div>
  </div>
);

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  handleSubmit,
  handleViewChange,
}) => (
  <form className={styles.form} onSubmit={handleSubmit}>
    <div className={styles.row}>
      <label htmlFor="email">Email address</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
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
        disabled={loading}
      />
    </div>

    <div className={styles.buttons}>
      <button
        type="submit"
        disabled={loading}
        className={loading ? styles.buttonLoading : ""}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <h5
        onClick={() => !loading && handleViewChange("forgotPassword")}
        className={loading ? styles.disabled : ""}
      >
        Forgot your password?
      </h5>

      <h3
        onClick={() => !loading && handleViewChange("signUp")}
        className={loading ? styles.disabled : ""}
      >
        Not registered yet? Sign up
      </h3>
    </div>
  </form>
);

export default function Login() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Wrong password, Please try again");
        return;
      }

      localStorage.setItem("authToken", data.data.token);

      const profileResponse = await api.get("/api/users/profile");

      if (!profileResponse.success) {
        setError("Failed to fetch profile");
        localStorage.removeItem("authToken");
        return;
      }

      setUser(profileResponse.data);
      navigate(
        profileResponse.data.profileComplete ? "/dashboard" : "/userprofile"
      );
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (newView) => {
    setError("");
    setView(newView);
  };

  return (
    <>
      <main className={styles.login}>
        <PageNav />
        {view === "login" && (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            handleSubmit={handleLogin}
            handleViewChange={handleViewChange}
          />
        )}
        {view === "forgotPassword" && (
          <ForgotPassword onBack={() => handleViewChange("login")} />
        )}
        {view === "signUp" && (
          <SignUp onBack={() => handleViewChange("login")} />
        )}
        {error && <ErrorAlert message={error} onClose={() => setError("")} />}
      </main>
      <Footer />
    </>
  );
}
