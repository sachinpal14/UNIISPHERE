import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { PiShareFatThin } from "react-icons/pi";
import { TfiCommentsSmiley } from "react-icons/tfi";
import { useLocation } from "react-router-dom";
import "./DesktopMiddle.css";
import MiddlemainImage from "./Middle-image-main.png";
import ConnectMidlleimage from "./middleconnectimage.png";
import Profileimage from "./Profile-image.png";

function DesktopMiddle() {
  const [posts, setPosts] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCommentPostIndex, setActiveCommentPostIndex] = useState(null); // Track which post's comments are open
  const [newComment, setNewComment] = useState(""); // Store new comment input

  const location = useLocation();

  const getAuthData = () => {
    const storedToken = localStorage.getItem("authToken");
    const storedUserId = localStorage.getItem("userId");
    return storedToken && storedUserId
      ? { token: storedToken, userId: storedUserId }
      : null;
  };

  const authData = getAuthData();

  useEffect(() => {
    if (location.state?.userToken) {
      localStorage.setItem("authToken", location.state.userToken);
    }
    if (location.state?.userId) {
      localStorage.setItem("userId", location.state.userId);
    }

    const fetchData = async () => {
      if (!authData) {
        setError("You are not logged in. Please log in to view content.");
        setImageLoading(false);
        return;
      }

      setImageLoading(true);
      try {
        const response = await axios.get(
          "https://uniisphere-1.onrender.com/api/feed",
          {
            headers: { Authorization: `Bearer ${authData.token}` },
          }
        );
        console.log(response.data);

        if (response.data.posts && response.data.posts.length > 0) {
          const updatedPosts = response.data.posts.map((post) => ({
            ...post,
            likes: post.likes || 0,
            isLiked: false,
            comments: post.comments || [],
          }));
          setPosts(updatedPosts);
        }
      } catch (error) {
        setError("Failed to load content. Please try again later.");
        setPosts([]);
      } finally {
        setImageLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

  const handleLike = (index) => {
    setPosts((prevPosts) =>
      prevPosts.map((post, i) =>
        i === index
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleCommentClick = (index) => {
    setActiveCommentPostIndex(index);
    setNewComment(""); // Reset input when opening
  };

  const handleCloseCommentModal = () => {
    setActiveCommentPostIndex(null);
  };

  const handleCommentSubmit = (index) => {
    if (!newComment.trim()) return; // Ignore empty comments

    setPosts((prevPosts) =>
      prevPosts.map((post, i) =>
        i === index
          ? {
              ...post,
              comments: [...post.comments, { text: newComment, author: "You" }],
            }
          : post
      )
    );
    setNewComment(""); // Clear input after submission
  };

  return (
    <div className="middle-container">
      <div className="middle-middle-card">
        {error && <div className="error-message">{error}</div>}

        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} className="post-container">
              {/* Profile Header */}
              <div className="middle-profile-header">
                <img
                  src={Profileimage}
                  alt="Profile"
                  className="middle-profile-pic"
                />
                <div className="middle-profile-info">
                  <div className="middle-profile-top">
                    <span className="middle-profile-name">
                      {post.authorName || "Unknown Author"}
                    </span>
                    <span className="middle-post-time">18h</span>
                  </div>
                  <p className="middle-profile-details">
                    {post.authorDetails ||
                      "University of Delhi | Works at Google"}
                  </p>
                </div>
                <BsThreeDotsVertical className="middle-options-icon" />
              </div>

              {/* Main Image */}
              <div className="middle-main-image">
                {imageLoading ? (
                  <div>Loading image...</div>
                ) : post.mediaUrl ? (
                  <img
                    src={post.mediaUrl}
                    alt={`Post ${index + 1}`}
                    className="middle-content-image"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/300")
                    }
                  />
                ) : (
                  <img
                    src={MiddlemainImage}
                    alt="Default Post"
                    className="middle-content-image"
                  />
                )}
              </div>

              {/* Action Bar */}
              <div className="middle-action-bar">
                <img
                  src={ConnectMidlleimage}
                  alt="Connect"
                  className="middle-connect-image"
                />
                <div className="middle-action-icons">
                  {/* Like Button */}
                  <div
                    className="middle-icon-container"
                    onClick={() => handleLike(index)}
                  >
                    <span className="middle-icon-count">{post.likes}</span>
                    <CiHeart
                      className={`middle-icon ${post.isLiked ? "liked" : ""}`}
                    />
                  </div>

                  {/* Comment Button */}
                  <div
                    className="middle-icon-container"
                    onClick={() => handleCommentClick(index)}
                  >
                    <span className="middle-icon-count">
                      {post.comments.length}
                    </span>
                    <TfiCommentsSmiley className="middle-icon" />
                  </div>

                  {/* Share Placeholder */}
                  <div className="middle-icon-container">
                    <PiShareFatThin className="middle-icon" />
                  </div>
                </div>
              </div>

              {/* Post Text */}
              <div className="middle-post-text">
                <span className="middle-post-author">
                  {post.authorName || "Unknown Author"}
                </span>{" "}
                {post.caption || "No caption available"}
                <span className="middle-see-more">...more</span>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}

        {/* Comment Modal */}
        {activeCommentPostIndex !== null && (
          <div className="middle-comment-modal-overlay">
            <div className="middle-comment-modal">
              <div className="middle-comment-modal-header">
                <h3>Comments</h3>
                <button
                  className="middle-comment-modal-close"
                  onClick={handleCloseCommentModal}
                >
                  ×
                </button>
              </div>
              <div className="middle-comment-modal-content">
                {/* Existing Comments */}
                <div className="middle-comment-list">
                  {posts[activeCommentPostIndex].comments.length > 0 ? (
                    posts[activeCommentPostIndex].comments.map(
                      (comment, idx) => (
                        <div key={idx} className="middle-comment">
                          <span className="middle-comment-author">
                            {comment.author}:
                          </span>{" "}
                          {comment.text}
                        </div>
                      )
                    )
                  ) : (
                    <p>No comments yet</p>
                  )}
                </div>

                {/* Comment Input */}
                <div className="middle-comment-input-section">
                  <textarea
                    className="middle-comment-input"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    className="middle-comment-submit"
                    onClick={() => handleCommentSubmit(activeCommentPostIndex)}
                    disabled={!newComment.trim()}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DesktopMiddle;