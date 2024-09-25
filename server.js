const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.post("/check-monetization", async (req, res) => {
  const { videoUrl } = req.body;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(videoUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Get the page content
    const pageContent = await page.content();
    
    // Check if 'yt_ad' exists in the source code using regex
    const hasYtAd = pageContent.includes('"yt_ad":');
    console.log("Monetization status: ", hasYtAd);

    await browser.close();

    // Send the monetization status to the frontend
    res.json({ monetized: hasYtAd });
  } catch (error) {
    console.error("Error checking monetization status:", error);
    res.status(500).json({ error: "Error checking monetization status" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
