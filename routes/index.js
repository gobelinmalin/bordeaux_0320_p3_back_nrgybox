const express = require("express");
const users = require("./users");
const send = require("./send")

const router = express.Router();

router.use("/users", users);
router.use("/send", send)

module.exports = router;
