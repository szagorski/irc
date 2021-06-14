const express = require("express");
const path = require("path");

const app = express();
app.use(express.static("static"));
app.use(express.json());

const PORT = process.env.PORT || 3000; //port heroku lun lokalny - 3000

var tab = [];

app.get("/", (req, res) => res.redirect("index.html"));

app.get("/odbierz", (req, res) => tab.push(res));

app.post("/wyslij", (req, res) => {
  let wiadomosc = req.body;
  for (let i = 0; i < tab.length; i++) tab[i].send([wiadomosc]);
  tab = [];
  res.end();
});

app.listen(PORT, () => console.log("Serwer startuje na porcie: " + PORT));
