const portfolioData = [
  {
    section: "header",
    data: {
      name: "Wenbin Jiang",
      title: "Student at Humber Polytechnic",
      description:
        "I am passionate about software development and snowboarding.",
      socialLinks: {
        linkedin: "https://linkedin.com/in/wenbin-jiang",
        github: "https://github.com/Wenbin-Jiang",
      },
      photo: "/public/profile-pic.png",
    },
  },
  {
    section: "about",
    data: {
      bio: [
        "Hi! I'm a student at Humber Polytechnic, passionate about software development and programming.",
        "Outside of my studies, I stay active through exercise and especially love for snowboarding—I'm a certified Level 1 snowboard instructor and enjoy teaching others how to have fun on the slopes.",

        "I'm fluent in English, Mandarin, and Cantonese, which has enriched my cultural experiences and helped me connect with people from various backgrounds.",

        "Aside from studying, I work as a dental hygienist, where I enjoy educating patients about oral health. When I'm not focused on school or work, I love spending time with my energetic two-year-old son.",
      ],
      aboutPic: "/public/about-pic.png",
    },
  },
  {
    section: "education",
    data: [
      {
        school: "University of Toronto",
        degree: "B.Sc. Bachelors Degree",
        years: "2011-2015",
      },
      {
        school: "Humber Polytechnic",
        degree: "Diploma",
        years: "2024-2025",
      },
    ],
  },
  {
    section: "experience",
    data: "3rd year in Computer Programming",
  },

  {
    section: "skills",
    data: {
      frontend: [
        { name: "React", level: "Experienced" },
        { name: "JavaScript", level: "Experienced" },
        { name: "HTML", level: "Experienced" },
        { name: "CSS", level: "Intermediate" },
      ],
      backend: [
        { name: "Node JS", level: "Experienced" },
        { name: "Express JS", level: "Experienced" },
        { name: "MySQL", level: "Experienced" },
        { name: "Git", level: "Experienced" },
      ],
    },
  },
  {
    section: "projects",
    data: [
      {
        title: "Today I Learned",
        description: "A platform for sharing daily learnings.",
        image: "/public/project-1.png", // Project 1 image URL
        github: "https://github.com/Wenbin-Jiang/today-i-learned",
        liveDemo: "https://todayilearned-waynej.netlify.app",
      },
      {
        title: "Travel List",
        description: "An app to manage travel packing lists.",
        image: "/public/project-2.png", // Project 2 image URL
        github: "https://github.com/Wenbin-Jiang/travel-list",
        liveDemo: "https://wenbin-jiang.github.io/travel-list/",
      },
      {
        title: "usePopcorn",
        description:
          "A platform that helps users find and rate their favorite movies and series.",
        image: "/public/project-3.png", // Project 3 image URL
        github: "https://github.com/Wenbin-Jiang/usepopcorn",
        liveDemo: "https://example.com/project-three",
      },
    ],
  },
  {
    section: "resume",
    data: {
      resumeLink: "/public/resume-example.pdf", // Resume file URL
    },
  },
];

export default portfolioData;
