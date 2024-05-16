const User = require("../models/User");
const fs = require("fs").promises;
const diff = require("diff");
const { OpenAI } = require("openai");

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const createRepository = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;

    let repo_picture = "";
    if (req.file) {
      repo_picture = req.file.path;
    }

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
      repo_picture,
    };

    user.repositories.push(repository);

    if (!repository.invitedUsers || !Array.isArray(repository.invitedUsers)) {
      repository.invitedUsers = [];
    }

    repository.invitedUsers.push(req.user._id);

    await user.save();

    res
      .status(201)
      .json({ message: "Repository created successfully", repository });
  } catch (error) {
    console.error("Error creating repository:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRepository = async (req, res) => {
  try {
    const repositoryId = req.params.repositoryId;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let repository = user.repositories.find(
      (repo) => repo._id.toString() === repositoryId
    );

    if (!repository) {
      for (const collabRepo of user.collaboratingRepositories) {
        if (collabRepo._id.toString() === repositoryId) {
          repository = collabRepo;
          break;
        }
      }
    }

    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    const latestVersion =
      repository && repository.versions
        ? repository.versions[repository.versions.length - 1]
        : null;

    res
      .status(200)
      .json({ repository: repository, latestVersion: latestVersion });
  } catch (error) {
    console.error("Error fetching repository:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadRepositoryContent = async (req, res) => {
  try {
    const { content, fontColor, fontStyle } = req.body;

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
      fontColor,
      fontStyle,
      createdAt: new Date(),
    };

    repository.versions.push(newVersion);

    await user.save();

    const filePath = `repositoryContent/${
      req.params.repositoryId
    }-${Date.now()}.txt`;
    await fs.writeFile(filePath, content);

    res.status(200).json({ message: "Content uploaded successfully" });
  } catch (error) {
    console.error("Error uploading content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getVersionsDifference = async (userId, repositoryId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const repository = user.repositories.find(
      (repo) => repo._id.toString() === repositoryId
    );

    if (!repository) {
      throw new Error("Repository not found");
    }

    const versions = repository.versions.slice(-2);

    if (versions.length < 2) {
      throw new Error("Less than two versions found for the repository");
    }

    const previousContent = versions[0].content;
    const latestContent = versions[1].content;

    printDifference(previousContent, latestContent);
  } catch (error) {
    console.error("Error getting versions difference:", error.message);
  }
};

const compareAnyVersion = async (userId, repositoryId, versionIdToCompare) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const repository = user.repositories.find(
      (repo) => repo._id.toString() === repositoryId
    );

    if (!repository) {
      throw new Error("Repository not found");
    }

    const latestVersion = repository.versions[repository.versions.length - 1];

    if (!latestVersion) {
      throw new Error("No versions found for the repository");
    }

    let versionToCompare;
    if (versionIdToCompare) {
      versionToCompare = repository.versions.find(
        (version) => version._id.toString() === versionIdToCompare
      );

      if (!versionToCompare) {
        throw new Error("Version to compare not found");
      }
    } else {
      versionToCompare = repository.versions[repository.versions.length - 2];
      if (!versionToCompare) {
        throw new Error("No previous version found for comparison");
      }
    }

    const previousContent = versionToCompare.content;
    const latestContent = latestVersion.content;

    printDifference(previousContent, latestContent);
  } catch (error) {
    console.error("Error getting versions difference:", error.message);
  }
};

function printDifference(previousContent, latestContent) {
  const differences = diff.diffWords(previousContent, latestContent);
  differences.forEach((part) => {
    const color = part.added
      ? "\x1b[32m"
      : part.removed
      ? "\x1b[31m"
      : "\x1b[0m";
    process.stdout.write(color + part.value);
  });
  process.stdout.write("\x1b[0m");
  process.stdout.write("\n");
}

const getCollaboratingRepositoryInfo = async (req, res) => {
  const userId = req.user._id;
  const { repositoryId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const collaboratingRepo = user.collaboratingRepositories.find(
      (repo) => repo._id.toString() === repositoryId
    );
    if (!collaboratingRepo) {
      return res
        .status(404)
        .json({ error: "Collaborating repository not found" });
    }

    for (const otherUser of await User.find()) {
      const repository = otherUser.repositories.find(
        (repo) => repo._id.toString() === repositoryId
      );
      if (repository) {
        return res.status(200).json({
          repositoryId: repository._id,
          name: repository.name,
          description: repository.description,
          picture: repository.repo_picture,
          visibility: repository.visibility,
          collaborators: repository.collaborators,
          versions: repository.versions,
          createdAt: repository.createdAt,
        });
      }
    }

    return res.status(404).json({ error: "Repository not found in any user" });
  } catch (error) {
    console.error("Error fetching collaborating repository info:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const synchronizeCollaboratingRepositoryInfo = async (req, res) => {
  try {
    const repositoryId = req.body.repositoryId;
    const content = req.body.content;

    const mainUser = await User.findOne({ "repositories._id": repositoryId });
    if (!mainUser) {
      return res.status(404).json({
        error: "Main user not found for the collaborating repository",
      });
    }

    const mainUserRepository = mainUser.repositories.find(
      (repo) => repo._id.toString() === repositoryId
    );
    if (!mainUserRepository) {
      return res
        .status(404)
        .json({ error: "Main user's repository not found" });
    }

    const newVersion = {
      content: content,
      createdAt: new Date(),
    };

    mainUserRepository.versions.push(newVersion);

    await mainUser.save();

    console.log("New version added to the repository successfully");

    res
      .status(200)
      .json({ message: "New version added to the repository successfully" });
  } catch (error) {
    console.error("Error adding new version to the repository:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `give only a cover without text about ${prompt}`,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    res.status("200").json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
};

const generateText = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `can you summarize the following text by keeping the main points about the story and making it less than 50% characters: ${prompt}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    const generatedText = completion.choices[0].message.content;
    return res.status(200).json(generatedText);
  } catch (error) {
    console.error("Error generating text:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createRepository,
  uploadRepositoryContent,
  getVersionsDifference,
  compareAnyVersion,
  getRepository,
  synchronizeCollaboratingRepositoryInfo,
  generateImage,
  getCollaboratingRepositoryInfo,
  generateText,
};
