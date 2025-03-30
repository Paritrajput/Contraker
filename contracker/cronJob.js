const cron = require("node-cron");

const axios = require("axios");

cron.schedule("*/1 * * * *", async () => {
  // Runs every 5 minutes
  console.log("Running bid approval process...");
  try {
    await axios.post("http://localhost:3000/api/bid-approve");
    console.log("Bids processed successfully");
  } catch (error) {
    console.error("Error processing bids:", error);
  }
});
