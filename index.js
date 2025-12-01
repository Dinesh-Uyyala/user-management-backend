const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { authenticate } = require("./middleware/auth");

app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;

app.use("/auth", require("./routes/auth"));
app.use("/users", authenticate, require("./routes/users"));

app.get("/", (req, res) => {
  res.send("Welcome to the User Management API!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
