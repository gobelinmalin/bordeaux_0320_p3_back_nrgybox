const express = require("express");
const users = require("./users");
const programs = require("./programs");
const lights = require("./lights");

const router = express.Router();

router.use("/users", users);
router.use("/programs", programs);
router.use("/lights", lights);

module.exports = router;
