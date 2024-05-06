const multer = require("multer");
const path = require("path");

const createStorage = function (destination) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      const extname = path.extname(file.originalname);
      const filename =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + extname;
      cb(null, filename);
    },
  });
};

const profilePictureStorage = createStorage("profilePictures/");
const profilePictureUpload = multer({
  storage: profilePictureStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
}).single("image");

const repoPictureStorage = createStorage("repoPictures/");
const repoPictureUpload = multer({
  storage: repoPictureStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
}).single("image");

const postStorage = createStorage("uploadPosts/");
const postUpload = multer({
  storage: postStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
}).single("image");

module.exports = { postUpload, profilePictureUpload, repoPictureUpload };
