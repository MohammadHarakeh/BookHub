const User = require("../models/User");

const getAllPosts = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    let allPosts = [];
    for (const user of users) {
      for (const post of user.posts) {
        const postDetails = {
          _id: post._id,
          content: post.content,
          image: post.image,
          likes: post.likes,
          comments: post.comments,
          createdAt: post.createdAt,
          username: user.username,
          profile_picture: user.profile.profile_picture,
        };
        allPosts.push(postDetails);
      }
    }

    res.status(200).json(allPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

const createPost = async (req, res) => {
  try {
    const userId = req.user._id;

    let content = req.body.content || null;
    let image = req.file ? req.file.path : null;

    if (!content && !image) {
      return res.status(400).json({ message: "Content or image is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = { content, image };
    user.posts.push(post);
    await user.save();

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error });
  }
};

const deletePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.posts.findIndex(
      (post) => post._id.toString() === postId
    );

    if (index === -1) {
      return res.status(404).json({ message: "Post not found" });
    }

    user.posts.splice(index, 1);

    await user.save();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete post", error });
  }
};

const toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postIndex = user.posts.findIndex((post) => post._id.equals(postId));
    if (postIndex === -1) {
      return res.status(404).json({ message: "Post not found" });
    }

    const liked = user.posts[postIndex].likes.includes(userId);
    if (liked) {
      user.posts[postIndex].likes.pull(userId);
    } else {
      user.posts[postIndex].likes.push(userId);
    }

    await user.save();
    res.status(200).json({ message: "Like toggled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { comment } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = user.posts.id(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ userId, comment, createdAt: new Date() });

    await user.save();

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  deletePost,
  toggleLike,
  addComment,
};
