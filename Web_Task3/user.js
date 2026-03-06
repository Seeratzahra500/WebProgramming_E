const express = require("express");
const router = express.Router();

// GET route
router.get("/", (req, res) => {
    res.send("User Home Page");
});

// GET user profile
router.get("/profile", (req, res) => {
    res.send("User Profile Page");
});

// POST route
router.post("/create", (req, res) => {
    res.send("User Created");
});

module.exports = router;