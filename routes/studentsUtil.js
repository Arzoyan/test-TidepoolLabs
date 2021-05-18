const db = require("../db.js");
const moment = require("moment");

const getExamByUser = async (req, res, next) => {
  try {
    let AllExamsforStudent = await db.any(
      `SELECT
        fullname,
        scorr,
        subject.NAME AS subject,
        subjectid AS subject_id,
        exam."date" AS DATE
    FROM
        student
        JOIN exam ON student.ID = exam.studentid
        JOIN subject ON exam.subjectid = subject.ID
    WHERE studentid=${req.params.id};`
    );

    let lastesDatePerExam = [];

    let uniqueAllExams = await db.any(
      `  SELECT
    	subjectid AS subject_id,
    	subject."name" AS subject
    FROM
    	exam
    	JOIN subject ON exam.subjectid = subject."id"
    WHERE studentid=${req.params.id}
    GROUP BY
    	subjectid,
    	subject."name";`
    );

    for (let i = 0; i < uniqueAllExams.length; i++) {
      let date = await db.one(
        ` SELECT MAX
          ( exam."date" ) AS DATE
          FROM exam
          JOIN subject ON exam.subjectid = subject."id"
          WHERE
          studentid = ${req.params.id}
          AND subjectid =${uniqueAllExams[i].subject_id};`
      );
      lastesDatePerExam.push(date);
    }
    let result = [];
    for (let i = 0; i < lastesDatePerExam.length; i++) {
      result.push(
        AllExamsforStudent.filter((item) => {
          return moment(item.date).isSame(lastesDatePerExam[i].date);
        })[0]
      );
    }
    res.status(200).json({ student: result, success: true });
  } catch (err) {
    next(err);
  }
};

const getUsersByMaxScore = async (req, res, next) => {
  try {
    let maxScore = await db.one(
      `SELECT MAX
      ( scorr ) AS score 
  FROM
      exam
  WHERE
      subjectid = ${req.params.id}
  ORDER BY
      score DESC`
    );

    let students = await db.any(
      `SELECT
        fullname,
        MAX ( scorr ) AS score 
    FROM
        exam
        JOIN student ON exam.studentid = student."id" 
    WHERE
    subjectid = ${req.params.id}
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
    next(err);
  }
};

const getBestStudent = async (req, res, next) => {
  try {
    let bestStudent = await db.any(
      `SELECT
      fullname,
      ROUND( AVG ( ALL scorr ), 3 ) AS score 
  FROM
      exam
      JOIN student ON exam.studentid = student."id" 
  GROUP BY
      studentid,
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
    next(err);
  }
};

module.exports = { getExamByUser, getUsersByMaxScore, getBestStudent };
