import React, { useState } from "react";
import { AvatarConfig, CustomAvatar } from "./Avatar";
import { CommunityData } from "./CommunityChatPage";
import { EventData } from "../App";

interface CommunitiesPageProps {
  communities: CommunityData[];
  events: EventData[];
  getAvatar: (key?: string) => AvatarConfig;
  onToggleJoinCommunity: (communityId: string) => void;
  onOpenCommunityChat: (community: CommunityData) => void;
  onOpenEvent: (event: EventData) => void;
  onHostEventForCommunity: (category: string) => void;
  onOpenPhotoWall: () => void;
}

export function CommunitiesPage({
  communities,
  events,
  getAvatar,
  onToggleJoinCommunity,
  onOpenCommunityChat,
  onOpenEvent,
  onHostEventForCommunity,
  onOpenPhotoWall,
}: CommunitiesPageProps) {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const hashtagFilters = ["All", "#Sports", "#Running", "#Women-Only", "#Hobbies", "#Carpool", "#Social"];

  const filteredCommunities = communities.filter((c) => {
    const matchesTag =
      selectedTag === "All" ||
      c.hashtag.toLowerCase() === selectedTag.toLowerCase() ||
      c.category.toLowerCase() === selectedTag.replace("#", "").toLowerCase();

    const matchesSearch =
      searchQuery.trim() === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hashtag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sharedResource.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTag && matchesSearch;
  });

  return (
    <div style={{ paddingTop: "6px", paddingBottom: "24px" }}>
      {/* Screen Header */}
      <div className="screen-header" style={{ alignItems: "flex-start", marginBottom: "8px" }}>
        <div>
          <h1 className="screen-title" style={{ fontSize: "22px", fontWeight: 900, margin: 0 }}>
            Communities
          </h1>
          <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#666", fontWeight: 600 }}>
            Connect by hashtags, access shared township resources & chat
          </p>
        </div>

        <button
          onClick={onOpenPhotoWall}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "5px 10px",
            borderRadius: "99px",
            border: "1.5px solid #111215",
            background: "#ffffff",
            color: "#111215",
            fontSize: "11px",
            fontWeight: 800,
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          }}
          type="button"
        >
          <span>📸</span> Photo Wall
        </button>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: "12px", position: "relative" }}>
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by community or #hashtag..."
          style={{
            width: "100%",
            padding: "9px 14px",
            borderRadius: "14px",
            border: "1.5px solid #dedad0",
            background: "#ffffff",
            fontSize: "11.5px",
            color: "#111215",
            outline: "none",
            boxSizing: "border-box",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
          type="text"
          value={searchQuery}
        />
      </div>

      {/* Hashtag Filter Chips */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          overflowX: "auto",
          paddingBottom: "8px",
          marginBottom: "14px",
          scrollbarWidth: "none",
        }}
      >
        {hashtagFilters.map((tag) => {
          const isActive = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              style={{
                padding: "5px 11px",
                borderRadius: "99px",
                border: isActive ? "1.5px solid #111215" : "1px solid #dcd8cf",
                background: isActive ? "#111215" : "#ffffff",
                color: isActive ? "#ffffff" : "#444444",
                fontSize: "10.5px",
                fontWeight: 800,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
              type="button"
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Communities Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {filteredCommunities.map((community) => {
          // Find upcoming events organized for this community's category
          const relatedEvents = events.filter((e) => {
            if (community.category === "Women-Only") {
              return e.isWomenOnly || e.category === "Women-Only";
            }
            if (community.category === "Running") {
              return e.category === "Sports" && e.title.toLowerCase().includes("jog");
            }
            return e.category === community.category;
          });

          return (
            <div
              key={community.id}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                border: community.isJoined ? `2px solid ${community.themeColor}` : "1.5px solid #e7e4dc",
                padding: "15px",
                boxShadow: community.isJoined
                  ? `0 4px 16px ${community.themeColor}22`
                  : "0 3px 10px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "11px",
                boxSizing: "border-box",
                transition: "all 0.15s ease",
              }}
            >
              {/* Card Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "14px",
                      background: community.bgLight,
                      border: `1.5px solid ${community.borderLight}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                      flexShrink: 0,
                    }}
                  >
                    {community.sticker}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: "9.5px",
                          fontWeight: 800,
                          color: community.themeColor,
                          background: community.bgLight,
                          padding: "1px 7px",
                          borderRadius: "99px",
                          border: `1px solid ${community.borderLight}`,
                        }}
                      >
                        {community.hashtag}
                      </span>
                      <span style={{ fontSize: "9.5px", color: "#777", fontWeight: 700 }}>
                        {community.badge}
                      </span>
                    </div>

                    <h2
                      style={{
                        margin: "3px 0 0",
                        fontSize: "15.5px",
                        fontWeight: 900,
                        color: "#111215",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.25,
                      }}
                    >
                      {community.name}
                    </h2>
                  </div>
                </div>

                {/* Lead avatar stack & member count */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <CustomAvatar config={getAvatar(community.leadAvatarKey)} size={26} />
                    <span style={{ fontSize: "9.5px", fontWeight: 800, color: "#444" }}>
                      {community.leadName} (Lead)
                    </span>
                  </div>
                  <span style={{ fontSize: "9px", color: "#888", marginTop: "2px" }}>
                    👥 {community.memberCount} members
                  </span>
                </div>
              </div>

              {/* Description */}
              <p style={{ margin: 0, fontSize: "11px", color: "#555", lineHeight: 1.4 }}>
                {community.description}
              </p>

              {/* Shared Resource Banner */}
              <div
                style={{
                  background: community.bgLight,
                  borderRadius: "12px",
                  padding: "8px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  border: `1px solid ${community.borderLight}`,
                }}
              >
                <span style={{ fontSize: "14px" }}>📦</span>
                <span style={{ fontSize: "10px", color: "#333", fontWeight: 600, lineHeight: 1.3 }}>
                  <strong style={{ color: "#111" }}>Township Resource:</strong> {community.sharedResource}
                </span>
              </div>

              {/* Community Actions Row */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  onClick={() => onToggleJoinCommunity(community.id)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "11px",
                    border: community.isJoined ? "1.5px solid #2f9e44" : "1.5px solid #111215",
                    background: community.isJoined ? "#ebfbee" : "#111215",
                    color: community.isJoined ? "#2b8a3e" : "#ffffff",
                    fontSize: "11px",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    transition: "all 0.15s ease",
                  }}
                  type="button"
                >
                  {community.isJoined ? "✓ Joined Community" : "+ Join Community"}
                </button>

                <button
                  onClick={() => onOpenCommunityChat(community)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "11px",
                    border: "1.5px solid #e7e4dc",
                    background: "#f8f7f2",
                    color: "#111215",
                    fontSize: "11px",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    flexShrink: 0,
                  }}
                  type="button"
                >
                  <span>💬</span> Chat
                  <span
                    style={{
                      background: "#111215",
                      color: "#fff",
                      fontSize: "9px",
                      borderRadius: "99px",
                      padding: "1px 5px",
                      fontWeight: 700,
                    }}
                  >
                    {community.chatHistory.length}
                  </span>
                </button>
              </div>

              {/* Related Events Under this Community */}
              <div
                style={{
                  borderTop: "1px solid #f0eee6",
                  paddingTop: "9px",
                  marginTop: "2px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 800, color: "#666" }}>
                    ACTIVITIES UNDER {community.hashtag.toUpperCase()}
                  </span>
                  <button
                    onClick={() => onHostEventForCommunity(community.category)}
                    style={{
                      background: "none",
                      border: 0,
                      color: "#d9480f",
                      fontSize: "10px",
                      fontWeight: 800,
                      cursor: "pointer",
                      padding: 0,
                    }}
                    type="button"
                  >
                    + Organise
                  </button>
                </div>

                {relatedEvents.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {relatedEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => onOpenEvent(ev)}
                        style={{
                          background: "#fbfbfa",
                          border: "1px solid #edebe3",
                          borderRadius: "12px",
                          padding: "8px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          transition: "background 0.15s ease",
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
                            {ev.date} · {ev.time} · {ev.venue}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEvent(ev);
                          }}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "8px",
                            background: "#f5c842",
                            color: "#111215",
                            border: 0,
                            fontSize: "10px",
                            fontWeight: 800,
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                          type="button"
                        >
                          View ›
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "8px 10px",
                      borderRadius: "10px",
                      background: "#f9f8f4",
                      border: "1px dashed #dedad0",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "10px", color: "#777", fontWeight: 600 }}>
                      No active events right now.
                    </span>{" "}
                    <button
                      onClick={() => onHostEventForCommunity(community.category)}
                      style={{
                        background: "none",
                        border: 0,
                        color: "#d9480f",
                        fontSize: "10px",
                        fontWeight: 800,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      type="button"
                    >
                      Host one!
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
