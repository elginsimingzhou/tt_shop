require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const PORT = 3000 || process.env.PORT;

const app = express();

//Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());

app.get("/", async (req, res) => {
  // res.json("Hello world");
  const videos = await pool.query("SELECT * FROM videos");
  // console.log('videos pushed');
  res.status(200).json(videos.rows)
});

//GET: Retrieve specific video
app.get("/videos/:video_id", (req, res) => {});

//GET: Retrieve all products to load TikTok Shop
//Contain recommender system logic
app.get("/products", (req, res) => {});

//GET: Retrieve specific product resource when loading product page
app.get("/products/:product_id", (req, res) => {});

app.listen(PORT, () => {
  console.log(`App listening at PORT ${PORT}`);
});
