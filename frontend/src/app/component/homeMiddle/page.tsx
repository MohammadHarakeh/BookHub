"use client";
import React, { useEffect, useState } from "react";
import { sendRequest } from "../../tools/apiRequest";
import { requestMethods } from "../../tools/apiRequestMethods";
import { ToastContainer, toast } from "react-toastify";
import defaultImage from "../../../../public/images/defaultImage.png";
import "./page.css";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";

const HomeLeft = () => {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  const createPost = async () => {
    try {
      const formData = new FormData();
      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      const response = await sendRequest(
        requestMethods.POST,
        "/user/createPost",
        formData
      );

      if (response.status === 201) {
        setContent("");
        setImage(null);
        setImagePreview(null);
        console.log("Post uploaded successfully");
        toast.success("Post uploaded successfully");
        console.log(image);
        console.log(content);
        getAllPosts();
      } else {
        console.log("Failed to upload post");
        toast.error("Failed to upload post");
      }
    } catch (error) {
      console.error("Failed to upload post", error);
      toast.error("Failed to upload post");
    }
  };

  const getAllPosts = async () => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        "/user/getAllPosts"
      );
      if (response.status === 200) {
        console.log("Fetched posts successfully", response.data);
        setPosts(response.data);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts");
    }
  };

  const getLoggedinUser = async () => {
    try {
      const response = await sendRequest(
        requestMethods.GET,
        "/user/getLoggedinUser"
      );
      if (response.status === 200) {
        setUserProfileImage(response.data.user.profile.profile_picture);
        console.log(
          "User ProfileImage: ",
          response.data.user.profile.profile_picture
        );
        console.log(response.data.user);
        setUserId(response.data.user._id);
      } else {
        setUserProfileImage(null);
      }
    } catch (error) {
      console.error("Error fetching user profile image", error);
      setUserProfileImage(null);
    }
  };

  const togglePostLike = async (postId: string) => {
    try {
      const response = await sendRequest(
        requestMethods.POST,
        `/user/toggleLike/${postId}`
      );

      if (response.status === 200) {
        getAllPosts();
      } else {
        console.error("Failed to toggle like");
        toast.error("Failed to toggle like");
      }
    } catch (error) {
      console.error("Failed to toggle like", error);
      toast.error("Failed to toggle like");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  useEffect(() => {
    getLoggedinUser();
    getAllPosts();
  }, []);

  return (
    <div className="homepage-middle">
      <div className="homepage-middle-upload-container">
        <div className="homepage-middle-upload">
          {userProfileImage ? (
            <img src={userProfileImage} className="user-profile-small" />
          ) : (
            <img src={defaultImage.src} className="user-profile-small" />
          )}
          <input
            placeholder="What's on your mind"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            className="homepage-input-text"
          />
          <div className="upload-image-btn-wrapper">
            <div className="upload-image-container">
              <label
                htmlFor="fileInput"
                className="file-input-label general-button"
              >
                Choose File
              </label>
              <input id="fileInput" type="file" onChange={handleImageChange} />
            </div>
            <button className="general-button" onClick={createPost}>
              Upload
            </button>
          </div>
        </div>
        <div className="imagePreview">
          {imagePreview && <img src={imagePreview} alt="Selected Image" />}
        </div>
      </div>
      <div className="homepage-middle-posts">
        {posts.map((post) => (
          <div key={post._id} className="posts">
            <div className="posts-info">
              {post.image ? (
                post.image.includes("profilePictures\\") ? (
                  <img
                    src={`http://localhost:3001/${
                      post.image.split("profilePictures\\")[1]
                    }`}
                    alt="Post Image"
                  />
                ) : (
                  <img src={defaultImage.src} alt="Default Image" />
                )
              ) : (
                <img src={defaultImage.src} alt="Default Image" />
              )}
              <div className="posts-username-time">
                <p>{post.username}</p>
                <p className="post-time">
                  {new Date(post.createdAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>

            <p className="post-content">{post.content}</p>
            {post.image && (
              <img
                src={`http://localhost:3001/${
                  post.image.split("uploadPosts\\")[1]
                }`}
                alt="Post Image"
              />
            )}

            <div className="homepage-middle-like-comment">
              <div className="like-section">
                <p>20</p>
                <AiOutlineLike
                  onClick={() => {
                    togglePostLike(post._id);
                  }}
                />
                {post.likes.includes(userId) ? (
                  <AiFillLike />
                ) : (
                  <AiOutlineLike />
                )}
              </div>

              <div className="comment-section">
                <p>20</p>
                <FaRegComment />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeLeft;
