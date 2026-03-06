const express = require("express");
const app = express();

const userRoutes = require("./user");

// middleware
app.use(express.json());

// use routes
app.use("/user", userRoutes);

// main route
app.get("/", (req, res) => {
    res.send("Welcome to Express Server");
});

// server start
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});