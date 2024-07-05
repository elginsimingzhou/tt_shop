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
    console.error("Redis error:", err);
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

//GET: Retrieve specific video and relevant user information, comments, likes,saves, stars
app.get("/videos/:video_id", async (req, res) => {
  const { video_id } = req.params;

  const fetchedKeywords = await getOrSetCache(
    `keywords/${video_id}`,
    async () => {
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

  let params = [];
  for (let i = 1; i <= fetchedKeywords.keywords.length; i++) {
    params.push("$" + i);
  }

  const query_text = `
    select products.product_id, title, price, stock, sold_count, image_url, shop_id
    from products 
    inner join (
    select product_tags.product_id, count(product_tags.tag_id) as tags_count
    from product_tags
    inner join
    (select *
    from tags
    where tag_name in (` + params.join(',') + `)) as matched_tags
    on matched_tags.tag_id = product_tags.tag_id
    group by product_tags.product_id
    order by tags_count desc) as matched_products
    on products.product_id = matched_products.product_id
    limit 1;
    `;

  const matched_product = await pool.query(
    query_text,
    fetchedKeywords.keywords
  );

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

  res.json({
    generic_data: generic_data.rows[0],
    comments: comments.rows,
    matched_product: matched_product.rows[0],
  });
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
      `SELECT watched_products.*, avg_rating
       FROM (SELECT products.product_id, title, price, stock, sold_count, image_url, shop_id, video_id, user_id, duration
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
        ORDER BY duration DESC; `,
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
        order by avg_rating desc NULLS LAST, sold_count desc;;
      `,
      [user_id]
    );

    res.status(201).json({
      star_products: starProducts.rows,
      watched_products: watchedProducts.rows,
      remaining_products: remainingProducts.rows,
    });

    // if (starProducts.rows.length === 0 && watchedProducts.rows.length === 0) {
    //   const rankedProducts = products.rows.sort(
    //     (a, b) => b.sold_count - a.sold_count
    //   );
    //   return res.status(200).json(rankedProducts.slice(0, 5));
    // } else {
    //   // Create a ranking map
    //   const productRanking = new Map();

    //   likedProducts.rows.forEach((row) => {
    //     productRanking.set(
    //       row.product_id,
    //       (productRanking.get(row.product_id) || 0) + 2
    //     ); //liked products increment 2
    //   });

    //   // Increment ranking for watched products
    //   watchedProducts.rows.forEach((row) => {
    //     productRanking.set(
    //       row.product_id,
    //       (productRanking.get(row.product_id) || 0) + 1
    //     ); //liked products increment 1
    //   });

    //   // Rank products based on the ranking map
    //   const rankedProducts = products.rows.sort((a, b) => {
    //     const rankA = productRanking.get(a.product_id) || 0;
    //     const rankB = productRanking.get(b.product_id) || 0;
    //     return rankB - rankA;
    //   });

    //   res.status(200).json(rankedProducts.slice(0, 5));
    // }
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
