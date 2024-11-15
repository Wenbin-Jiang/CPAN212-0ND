import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import styles from "./PageNav.module.css";

function PageNav() {
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/findride">Find a Ride</NavLink>
        </li>
        <li>
          <NavLink to="/postride">Post a Ride</NavLink>
        </li>
        <li>
          <NavLink to="/Login" className={styles.ctaLink}>
            Log In
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
