const express = require("express");
const router = express.Router();
// const db = require("../db.js");

const { getExamsPerUser } = require("./subjects.middleware");

router.get("/student/:id", getExamsPerUser);

module.exports = router;
