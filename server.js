const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const fs = require("fs");

const hallOfFame = [];

// Sätt flaggor här
const correctFlags = ["iths2024", "bobbocorp", "87022442"];

// Middleware för att parsa JSON- och URL-encoded-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint för robots.txt (ingen riktigt .txt fil)
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /secret\n");
});

// Vi skickar index.html till klienten här, men lägger till en hemlig header
app.get("/", (req, res) => {
  res.set("X-Secret-Header", "/api/iusearchbtw25");
  fs.readFile(
    path.join(__dirname, "public", "index.html"),
    "utf8",
    (err, data) => {
      if (err) {
        return res.status(500).send("Server Error");
      }
      res.send(data);
    },
  );
});

// hemlig endpoint (från headern)
app.get("/api/iusearchbtw25", (req, res) => {
  res.json({ message: "Flagga1{iths2024}" });
});

// Denna endpoint kan hittas på flera olika sätt
app.get("/secret", (req, res) => {
  res.set("X-Secret-Header", "Flagga3{87022442}");
  fs.readFile(
    path.join(__dirname, "public", "404.html"),
    "utf8",
    (err, data) => {
      if (err) {
        return res.status(500).send("Server Error");
      }
      res.send(data);
    },
  );
});

app.get("/tips", (req, res) => {
  fs.readFile(
    path.join(__dirname, "public", "tips.html"),
    "utf8",
    (err, data) => {
      if (err) {
        return res.status(500).send("Server Error");
      }
      res.send(data);
    },
  );
});

const submissions = {}; // Objekt för att spåra inlämningar per namn

app.post("/submit", (req, res) => {
  const { name, flag1, flag2, flag3 } = req.body;

  // Kontrollera omm detta namn redan har skickat in flaggorna
  if (submissions[name]) {
    return res.json({
      success: false,
      message: "Du har redan skickat in flaggorna!",
    });
  }

  // Kontrollera flaggorna
  if (
    flag1 === correctFlags[0] &&
    flag2 === correctFlags[1] &&
    flag3 === correctFlags[2]
  ) {
    // Spara inlämningen för detta namn och lägg till namnet i Hall of Fame
    submissions[name] = true;
    hallOfFame.push(name);
    return res.json({
      success: true,
      message: "Flaggorna är korrekta! Du är nu med i Hall of Fame.",
    });
  } else {
    return res.json({
      success: false,
      message: "En eller flera flaggor är felaktiga. Försök igen!",
    });
  }
});

app.get("/hall-of-fame", (req, res) => {
  res.json(hallOfFame);
});

// Custom 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Starta servern
app.listen(port, () => {
  console.log(`Servern kör på http://localhost:${port}`);
});
