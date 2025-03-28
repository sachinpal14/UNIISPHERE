import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./DesFollowerMiddleSectionPrivacy.css";
import { GoLock } from "react-icons/go";
import { RiArrowDropRightLine } from "react-icons/ri";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Personimage from "./Person.png";
import middleconnectimage from "./middleconnectimage.png";
import DesktopRight from "../DesktopRight/DesktopRight";
import DesktopLeftbottom from "../DesktopLeftbottom/DesktopLeftbottom.jsx";
import DesktopLeftTop from "../DesktopLeftTop/DesktopLeftTop.jsx";
import Background from "../Background/Background.jsx";
import DesktopNavbarr from "../DesktopNavbarr/DesktopNavbarr.jsx";
import MobileFooter from "../Mobilefooter/MobileFooter.jsx";

function DesFollowerMiddleSectionPrivacy() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId"); // Get userId from query parameters (e.g., /profile?userId=...)
  const [profileData, setProfileData] = useState(null); // State to store API data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isExpanded, setIsExpanded] = useState(false);

  // Default dummy data
  const defaultData = {
    profilePic: Personimage,
    collabs: 12,
    connections: 34,
    name: "Himanshu Choudhary",
    title: "Full Stack Developer | React & Node.js",
    about: "I am a passionate full-stack developer with expertise in React and Node.js.",
    collaboratorName: "Jane Smith",
    education: ["B.Tech in CS"],
    subCollaborators: ["Alice", "Bob", "Charlie"],
    paragraph:
      "Founder Himanshu who worked for months to think and plan all the essential stuffs to make the idea and dream to be a on ground working.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    fullAboutText:
      "Passionate developer with experience in web and mobile development. I specialize in React, Node.js, and building scalable applications. Love to work on open-source projects and contribute to the tech community.",
  };

  // Fetch profile data when component mounts or userId changes
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        setError("No user ID provided in query parameters");
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Reset loading state
        const response = await fetch(`https://uniisphere-1.onrender.com/getProfile/profile/?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch profile data: ${response.status}`);
        }
        const data = await response.json();
        const profile = data[0]; // Assuming data is an array with one object
        setProfileData(profile || defaultData); // Fallback to default if profile is null
        setLoading(false);

        // Structured console logging for API data
        console.log("API Data Received:", {
          Username: profile?.username ?? "N/A",
          FirstName: profile?.firstName ?? "N/A",
          LastName: profile?.lastName ?? "N/A",
          Location: profile?.location ?? "N/A",
          About: profile?.About ?? "N/A",
          Skills: profile?.Skills ?? "N/A",
          Interests: profile?.Interests ?? "N/A",
          Headline: profile?.headline ?? "N/A",
          ProfilePictureUrl: profile?.profilePictureUrl ?? "N/A",
          WorkOrProject: profile?.workorProject ?? "N/A",
          College: profile?.college ?? "N/A",
          Degree: profile?.degree ?? "N/A",
          Email: profile?.email ?? "N/A",
          Count: profile?._count ?? "N/A",
        });
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  // Toggle "See More" / "See Less" for about section
  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Use API data if available, otherwise use default data
  const data = profileData ? profileData : defaultData;

  const maxLength = 100;
  const displayedText =
    data.fullAboutText && isExpanded
      ? data.fullAboutText
      : data.fullAboutText?.slice(0, maxLength) +
        (data.fullAboutText?.length > maxLength ? "..." : "") || data.about || "N/A";

  if (loading) return <div>Loading...</div>;

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
          <div className="Followers-middle-section-1-mainParent-privacy">
            <div className="Followers-middle-section-1-middle-container-privacy">
              <div className="Followers-middle-section-1-middle-section-privacy">
                {/* Show error message if data fetch fails */}
                {error && (
                  <div style={{ color: "red", textAlign: "center", padding: "10px" }}>
                    {error}
                  </div>
                )}
                <div className="Followers-middle-section-1-top-nav">
                  <IoArrowBackCircleOutline className="Followers-middle-section-1-Circle-back-icon" />
                  <img src={middleconnectimage} alt="" />
                </div>
                <div className="Followers-middle-section-1-profile-header-privacy">
                  <div className="Followers-middle-section-1-imageContainer-privacy">
                    <img
                      src={data.profilePictureUrl || data.profilePic || Personimage}
                      alt="Profile"
                      className="Followers-middle-section-1-profile-pic-privacy"
                    />
                  </div>
                  <div className="Followers-middle-section-1-collabsDetails-privacy">
                    <h4>Collabs</h4> <span>{data._count?.connections1 ?? data.collabs ?? 0}</span>
                  </div>
                  <div className="Followers-middle-section-1-connectionsDetails-privacy">
                    <h4>Connections</h4>
                    <span>{data._count?.connections2 ?? data.connections ?? 0}</span>
                  </div>
                </div>
                <div className="Followers-middle-section-1-profile-info-privacy">
                  <p>{data.headline || data.title || "N/A"}</p>
                </div>
                <div className="Followers-middle-section-1-profile-buttons-privacy">
                  <button>{data.college || "Masters Union"}</button>
                  <button>{data.degree || "SBM"}</button>
                </div>
                <div className="Followers-middle-section-1-about-section-privacy">
                  <p>About</p>
                  <p>
                    {displayedText}
                    {data.fullAboutText?.length > maxLength && (
                      <button
                        className="Followers-middle-section-1-about-button-privacy"
                        onClick={toggleExpand}
                      >
                        {isExpanded ? "See Less" : "See More"}
                      </button>
                    )}
                  </p>
                </div>
                <div className="Followers-middle-section-1-collabs-section-privacy">
                  <p>Collabs</p>
                  <div className="Followers-middle-section-1-collabratorCard-privacy">
                    <div className="Followers-middle-section-1-collab-image-privacy">
                      <img src={Personimage} alt="" />
                    </div>
                    <div className="Followers-middle-section-1-collabratorDetails-privacy">
                      <h7>{data.collaboratorName || "N/A"}</h7>
                      <div className="Followers-middle-section-1-education-privacy">
                        {(data.education || [data.college || "N/A"]).map((val, index) => (
                          <h6 key={index}>{val}</h6>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="Followers-middle-section-1-paragraphAndArrow-privacy">
                  <div className="Followers-middle-section-1-para-privacy">
                    <p>{data.workorProject || data.paragraph || "N/A"}</p>
                  </div>
                  <div className="Followers-middle-section-1-iconAndImage-privacy">
                    <img src={Personimage} alt="" />
                    <RiArrowDropRightLine className="Followers-middle-section-1-paragrapgh-icon-privacy" />
                  </div>
                </div>
                <div className="Followers-middle-section-1-skills-section-privacy">
                  <h3>Skills</h3>
                  <div className="Followers-middle-section-1-skill-list-privacy">
                    {(data.Skills && data.Skills.length > 0 ? data.Skills : data.skills || []).map(
                      (val, index) => (
                        <div
                          key={index}
                          className="Followers-middle-section-1-skillsMiniDiv-privacy"
                        >
                          {val || "N/A"}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="Followers-middle-section-1-blur-privacy">
                  <div className="Followers-middle-section-1-lock-privacy">
                    <GoLock className="Followers-middle-section-1-lockIcon-privacy" />
                  </div>
                  <div className="Followers-middle-section-1-headings-privacy">
                    <h4>Do you know privacy?</h4>
                    <h4>Connect to explore further</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="Interest-section-Mobile-Footer">
              <MobileFooter />
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

export default DesFollowerMiddleSectionPrivacy;