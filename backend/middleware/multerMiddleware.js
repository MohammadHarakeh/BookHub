const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.route.path === "/updateProfile") {
      cb(null, "profilePictures/");
    } else if (req.route.path === "/uploadRepoPicture") {
      cb(null, "repoPictures/");
    } else {
      cb(null, "uploadPosts/");
    }
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    const filename =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + extname;
    cb(null, filename);
  },
});

const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

const postUpload = uploadImage.single("image");
const profilePictureUpload = uploadImage.single("image");
const repoPictureUpload = uploadImage.single("image");

module.exports = { postUpload, profilePictureUpload, repoPictureUpload };
