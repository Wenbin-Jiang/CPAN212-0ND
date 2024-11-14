import React from "react";

function Header() {
  return (
    <header className="header">
      <h1>Snow Pool</h1>
      <nav>
        <a href="/">Home</a> | <a href="/about">About</a> |{" "}
        <a href="/help">Help</a>
      </nav>
    </header>
  );
}

export default Header;
