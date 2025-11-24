import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadCourses = () => {
  const coursesPath = path.join(__dirname, "data", "courses.json");
  return JSON.parse(fs.readFileSync(coursesPath, "utf8"));
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

if (process.env.NODE_ENV === 'development') {
  app.set('view cache', false);
}

// Home
app.get('/', (req, res) => {
  const courses = loadCourses();
  res.render('home', { 
    courses: courses.slice(0, 3),
    currentPage: 'home'  // ← ДОДАНО
  });
});

// Courses page
app.get("/courses", (req, res) => {
  const courses = loadCourses();
  const topic = req.query.topic;
  res.render("courses", { 
    courses, 
    topic,
    currentPage: 'courses'  // ← ДОДАНО
  });
});

// Single course details
app.get("/course/:id", (req, res) => {
  const courses = loadCourses();
  const course = courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).send("Course not found");
  
  const otherCourses = courses.filter(c => c.id !== req.params.id).slice(0, 5);
  res.render("course-details", { 
    course, 
    courses: otherCourses,
    currentPage: 'courses'  // ← ДОДАНО (бо це підсторінка курсів)
  });
});

// Pricing
app.get("/pricing", (req, res) => {
  res.render("pricing", {
    currentPage: 'pricing'  // ← ДОДАНО
  });
});

// About (якщо є сторінка)
app.get("/about", (req, res) => {
  res.render("about", {
    currentPage: 'about'  // ← ДОДАНО
  });
});

const PORT = 3012;
app.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));