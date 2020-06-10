const express = require("express");
const users = require("./users");
const send = require("./send");
const programs = require('./programs');
const router = express.Router();


router.use("/users", users);
router.use("/send", send)
router.use("/programs", programs);

module.exports = router;
