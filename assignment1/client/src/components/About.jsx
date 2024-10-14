import { useEffect, useState } from "react";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [educationData, setEducationData] = useState([]);
  const [experienceData, setExperienceData] = useState("");

  useEffect(() => {
    // Fetch about information from the server
    fetch("http://localhost:8000/getAbout")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAboutData(data);
      })
      .catch((error) => {
        console.error("Error fetching about data:", error);
      });

    // Fetch education information from the server
    fetch("http://localhost:8000/getEdu")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEducationData(data);
      })
      .catch((error) => {
        console.error("Error fetching education data:", error);
      });

    // Fetch experience information from the server
    fetch("http://localhost:8000/getExp")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setExperienceData(data);
      })
      .catch((error) => {
        console.error("Error fetching experience data:", error);
      });
  }, []);

  // Render loading state if data is not yet fetched
  if (!aboutData || !educationData.length || !experienceData)
    return <div>Loading...</div>;

  return (
    <section id="about">
      <p className="section__text__p1">Get To Know More</p>
      <h1 className="title">About Me</h1>
      <div className="section-container">
        <div className="section__pic-container">
          <img
            src={`http://localhost:8000${aboutData.aboutPic}`}
            alt="About"
            className="about-pic"
          />
        </div>
        <div className="about-details-container">
          <div className="about-containers">
            <div className="details-container">
              <img
                src="/src/assets/experience.png"
                alt="Experience icon"
                className="icon"
              />
              <h3>Experience</h3>
              <p>{experienceData}</p>
            </div>
            <div className="details-container">
              <img
                src="/src/assets/education.png"
                alt="Education icon"
                className="icon"
              />
              <h3>Education</h3>
              <p>
                {educationData.map((edu, index) => (
                  <div key={index}>
                    <strong>
                      {edu.school} {edu.years}
                    </strong>{" "}
                    {edu.degree}
                    <br />
                  </div>
                ))}
              </p>
            </div>
          </div>
          <div className="text-container">
            {aboutData.bio.map((sentence, index) => (
              <p key={index}>{sentence}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
