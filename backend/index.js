const express = require("express");
const cors = require("cors");
const { connect } = require("./config/db.config");

require("dotenv").config();

const app = express();

connect();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.listen(port, (err) => {
  if (err) throw new Error(err);

  console.log(`Server is running on http://localhost:${port}`);
});
