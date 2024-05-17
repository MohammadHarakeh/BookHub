"use client";
import React, { useEffect, useState, useRef } from "react";
import { sendRequest } from "../../tools/apiRequest";
import { requestMethods } from "../../tools/apiRequestMethods";
import { ToastContainer, toast } from "react-toastify";
import defaultImage from "../../../../public/images/defaultImage.png";
import "./page.css";
import "../../globals.css";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { useEmailContext } from "@/context/emailContext";
import { IoMdClose } from "react-icons/io";

const HomeLeft = () => {
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
  const { userLoggedIn, setUserLoggedIn } = useEmailContext();
  const { userInfo, setUserInfo } = useEmailContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleCreatePost = () => {
    if (userLoggedIn) {
      createPost();
    } else {
      alert("Please login");
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

        if (toggleComments && currentPostId) {
          const updatedPost = response.data.find(
            (post: any) => post._id === currentPostId
          );
          if (updatedPost) {
            setCurrentPostComments(updatedPost.comments);
            console.log(updatedPost.comments);
          }
        }
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
        const profileImage = response.data.user.profile.profile_picture
          ? `http://localhost:3001/${
              response.data.user.profile.profile_picture.split(
                "profilePictures\\"
              )[1]
            }`
          : null;
        setUserProfileImage(profileImage);
        setUserId(response.data.user._id);
        setUserInfo(response.data);
        console.log(response.data);
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

  const handleLike = (post: any) => {
    if (userLoggedIn) {
      togglePostLike(post._id);
    } else {
      alert("Please login");
    }
  };

  const toggleCommentLike = async (postId: string, commentId: string) => {
    try {
      const response = await sendRequest(
        requestMethods.POST,
        `/user/toggleCommentLike/${postId}/${commentId}`
      );
      if (response.status === 200) {
        getAllPosts();
      } else {
        console.error("Failed to toggle comment like");
        toast.error("Failed to toggle comment like");
      }
    } catch (error) {
      console.error("Failed to toggle comment like", error);
      toast.error("Failed to toggle comment like");
    }
  };

  const handleCommentLike = (postId: any, commentId: any) => {
    if (userLoggedIn) {
      toggleCommentLike(postId, commentId);
    } else {
      alert("Please login");
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

  const handleAddComment = () => {
    if (userLoggedIn) {
      addComment();
    } else {
      alert("Please login");
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

    const token = localStorage.getItem("token");
    if (token) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
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
          {userInfo?.user?.profile?.profile_picture ? (
            userInfo?.user?.profile?.profile_picture?.startsWith("https://") ? (
              <img
                src={userInfo.user.profile.profile_picture}
                className="user-profile-small"
                alt="User Profile"
              />
            ) : (
              <img
                src={`http://localhost:3001/${
                  userInfo.user.profile.profile_picture.split(
                    "profilePictures\\"
                  )[1]
                }`}
                className="user-profile-small"
                alt="User Profile"
              />
            )
          ) : (
            <img
              src={defaultImage.src}
              className="user-profile-small"
              alt="Default Profile"
            />
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
              <input
                id="fileInput"
                type="file"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
            </div>
            <button className="general-button" onClick={handleCreatePost}>
              Upload
            </button>
          </div>
        </div>
        <div className="imagePreview">
          {imagePreview && <img src={imagePreview} alt="Selected Image" />}
        </div>
      </div>
      <div className="homepage-middle-posts">
        {posts.length === 0 && (
          <div className="empty-posts">
            <p>There are currently no posts. Be the first</p>
          </div>
        )}
        {posts.map((post) => (
          <div key={post._id} className="posts">
            <div className="posts-info">
              {post.profile_picture ? (
                post.profile_picture.startsWith("https://") ? (
                  <img
                    src={post.profile_picture}
                    alt="Profile Picture"
                    className="user-profile-small"
                  />
                ) : (
                  <img
                    src={`http://localhost:3001/${
                      post.profile_picture.split("profilePictures\\")[1]
                    }`}
                    alt="Profile Picture"
                    className="user-profile-small"
                  />
                )
              ) : (
                <img
                  src={defaultImage.src}
                  alt="Default Image"
                  className="user-profile-small"
                />
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
                className="post-image"
              />
            )}

            <div className="homepage-middle-like-comment">
              <div className="homepage-middle-like-comment-wrapper">
                <div className="homepage-like-comment">
                  <div
                    className="like-section"
                    onClick={() => handleLike(post)}
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
                    <FaRegComment />
                    <p>{post.comments.length}</p>
                  </div>
                </div>
                <div className="comment-section">
                  <input
                    className="blurred-comment homepage-input-text"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></input>
                  <button
                    className="general-button"
                    onClick={() => handleAddComment()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
            {toggleComments && currentPostId === post._id && (
              <div className="blurred-modal">
                <div className="blurred">
                  <div className="blurred-comment-wrapper">
                    <div className="blurred-buttons">
                      <IoMdClose
                        className="close-button"
                        onClick={() => toggleCommentSection(currentPostId)}
                      ></IoMdClose>
                    </div>
                  </div>

                  <div className="blurred-all-comments">
                    {currentPostComments.map((comment) => (
                      <div key={comment._id} className="comments">
                        <div className="comment-profilepicture">
                          <div className="comment-time-wrapper">
                            <div className="comment-time">
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
                            <div
                              className="like-section"
                              onClick={() =>
                                handleCommentLike(post._id, comment._id)
                              }
                            >
                              {comment.likes.includes(userId) ? (
                                <AiFillLike />
                              ) : (
                                <AiOutlineLike />
                              )}
                              <p>{comment.likes.length}</p>
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
