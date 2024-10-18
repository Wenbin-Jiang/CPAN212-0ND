import { useState, useEffect } from "react";

const Skills = () => {
  const [skillsData, setSkillsData] = useState(null);

  useEffect(() => {
    // Fetch skills information from the server
    fetch("http://localhost:8000/getSkills")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSkillsData(data);
      })
      .catch((error) => {
        console.error("Error fetching skills data:", error);
      });
  }, []);

  // Render loading state if data is not yet fetched
  if (!skillsData) return <div>Loading...</div>;

  return (
    <section id="skills">
      <p className="section__text__p1">Explore My</p>
      <h1 className="title">Skills</h1>
      <div className="skills-details-container">
        <div className="about-containers">
          {/* Frontend Skills */}
          <div className="details-container">
            <h2 className="skills-sub-title">Frontend Development</h2>
            <div className="article-container">
              {skillsData.frontend.map((skill, index) => (
                <article key={index}>
                  <img
                    src="/src/assets/checkmark.png"
                    alt="Experience icon"
                    className="icon"
                  />
                  <div>
                    <h3>{skill.name}</h3>
                    <p>{skill.level}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          {/* Backend Skills */}
          <div className="details-container">
            <h2 className="skills-sub-title">Backend Development</h2>
            <div className="article-container">
              {skillsData.backend.map((skill, index) => (
                <article key={index}>
                  <img
                    src="/src/assets/checkmark.png"
                    alt="Experience icon"
                    className="icon"
                  />
                  <div>
                    <h3>{skill.name}</h3>
                    <p>{skill.level}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
