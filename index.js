const express = require("express");
const app = express();
const api = require("./routes");
const bodyParser = require("body-parser");
const port = process.env.DOOKU_PORT || 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", api);

app.listen(port, (err) => {
  if (err) {
    throw new Error("There is an error");
  }
  console.log(`Welcom to the port ${port}`);
});
