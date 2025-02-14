const { createClient } = require("redis");

const client = createClient();

client.on('error', (err) => {
  console.log('Redis Client Error:', err);
});

(async () => {
  await client.connect();
})();

module.exports = client;
