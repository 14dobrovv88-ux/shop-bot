const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🚀 Server is working");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
