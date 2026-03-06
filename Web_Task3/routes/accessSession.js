javascript

router.get('/sessions', (req, res) => {
    console.log(req.session); // Logs session data to the console
    res.send(`Session Data: ${JSON.stringify(req.session)}`);
});

module.exports = router;