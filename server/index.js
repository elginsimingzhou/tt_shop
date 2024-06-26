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
  const videos = await pool.query(` 
    select video_id, video_url, thumbnail_url, title, description, videos.created_at, videos.user_id, username 
    from videos
    INNER JOIN users
    on videos.user_id = users.user_id;
    `);
  // console.log('videos pushed');
  res.status(200).json(videos.rows);
});

//GET: Retrieve specific video and relevant user information, comments, likes,saves, flags
app.get("/videos/:video_id", async (req, res) => {
  const { video_id } = req.params;

  const generic_data = await pool.query(
      `SELECT vl.video_id, COALESCE(vl.like_count, 0) as like_count, COALESCE(vf.flag_count, 0) as flag_count, COALESCE(vc.comment_count, 0) as comment_count, COALESCE(vs.save_count, 0) as save_count
      FROM
          (SELECT video_id, COUNT(like_id) AS like_count
          FROM video_likes
          WHERE video_id = $1
          GROUP BY video_id) AS vl
      LEFT JOIN
          (SELECT video_id, COUNT(flag_id) AS flag_count
          FROM video_flags
          WHERE video_id = $1
          GROUP BY video_id) AS vf
      ON vl.video_id = vf.video_id
      LEFT JOIN
          (SELECT video_id, COUNT(comment_id) AS comment_count
          FROM video_comments
          WHERE video_id = $1
          GROUP BY video_id) AS vc
      ON vl.video_id = vc.video_id
      LEFT JOIN
          (SELECT video_id, COUNT(save_id) AS save_count
          FROM video_saves
          WHERE video_id = $1
          GROUP BY video_id) AS vs
      ON vl.video_id = vs.video_id;`,
    [video_id]
  );

  const comments = await pool.query(
    `SELECT comment_text
      FROM video_comments
      WHERE video_id = $1`, [video_id]
  )

  res.json({"generic_data": generic_data.rows[0], "comments": comments.rows});
});

//GET: Retrieve all products to load TikTok Shop
//Contain recommender system logic
app.get("/products", async (req, res) => {
  const products = await pool.query("SELECT * FROM products");
  // console.log('videos pushed');
  res.status(200).json(products.rows);
});

//GET: Retrieve specific product resource when loading product page
app.get("/products/:product_id", (req, res) => {
  
});

app.listen(PORT, () => {
  console.log(`App listening at PORT ${PORT}`);
});
