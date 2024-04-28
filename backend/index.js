const express = require("express");
const cors = require("cors");
const { connect } = require("./config/dbconfig");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

require("dotenv").config();

const app = express();

connect();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use(express.static("uploadPosts"));

app.listen(port, (err) => {
  if (err) throw new Error(err);

  console.log(`Server is running on http://localhost:${port}`);
});
