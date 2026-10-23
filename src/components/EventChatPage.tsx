import React, { useState, useRef, useEffect, useId } from "react";
import { EventData, ChatMessage, PollData } from "../App";
import { AvatarConfig, CustomAvatar } from "./Avatar";
import { sendChatMessage } from "../services/api";

interface EventChatPageProps {
  event: EventData;
  onBack: () => void;
  onSendMessage: (text: string) => void;
  onCreatePoll: (question: string, options: string[]) => void;
  onVotePoll: (messageId: number, optionId: number) => void;
  onJoinEvent?: (event: EventData) => void;
  onRegisterEvent?: (event: EventData) => void;
  getAvatar: (avatarKey?: string) => AvatarConfig;
}

export function EventChatPage({
  event,
  onBack,
  onSendMessage,
  onCreatePoll,
  onVotePoll,
  onJoinEvent,
  onRegisterEvent,
  getAvatar,
}: EventChatPageProps) {
  const [inputText, setInputText] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Poll Creator Form State
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const questionInputId = useId();

  // Scroll to bottom on new message or poll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [event.chatHistory.length]);

  // 🤖 Send Message with Gemini AI Content Moderation
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText || isSending) return;

    setIsSending(true);

    try {
      // Send through Express AI moderation server
      const response = await sendChatMessage(String(event.id), "alex", cleanText);

      // Check if Gemini AI Safety filter flagged the message
      if (response && (response.error || response.isFlagged)) {
        showNotice(
          `⚠️ AI Safety Filter: ${response.reason || response.error || "Message flagged as inappropriate."}`
        );
        setIsSending(false);
        return;
      }

      // Safe message! Pass to parent component handler
      onSendMessage(cleanText);
      setInputText("");
    } catch (err) {
      console.error("Failed to send moderated chat message:", err);
      // Fallback: still send locally if network error occurs
      onSendMessage(cleanText);
      setInputText("");
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenPollModal = () => {
    setPollQuestion("");
    setPollOptions(["", ""]);
    setIsCreatePollOpen(true);
  };

  const handleAddOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, idx) => idx !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...pollOptions];
    updated[index] = val;
    setPollOptions(updated);
  };

  const [pollError, setPollError] = useState("");
  const [inAppNotice, setInAppNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setInAppNotice(msg);
    setTimeout(() => setInAppNotice(null), 4000);
  };

  const handleSubmitPoll = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuestion = pollQuestion.trim();
    const cleanOptions = pollOptions.map((o) => o.trim()).filter(Boolean);

    if (!cleanQuestion || cleanOptions.length < 2) {
      setPollError("Please enter a question and at least 2 options.");
      return;
    }

    setPollError("");
    onCreatePoll(cleanQuestion, cleanOptions);
    setIsCreatePollOpen(false);
  };

  const isAlexJoined = event.attendeeKeys?.includes("alex") || event.host.toLowerCase().includes("alex");

  const categoryThemes: Record<string, { bg: string; color: string; border: string }> = {
    Sports: { bg: "#fef8e3", color: "#8c6500", border: "#f5c842" },
    Social: { bg: "#fef3e7", color: "#b34e00", border: "#f28b24" },
    Hobbies: { bg: "#f4effe", color: "#5c32b6", border: "#ba9cfc" },
    Carpool: { bg: "#eef5ff", color: "#1864ab", border: "#3d8bfd" },
    "Women-Only": { bg: "#fef0ef", color: "#c92a2a", border: "#f36458" },
  };

  const theme = categoryThemes[event.category] || categoryThemes.Sports;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: "#f6f5f0",
        position: "relative",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Status Bar */}
      <div className="status-bar light-theme">
        <span>9:41</span>
        <div className="status-icons">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Top Header Bar */}
      {inAppNotice && (
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "14px",
            right: "14px",
            zIndex: 100,
            background: "#111215",
            color: "#ffffff",
            padding: "10px 14px",
            borderRadius: "14px",
            border: "1.5px solid #f5c842",
            fontSize: "11px",
            fontWeight: 800,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>⚠️</span>
          <span>{inAppNotice}</span>
        </div>
      )}
      <div
        style={{
          background: "#ffffff",
          borderBottom: "1.5px solid #e7e4dc",
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          {/* Back button and Event Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <button
              onClick={onBack}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                border: "1.5px solid #e7e4dc",
                background: "#f8f7f2",
                color: "#111215",
                fontSize: "16px",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              title="Back"
              type="button"
            >
              ←
            </button>

            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "14.5px",
                  fontWeight: 900,
                  color: "#111215",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "230px",
                }}
              >
                {event.title}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginTop: "2px" }}>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 800,
                    padding: "1px 6px",
                    borderRadius: "5px",
                    background: theme.bg,
                    color: theme.color,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  #{event.category}
                </span>
                <span style={{ fontSize: "10.5px", color: "#666", fontWeight: 700 }}>
                  {event.joined}/{event.spots >= 900 ? "∞" : event.spots + event.joined} spots
                </span>
              </div>
            </div>
          </div>

          {/* Details Toggle Button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              padding: "5px 10px",
              borderRadius: "8px",
              background: showDetails ? "#111215" : "#f0eee6",
              color: showDetails ? "#ffffff" : "#111215",
              border: 0,
              fontSize: "11px",
              fontWeight: 800,
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.15s ease",
            }}
            type="button"
          >
            {showDetails ? "Hide Info" : "Details"}
          </button>
        </div>

        {/* Organiser Row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#777", fontWeight: 600, fontSize: "11px" }}>Organised by</span>
            <CustomAvatar config={getAvatar(event.hostAvatarKey || (event.host.toLowerCase().includes("alex") ? "alex" : "user"))} size={20} />
            <strong style={{ color: "#111215", fontWeight: 800, fontSize: "11.5px" }}>{event.host}</strong>
          </div>

          {!isAlexJoined && onJoinEvent && (
            <button
              onClick={() => onJoinEvent(event)}
              style={{
                padding: "4px 10px",
                borderRadius: "8px",
                background: "#f5c842",
                color: "#111215",
                border: 0,
                fontSize: "10.5px",
                fontWeight: 800,
                cursor: "pointer",
              }}
              type="button"
            >
              + Join Event
            </button>
          )}
        </div>

        {/* Collapsible Details Panel */}
        {showDetails && (
          <div
            style={{
              background: "#fbfaf7",
              borderRadius: "12px",
              border: "1px solid #e7e4dc",
              padding: "10px 12px",
              display: "grid",
              gap: "5px",
              fontSize: "11.5px",
              marginTop: "2px",
            }}
          >
            <div>
              <span style={{ color: "#777", fontWeight: 600 }}>Date & Time: </span>
              <strong style={{ color: "#111215" }}>{event.date} · {event.time}</strong>
            </div>
            <div>
              <span style={{ color: "#777", fontWeight: 600 }}>Venue: </span>
              <strong style={{ color: "#111215" }}>{event.venue}</strong>
            </div>
            {event.skillTag && (
              <div>
                <span style={{ color: "#777", fontWeight: 600 }}>Requirements: </span>
                <span style={{ color: "#444", fontWeight: 700 }}>{event.skillTag}</span>
              </div>
            )}
            {event.needPlusOne && (
              <div style={{ color: "#d9480f", fontWeight: 700, fontSize: "11px" }}>
                Notice: {event.needPlusOne}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Full-Screen Chat Feed */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          boxSizing: "border-box",
        }}
      >
        {/* System Welcome Card */}
        <div
          style={{
            alignSelf: "center",
            background: "rgba(0, 0, 0, 0.04)",
            borderRadius: "99px",
            padding: "4px 12px",
            fontSize: "10.5px",
            fontWeight: 700,
            color: "#666",
            textAlign: "center",
            margin: "4px 0",
          }}
        >
          Event group chat active · Protected by Gemini AI Moderation 🛡️
        </div>

        {/* Message Stream */}
        {event.chatHistory.map((msg) => {
          if (msg.poll) {
            const poll = msg.poll;
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: "center",
                  width: "100%",
                  maxWidth: "340px",
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1.5px solid #eae6dc",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                  padding: "13px 15px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {/* Poll Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        fontSize: "9.5px",
                        fontWeight: 800,
                        background: "#fef8e3",
                        color: "#8c6500",
                        border: "1px solid #f5c842",
                        padding: "1px 6px",
                        borderRadius: "5px",
                        letterSpacing: "0.02em",
                      }}
                    >
                      POLL
                    </span>
                    <span style={{ fontSize: "10.5px", color: "#777", fontWeight: 600 }}>
                      by {poll.createdBy || msg.sender}
                    </span>
                  </div>
                  <span style={{ fontSize: "10px", color: "#999", fontWeight: 600 }}>
                    {msg.time}
                  </span>
                </div>

                {/* Poll Question */}
                <h4
                  style={{
                    margin: 0,
                    fontSize: "13.5px",
                    fontWeight: 800,
                    color: "#111215",
                    lineHeight: 1.3,
                  }}
                >
                  {poll.question}
                </h4>

                {/* Poll Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  {poll.options.map((opt) => {
                    const isVoted = poll.userVotedId === opt.id;
                    const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          if (!isAlexJoined) {
                            showNotice("Please register for this event first to vote on polls!");
                            return;
                          }
                          onVotePoll(msg.id, opt.id);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "9px 11px",
                          borderRadius: "11px",
                          border: isVoted ? "2px solid #f5c842" : "1.5px solid #e7e4dc",
                          background: isVoted ? "#fffbf0" : "#faf9f5",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          transition: "all 0.15s ease",
                        }}
                        type="button"
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${percentage}%`,
                            background: isVoted ? "rgba(245, 200, 66, 0.28)" : "rgba(0, 0, 0, 0.04)",
                            pointerEvents: "none",
                            transition: "width 0.25s ease",
                          }}
                        />

                        <div
                          style={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "8px",
                            zIndex: 1,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div
                              style={{
                                width: "14px",
                                height: "14px",
                                borderRadius: "50%",
                                border: isVoted ? "4.5px solid #111215" : "1.5px solid #bbb",
                                background: isVoted ? "#f5c842" : "#ffffff",
                                flexShrink: 0,
                                boxSizing: "border-box",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "11.5px",
                                fontWeight: isVoted ? 800 : 700,
                                color: "#111215",
                              }}
                            >
                              {opt.text}
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                            <span style={{ fontSize: "11px", fontWeight: 800, color: isVoted ? "#111" : "#666" }}>
                              {opt.votes}
                            </span>
                            <span style={{ fontSize: "10px", color: "#888", fontWeight: 700 }}>
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Poll Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "#777", fontWeight: 600, paddingTop: "2px" }}>
                  <span>{totalVotes} total {totalVotes === 1 ? "vote" : "votes"}</span>
                  <span style={{ color: poll.userVotedId ? "#197142" : "#888", fontWeight: 700 }}>
                    {poll.userVotedId ? "✓ You voted" : "Tap to vote"}
                  </span>
                </div>
              </div>
            );
          }

          const isUser = Boolean(msg.isUser);

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: isUser ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: "7px",
                maxWidth: "85%",
                alignSelf: isUser ? "flex-end" : "flex-start",
              }}
            >
              {!isUser && (
                <div style={{ flexShrink: 0, marginBottom: "2px" }}>
                  <CustomAvatar config={getAvatar(msg.avatarKey)} size={26} />
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
                {!isUser && (
                  <span style={{ fontSize: "10px", fontWeight: 800, color: "#777", marginBottom: "2px", paddingLeft: "2px" }}>
                    {msg.sender}
                  </span>
                )}

                <div
                  style={{
                    background: isUser ? "#111215" : "#ffffff",
                    color: isUser ? "#ffffff" : "#111215",
                    border: isUser ? "none" : "1.5px solid #e7e4dc",
                    borderRadius: isUser ? "15px 15px 3px 15px" : "15px 15px 15px 3px",
                    padding: "9px 12px",
                    fontSize: "12px",
                    lineHeight: 1.35,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>

                <span style={{ fontSize: "9px", color: "#999", fontWeight: 600, marginTop: "2px", padding: "0 2px" }}>
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={chatEndRef} />
      </div>

      {/* Bottom Message Input Bar / Register Bar */}
      {!isAlexJoined ? (
        <div
          style={{
            background: "#ffffff",
            borderTop: "1.5px solid #e7e4dc",
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "9px",
            alignItems: "center",
            textAlign: "center",
            boxShadow: "0 -4px 14px rgba(0,0,0,0.05)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "16px" }}>🔒</span>
            <strong style={{ fontSize: "13px", color: "#111215", fontWeight: 800 }}>
              Group Chat Locked
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: "11.5px", color: "#666", fontWeight: 600 }}>
            Only registered participants can send messages and vote on polls.
          </p>
          {onRegisterEvent && (
            <button
              onClick={() => onRegisterEvent(event)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                background: "var(--folder-yellow, #f5c842)",
                color: "#111215",
                border: 0,
                fontSize: "13px",
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(245, 200, 66, 0.3)",
              }}
              type="button"
            >
              Register Event to Unlock Chat (+20 pts)
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            background: "#ffffff",
            borderTop: "1.5px solid #e7e4dc",
            padding: "10px 14px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          <form onSubmit={handleSend} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={handleOpenPollModal}
              style={{
                padding: "7px 11px",
                borderRadius: "10px",
                background: "#fef8e3",
                border: "1.5px solid #f5c842",
                color: "#8c6500",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                flexShrink: 0,
              }}
              title="Create a poll for this group"
              type="button"
            >
              + Poll
            </button>

            <input
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Say something to the group..."
              style={{
                flex: 1,
                padding: "9px 13px",
                borderRadius: "12px",
                border: "1.5px solid #e2ded5",
                background: "#f8f7f2",
                fontSize: "12px",
                color: "#111215",
                outline: "none",
              }}
              type="text"
              value={inputText}
            />

            <button
              disabled={!inputText.trim() || isSending}
              style={{
                padding: "9px 15px",
                borderRadius: "12px",
                background: inputText.trim() && !isSending ? "#111215" : "#e0ded7",
                color: inputText.trim() && !isSending ? "#ffffff" : "#888",
                border: 0,
                fontSize: "11.5px",
                fontWeight: 800,
                cursor: inputText.trim() && !isSending ? "pointer" : "default",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
              type="submit"
            >
              {isSending ? "Checking..." : "Send"}
            </button>
          </form>
        </div>
      )}

      {/* CREATE POLL MODAL SHEET */}
      {isCreatePollOpen && (
        <div
          aria-modal="true"
          className="modal-backdrop"
          onClick={() => setIsCreatePollOpen(false)}
          role="dialog"
          style={{ zIndex: 100 }}
        >
          <div
            className="playful-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "88vh", overflowY: "auto" }}
          >
            <button
              className="modal-close-pill"
              onClick={() => setIsCreatePollOpen(false)}
              type="button"
            >
              ✕
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: 800,
                  background: "#fef8e3",
                  color: "#8c6500",
                  border: "1px solid #f5c842",
                  padding: "2px 8px",
                  borderRadius: "6px",
                }}
              >
                NEW POLL
              </span>
              <h2 style={{ margin: 0, fontSize: "16.5px", fontWeight: 800, color: "#111215" }}>
                Create a Group Poll
              </h2>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: "11.5px", color: "#666", fontWeight: 600 }}>
              Ask a question to all attendees in {event.title}.
            </p>

            <form onSubmit={handleSubmitPoll} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label
                  htmlFor={questionInputId}
                  style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#111215", marginBottom: "4px" }}
                >
                  Question
                </label>
                <input
                  id={questionInputId}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="e.g. Post-match breakfast spot?"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: "1.5px solid #dcd8ce",
                    fontSize: "12px",
                    boxSizing: "border-box",
                  }}
                  type="text"
                  value={pollQuestion}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#111215", marginBottom: "6px" }}>
                  Options (Minimum 2)
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "#e8e5dc",
                          color: "#555",
                          fontSize: "10px",
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <input
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        style={{
                          flex: 1,
                          padding: "8px 11px",
                          borderRadius: "99px",
                          border: "1.5px solid #dcd8ce",
                          fontSize: "11.5px",
                        }}
                        type="text"
                        value={opt}
                      />
                      {pollOptions.length > 2 && (
                        <button
                          onClick={() => handleRemoveOption(idx)}
                          style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "7px",
                            background: "#fee",
                            color: "#c92a2a",
                            border: "1px solid #fcc",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                          type="button"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {pollOptions.length < 6 && (
                  <button
                    onClick={handleAddOption}
                    style={{
                      marginTop: "8px",
                      background: "none",
                      border: "1.5px dashed #bbb",
                      borderRadius: "9px",
                      width: "100%",
                      padding: "7px",
                      color: "#555",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    type="button"
                  >
                    + Add Option
                  </button>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "6px" }}>
                <button
                  className="btn-punchy"
                  onClick={() => setIsCreatePollOpen(false)}
                  style={{ background: "#eae7de", color: "#333" }}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn-punchy yellow"
                  disabled={!pollQuestion.trim() || pollOptions.filter((o) => o.trim()).length < 2}
                  type="submit"
                >
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventChatPage;