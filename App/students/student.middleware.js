const db = require("../../db.js");
const ApiError = require("../../error/ApiError.js");

const getUsersByMaxScore = async (req, res, next) => {
  try {
    let maxScore = await db.one(
      `SELECT MAX
        ( score ) AS score 
    FROM
        exams
    WHERE
        subject_id = ${req.params.id}
    ORDER BY
        score DESC`
    );

    let students = await db.any(
      `SELECT
          fullname,
          MAX ( score ) AS score 
      FROM
          exams
          JOIN students ON exams.student_id = students."id" 
      WHERE
      subject_id = ${req.params.id}
      GROUP BY
          fullname 
      ORDER BY
          score DESC`
    );

    students = students.filter((item) => {
      return item.score === maxScore.score;
    });

    res.status(200).json({ student: students, success: true });
  } catch (err) {
    ApiError.badRequest("user doesn't exist ");
  }
};
const getBestStudent = async (req, res, next) => {
  try {
    let bestStudent = await db.any(
      `SELECT
          fullname,
          ROUND( AVG ( ALL score ), 3 ) AS score 
      FROM
          exams
          JOIN students ON exams.student_id = students."id" 
      GROUP BY
          student_id,
          fullname 
      ORDER BY
          score DESC`
    );

    let result = [];
    let maxScore = bestStudent[0].score;
    for (let i = 0; i < bestStudent.length; i++) {
      if (bestStudent[i].score > maxScore) {
        result = [bestStudent[i]];
      } else if (bestStudent[i].score === maxScore) {
        result.push(bestStudent[i]);
      }
    }

    res.status(200).json({ data: result, success: true });
  } catch (err) {
    ApiError.badRequest("user doesn't exist ");
  }
};

module.exports = { getUsersByMaxScore, getBestStudent };
