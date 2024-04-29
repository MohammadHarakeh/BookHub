"use client";
import "./globals.css";
import "./page.css";
import Header from "../app/component/header/page";
import Footer from "../app/component/footer/page";
import { FaPlus } from "react-icons/fa";
import profileImage from "../../public/images/profileImage.jpeg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { send } from "process";
import { sendRequest } from "./tools/apiRequest";
import { requestMethods } from "./tools/apiRequestMethods";
import defaultImage from "../../public/images/defaultImage.png";

export default function Home() {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="home-wrapper">
      <ToastContainer
        theme="dark"
        toastStyle={{ backgroundColor: "#0e0f32" }}
      />
      <Header />
      <div className="homepage-wrapper">
        <div className="homepage-left">
          <div className="homepage-left-title">
            <p>Collaboration</p>
            <button className="general-button">
              <FaPlus /> New
            </button>
          </div>

          <div className="homepage-left-stories">
            <p>Story name</p>
            <p>Story name</p>
            <p>Story name</p>
            <p>Story name</p>
          </div>
        </div>

        <div className="homepage-middle">
          <div className="homepage-middle-upload-container">
            <div className="homepage-middle-upload">
              <img src={profileImage.src} className="user-profile-small"></img>
              <input
                placeholder="What's on your mind"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                className="homepage-input-text"
              ></input>

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
                ></input>
              </div>
              <button className="general-button" onClick={createPost}>
                upload
              </button>
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
                    <img src={defaultImage.src} alt="Default Image" />
                  ) : (
                    <img
                      src={`http://localhost:3001/${
                        post.image.split("profilePictures\\")[1]
                      }`}
                      alt="Post Image"
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
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
