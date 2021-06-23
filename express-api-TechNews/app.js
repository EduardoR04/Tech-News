let express = require("express");
let cors = require("cors");
let app = express();
const Sequelize = require("sequelize");

// instantiate the library for use, connecting to the sqlite database file
let sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "posts.sqlite",
});

// If port is set in environment variable use that port
// if not, use port 5000
const PORT = process.env.PORT || 5000;

// Enable CORS middleware
app.use(cors());
// Enable receiving data in JSON format
app.use(express.json());
// Enable receiving data from HTML forms
app.use(express.urlencoded({ extended: false }));

// Start: Change only below this line

const Post = sequelize.import("./models/posts.js");

// View all posts
// Happy Path: returns all posts in an array in JSON format (Status 200)
// Sad Path: None
app.get("/posts", function (req, res) {
  Post.findAll().then(function (posts) {
    res.status(200).json(posts);
  });
});

// Create a post
// Happy Path: creates the post item (Status 201 - returns copy of created post)
// Sad Path: none
app.post("/posts", function (req, res) {
  let title = req.body.title;
  let url = req.body.url;
  let points = req.body.points;

  let new__post = Post.build({
    title: title,
    url: url,
    points: points,
  });

  new__post.save();

  return res.status(201).end();
});

// Upvote a post
// Happy Path: upvote a post (Status 204 - empty JSON)
// Sad Path: post does not exist (Status 404 - empty JSON)
app.patch("/posts/upvote", function (req, res) {
  Post.findOne({
    where: {
      id: req.body.id,
    },
  }).then(function (foundPost) {
    if (foundPost != null) {
      let updatedPoints = foundPost.points + 1;
      foundPost.update({
        points: updatedPoints,
      });
      res.status(204).json();
    } else {
      res.status(404).send("post does not exist");
    }
  });
});

// Downvote a post
// Happy Path: downvote a post (Status 204 - empty JSON)
// Sad Path: post does not exist (Status 404 - empty JSON)
app.patch("/posts/downvote", function (req, res) {
  // fix status codes
  Post.findOne({
    where: {
      id: req.body.id,
    },
  }).then((foundPost) => {
    if (foundPost != null) {
      if (foundPost.points != 0) {
        let updatedPoints = foundPost.points - 1;
        foundPost.update({
          points: updatedPoints,
        });
        res.status(204).json();
      }
      res.json();
    } else {
      res.status(404).send("post does not exist");
    }
  });
});

// STOP: Don't change anything below this line

app.listen(PORT, function () {
  console.log("Server started...");
});
