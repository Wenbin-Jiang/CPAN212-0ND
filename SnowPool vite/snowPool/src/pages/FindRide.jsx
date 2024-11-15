import Footer from "../components/Footer";
import PageNav from "../components/PageNav";
import SearchBox from "../components/SearchBox";
import styles from "./FindRide.module.css";

function FindRide() {
  return (
    <main className={styles.findride}>
      <PageNav />

      <SearchBox />

      <Footer />
    </main>
  );
}

export default FindRide;
