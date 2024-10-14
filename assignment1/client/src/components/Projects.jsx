import { useEffect, useState } from "react";

const Projects = () => {
  const [projectsData, setProjectsData] = useState([]);

  useEffect(() => {
    // Fetch projects information from the server
    fetch("http://localhost:8000/getProjects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProjectsData(data);
      })
      .catch((error) => {
        console.error("Error fetching projects data:", error);
      });
  }, []);

  // Render loading state if data is not yet fetched
  if (!projectsData.length) return <div>Loading...</div>;

  return (
    <section id="projects">
      <p className="section__text__p1">Browse My Recent</p>
      <h1 className="title">Projects</h1>
      <div className="experience-details-container">
        <div className="about-containers">
          {projectsData.map((project, index) => (
            <div key={index} className="details-container color-container">
              <div className="article-container">
                <img
                  src={`http://localhost:8000${project.image}`} // Image from server
                  alt={project.title}
                  className="project-img"
                />
              </div>
              <h2 className="experience-sub-title project-title">
                {project.title}
              </h2>
              <p>{project.description}</p>
              <div className="btn-container">
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={() => window.open(project.github, "_blank")}
                >
                  GitHub
                </button>
                <button
                  className="btn btn-color-2 project-btn"
                  onClick={() => window.open(project.liveDemo, "_blank")}
                >
                  Live Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
