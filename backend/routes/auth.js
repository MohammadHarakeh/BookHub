const express = require("express");
const router = expres.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});
