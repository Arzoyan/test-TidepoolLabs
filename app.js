const express = require("express");
const port = 3000;

const studentdRouter = require("./routes/students");
// const subjectRouter = require("./routes/subject");
const app = express();

app.use(express.json());

app.use("/", studentdRouter);
app.listen(port, () => {
  console.log("############>>>>>>>>>>>", port);
});
