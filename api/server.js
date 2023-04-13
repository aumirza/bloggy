const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

// load environment variables
require("dotenv").config();

//  MongoDB URI
const mongodbUri = process.env.MONGODB_URI;

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Enable JSON parsing
app.use(express.json());

// Enable morgan
app.use(morgan("dev"));

// Define Post schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// Define Post model
const Post = mongoose.model("Post", postSchema);

// Routes
app.get("/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.get("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.json(post);
});

app.post("/posts", async (req, res) => {
  const { title, body, author } = req.body;
  const post = new Post({ title, body, author });
  await post.save();
  res.json(post);
});

app.put("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");
  const { title, body, author } = req.body;
  post.title = title;
  post.body = body;
  post.author = author;
  await post.save();
  res.json(post);
});

app.delete("/posts/:id", async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.json(post);
});

// Start the server
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Error connecting to MongoDB", err));
