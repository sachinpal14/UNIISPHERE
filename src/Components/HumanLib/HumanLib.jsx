import React, { useState, useEffect, useRef } from "react";
import "./HumanLib.css"; // Import the external CSS file
import DesktopNavbar from "../DesktopNavbar/DesktopNavbar.jsx";
import DesktopRight from "../DesktopRight/DesktopRight.jsx";
import Background from "../Background/Background.jsx";
import Toast from '../Common/Toast';
import axios from 'axios';

function HumanLib() {
  // State to track the current phase (1: Nickname, 2: Get connected, 3: Connecting, 4: Chat)
  const [phase, setPhase] = useState(1);
  // State for nickname input in Phase 1
  const [nickname, setNickname] = useState("");
  // State for chat data
  const [chatHistory, setChatHistory] = useState([]); // Store the full chat history
  const [selectedChatId, setSelectedChatId] = useState(null); // Track the selected chat
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // State to control the 10-second delay in Phase 3
  const [isPhase3TimerActive, setIsPhase3TimerActive] = useState(false);
  const chatMessagesRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Sender ID and token (assumed to be stored in localStorage)
  const senderId = localStorage.getItem("LoginuserId") || "18114725-fcc6-4cbe-a617-894a464b9fc8";
  const token = localStorage.getItem("authToken") || "your-auth-token-here";

  // Handler to transition to the next phase
  const handleNextPhase = (nextPhase) => {
    if (phase === 1 && !nickname.trim()) {
      showErrorToast("Please enter a nickname to proceed.");
      return;
    }
    if (phase === 2) {
      // Go to Phase 3 (Connecting) instead of directly to Phase 4
      setPhase(3);
      setIsPhase3TimerActive(true); // Start the timer for Phase 3
    } else if (phase === 3 && isPhase3TimerActive) {
      // Prevent manual transition during the 10-second timer
      return;
    } else {
      setPhase(nextPhase || phase + 1);
    }
  };

  // Automatically transition from Phase 3 to Phase 4 after 10 seconds
  useEffect(() => {
    if (phase !== 3 || !isPhase3TimerActive) return;

    const timer = setTimeout(() => {
      setIsPhase3TimerActive(false);
      setPhase(4); // Move to Phase 4 after 10 seconds
    }, 10000); // 10 seconds

    return () => clearTimeout(timer); // Cleanup the timer on unmount or phase change
  }, [phase, isPhase3TimerActive]);

  // Fetch chat history when entering Phase 4
  useEffect(() => {
    if (phase !== 4) return;

    const fetchChatHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Pass userId as a query parameter
        const response = await axios.get(
          `https://uniisphere-backend-latest.onrender.com/api/anonymous-chat/history?userId=${senderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.data;

        if (data && data.length > 0) {
          // Transform the chat history for display
          const transformedHistory = data.map((chat) => ({
            chatId: chat.chatId,
            lastMessage: chat.lastMessage || "No messages yet",
            timestamp: chat.updatedAt
              ? new Date(chat.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : "Unknown",
          }));
          setChatHistory(transformedHistory);
          // Automatically select the most recent chat
          setSelectedChatId(transformedHistory[0].chatId);
          showSuccessToast("Now you are chatting with a random person.");
        } else {
          throw new Error("No chat history found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token && senderId) {
      fetchChatHistory();
    }
  }, [phase, token, senderId]);

  // Fetch chat messages when a chat is selected
  useEffect(() => {
    if (!selectedChatId) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://uniisphere-backend-latest.onrender.com/api/anonymous-chat/${selectedChatId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.data;

        const transformedMessages = data.map((msg) => ({
          sender: msg.senderId === senderId ? "You" : msg.senderNickname || "Anonymous",
          text: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSent: msg.senderId === senderId,
          type: msg.type || "text",
        }));

        setChatMessages(transformedMessages);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMessages();

    // Poll for new messages every 2 seconds
    const intervalId = setInterval(fetchMessages, 2000);
    return () => clearInterval(intervalId);
  }, [selectedChatId, token, senderId]);

  // Auto-scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChatId) return;

    const newMessage = {
      sender: "You",
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSent: true,
      type: "text",
    };

    // Optimistic update
    setChatMessages((prev) => [...prev, newMessage]);
    setMessageInput("");

    try {
      const response = await axios.post(
        `https://uniisphere-backend-latest.onrender.com/api/anonymous-chat/${selectedChatId}/messages`,
        {
          content: messageInput,
          senderId: senderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.data;
    } catch (err) {
      setError(err.message);
      // Remove the optimistic update if the request fails
      setChatMessages((prev) => prev.filter((msg) => msg !== newMessage));
    }
  };

  // Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Dummy page component for when there's an error or no chat history
  const DummyPage = () => (
    <div className="HumanLib-dummy-page">
      <h2 className="HumanLib-title">No Active Chat Found</h2>
      <p className="HumanLib-description">
        It looks like we couldn't find an active chat for you at the moment. <br />
        Please try again later or start a new search.
      </p>
      <button
        className="HumanLib-button HumanLib-start"
        onClick={() => setPhase(2)} // Go back to Phase 2 to try again
      >
        Try Again
      </button>
    </div>
  );

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

  return (
    <div className="HumanLib-wrapper">
      {/* Navbar at the top */}
      <DesktopNavbar />

      {/* Background component (assumed to provide abstract shapes) */}
      <Background />

      {/* Main content area with the form and right sidebar */}
      <div className="HumanLib-main-content">
        {/* Form container (left/center section) */}
        <div className="HumanLib-container">
          {phase === 1 ? (
            // First page: Nickname entry form
            <div>
              <h2 className="HumanLib-title">Enter Your Nickname</h2>
              <p className="HumanLib-description">
                We respect your privacy & keep it safe we suggest to
                <br />
                pick up a nickname for your display.
              </p>
              <input
                type="text"
                placeholder="Enter your nickname"
                className="HumanLib-input"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
              <div className="HumanLib-button-container">
                <button className="HumanLib-button HumanLib-cancel">Cancel</button>
                <button
                  className="HumanLib-button HumanLib-start"
                  onClick={() => handleNextPhase()}
                  disabled={!nickname.trim()} // Disable button if nickname is empty
                >
                  Start searching
                </button>
              </div>
            </div>
          ) : phase === 2 ? (
            // Second page: "Get connected" content
            <div className="HumanLib-second-page-content-phase2">
              <div className="HumanLib-image-container-phase2">
                {/* Concentric circles and orbiting images */}
                <div className="HumanLib-concentric-circles-phase2">
                  {/* Pink outer circle (static) */}
                  <div className="HumanLib-circle-phase2 HumanLib-circle-pink-phase2"></div>
                  {/* Light blue inner circle (static) */}
                  <div className="HumanLib-circle-phase2 HumanLib-circle-blue-phase2"></div>
                  {/* Central image (static) */}
                  <div className="HumanLib-central-image-phase2"></div>
                  {/* Orbiting colored circles on the pink circle */}
                  <div className="HumanLib-orbiting-image-phase2 HumanLib-orbiting-image-1-phase2"></div>
                  <div className="HumanLib-orbiting-image-phase2 HumanLib-orbiting-image-2-phase2"></div>
                  <div className="HumanLib-orbiting-image-phase2 HumanLib-orbiting-image-3-phase2"></div>
                  <div className="HumanLib-orbiting-image-phase2 HumanLib-orbiting-image-4-phase2"></div>
                </div>
              </div>

              <h2 className="HumanLib-title">
                Get connected with the ones who are just like you. And want to share their feelings
              </h2>
              <p className="HumanLib-description">
                With just a click, get connected to another student who will never judge your feelings.
              </p>
              <div className="HumanLib-button-container">
                <button
                  className="HumanLib-button HumanLib-start"
                  onClick={() => handleNextPhase()}
                >
                  Start searching
                </button>
              </div>
            </div>
          ) : phase === 3 ? (
            // Third page: "Connecting" content (shown for 10 seconds)
            <div className="HumanLib-third-page-content">
              <div className="HumanLib-image-container">
                {/* Concentric circles for the third phase */}
                <div className="HumanLib-concentric-circles">
                  {/* Outer circle (red) */}
                  <div className="HumanLib-circle HumanLib-circle-red"></div>
                  {/* Orange circle */}
                  <div className="HumanLib-circle HumanLib-circle-orange"></div>
                  {/* Yellow circle */}
                  <div className="HumanLib-circle HumanLib-circle-yellow"></div>
                  {/* Green circle */}
                  <div className="HumanLib-circle HumanLib-circle-green"></div>
                  {/* Blue circle */}
                  <div className="HumanLib-circle HumanLib-circle-blue"></div>
                  {/* Indigo circle */}
                  <div className="HumanLib-circle HumanLib-circle-indigo"></div>
                  {/* Inner circle (violet) */}
                  <div className="HumanLib-circle HumanLib-circle-violet"></div>
                </div>
              </div>
              <p className="HumanLib-description">
                Connecting with the most <br /> accurate person for you.
              </p>
              <button
                className="HumanLib-button HumanLib-start"
                onClick={() => handleNextPhase()}
                disabled={isPhase3TimerActive} // Disable button during the 10-second timer
              >
                {isPhase3TimerActive ? "Connecting..." : "Start Chat"}
              </button>
            </div>
          ) : (
            // Fourth page: Chat interface with history sidebar or dummy page
            <div className="HumanLib-chat-wrapper">
              {error ? (
                // Show dummy page if there's an error or no chat history
                <DummyPage />
              ) : (
                <>
                  {/* Chat history sidebar */}
                  <div className="HumanLib-chat-history-sidebar">
                    <h3 className="HumanLib-sidebar-title">Chat History</h3>
                    {isLoading && <p>Loading chat history...</p>}
                    {!isLoading && chatHistory.length === 0 && (
                      <p>No chat history found.</p>
                    )}
                    {chatHistory.map((chat) => (
                      <div
                        key={chat.chatId}
                        className={`HumanLib-chat-history-item ${selectedChatId === chat.chatId ? "active" : ""
                          }`}
                        onClick={() => setSelectedChatId(chat.chatId)}
                      >
                        <div className="HumanLib-chat-history-info">
                          <p className="HumanLib-chat-history-preview">{chat.lastMessage}</p>
                          <p className="HumanLib-chat-history-timestamp">{chat.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat interface */}
                  <div className="HumanLib-chat-container">
                    {/* Chat header */}
                    <div className="HumanLib-chat-header">
                      <div className="HumanLib-chat-contact">
                        <div className="HumanLib-contact-avatar"></div>
                        <div>
                          <h3 className="HumanLib-contact-name">Anonymous</h3>
                          <p className="HumanLib-contact-status">Anonymous Chat</p>
                        </div>
                      </div>
                      <div className="HumanLib-chat-timestamp">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>

                    {/* Chat messages area */}
                    <div className="HumanLib-chat-messages" ref={chatMessagesRef}>
                      {!selectedChatId && <p>Select a chat to view messages.</p>}
                      {selectedChatId && chatMessages.length === 0 && (
                        <p>No messages yet. Start the conversation!</p>
                      )}
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`HumanLib-message ${message.isSent ? "HumanLib-message-sent" : "HumanLib-message-received"
                            }`}
                        >
                          {/* Sender avatar for received messages */}
                          {!message.isSent && (
                            <div className="HumanLib-message-avatar"></div>
                          )}
                          <div className="HumanLib-message-content">
                            <p className="HumanLib-message-sender">{message.sender}</p>
                            {message.type === "voice" ? (
                              <div className="HumanLib-voice-message">
                                <span className="HumanLib-voice-waveform">🎙️ Voice message</span>
                              </div>
                            ) : (
                              <p className="HumanLib-message-text">{message.text}</p>
                            )}
                            <p className="HumanLib-message-timestamp">{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message input area */}
                    <div className="HumanLib-chat-input">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={!selectedChatId} // Disable input if no chat is selected
                      />
                      <button className="HumanLib-emoji-button">😊</button>
                      <button className="HumanLib-voice-button">🎙️</button>
                      <button
                        className="HumanLib-send-button"
                        onClick={handleSendMessage}
                        disabled={!selectedChatId} // Disable send button if no chat is selected
                      >
                        ➤
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar (hidden in chat phase for simplicity) */}
        {phase !== 4 && (
          <div className="HumanLib-right-section">
            <DesktopRight />
          </div>
        )}
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

export default HumanLib;