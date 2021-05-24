const express = require("express");
const router = express.Router();

const { getUsersByMaxScore, getBestStudent } = require("./student.middleware");

router.get("/best", getBestStudent);
router.get("/subject/:id", getUsersByMaxScore);

module.exports = router;
