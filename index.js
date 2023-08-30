import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;
const URL = "https://api.openai.com/v1/images/generations";

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

//Endpoint to make the request to the openai api and return the images
app.post("/generate-image", async (req, res) => {
  const { prompt, n } = req.body;
  try {
    if (!!!prompt) {
      throw Error("No prompt found");
    }
    const response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify({
        prompt,
        n,
        size: "512x512",
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const data = await response.json();
    res.json(data)

  } catch {
    console.error("Error generating image", error.message);
    res.sendStatus(500);
  }
});

//The server is listening
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
