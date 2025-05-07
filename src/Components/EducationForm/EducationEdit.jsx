import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSave, FiX } from "react-icons/fi";
import DesktopNavbar from  '../DesktopNavbar/DesktopNavbar.jsx'
import DesktopLeftTop from "../DesktopLeftTop/DesktopLeftTop.jsx";
import DesktopLeftBottomSection from '../DesktopLeftBottomSection/DesktopLeftBottomSection.jsx'
import DesktopRight from "../DesktopRight/DesktopRight.jsx";
import Background from "../Background/Background.jsx";
import MobileFooter from "../Mobilefooter/MobileFooter.jsx";
import axios from "axios";
import "./EducationEdit.css";
import Toast from '../Common/Toast';

function EducationEdit() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(false);
  const [educationList, setEducationList] = useState([
    { id: 1, name: "MIT" },
    { id: 2, name: "Harvard" },
    { id: 3, name: "10th" },
    { id: 4, name: "12th" },
  ]);
  const [newEducation, setNewEducation] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddEducation = () => {
    if (newEducation.trim() === "") {
      showErrorToast("Please enter a valid education entry.");
      return;
    }
    setEducationList([
      ...educationList,
      { id: Date.now(), name: newEducation.trim() },
    ]);
    setNewEducation("");
  };

  const handleEditEducation = (id, newName) => {
    setEducationList(
      educationList.map((edu) =>
        edu.id === id ? { ...edu, name: newName } : edu
      )
    );
  };

  const handleRemoveEducation = (id) => {
    if (educationList.length === 1) {
      showErrorToast("At least one education entry is required.");
      return;
    }
    setEducationList(educationList.filter((edu) => edu.id !== id));
  };

  const showErrorToast = (message) => {
    setToastMessage(message);
    setToastType('error');
    setShowToast(true);
  };

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setToastType('success');
    setShowToast(true);
  };

  const validateEducation = (education) => {
    if (!education.school || !education.degree || !education.startDate || !education.endDate) {
      showErrorToast("Please enter a valid education entry.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (educationList.length === 0) {
      showErrorToast("At least one education entry is required.");
      return;
    }

    const isValid = educationList.every(validateEducation);
    if (!isValid) {
      showErrorToast("Please add at least one education entry.");
      return;
    }

    setLoading(true);
    try {
      const authToken =
        localStorage.getItem("AuthToken") || localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("User not authenticated. Please log in.");
      }

      const response = await axios.patch(
        `https://uniisphere-backend-latest.onrender.com/users/profile`,
        {
          userId: userId,
          Skills: educationList.map((edu) => edu.name), // Using 'Skills' as per provided API, but likely should be 'education'
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      showSuccessToast("Education details saved successfully!");
      navigate(`/ProfileEditSection/${userId}`);
    } catch (error) {
      console.error("Error saving education:", error);

      if (error.response?.status === 401) {
        showErrorToast("Your session has expired. Please log in again.");
        localStorage.removeItem("AuthToken");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("LoginuserId");
        navigate("/userlogin");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to save education details. Please try again.";
        showErrorToast(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div>
      <DesktopNavbar />
      <div className="EducationEdit-main-container">
        <Background />
        <div className="EducationEdit-left-main-container">
          <DesktopLeftTop />
          <DesktopLeftBottomSection />
        </div>
        <div className="EducationEdit-middle-main-container">
          <div className="middle-education-mainParent">
            <div className="middle-education-container">
              <div className="middle-education-header">
                <h3>Edit Education</h3>
              </div>

              <div className="middle-education-list">
                {educationList.map((edu) => (
                  <div key={edu.id} className="middle-education-item">
                    <input
                      type="text"
                      value={edu.name}
                      onChange={(e) => handleEditEducation(edu.id, e.target.value)}
                      className="middle-education-input"
                      placeholder="Enter education"
                      disabled={loading}
                    />
                    <button
                      className="middle-education-remove"
                      onClick={() => handleRemoveEducation(edu.id)}
                      disabled={loading}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>

              <div className="middle-education-add">
                <input
                  type="text"
                  value={newEducation}
                  onChange={(e) => setNewEducation(e.target.value)}
                  className="middle-education-input"
                  placeholder="Add new education"
                  disabled={loading}
                />
                <button
                  className="middle-education-add-button"
                  onClick={handleAddEducation}
                  disabled={loading}
                >
                  Add
                </button>
              </div>

              <div className="middle-education-description">
                <p>
                  Update your education details to showcase your academic
                  background. You can add, edit, or remove entries as needed.
                </p>
              </div>

              <div className="middle-education-buttons">
                <button
                  className="middle-education-cancel"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="middle-education-save"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>

              {isMobile && <MobileFooter />}
            </div>
          </div>
        </div>
        <div className="EducationEdit-right-main-container">
          <DesktopRight />
        </div>
      </div>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
      />
    </div>
  );
}

export default EducationEdit;