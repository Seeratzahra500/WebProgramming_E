const express = require('express');
const session = require('express-session');

const app = express();

// Configure session middleware
app.use(session({
    secret: "gggggghhhhhh",
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());

const sessionRoutes = require('./routes/sessionRoutes');
app.use('/session', sessionRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});