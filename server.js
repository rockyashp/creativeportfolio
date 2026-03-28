const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// serve images
app.use("/images", express.static(path.join(__dirname, "images")));

// API to get images
app.get("/api/gallery", (req, res) => {

  const imagesDir = path.join(__dirname, "images");

  let gallery = {};

  try {

    const folders = fs.readdirSync(imagesDir);

    folders.forEach(folder => {

      const folderPath = path.join(imagesDir, folder);

      if (fs.lstatSync(folderPath).isDirectory()) {

        const files = fs.readdirSync(folderPath).filter(file =>

          file.endsWith(".jpg") ||
          file.endsWith(".jpeg") ||
          file.endsWith(".png") ||
          file.endsWith(".webp") ||
          file.endsWith(".mp4") ||
          file.endsWith(".mov")

        );

        gallery[folder] = files;

      }

    });

    res.json(gallery);

  }
  catch (err) {

    console.error(err);
    res.status(500).json({ error: "Could not read images folder" });

  }

});

// start server
app.listen(PORT, () => {

  console.log(`Server running at http://localhost:${PORT}`);

});