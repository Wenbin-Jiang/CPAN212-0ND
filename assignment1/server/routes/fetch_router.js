import express from "express";
import portfolioData from "../portfolioData.js";

const router = express.Router();

// Endpoints

// Fetch header information
router.get("/getHeader", (req, res) => {
  const header = portfolioData.find((item) => item.section === "header");
  res.json(header.data);
});

// Fetch about information
router.get("/getAbout", (req, res) => {
  const about = portfolioData.find((item) => item.section === "about");
  res.json(about.data);
});

// Fetch education information
router.get("/getEdu", (req, res) => {
  const education = portfolioData.find((item) => item.section === "education");
  res.json(education.data);
});

// Fetch experience information
router.get("/getExp", (req, res) => {
  const experience = portfolioData.find(
    (item) => item.section === "experience"
  );
  res.json(experience.data);
});

// Fetch skills information
router.get("/getSkills", (req, res) => {
  const skills = portfolioData.find((item) => item.section === "skills");
  res.json(skills.data);
});

// Fetch projects information
router.get("/getProjects", (req, res) => {
  const projects = portfolioData.find((item) => item.section === "projects");
  res.json(projects.data);
});

// Fetch resume link
router.get("/getResume", (req, res) => {
  const resume = portfolioData.find((item) => item.section === "resume");
  res.json(resume.data);
});

export default router;
