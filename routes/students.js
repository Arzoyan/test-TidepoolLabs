const express = require("express");
const router = express.Router();

const {
  getExamByUser,
  getUsersByMaxScore,
  getBestStudent,
} = require("./studentsUtil");

const getStudents = async (req, res) => {
  await db
    .any("SELECT * FROM student;")
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log("ERRROR>>>>>>>>>>", err);
    });
};

router.get("/student/subject/:id", getExamByUser);
router.get("/student/exam/:id", getUsersByMaxScore);
router.get("/best-student", getBestStudent);
router.get("/", getStudents);

module.exports = router;
