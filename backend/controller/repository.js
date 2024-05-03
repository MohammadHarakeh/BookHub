const User = require("../models/User");

const createRepository = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const repository = {
      name,
      description,
      visibility,
      owner: req.user._id,
      content: [],
    };

    user.repositories.push(repository);

    await user.save();

    res
      .status(201)
      .json({ message: "Repository created successfully", repository });
  } catch (error) {
    console.error("Error creating repository:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadRepositoryContent = async (req, res) => {
  try {
    const { content } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const repository = user.repositories.find(
      (repo) => repo._id.toString() === req.params.repositoryId
    );

    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    if (!repository.versions || !Array.isArray(repository.versions)) {
      repository.versions = [];
    }

    const newVersion = {
      content,
      createdAt: new Date(),
    };

    repository.versions.push(newVersion);

    await user.save();

    res.status(200).json({ message: "Content uploaded successfully" });
  } catch (error) {
    console.error("Error uploading content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createRepository, uploadRepositoryContent };
