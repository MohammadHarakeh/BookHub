const {
  googleLogin,
  getLoggedinUser,
  getAllUsers,
  updateProfile,
  followUser,
  getFollowedUser,
} = require("../controller/user");

const { register } = require("../controller/auth");

const { toggleLike } = require("../controller/post");

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("Google Login Controller", () => {
  it("should handle errors", async () => {
    const req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        picture: "test.jpg",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne.mockRejectedValueOnce("Database error");

    await googleLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error logging in with Google",
    });
  });
});

describe("getLoggedinUser Controller", () => {
  it("should handle missing authorization token", async () => {
    const req = {
      headers: {}, // No authorization token
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await getLoggedinUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authorization token is required",
    });
  });
});

describe("register Controller", () => {
  it("should handle registration failure", async () => {
    const req = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    bcrypt.hash.mockRejectedValueOnce("Hashing error");

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Registration failed",
      error: "Hashing error",
    });
  });
});

describe("toggleLike Controller", () => {
  it("should handle post not found", async () => {
    const userId = "mockUserId";
    const postId = "mockPostId";
    const req = {
      user: { id: userId },
      params: { postId },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValueOnce(null);

    await toggleLike(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
  });

  it("should handle internal server error", async () => {
    const userId = "mockUserId";
    const postId = "mockPostId";
    const req = {
      user: { id: userId },
      params: { postId },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne.mockRejectedValueOnce("Database error");

    await toggleLike(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
