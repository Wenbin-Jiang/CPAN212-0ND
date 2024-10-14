import { useEffect, useState } from "react";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [resumeLink, setResumeLink] = useState("");

  useEffect(() => {
    // Fetch header information from the server
    fetch("http://localhost:8000/getHeader")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProfileData(data);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });

    // Fetch resume link from the server
    fetch("http://localhost:8000/getResume")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setResumeLink(data.resumeLink);
      })
      .catch((error) => {
        console.error("Error fetching resume data:", error);
      });
  }, []);

  // Render loading state if data is not yet fetched
  if (!profileData) return <div>Loading...</div>;

  return (
    <section id="profile">
      <div className="section__pic-container">
        <img
          src={`http://localhost:8000${profileData.photo}`}
          alt={`${profileData.name} profile`}
        />
      </div>
      <div className="section__text">
        <p className="section__text__p1">Hello, I'm</p>
        <h1 className="title">{profileData.name}</h1>
        <p className="section__text__p2">{profileData.title}</p>
        <p>{profileData.description}</p>
        <br />
        <div className="btn-container">
          <a
            href={`http://localhost:8000${resumeLink}`}
            download
            className="btn btn-color-1"
          >
            Download CV
          </a>
          <a className="btn btn-color-1" href="#contact">
            Contact Info
          </a>
        </div>
        <div id="socials-container">
          <a
            href={profileData.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/src/assets/linkedin.png"
              alt="LinkedIn profile"
              className="icon"
            />
          </a>
          <a
            href={profileData.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/src/assets/github.png"
              alt="GitHub profile"
              className="icon"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Profile;
