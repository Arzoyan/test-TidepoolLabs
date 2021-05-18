const express = require("express");
const router = express.Router();

const { getExamByUser } = require("./studentsUtil");

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

router.get("/", getStudents);
router.get("/:id", getExamByUser);

module.exports = router;
