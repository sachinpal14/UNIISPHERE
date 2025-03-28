import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Background from "../Background/Background.jsx";
import DesktopLeftbottom from "../DesktopLeftbottom/DesktopLeftbottom.jsx";
import DesktopLeftTop from "../DesktopLeftTop/DesktopLeftTop.jsx";
import DesktopNavbarr from "../DesktopNavbarr/DesktopNavbarr.jsx";
import DesktopRight from "../DesktopRight/DesktopRight";
import MobileFooter from "../Mobilefooter/MobileFooter";
import "./FullFlowerSectionPage.css";
import Profile from "./Profile.png";
import Profileandview from "./Profileandview.png";
import uploadimage1 from "./UploadImage1.png";
import uploadimage2 from "./UploadImage2.png";
import uploadimage3 from "./UploadImage3.png";

function FullFlowerSectionPage() {
  const { userId } = useParams(); // Extracts "07d3b55a-6908-4d5d-be94-79f8f6e0539b" from URL
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);

  const [profilePic, setProfilePic] = useState(Profile);
  const [collabs, setCollabs] = useState(10);
  const [connections, setConnections] = useState(50);
  const [name, setName] = useState("Himanshu Choudhary");
  const [title, setTitle] = useState("Software Engineer || Web Developer");
  const [address, setAddress] = useState("Gurgaon, Haryana, India");
  const [fullAboutText, setFullAboutText] = useState(
    "Passionate developer with experience in web and mobile development. I specialize in React, Node.js, and building scalable applications. Love to work on open-source projects and contribute to the tech community."
  );
  const [skill, setSkill] = useState([
    "UI/UX", "JAVA", "CSS", "C++", "Python", "V+", "Figma", "Photoshop",
  ]);
  const [interest, setInterest] = useState([
    "UI/UX", "JAVA", "CSS", "C++", "Python", "V+", "Figma", "Photoshop",
  ]);

  const dummyData = {
    profilePic: Profile,
    collabs: 10,
    connections: 50,
    name: "Himanshu Choudhary",
    title: "Software Engineer || Web Developer",
    address: "Gurgaon, Haryana, India",
    about:
      "Passionate developer with experience in web and mobile development. I specialize in React, Node.js, and building scalable applications. Love to work on open-source projects and contribute to the tech community.",
    skills: ["UI/UX", "JAVA", "CSS", "C++", "Python", "V+", "Figma", "Photoshop"],
    interests: ["UI/UX", "JAVA", "CSS", "C++", "Python", "V+", "Figma", "Photoshop"],
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      const authToken = localStorage.getItem("authToken");
      console.log("Starting fetch for userId:", userId, "with token:", authToken);

      if (!authToken) {
        console.log("No auth token found, using dummy data");
        setError("Authentication required. Using dummy data.");
        applyDummyData();
        setLoading(false);
        return;
      }

      if (!userId || userId === "unknown") {
        console.log("Invalid userId, using dummy data");
        setError("Invalid user ID. Using dummy data.");
        applyDummyData();
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Set loading to true before fetching
        console.log("Fetching data from API...");

        const response = await axios.get(
          `https://uniisphere-1.onrender.com/getProfile/profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        console.log("API response for userId", userId, ":", response.data);

        const data = response.data;
        if (!data || Object.keys(data).length === 0) {
          throw new Error("No data returned from API");
        }

        console.log("Processed profile data:", data);

        // Update state with API data
        setProfilePic(data.profilePictureUrl || dummyData.profilePic);
        setCollabs(data._count?.connections1 || dummyData.collabs);
        setConnections(
          (data._count?.connections1 || 0) + (data._count?.connections2 || 0) || dummyData.connections
        );
        setName(
          `${data.firstName || dummyData.name.split(" ")[0]} ${data.lastName || dummyData.name.split(" ")[1]}`
        );
        setTitle(data.headline || dummyData.title);
        setAddress(data.location || dummyData.address);
        setFullAboutText(data.About || dummyData.about);
        setSkill(data.skills || dummyData.skills);
        setInterest(data.interests || dummyData.interests);
      } catch (error) {
        console.error("Error fetching profile data for userId", userId, ":", error.message);
        setError("Failed to load profile data. Showing dummy data.");
        applyDummyData();
      } finally {
        setLoading(false);
        console.log("Fetch complete, loading set to false");
      }
    };

    const applyDummyData = () => {
      setProfilePic(dummyData.profilePic);
      setCollabs(dummyData.collabs);
      setConnections(dummyData.connections);
      setName(dummyData.name);
      setTitle(dummyData.title);
      setAddress(dummyData.address);
      setFullAboutText(dummyData.about);
      setSkill(dummyData.skills);
      setInterest(dummyData.interests);
    };

    fetchProfileData();
  }, [userId]);

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const maxLength = 100;
  const displayedText = isExpanded
    ? fullAboutText
    : fullAboutText.slice(0, maxLength) +
      (fullAboutText.length > maxLength ? "..." : "");

  const images = [uploadimage1, uploadimage2, uploadimage3, uploadimage2, uploadimage3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const prevImageSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextImageSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const experiencesData = [
    {
      title: "Farewell",
      subtitle: "Backstage Handler",
      description:
        "The actual idea of Unisphere was of The Founder Himanshu who worked for months to...",
    },
    // ... other experiences unchanged
  ];

  const [currentExpIndex, setCurrentExpIndex] = useState(0);

  const prevExpSlide = () => {
    setCurrentExpIndex((prevIndex) =>
      prevIndex === 0 ? experiencesData.length - 1 : prevIndex - 1
    );
  };

  const nextExpSlide = () => {
    setCurrentExpIndex((prevIndex) =>
      prevIndex === experiencesData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const [color] = useState(["#F3FDF4", "#FDF9F9", "#eaead6", "#F7F7F7"]);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [currentInterestIndex, setCurrentInterestIndex] = useState(0);

  const prevSkillSlide = () => {
    setCurrentSkillIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(skill.length - 4, 0) : prevIndex - 1
    );
  };

  const nextSkillSlide = () => {
    setCurrentSkillIndex((prevIndex) =>
      prevIndex >= skill.length - 4 ? 0 : prevIndex + 1
    );
  };

  const prevInterestSlide = () => {
    setCurrentInterestIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(interest.length - 4, 0) : prevIndex - 1
    );
  };

  const nextInterestSlide = () => {
    setCurrentInterestIndex((prevIndex) =>
      prevIndex >= interest.length - 4 ? 0 : prevIndex + 1
    );
  };

  const [collaboratorName] = useState("Jane Smith");
  const [subCollaborators] = useState(["Alice", "Bob", "Charlie"]);
  const [paragraph] = useState(
    "Founder Himanshu who worked for months to think and plan all the essential stuffs to make the idea and dream to be a on ground working."
  );

  const handleBackClick = () => navigate("/");

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
  }

  return (
    <div>
      <DesktopNavbarr />
      <div className="Interest-main-container">
        <Background />
        <div className="Interest-left-main-container">
          <DesktopLeftTop />
          <DesktopLeftbottom />
        </div>
        <div className="Interest-middle-main-container">
          <div>
            <div className="Profile-full-section-mainParent">
              <div className="Profile-full-section-container">
                <IoArrowBack
                  className="back-button"
                  onClick={handleBackClick}
                  style={{ cursor: "pointer", fontSize: "24px", margin: "10px" }}
                />
                {error && (
                  <div style={{ color: "orange", textAlign: "center", padding: "10px" }}>
                    {error}
                  </div>
                )}
                <div className="Profile-full-section-whole-profile-section">
                  <div className="Profile-full-section-top-nav-section"></div>
                  <div className="Profile-full-section-profile-header">
                    <div className="Profile-full-section-imageContainer">
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="Profile-full-section-profile-pic"
                      />
                    </div>
                    <div className="Profile-full-section-parent-collabs-connection">
                      <div className="Profile-full-section-collabsDetails">
                        <h4>Collabs</h4>
                        <span>{collabs}</span>
                      </div>
                      <div className="Profile-full-section-connectionsDetails">
                        <h4>Connections</h4>
                        <span>{connections}</span>
                      </div>
                    </div>
                  </div>

                  <div className="Profile-full-section-profile-info">
                    <p>{name}</p>
                    <p>{title}</p>
                    <p>{address}</p>
                    <p>User ID: {userId}</p> {/* Displays 07d3b55a-6908-4d5d-be94-79f8f6e0539b */}
                  </div>

                  <div className="Profile-full-section-profile-buttons">
                    <button className="Profile-full-section-btn">Message</button>
                    <button className="Profile-full-section-btn">Connect</button>
                  </div>
                </div>

                <div className="Profile-full-section-goal-section">
                  <p className="Profile-full-section-heading">Your Plan and Goal</p>
                  <p>
                    {displayedText}
                    <span>
                      {fullAboutText.length > maxLength && (
                        <button
                          className="Profile-full-section-goal-button"
                          onClick={toggleExpand}
                        >
                          {isExpanded ? "See Less" : "See More"}
                        </button>
                      )}
                    </span>
                  </p>
                </div>

                {/* Rest of the JSX remains unchanged */}
                <div className="Profile-full-section-main-analytics-parent">
                  <div className="Profile-full-section-anlaytic-main-section">
                    <p className="Profile-full-section-heading">Analytics</p>
                    <div className="Profile-full-section-analytics-container">
                      <div className="Profile-full-section-circle"></div>
                      <div className="Profile-full-section-circle"></div>
                      <div className="Profile-full-section-circle"></div>
                      <div className="Profile-full-section-circle"></div>
                    </div>
                  </div>
                </div>

                <div className="Profile-full-section-about-section">
                  <div className="Profile-full-section-about-headingAndFull">
                    <p className="Profile-full-section-heading">About</p>
                  </div>
                  <p>
                    {displayedText}
                    <span>
                      {fullAboutText.length > maxLength && (
                        <button
                          className="Profile-full-section-aboutAndgoal-button"
                          onClick={toggleExpand}
                        >
                          {isExpanded ? "See Less" : "See More"}
                        </button>
                      )}
                    </span>
                  </p>
                </div>

                <div className="Profile-full-section-upload-slider-box">
                  <p className="Profile-full-section-heading">Upload</p>
                  <div className="Profile-full-section-down-upload-slider-con">
                    <IoIosArrowBack
                      className="Profile-full-section-Back"
                      onClick={prevImageSlide}
                    />
                    <div className="Profile-full-section-slide-track">
                      {images
                        .slice(currentImageIndex, currentImageIndex + 3)
                        .map((image, index) => (
                          <div
                            key={index}
                            className="Profile-full-section-each-slide"
                          >
                            <img
                              src={image}
                              alt="Slide"
                              className="Profile-full-section-slide-img"
                            />
                            <p>the actual idea..... </p>
                          </div>
                        ))}
                    </div>
                    <IoIosArrowForward
                      className="Profile-full-section-Forward"
                      onClick={nextImageSlide}
                    />
                  </div>
                </div>

                <div className="Profile-full-section-experience-slider-box">
                  <p className="Profile-full-section-heading">Experience</p>
                  <div className="Profile-full-section-down-experience-slider-con">
                    <IoIosArrowBack
                      className="Profile-full-section-Back"
                      onClick={prevExpSlide}
                    />
                    <div className="Profile-full-section-slide-track">
                      {experiencesData
                        .slice(currentExpIndex, currentExpIndex + 3)
                        .map((data, index) => (
                          <div
                            style={{ backgroundColor: color[index % color.length] }}
                            key={index}
                            className="Profile-full-section-experince-inner-div"
                          >
                            <h3>{data.title}</h3>
                            <h5>{data.subtitle}</h5>
                            <p>{data.description}</p>
                          </div>
                        ))}
                    </div>
                    <IoIosArrowForward
                      className="Profile-full-section-Forward"
                      onClick={nextExpSlide}
                    />
                  </div>
                </div>

                <div className="Profile-full-section-main-wrapper-section">
                  <div className="Profile-full-section-heading-and-logos">
                    <p className="Profile-full-section-heading">Skills</p>
                    <div className="Profile-full-section-logos"></div>
                  </div>
                  <div className="Profile-full-section-content-and-arrow">
                    <IoIosArrowBack
                      className="Profile-full-section-left-btn"
                      onClick={prevSkillSlide}
                    />
                    <div className="Profile-full-section-suggested-tags">
                      {skill
                        .slice(currentSkillIndex, currentSkillIndex + 4)
                        .map((skillItem, index) => (
                          <div
                            key={index}
                            style={{ backgroundColor: color[index % color.length] }}
                            className="Profile-full-section-tag"
                          >
                            {skillItem}
                          </div>
                        ))}
                    </div>
                    <IoIosArrowForward
                      className="Profile-full-section-right-btn"
                      onClick={nextSkillSlide}
                    />
                  </div>
                </div>

                <div className="Profile-full-section-main-collabs-section">
                  <div className="Profile-full-section-heading-and-logos">
                    <p className="Profile-full-section-heading">Collabs</p>
                    <div className="Profile-full-section-logos"></div>
                  </div>
                  <div className="Profile-full-section-second-div-arrowAndContent">
                    <IoIosArrowBack
                      className="Profile-full-section-Back"
                      onClick={prevImageSlide}
                    />
                    <div className="Profile-full-section-innerDiv-onlyContent">
                      <div className="Profile-full-section-left">
                        <div className="Profile-full-section-collabratorCard">
                          <div className="Profile-full-section-collab-image">
                            <img src={uploadimage1} alt="" />
                          </div>
                          <div className="Profile-full-section-collabratorDetails">
                            <p>{collaboratorName}</p>
                            <div className="Profile-full-section-education">
                              <p>M.Tech </p>
                              <p>B.tech </p>
                            </div>
                            <div className="Profile-full-section-subCollabrators">
                              (
                              <div className="Profile-full-section-sunCollabrators-name">
                                {subCollaborators.map((val, index) => (
                                  <p key={index}>{val},</p>
                                ))}
                              </div>
                              )
                            </div>
                          </div>
                        </div>
                        <div className="Profile-full-section-para">
                          <p>{paragraph}</p>
                        </div>
                      </div>
                      <div className="Profile-collab-full-section-right">
                        <img src={uploadimage2} alt="" />
                      </div>
                    </div>
                    <IoIosArrowForward
                      className="Profile-full-section-Forward"
                      onClick={nextImageSlide}
                    />
                  </div>
                </div>

                <div className="Profile-full-section-main-wrapper-section">
                  <div className="Profile-full-section-heading-and-logos">
                    <h3>Interests</h3>
                    <div className="Profile-full-section-logos"></div>
                  </div>
                  <div className="Profile-full-section-content-and-arrow">
                    <IoIosArrowBack
                      className="Profile-full-section-left-btn"
                      onClick={prevInterestSlide}
                    />
                    <div className="Profile-full-section-suggested-tags">
                      {interest
                        .slice(currentInterestIndex, currentInterestIndex + 4)
                        .map((interestItem, index) => (
                          <div
                            key={index}
                            style={{ backgroundColor: color[index % color.length] }}
                            className="Profile-full-section-tag"
                          >
                            {interestItem}
                          </div>
                        ))}
                    </div>
                    <IoIosArrowForward
                      className="Profile-full-section-right-btn"
                      onClick={nextInterestSlide}
                    />
                  </div>
                </div>

                <div className="Profile-full-section-main-education">
                  <div className="Profile-full-section-upper-education">
                    <div className="Profile-full-section-education-headingAndFull">
                      <p className="Profile-full-section-heading">Education</p>
                    </div>
                    <div className="Profile-full-section-buttons-section">
                      <button className="btn btn-left">Hansraj College</button>
                      <button className="btn btn-middle">B.A Programme.</button>
                      <button className="btn btn-middle">12th Class</button>
                      <button className="btn btn-right">10th Class</button>
                    </div>
                  </div>
                  <img
                    className="Profile-full-section-public-logo"
                    src={Profileandview}
                    alt=""
                  />
                  {isMobile && <MobileFooter />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Interest-right-main-container">
          <DesktopRight />
        </div>
      </div>
    </div>
  );
}

export default FullFlowerSectionPage;