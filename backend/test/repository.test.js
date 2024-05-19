const {
  googleLogin,
  getLoggedinUser,
  getAllUsers,
  updateProfile,
  followUser,
  getFollowedUser,
} = require("../controller/user");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("Controller functions", () => {
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

describe("getLoggedinUser", () => {
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
