const express = require("express");
const port = 3000;
const apiErrorHandler = require("./error/api-error-handler");

const studentsRouter = require("./App/students/students.routes");
const subjectsRouter = require("./App/subjects/subjects.routes");
const app = express();

app.use(express.json());

app.use("/subjects", subjectsRouter);
app.use("/students", studentsRouter);
app.use(apiErrorHandler);

app.listen(port, () => {});
