import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import Logo from "./Logo";
import styles from "./PageNav.module.css";

const UnauthenticatedLinks = () => (
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
);

const AuthenticatedLinks = ({ handleLogout }) => (
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
      <NavLink to="/login" className={styles.ctaLink} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Log Out
      </NavLink>
    </li>
  </>
);

function PageNav() {
  const navigate = useNavigate();
  const { logout } = useUserContext();
  const isLoggedIn = localStorage.getItem("authToken");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        {isLoggedIn ? (
          <AuthenticatedLinks handleLogout={handleLogout} />
        ) : (
          <UnauthenticatedLinks />
        )}
      </ul>
    </nav>
  );
}

export default PageNav;
