require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const client = require("./cache");

const PORT = 3000 || process.env.PORT;

const app = express();

//Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());

//Check Cache
const getOrSetCache = async (key, cb) => {
  try {
    const cachedValue = await client.get(key);

    if (cachedValue) {
      return JSON.parse(cachedValue);
    }

    const freshData = await cb();
    await client.set(key, JSON.stringify(freshData));
    return freshData;

  } catch (err) {
    console.error('Redis error:', err);
    throw err;
  }
};

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

  const fetchedKeywords = await getOrSetCache(`keywords/${video_id}`, async () => {
    const response = await fetch(
      `${process.env.ML_SERVER_URL}/videos/${video_id}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_url: video_id }),
      }
    );
    const fetchedKeywords = await response.json();
    return fetchedKeywords;
  });

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
      WHERE video_id = $1`,
    [video_id]
  );

  res.json({
    "generic_data": generic_data.rows[0],
    "comments": comments.rows,
    "keywords": fetchedKeywords,
  });
});

//GET: Retrieve all products to load TikTok Shop
//Contain recommender system logic
app.get("/products", async (req, res) => {
  const products = await pool.query("SELECT * FROM products");
  // console.log('videos pushed');
  res.status(200).json(products.rows);
});

//GET: Retrieve specific product resource when loading product page
app.get("/products/:product_id", async (req, res) => {
  const { product_id } = req.params;

  const product_info = await pool.query(
    `
    select products.product_id, products.shop_id, products.title as product_title, products.description as product_description, price, stock, image_url, products.sold_count as product_sold_count, shops.title as shop_title, shops.sold_count as shop_sold_count, response_rate, shipped_on_time_rate 
    from products
    inner join shops
    on products.shop_id = shops.shop_id
    where product_id = $1;
    `,
    [product_id]
  );

  const metrics = await pool.query(
    `
    select product_reviews.product_id, count(product_reviews.review_id) as review_count, count(product_ratings.rating_id) as rating_count, cast(avg(rating) as decimal(3,2)) as avg_ratings
    from product_reviews
    inner join product_ratings
    on (product_reviews.product_id = product_ratings.product_id and product_reviews.user_id = product_ratings.user_id)
    where product_reviews.product_id = $1
    group by product_reviews.product_id;
    `,
    [product_id]
  );

  const reviews = await pool.query(
    `
    select review_id, user_id, review_text, created_at
    from product_reviews
    where product_id = $1;
    `,
    [product_id]
  );

  res.json({
    product_info: product_info.rows[0],
    metrics: metrics.rows[0],
    reviews: reviews.rows,
  });
});

app.listen(PORT, () => {
  console.log(`App listening at PORT ${PORT}`);
});
