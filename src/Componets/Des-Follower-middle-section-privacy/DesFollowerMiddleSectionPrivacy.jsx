/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./DesFollowerMiddleSectionPrivacy.css";
import { GoLock } from "react-icons/go";
import { RiArrowDropRightLine } from "react-icons/ri";
import Personimage from "./Person.png";
import middleconnectimage from "./middleconnectimage.png";
import DesktopRight from "../DesktopRight/DesktopRight";
import DesktopLeftbottom from "../DesktopLeftbottom/DesktopLeftbottom.jsx";
import DesktopLeftTop from "../DesktopLeftTop/DesktopLeftTop.jsx";
import Background from "../Background/Background.jsx";
import DesktopNavbarr from "../DesktopNavbarr/DesktopNavbarr.jsx";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import MobileFooter from "../Mobilefooter/MobileFooter.jsx";
function DesFollowerMiddleSectionPrivacy() {
  const [profilePic] = useState(Personimage);
  const [collabs] = useState(12);
  const [connections] = useState(34);
  const [name] = useState("Himanshu Choudhary");
  const [title] = useState("Full Stack Developer | React & Node.js");
  const [about] = useState(
    "I am a passionate full-stack developer with expertise in React and Node.js."
  );
  const [collaboratorName] = useState("Jane Smith");
  const [education] = useState(["B.Tech in CS"]);
  const [subCollaborators] = useState(["Alice", "Bob", "Charlie"]);
  const [paragraph] = useState(
    "Founder Himanshu who worked for months to think and plan all the essential stuffs to make the idea and dream to be a on ground working."
  );
  const [skills] = useState(["JavaScript", "React", "Node.js", "MongoDB"]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [fullAboutText] = useState(
    "Passionate developer with experience in web and mobile development. I specialize in React, Node.js, and building scalable applications. Love to work on open-source projects and contribute to the tech community."
  );

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const maxLength = 100;
  const displayedText = isExpanded
    ? fullAboutText
    : fullAboutText.slice(0, maxLength) +
      (fullAboutText.length > maxLength ? "..." : "");
  return (
    <div>
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
              <div className="Followers-middle-section-1-mainParent-privacy">
                <div className="Followers-middle-section-1-middle-container-privacy">
                  <div className="Followers-middle-section-1-middle-section-privacy">
                  <div className="Followers-middle-section-1-top-nav">
                    < IoArrowBackCircleOutline className="Followers-middle-section-1-Circle-back-icon" />
                    <img src={middleconnectimage} alt=""  />
                  </div>
                     
                    <div className="Followers-middle-section-1-profile-header-privacy">
                      <div className="Followers-middle-section-1-imageContainer-privacy">
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="Followers-middle-section-1-profile-pic-privacy"
                        />
                      </div>
                      <div className="Followers-middle-section-1-collabsDetails-privacy">
                        <h4>Collabs</h4> <span>{collabs}</span>
                      </div>
                      <div className="Followers-middle-section-1-connectionsDetails-privacy">
                        <h4>Connections</h4>
                        <span>{connections}</span>
                      </div>
                    </div>

                    <div className="Followers-middle-section-1-profile-info-privacy">
                      
                      <p>{title}</p>
                    </div>

                    <div className="Followers-middle-section-1-profile-buttons-privacy">
                      <button>Masters Union</button>
                      <button>SBM</button>
                    </div>

                    <div className="Followers-middle-section-1-about-section-privacy">
                      <p>About</p>
                      <p>
                        {displayedText}
                        {fullAboutText.length > maxLength && (
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
                          <h7>{collaboratorName}</h7>
                          <div className="Followers-middle-section-1-education-privacy">
                            {education.map((val, index) => (
                              <h6 key={index}>{val}</h6>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="Followers-middle-section-1-paragraphAndArrow-privacy">
                      <div className="Followers-middle-section-1-para-privacy">
                        <p>{paragraph}</p>
                      </div>
                      <div className="Followers-middle-section-1-iconAndImage-privacy">
                        <img src={Personimage} alt="" />
                        <RiArrowDropRightLine className="Followers-middle-section-1-paragrapgh-icon-privacy" />
                      </div>
                    </div>

                    <div className="Followers-middle-section-1-skills-section-privacy">
                      <h3>Skills</h3>
                      <div className="Followers-middle-section-1-skill-list-privacy">
                        {skills.map((val, index) => (
                          <div
                            key={index}
                            className="Followers-middle-section-1-skillsMiniDiv-privacy"
                          >
                            {val}
                          </div>
                        ))}
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
                <MobileFooter  />
                </div>
              </div>
             
            </div>
            
          </div>

          <div className="Interest-right-main-container">
            <DesktopRight />
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default DesFollowerMiddleSectionPrivacy;
