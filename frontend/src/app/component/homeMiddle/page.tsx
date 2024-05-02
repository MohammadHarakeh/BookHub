"use client";
import React, { useEffect, useState } from "react";
import { sendRequest } from "../../tools/apiRequest";
import { requestMethods } from "../../tools/apiRequestMethods";
import { ToastContainer, toast } from "react-toastify";
import defaultImage from "../../../../public/images/defaultImage.png";
import "./page.css";
import "../../globals.css";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";

const HomeLeft = () => {
  // State variables
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [toggleComments, setToggleComments] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [currentPostId, setCurrentPostId] = useState<string>("");
  const [currentPostComments, setCurrentPostComments] = useState<any[]>([]);

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
        toast.success("Post uploaded successfully");
        getAllPosts();
      } else {
        console.error("Failed to upload post");
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

  const addComment = async () => {
    try {
      const body = {
        content: comment,
      };
      const response = await sendRequest(
        requestMethods.POST,
        `/user/addComment/${currentPostId}`,
        body
      );
      if (response.status === 201) {
        setComment("");
        getAllPosts();
        toast.success("Comment added successfully");
      } else {
        console.error("Failed to add comment.");
        toast.error("Failed to add comment. Please try again.");
      }
    } catch (error) {
      console.error("Error creating comment", error);
      toast.error("Error creating comment");
    }
  };

  const toggleCommentSection = async (postId: string) => {
    setCurrentPostId(postId);
    setToggleComments(!toggleComments);
    setComment("");

    const post = posts.find((post) => post._id === postId);
    if (post) {
      setCurrentPostComments(post.comments);
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

  useEffect(() => {
    document.body.style.overflow = toggleComments ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [toggleComments]);

  return (
    <div className={`homepage-middle`}>
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
              <div
                className="like-section"
                onClick={() => togglePostLike(post._id)}
              >
                {post.likes.includes(userId) ? (
                  <AiFillLike />
                ) : (
                  <AiOutlineLike />
                )}
                <p>{post.likes.length}</p>
              </div>

              <div
                className="comment-section"
                onClick={() => toggleCommentSection(post._id)}
              >
                <p>{post.comments.length}</p>
                <FaRegComment />
              </div>
            </div>
            {toggleComments && currentPostId === post._id && (
              <div className="blurred-modal">
                <div className="blurred">
                  <div className="blurred-comment-wrapper">
                    {userProfileImage ? (
                      <img
                        src={userProfileImage}
                        className="user-profile-small"
                      />
                    ) : (
                      <img
                        src={defaultImage.src}
                        className="user-profile-small"
                      />
                    )}
                    <textarea
                      className="blurred-comment homepage-input-text"
                      placeholder="Write a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>

                    <div className="blurred-buttons">
                      <button
                        className="general-button"
                        onClick={() => addComment()}
                      >
                        Submit
                      </button>
                      <button
                        className="general-button"
                        onClick={() => toggleCommentSection(currentPostId)}
                      >
                        Back
                      </button>
                    </div>
                  </div>

                  <div className="blurred-all-comments">
                    {currentPostComments.map((comment) => (
                      <div key={comment._id} className="comments">
                        <div className="comment-profilepicture">
                          {userProfileImage ? (
                            <img
                              src={userProfileImage}
                              className="user-profile-small"
                            />
                          ) : (
                            <img
                              src={defaultImage.src}
                              className="user-profile-small"
                            />
                          )}
                          <div className="comment-time">
                            <div className="test">
                              <p>
                                <b>{comment.username}</b>
                              </p>
                              <p className="post-time">
                                {new Date(comment.createdAt).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                    second: "numeric",
                                    hour12: true,
                                  }
                                )}
                              </p>
                            </div>
                            <div className="comment-content">
                              <p>{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeLeft;
