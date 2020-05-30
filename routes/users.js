const express = require("express");
const router = express.Router();
// const connection = require("../config");

// Test
router.get("/", (req, res) => {
  console.log("ok");
});

module.exports = router;
