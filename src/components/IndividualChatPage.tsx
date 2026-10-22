import React, { useState } from "react";
import { AvatarConfig, CustomAvatar } from "./Avatar";
import { EventData } from "../App";

export interface DirectChatMessage {
  id: number;
  sender: string;
  avatarKey: string;
  time: string;
  text?: string;
  isUser?: boolean;
  eventInvite?: {
    eventId: number;
    title: string;
    date: string;
    time: string;
    venue: string;
  };
}

export interface DirectChatData {
  buddyId: number;
  buddyName: string;
  avatarKey: string;
  subtitle: string;
  statusMsg: string;
  lastMessage: string;
  lastTime: string;
  unreadCount?: number;
  messages: DirectChatMessage[];
}

interface IndividualChatPageProps {
  chat: DirectChatData;
  events: EventData[];
  getAvatar: (key?: string) => AvatarConfig;
  onBack: () => void;
  onSendMessage: (buddyId: number, text: string) => void;
  onSendEventInvite: (buddyId: number, event: EventData) => void;
  onViewEvent: (event: EventData) => void;
}

export function IndividualChatPage({
  chat,
  events,
  getAvatar,
  onBack,
  onSendMessage,
  onSendEventInvite,
  onViewEvent,
}: IndividualChatPageProps) {
  const [inputText, setInputText] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(chat.buddyId, inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
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
            title="Back to Chats"
            type="button"
          >
            ←
          </button>

          <div style={{ position: "relative" }}>
            <CustomAvatar config={getAvatar(chat.avatarKey)} size={38} />
            <span
              style={{
                position: "absolute",
                bottom: -1,
                right: -1,
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#2f9e44",
                border: "2px solid #ffffff",
              }}
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: 900,
                  color: "#111215",
                  letterSpacing: "-0.01em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {chat.buddyName}
              </h1>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 800,
                  padding: "1px 6px",
                  borderRadius: "99px",
                  background: "#ebfbee",
                  color: "#2b8a3e",
                }}
              >
                Friend ✓
              </span>
            </div>
            <span
              style={{
                fontSize: "10px",
                color: "#666",
                fontWeight: 600,
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {chat.statusMsg || chat.subtitle}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          style={{
            padding: "6px 11px",
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
          🤝 Invite Event
        </button>
      </div>

      {/* Direct Chat Banner: Match Context */}
      <div
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #edebe3",
          padding: "7px 14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "13px" }}>✨</span>
        <span style={{ fontSize: "10px", color: "#555", fontWeight: 600 }}>
          You and <strong>{chat.buddyName}</strong> matched on: {chat.subtitle}
        </span>
      </div>

      {/* Messages Feed */}
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
            Direct 1-on-1 Chat with {chat.buddyName}
          </span>
        </div>

        {chat.messages.map((msg) => {
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

                {/* Event Invite Card */}
                {msg.eventInvite ? (
                  <div
                    style={{
                      background: isUser ? "#fef8e3" : "#ffffff",
                      borderRadius: "16px",
                      border: "1.5px solid #f5c842",
                      padding: "12px 14px",
                      width: "240px",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "16px" }}>🤝</span>
                      <strong style={{ fontSize: "10.5px", color: "#8c6500", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        {isUser ? "Event Invitation Sent" : "Invited You to Event"}
                      </strong>
                    </div>

                    <h4 style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 800, color: "#111215" }}>
                      {msg.eventInvite.title}
                    </h4>

                    <div style={{ fontSize: "10.5px", color: "#555", lineHeight: 1.4, marginBottom: "9px" }}>
                      <div>📅 {msg.eventInvite.date} · {msg.eventInvite.time}</div>
                      <div>📍 {msg.eventInvite.venue}</div>
                    </div>

                    <button
                      onClick={() => {
                        const matchedEv = events.find((e) => e.id === msg.eventInvite?.eventId);
                        if (matchedEv) {
                          onViewEvent(matchedEv);
                        }
                      }}
                      style={{
                        width: "100%",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        background: "#111215",
                        color: "#ffffff",
                        border: 0,
                        fontSize: "10.5px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                      type="button"
                    >
                      View & Join Together ›
                    </button>
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

      {/* Message Input Bar */}
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
          onClick={() => setShowInviteModal(true)}
          style={{
            background: "#fef8e3",
            border: "1px solid #f5c842",
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
          title="Invite buddy to an event"
          type="button"
        >
          🤝
        </button>

        <input
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${chat.buddyName}...`}
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

      {/* Invite Buddy to Event Modal */}
      {showInviteModal && (
        <div aria-modal="true" className="modal-backdrop" role="dialog">
          <div className="playful-sheet" style={{ maxWidth: "340px", width: "90%" }}>
            <button
              className="modal-close-pill"
              onClick={() => setShowInviteModal(false)}
              type="button"
            >
              ✕
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ fontSize: "22px" }}>🤝</span>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Invite {chat.buddyName}</h2>
            </div>
            <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#666" }}>
              Select an activity to invite {chat.buddyName} to attend together:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "260px", overflowY: "auto" }}>
              {events.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    background: "#fbfbfa",
                    border: "1.5px solid #edebe3",
                    borderRadius: "12px",
                    padding: "9px 11px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ minWidth: 0, paddingRight: "6px" }}>
                    <strong
                      style={{
                        fontSize: "11.5px",
                        display: "block",
                        color: "#111215",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ev.title}
                    </strong>
                    <span style={{ fontSize: "9.5px", color: "#777" }}>
                      {ev.date} · {ev.time}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onSendEventInvite(chat.buddyId, ev);
                      setShowInviteModal(false);
                    }}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "8px",
                      background: "#111215",
                      color: "#ffffff",
                      border: 0,
                      fontSize: "10.5px",
                      fontWeight: 800,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                    type="button"
                  >
                    Send Invite
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
