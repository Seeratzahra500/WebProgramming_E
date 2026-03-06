const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.session.name = "hello";
    req.session.ban = true;
    res.send("Session data set.");
});

router.get('/sessions', (req, res) => {
    console.log(req.session); // Logs session data to the console
    res.send(`Session Data: ${JSON.stringify(req.session)}`);
});

module.exports = router;