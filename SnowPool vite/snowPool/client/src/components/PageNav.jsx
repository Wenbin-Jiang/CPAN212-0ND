import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import styles from "./PageNav.module.css";

function PageNav() {
  const navigate = useNavigate();

  // Check if user is logged in by verifying if there's a token in localStorage
  const isLoggedIn = localStorage.getItem("authToken");

  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        {!isLoggedIn ? (
          // Links for unauthenticated users
          <>
            <li>
              <NavLink to="/findride">
                <i className="fas fa-search"></i> Find a Ride
              </NavLink>
            </li>
            <li>
              <NavLink to="/postride">
                <i className="fas fa-plus"></i> Post a Ride
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className={styles.ctaLink}>
                <i className="fas fa-user"></i> Log In
              </NavLink>
            </li>
          </>
        ) : (
          // Links for authenticated users
          <>
            <li>
              <NavLink to="/dashboard">
                <i className="fas fa-columns"></i> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/mytrips">
                <i className="fas fa-map"></i> My Trips
              </NavLink>
            </li>
            <li>
              <NavLink to="/findride">
                <i className="fas fa-search"></i> Find a Ride
              </NavLink>
            </li>
            <li>
              <NavLink to="/postride">
                <i className="fas fa-plus"></i> Post a Ride
              </NavLink>
            </li>
            <li>
              <NavLink to="/userprofile">
                <i className="fas fa-user-circle"></i> Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className={styles.ctaLink}
                onClick={() => {
                  // Clear the token and log the user out
                  localStorage.removeItem("authToken");
                  navigate("/login"); // Use navigate to redirect to login page
                }}
              >
                <i className="fas fa-sign-out-alt"></i> Log Out
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default PageNav;
