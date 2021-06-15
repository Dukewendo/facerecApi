const express = require("express");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

app.use(bodyParser.json());
//check if this is needed
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
  },
});

app.get('/', (req, resp) => { resp.send('it is working')})
//signin --> POST (request user info) = success/fail
app.post("/signin", (req, resp) => {
  signin.handleSignin(req, resp, db, bcrypt);
});

//register --> POST = new user object returned
app.post("/register", (req, resp) => {
  register.handleRegister(req, resp, db, bcrypt);
});

//profile/:userId --> GET = returns user
app.get("/profile/:id", (req, resp) => {
  profile.handleProfileGet(req, resp, db);
});

//image end point --> PUT --> returns updated count for user
app.put("/image", (req, resp) => {
  image.handleImage(req, resp, db);
});
app.post("/imageurl", (req, resp) => {
  image.handleApiCall(req, resp);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app started- port ${process.env.PORT}`);
});
