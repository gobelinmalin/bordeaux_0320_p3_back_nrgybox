const express = require("express");
const users = require("./users");
const programs= require("./programs");

const router = express.Router();

router.use("/users", users);

router.use("/programs", programs);

module.exports = router;
