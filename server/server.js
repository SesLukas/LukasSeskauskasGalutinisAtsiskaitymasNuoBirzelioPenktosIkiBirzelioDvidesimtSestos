const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

(async () => {
  await connectToDatabase();

  
  app.get("/", (req, res) => res.send("Forumo API veikia "));

  app.listen(PORT, () => {
    console.log(`Serveris paleistas http://localhost:${PORT}`);
  });
})();
