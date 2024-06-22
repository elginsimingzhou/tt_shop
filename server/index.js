const express = require("express");
const cors = require("cors");

const PORT = 3000 || process.env.PORT;

const app = express();

//Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
    console.log('home')
  res.json("Hello world");
});

app.listen(PORT, () => {
  console.log(`App listening at PORT ${PORT}`);
});
