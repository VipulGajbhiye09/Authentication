const express = require("express");
const app = express();
const ejs = require("ejs")
const mongoose = require("mongoose")

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set("view engine","ejs")

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser : true});
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser
  .save()
  .then(() => {
    res.render("secrets");
  })
  .catch((err) => {
    console.log(err);
  })
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password =req.body.password;

  User.findOne({ email: username})
  .then((foundUser)=>{
    if(foundUser){
      if(foundUser.password === password){
        res.render("secrets")
      }
    }
  })
  .catch(err=>{
    console.log(err);
  })
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
