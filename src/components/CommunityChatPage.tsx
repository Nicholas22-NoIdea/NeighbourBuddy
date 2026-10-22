import React, { useState } from "react";
import { AvatarConfig, CustomAvatar } from "./Avatar";

export interface CommunityChatMessage {
  id: number;
  sender: string;
  avatarKey: string;
  time: string;
  text?: string;
  isUser?: boolean;
  poll?: {
    id: number;
    question: string;
    options: { id: number; text: string; votes: number }[];
    userVotedId?: number | null;
    createdBy: string;
    createdAt: string;
  };
}

export interface CommunityData {
  id: string;
  name: string;
  hashtag: string;
  category: "Sports" | "Running" | "Hobbies" | "Carpool" | "Women-Only" | "Social";
  description: string;
  memberCount: number;
  isJoined: boolean;
  leadAvatarKey: string;
  leadName: string;
  sticker: string;
  badge: string;
  themeColor: string;
  bgLight: string;
  borderLight: string;
  sharedResource: string;
  chatHistory: CommunityChatMessage[];
}

interface CommunityChatPageProps {
  community: CommunityData;
  getAvatar: (key?: string) => AvatarConfig;
  onBack: () => void;
  onSendMessage: (communityId: string, text: string) => void;
  onCreatePoll: (communityId: string, question: string, options: string[]) => void;
  onVotePoll: (communityId: string, messageId: number, optionId: number) => void;
  onOpenRelatedEvent?: (eventId: number) => void;
}

export function CommunityChatPage({
  community,
  getAvatar,
  onBack,
  onSendMessage,
  onCreatePoll,
  onVotePoll,
}: CommunityChatPageProps) {
  const [inputText, setInputText] = useState("");
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(community.id, inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handleOptionChange = (idx: number, value: string) => {
    const updated = [...pollOptions];
    updated[idx] = value;
    setPollOptions(updated);
  };

  const [pollError, setPollError] = useState("");

  const handlePollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = pollOptions.filter((opt) => opt.trim() !== "");
    if (!pollQuestion.trim() || validOptions.length < 2) {
      setPollError("Please enter a question and at least 2 options.");
      return;
    }
    setPollError("");
    onCreatePoll(community.id, pollQuestion.trim(), validOptions);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setShowPollModal(false);
  };

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
      {/* Phone Status Bar */}
      <div className="status-bar light-theme">
        <span>9:41</span>
        <div className="status-icons">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Top Header */}
      <div
        style={{
          background: "#ffffff",
          borderBottom: "1.5px solid #e7e4dc",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
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
            title="Back to Communities"
            type="button"
          >
            ←
          </button>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "16px" }}>{community.sticker}</span>
              <h1
                style={{
                  margin: 0,
                  fontSize: "14.5px",
                  fontWeight: 900,
                  color: "#111215",
                  letterSpacing: "-0.01em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {community.name}
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "1px" }}>
              <span
                style={{
                  fontSize: "9.5px",
                  fontWeight: 800,
                  color: community.themeColor,
                  background: community.bgLight,
                  padding: "1px 6px",
                  borderRadius: "99px",
                  border: `1px solid ${community.borderLight}`,
                }}
              >
                {community.hashtag}
              </span>
              <span style={{ fontSize: "10px", color: "#666", fontWeight: 600 }}>
                {community.memberCount} members · Lead by {community.leadName}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPollModal(true)}
          style={{
            padding: "5px 10px",
            borderRadius: "10px",
            background: "#f5c842",
            color: "#111215",
            border: 0,
            fontSize: "11px",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          }}
          type="button"
        >
          📊 + Poll
        </button>
      </div>

      {/* Community Shared Resource Info Banner */}
      <div
        style={{
          background: community.bgLight,
          borderBottom: `1px solid ${community.borderLight}`,
          padding: "7px 14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "13px" }}>📦</span>
        <span style={{ fontSize: "10px", color: "#333", fontWeight: 600, lineHeight: 1.3 }}>
          <strong>Shared Resource:</strong> {community.sharedResource}
        </span>
      </div>

      {/* Chat Messages Feed */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 14px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", margin: "4px 0 10px" }}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              background: "#eae7de",
              color: "#555",
              padding: "3px 10px",
              borderRadius: "99px",
            }}
          >
            Welcome to the {community.hashtag} Community Group Chat 💬
          </span>
        </div>

        {community.chatHistory.map((msg) => {
          const isUser = msg.isUser || msg.sender.includes("You");

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: isUser ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: "8px",
                maxWidth: "100%",
              }}
            >
              {!isUser && (
                <div style={{ flexShrink: 0, marginBottom: "2px" }}>
                  <CustomAvatar config={getAvatar(msg.avatarKey)} size={32} />
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isUser ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                }}
              >
                {!isUser && (
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px", paddingLeft: "4px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#111215" }}>{msg.sender}</span>
                    <span style={{ fontSize: "9.5px", color: "#888" }}>{msg.time}</span>
                  </div>
                )}

                {/* Poll Message */}
                {msg.poll ? (
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      border: "1.5px solid #e7e4dc",
                      padding: "12px 14px",
                      width: "250px",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "14px" }}>📊</span>
                      <strong style={{ fontSize: "12px", color: "#111215", lineHeight: 1.3 }}>
                        {msg.poll.question}
                      </strong>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                      {msg.poll.options.map((opt) => {
                        const totalVotes = msg.poll?.options.reduce((sum, o) => sum + o.votes, 0) || 0;
                        const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                        const isVoted = msg.poll?.userVotedId === opt.id;

                        return (
                          <button
                            key={opt.id}
                            onClick={() => onVotePoll(community.id, msg.id, opt.id)}
                            style={{
                              position: "relative",
                              borderRadius: "10px",
                              border: isVoted ? "1.5px solid #111" : "1px solid #e2e2dc",
                              background: isVoted ? "#fef8e3" : "#fbfbfa",
                              padding: "8px 10px",
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "#111",
                              cursor: "pointer",
                              textAlign: "left",
                              overflow: "hidden",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                            type="button"
                          >
                            {/* Vote progress fill */}
                            <div
                              style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: `${pct}%`,
                                background: isVoted ? "rgba(245, 200, 66, 0.35)" : "rgba(0,0,0,0.06)",
                                zIndex: 0,
                                transition: "width 0.25s ease",
                              }}
                            />
                            <span style={{ position: "relative", zIndex: 1 }}>{opt.text}</span>
                            <span style={{ position: "relative", zIndex: 1, fontSize: "10px", fontWeight: 800, color: "#666" }}>
                              {opt.votes} ({pct}%)
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Standard Chat Bubble */
                  <div
                    style={{
                      background: isUser ? "#111215" : "#ffffff",
                      color: isUser ? "#ffffff" : "#111215",
                      borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      padding: "9px 13px",
                      fontSize: "12px",
                      lineHeight: 1.4,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                      border: isUser ? "none" : "1px solid #e7e4dc",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                )}

                {isUser && (
                  <span style={{ fontSize: "9px", color: "#888", marginTop: "2px", paddingRight: "4px" }}>
                    {msg.time}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Message Input Bar */}
      <div
        style={{
          background: "#ffffff",
          borderTop: "1.5px solid #e7e4dc",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setShowPollModal(true)}
          style={{
            background: "#f0eee6",
            border: 0,
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            fontSize: "15px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          title="Create a Community Poll"
          type="button"
        >
          📊
        </button>

        <input
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${community.hashtag} members...`}
          style={{
            flex: 1,
            background: "#f6f5f0",
            border: "1.5px solid #e2ded5",
            borderRadius: "99px",
            padding: "8px 14px",
            fontSize: "12px",
            color: "#111215",
            outline: "none",
          }}
          type="text"
          value={inputText}
        />

        <button
          disabled={!inputText.trim()}
          onClick={handleSend}
          style={{
            background: inputText.trim() ? "#111215" : "#dedad0",
            color: "#ffffff",
            border: 0,
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            fontSize: "15px",
            fontWeight: 800,
            cursor: inputText.trim() ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.15s ease",
          }}
          type="button"
        >
          ↑
        </button>
      </div>

      {/* Create Community Poll Modal */}
      {showPollModal && (
        <div aria-modal="true" className="modal-backdrop" role="dialog">
          <div className="playful-sheet" style={{ maxWidth: "340px", width: "90%" }}>
            <button
              className="modal-close-pill"
              onClick={() => setShowPollModal(false)}
              type="button"
            >
              ✕
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ fontSize: "22px" }}>📊</span>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Create Community Poll</h2>
            </div>
            <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#666" }}>
              Ask {community.name} members for their vote or input.
            </p>

            <form onSubmit={handlePollSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", fontSize: "10.5px", fontWeight: 800, marginBottom: "4px" }}>
                  Question:
                </label>
                <input
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="e.g. Which weekday for evening drills?"
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "10px",
                    border: "1.5px solid #ddd",
                    fontSize: "11.5px",
                    boxSizing: "border-box",
                  }}
                  type="text"
                  value={pollQuestion}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "10.5px", fontWeight: 800, marginBottom: "4px" }}>
                  Options:
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {pollOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        fontSize: "11px",
                        boxSizing: "border-box",
                      }}
                      type="text"
                      value={opt}
                    />
                  ))}
                </div>

                {pollOptions.length < 5 && (
                  <button
                    onClick={handleAddOption}
                    style={{
                      background: "none",
                      border: 0,
                      color: "#d9480f",
                      fontSize: "10.5px",
                      fontWeight: 800,
                      cursor: "pointer",
                      marginTop: "6px",
                      padding: 0,
                    }}
                    type="button"
                  >
                    + Add Option
                  </button>
                )}
                {pollError && (
                  <div style={{ color: "#d9480f", fontSize: "11px", fontWeight: 800, marginTop: "6px" }}>
                    ⚠️ {pollError}
                  </div>
                )}
              </div>

              <button
                className="btn-punchy yellow"
                style={{ width: "100%", minHeight: "38px", fontSize: "12px", fontWeight: 800 }}
                type="submit"
              >
                Post Poll to Chat
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
