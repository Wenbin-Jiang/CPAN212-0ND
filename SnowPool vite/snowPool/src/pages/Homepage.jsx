import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";
import styles from "./Homepage.module.css";
import Footer from "../components/Footer";

function Homepage() {
  return (
    <>
      <main className={styles.homepage}>
        <PageNav />
        <section>
          <h1>
            Ready to hit the slopes?
            <br />
            Share the Ride, Share the Thrill!
          </h1>
          <h2>
            Snowpool brings skiers and snowboarders together for shared rides to
            the mountains. <br />
            Save on travel, reduce your carbon footprint, and make new friends.{" "}
            <br />
            Choose your destination, connect with fellow riders, and <br />
            start the adventure together!
          </h2>
          <Link to="/findride" className="cta">
            Start your trip
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Homepage;
