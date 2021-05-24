const db = require("../../db.js");
const moment = require("moment");
const ApiError = require("../../error/ApiError.js");

const getExamsPerUser = async (req, res, next) => {
  try {
    let AllExamsForStudent = await db.any(
      `SELECT
          fullname,
          score,
          subjects.NAME AS subject,
          exams.subject_id AS subject_id,
          exams."date" AS DATE
      FROM
          students
          JOIN exams ON students."id" = exams.student_id
          JOIN subjects ON exams.subject_id = subjects."id"
      WHERE student_id=${req.params.id};`
    );

    let lastDatePerExam = [];

    let uniqueAllExams = await db.any(
      `  SELECT
          subject_id AS subject_id,
          subjects."name" AS subject
      FROM
          exams
          JOIN subjects ON exams.subject_id = subjects."id"
      WHERE student_id=${req.params.id}
      GROUP BY
          subject_id,
          subjects."name";`
    );

    for (let i = 0; i < uniqueAllExams.length; i++) {
      let date = await db.one(
        ` SELECT MAX
            ( exams."date" ) AS DATE,
            subject_id
            FROM exams
            JOIN subjects ON exams.subject_id = subjects."id"
            WHERE
            student_id = ${req.params.id}
            AND subject_id =${uniqueAllExams[i].subject_id}
            GROUP BY
            subject_id ;`
      );
      lastDatePerExam.push(date);
    }

    let result = [];
    for (let i = 0; i < lastDatePerExam.length; i++) {
      result.push(
        AllExamsForStudent.filter((item) => {
          return (
            moment(item.date).isSame(lastDatePerExam[i].date) &&
            lastDatePerExam[i].subject_id === item.subject_id
          );
        })[0]
      );
    }
    res.status(200).json({ student: result, success: true });
  } catch (err) {
    ApiError.badRequest("user doesn't exist ");
  }
};

module.exports = { getExamsPerUser };
