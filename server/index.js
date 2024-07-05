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
    if (freshData !== null) {
      await client.set(key, JSON.stringify(freshData));
    }

    return freshData;
  } catch (err) {
    console.error("Redis error:", err);
    throw err;
  }
};

app.get("/", async (req, res) => {
  const videos = await pool.query(` 
    select video_id, video_url, thumbnail_url, title, description, videos.created_at, videos.user_id, username 
    from videos
    INNER JOIN users
    on videos.user_id = users.user_id
    order by video_id;
    `);
  // console.log(JSON.stringify(videos.rows));

  res.status(200).json(videos.rows);
});

//GET: Retrieve specific video and relevant user information, comments, likes,saves, stars
app.get("/videos/:video_id", async (req, res) => {
  try {
    const { video_id } = req.params;

    const fetchedKeywords = await getOrSetCache(
      `keywords/${video_id}`,
      async () => {
        console.log("Fetching from model...");
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
      }
    );
    // console.log(JSON.stringify(fetchedKeywords))

    let matched_product = {
      rows: [],
    };
    if (fetchedKeywords !== null) {
      let params = [];
      for (let i = 1; i <= fetchedKeywords.keywords.length; i++) {
        params.push("$" + i);
      }

      const query_text =
        `
    select products.product_id, title, price, stock, sold_count, image_url, shop_id
    from products 
    inner join (
    select product_tags.product_id, count(product_tags.tag_id) as tags_count
    from product_tags
    inner join
    (select *
    from tags
    where tag_name in (` +
        params.join(",") +
        `)) as matched_tags
    on matched_tags.tag_id = product_tags.tag_id
    group by product_tags.product_id
    order by tags_count desc) as matched_products
    on products.product_id = matched_products.product_id
    limit 1;
    `;

      matched_product = await pool.query(query_text, fetchedKeywords.keywords);
    }

    let generic_data = await pool.query(
      `SELECT vl.video_id, COALESCE(vl.like_count, 0) as like_count, COALESCE(vf.star_count, 0) as star_count, COALESCE(vc.comment_count, 0) as comment_count, COALESCE(vs.save_count, 0) as save_count
      FROM
          (SELECT video_id, COUNT(like_id) AS like_count
          FROM video_likes
          WHERE video_id = $1
          GROUP BY video_id) AS vl
      LEFT JOIN
          (SELECT video_id, COUNT(star_id) AS star_count
          FROM video_stars
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

    if (generic_data.rows.length === 0) {
      generic_data = {
        rows: [
          {
            video_id: video_id,
            like_count: 0,
            star_count: 0,
            comment_count: 0,
            save_count: 0,
          },
        ],
      };
    }

    const comments = await pool.query(
      `SELECT username, comment_text
      FROM video_comments
      INNER JOIN users ON video_comments.user_id = users.user_id
      WHERE video_id = $1
      `,
      [video_id]
    );

    res.status(201).json({
      generic_data: generic_data.rows[0],
      comments: comments.rows,
      matched_product: matched_product.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//PUT: Update user star into database
app.put("/videos/:video_id/star", async (req, res) => {
  try {
    const body = req.body;

    const query_text = `
    insert into video_stars (video_id, product_id, user_id)
    values (${body.video_id}, ${body.product_id}, ${body.user_id})
    on conflict (video_id, product_id, user_id) do nothing
    returning *;
    `;
    console.log(query_text);
    const response = await pool.query(query_text);
    if (response) {
      console.log("Successfully starred product.");
      res.status(204).json(response.rows[0].star_id);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//DELETE: DELETE user star into database
app.delete("/videos/:video_id/star", async (req, res) => {
  try {
    const body = req.body;

    let params = [];
    for (let i = 1; i <= Object.keys(body).length; i++) {
      params.push("$" + i);
    }
    query_text =
      `
    delete from video_stars where (video_id, product_id, user_id)
    = (` +
      params.join(",") +
      `)
    returning *;
    `;
    console.log(query_text);
    const response = await pool.query(query_text, [
      body.video_id,
      body.product_id,
      body.user_id,
    ]);
    if (response) {
      console.log("Star rows successfully deleted");
      res.status(204).json(response.rows[0].star_id);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//PUT: Update user duration into database
app.put("/videos/:video_id/view", async (req, res) => {
  try {
    const body = req.body;

    const query_text = `
    insert into video_views (video_id, user_id, duration)
    values (${body.video_id}, ${body.user_id}, ${body.duration})
    on conflict (video_id, user_id) do update
    set duration = ${body.duration}
    returning *;
    `;
    console.log(query_text);
    const response = await pool.query(query_text);
    if (response) {
      // console.log(response);
      console.log("Successfully updated view duration.");
      res.status(204).json(response.rows[0].view_id);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//GET: Retrieve all products to load TikTok Shop
app.get("/products", async (req, res) => {
  try {
    //Get user_id HARDCODED
    const user_id = 1;

    //Fetch stared products
    const starProducts = await pool.query(
      `select star_products.*, avg_rating
        from (
            select products.product_id, title, price, stock, sold_count, image_url, shop_id, video_id, user_id
            from products
            inner join video_stars on products.product_id = video_stars.product_id
            where video_stars.user_id = $1) as star_products
        left join (
        select product_id, cast(avg(rating) as decimal(2)) as avg_rating
        from product_ratings
        group by product_id	) as product_rating
        on star_products.product_id = product_rating.product_id
	;`,
      [user_id]
    );

    //Fetch watched products
    const watchedProducts = await pool.query(
      `
      SELECT watched_products.product_id, title, price, stock, sold_count, image_url, shop_id, user_id, cast(avg(avg_rating) as decimal(2)) as avg_rating, cast(avg(duration) as decimal(2)) as avg_duration
       FROM (SELECT products.product_id, title, price, stock, sold_count, image_url, shop_id, user_id, duration
                FROM products
                INNER JOIN video_views
                ON products.product_id = video_views.product_id
                WHERE video_views.user_id = $1 and video_views.product_id not in (
                  select product_id
                  from video_stars
                  where video_stars.user_id = $1
                )) AS watched_products
        LEFT JOIN (SELECT product_id, CAST(Avg(rating) AS DECIMAL(2)) AS avg_rating
                    FROM product_ratings
                    GROUP BY product_id) AS product_rating
        ON watched_products.product_id = product_rating.product_id
		group by watched_products.product_id, title, price, stock, sold_count, image_url, shop_id, user_id
        ORDER BY avg_duration DESC;
      `,
      [user_id]
    );

    // Fetch rest products
    const remainingProducts = await pool.query(
      `
       select remaining_products.*, avg_rating 
        from (select *
        from products
        where products.product_id not in (
          select product_id
          from video_stars
          where user_id = $1
          UNION
          select product_id
          from video_views
          where user_id = $1
        )) as remaining_products
        left join (
          select product_id, cast(avg(rating) as decimal(2)) as avg_rating
          from product_ratings
          group by product_id	) as product_rating
        on remaining_products.product_id = product_rating.product_id
        order by sold_count desc, avg_rating desc NULLS LAST;
      `,
      [user_id]
    );

    res.status(201).json({
      star_products: starProducts.rows,
      watched_products: watchedProducts.rows,
      remaining_products: remainingProducts.rows,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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
