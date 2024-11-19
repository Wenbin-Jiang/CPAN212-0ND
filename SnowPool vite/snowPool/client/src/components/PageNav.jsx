import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import styles from "./PageNav.module.css";

function PageNav() {
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/dashboard">
            {" "}
            <i className="fas fa-columns"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/trips">
            {" "}
            <i className="fas fa-car"></i>Trips
          </NavLink>
        </li>
        <li>
          <NavLink to="/findride">
            {" "}
            <i className="fas fa-search"></i> Find a Ride
          </NavLink>
        </li>
        <li>
          <NavLink to="/postride">
            {" "}
            <i className="fas fa-plus"></i>Post a Ride
          </NavLink>
        </li>
        <li>
          <NavLink to="/Login" className={styles.ctaLink}>
            <i className="fas fa-user"></i> Log In
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
