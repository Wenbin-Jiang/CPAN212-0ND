import React from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import DriverList from "./components/DriverList";
import Map from "./components/Map";
import Footer from "./components/Footer";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <Header />
      <HeroSection />
      <main className="main-content">
        <DriverList />
        <Map />
      </main>
      <Footer />
    </div>
  );
}

export default App;
