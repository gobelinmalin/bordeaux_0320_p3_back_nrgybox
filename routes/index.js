const express = require("express");
const users = require("./users");
const programms = require('./programs');

const router = express.Router();

router.use("/users", users);
router.use("/programms", programms);

module.exports = router;
