const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Candidate = require("./models/candidate");

mongoose
  .connect("mongodb://localhost:27017/form-practice")
  .then(() => {
    console.log("mongo connection open!");
  })
  .catch((e) => {
    console.log("mongo error");
    console.log(e);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

const secretPassword = "sheldongwapo";
const adminAccess = async (req, res, next) => {
  const { password } = req.query;
  if (password) {
    if (password === secretPassword) {
      await next();
    } else {
      res.render("admin/password");
    }
  } else {
    res.render("admin/password");
  }
};

// app.get("/goAdmin", (req, res) => {
//   res.render("admin/password");
// });
app.get("/admin", adminAccess, async (req, res) => {
  const candidates = await Candidate.find({});
  res.render("admin/index", { candidates });
});
app.get("/admin/new", (req, res) => {
  res.render("admin/new");
});
app.post("/admin", async (req, res) => {
  const data = req.body;
  const candidate = new Candidate(data);
  await candidate.save();
  res.redirect("/admin?password=" + secretPassword);
});
app.delete("/admin/:id", async (req, res) => {
  const { id } = req.params;
  await Candidate.findByIdAndDelete(id);
  res.redirect("/admin?password=" + secretPassword);
});
app.get("/admin/:id", async (req, res) => {
  const { id } = req.params;
  const candidate = await Candidate.findById(id);
  res.render("admin/edit", { candidate });
});
app.put("/admin/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  await Candidate.findByIdAndUpdate(id, data);
  res.redirect("/admin?password=" + secretPassword);
});
app.get("/", async (req, res) => {
  const candidates = await Candidate.find({});
  res.render("voter/index", { candidates });
});
app.get("/vote", async (req, res) => {
  const candidates = await Candidate.find({});
  res.render("voter/vote", { candidates });
});
app.post("/", async (req, res) => {
  const ids = Object.values(req.body);
  console.log(ids);
  for (id of ids) {
    const { votes } = await Candidate.findById(id);
    await Candidate.findByIdAndUpdate(id, { votes: votes + 1 });
  }
  res.redirect("/#results");
});

app.listen(3000, () => {
  console.log("connected to port 3000");
});
