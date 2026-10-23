import React, { useState } from "react";
import { EventData, Buddy } from "../App";
import { AvatarConfig, CustomAvatar } from "./Avatar";
import { getAIMatches, registerForActivity } from "../services/api";

interface EventDetailsPageProps {
  event: EventData;
  buddies: Buddy[];
  onBack: () => void;
  onOpenChat: () => void;
  onRegisterEvent: (event: EventData) => void;
  onUnregisterEvent?: (event: EventData) => void;
  getAvatar: (avatarKey?: string) => AvatarConfig;
}

export function EventDetailsPage({
  event,
  buddies,
  onBack,
  onOpenChat,
  onRegisterEvent,
  onUnregisterEvent,
  getAvatar,
}: EventDetailsPageProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [showRegisteredModal, setShowRegisteredModal] = useState(false);
  const [invitedBuddyIds, setInvitedBuddyIds] = useState<number[]>([]);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Matching States
  const [aiMatches, setAiMatches] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleTriggerAIMatch = async () => {
    if (!event?.id) return;
    setIsMatching(true);
    showToast("Gemini AI is analyzing community profiles...");
    try {
      const result = await getAIMatches(String(event.id));
      if (result && result.matchedBuddies) {
        setAiMatches(result.matchedBuddies);
        showToast("✨ AI Matches found!");
      } else if (result && Array.isArray(result)) {
        setAiMatches(result);
        showToast("✨ AI Matches found!");
      } else {
        showToast("No AI matches found for this activity.");
      }
    } catch (err) {
      console.error("AI Match Error:", err);
      showToast("Could not fetch AI matches.");
    } finally {
      setIsMatching(false);
    }
  };

  const isAlexJoined =
    event.attendeeKeys?.includes("alex") || event.host.toLowerCase().includes("alex");
  const isHost = event.host.toLowerCase().includes("alex");

  const categoryThemes: Record<string, { bg: string; color: string; border: string }> = {
    Sports: { bg: "#fef8e3", color: "#8c6500", border: "#f5c842" },
    Social: { bg: "#fef3e7", color: "#b34e00", border: "#f28b24" },
    Hobbies: { bg: "#f4effe", color: "#5c32b6", border: "#ba9cfc" },
    Carpool: { bg: "#eef5ff", color: "#1864ab", border: "#3d8bfd" },
    "Women-Only": { bg: "#fef0ef", color: "#c92a2a", border: "#f36458" },
  };

  const theme = categoryThemes[event.category] || categoryThemes.Sports;

  const handleAddToCalendar = () => {
    try {
      const icsLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//NeighbourBuddy//Township Events//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${(event.description || event.title).replace(/\n/g, " ")}`,
        `LOCATION:${event.venue}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
      ];
      const icsString = icsLines.join("\r\n");
      const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setCalendarAdded(true);
      showToast(`Added "${event.title}" to your calendar!`);
    } catch {
      setCalendarAdded(true);
      showToast("Event added to your calendar!");
    }
  };

  const handleInviteBuddy = (buddy: Buddy) => {
    if (invitedBuddyIds.includes(buddy.id)) return;
    setInvitedBuddyIds([...invitedBuddyIds, buddy.id]);
    showToast(`Invitation sent to ${buddy.name}!`);
  };

  const neighbourNameMap: Record<string, string> = {
    alex: "Alex (You)",
    sarah: "Sarah",
    jamie: "Jamie",
    daniel: "Daniel",
    emily: "Emily",
    priya: "Priya",
    michelle: "Michelle",
  };

  const buddyMap = new Map<string, Buddy>();
  buddies.forEach((b) => buddyMap.set(b.avatarKey.toLowerCase(), b));

  const rawAttendeeKeys = Array.from(
    new Set([
      event.hostAvatarKey || (isHost ? "alex" : ""),
      ...(event.attendeeKeys || []),
    ].filter(Boolean))
  );

  const fullAttendees = rawAttendeeKeys.map((key) => {
    const isAlex = key === "alex";
    const hostMatch = key === event.hostAvatarKey || event.host.toLowerCase().includes(key);
    const buddy = buddyMap.get(key.toLowerCase());
    const isFriend = Boolean(buddy?.isFriend);
    const name = buddy?.name || neighbourNameMap[key] || (isAlex ? "Alex (You)" : key.charAt(0).toUpperCase() + key.slice(1));

    return {
      key,
      name,
      isHost: hostMatch,
      isYou: isAlex,
      isFriend,
    };
  });

  const someoneYouKnow = fullAttendees.filter(
    (a) => !a.isYou && (a.isFriend || a.isHost || buddyMap.has(a.key))
  ).slice(0, 3);

  const previewAttendees = someoneYouKnow.length > 0 ? someoneYouKnow : fullAttendees.slice(0, 2);
  const othersCount = Math.max(0, event.joined - previewAttendees.length);

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
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: "absolute",
            top: "55px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111215",
            color: "#ffffff",
            padding: "9px 18px",
            borderRadius: "99px",
            fontSize: "11.5px",
            fontWeight: 800,
            zIndex: 100,
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            whiteSpace: "nowrap",
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Status Bar */}
      <div className="status-bar light-theme">
        <span>9:41</span>
        <div className="status-icons">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Top Navigation Bar */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
          <span style={{ fontSize: "14px", fontWeight: 800, color: "#111215" }}>
            Event Details
          </span>
        </div>

        {isAlexJoined && (
          <button
            onClick={onOpenChat}
            style={{
              padding: "5px 12px",
              borderRadius: "9px",
              background: "#f5c842",
              color: "#111215",
              border: 0,
              fontSize: "11px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            type="button"
          >
            Group Chat & Polls ›
          </button>
        )}
      </div>

      {/* Scrollable Event Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxSizing: "border-box",
        }}
      >
        {/* Main Event Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            border: "1.5px solid #e7e4dc",
            padding: "16px",
            boxShadow: "0 3px 12px rgba(0, 0, 0, 0.04)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 900,
              color: "#111215",
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
            }}
          >
            {event.title}
          </h1>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "-2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: 800,
                  padding: "2px 7px",
                  borderRadius: "6px",
                  background: theme.bg,
                  color: theme.color,
                  border: `1px solid ${theme.border}`,
                }}
              >
                #{event.category}
              </span>
              {isHost ? (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: "#111215",
                    color: "#ffffff",
                  }}
                >
                  Hosting
                </span>
              ) : isAlexJoined ? (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: "#eaf8f0",
                    color: "#197142",
                    border: "1px solid #38b776",
                  }}
                >
                  ✓ Registered
                </span>
              ) : (
                <span
                  style={{
                    fontSize: "9.5px",
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: "#f0eee6",
                    color: "#666",
                  }}
                >
                  Open for Registration
                </span>
              )}
            </div>

            <span style={{ fontSize: "11px", fontWeight: 700, color: "#666" }}>
              {event.joined}/{event.spots >= 900 ? "∞" : event.spots + event.joined} spots
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 12px",
              background: "#fbfaf7",
              borderRadius: "12px",
              border: "1px solid #ede9e0",
            }}
          >
            <span style={{ color: "#777", fontWeight: 600, fontSize: "11.5px" }}>
              Organised by
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CustomAvatar
                config={getAvatar(
                  event.hostAvatarKey || (isHost ? "alex" : "user")
                )}
                size={24}
              />
              <strong style={{ color: "#111215", fontWeight: 800, fontSize: "12.5px" }}>
                {event.host}
              </strong>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "8px",
              background: "#f9f8f5",
              borderRadius: "14px",
              padding: "12px",
              fontSize: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "#777", fontWeight: 700, minWidth: "85px" }}>Date & Time:</span>
              <div>
                <strong style={{ color: "#111215" }}>{event.date}</strong>
                <span style={{ color: "#bbb", margin: "0 5px" }}>·</span>
                <strong style={{ color: "#d9480f" }}>{event.time}</strong>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "#777", fontWeight: 700, minWidth: "85px" }}>Location:</span>
              <strong style={{ color: "#111215" }}>{event.venue}</strong>
            </div>

            {event.skillTag && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "#777", fontWeight: 700, minWidth: "85px" }}>Level / Tier:</span>
                <span style={{ color: "#333", fontWeight: 700 }}>{event.skillTag}</span>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "#777", fontWeight: 700, minWidth: "85px" }}>Capacity:</span>
              <span style={{ color: "#333", fontWeight: 700 }}>
                {event.joined} joined · {event.spots >= 900 ? "Unlimited capacity" : `${event.spots} spots remaining`}
              </span>
            </div>
          </div>
        </div>

        {/* REGISTRATION SECTION */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            border: isAlexJoined ? "1.5px solid #2e9a59" : "1.5px solid #f5c842",
            padding: "16px",
            boxShadow: isAlexJoined
              ? "0 4px 14px rgba(46, 154, 89, 0.12)"
              : "0 4px 14px rgba(245, 200, 66, 0.18)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <strong style={{ fontSize: "14px", color: "#111215", display: "block", fontWeight: 900 }}>
                {isAlexJoined
                  ? (isHost ? "You're hosting this event" : "You're registered for this event")
                  : "Ready to participate?"}
              </strong>
              <span style={{ fontSize: "11px", color: "#666", fontWeight: 600 }}>
                {isAlexJoined
                  ? "Spot secured · Full group chat & poll access unlocked"
                  : "Register to secure your spot and access the group chat"}
              </span>
            </div>

            {isAlexJoined && !isHost && onUnregisterEvent && (
              <button
                onClick={() => {
                  onUnregisterEvent(event);
                  showToast("Registration cancelled.");
                }}
                style={{
                  background: "none",
                  border: "1px solid #dcd8ce",
                  borderRadius: "8px",
                  color: "#888",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  cursor: "pointer",
                }}
                type="button"
              >
                Cancel
              </button>
            )}
          </div>

          {!isAlexJoined ? (
            <button
              onClick={async () => {
                // 🚀 1. Send live POST request to Express backend
                await registerForActivity(String(event.id));

                // 2. Update React local state and open pop-up modal
                onRegisterEvent(event);
                setShowRegisteredModal(true);
              }}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "14px",
                background: "var(--folder-yellow, #f5c842)",
                color: "#111215",
                border: 0,
                fontSize: "13.5px",
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(245, 200, 66, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginTop: "4px",
              }}
              type="button"
            >
              Register Event
            </button>
          ) : (
            <div
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "14px",
                background: "#2e9a59",
                color: "#ffffff",
                fontSize: "13.5px",
                fontWeight: 900,
                cursor: "default",
                userSelect: "none",
                boxShadow: "0 2px 8px rgba(46, 154, 89, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginTop: "4px",
                boxSizing: "border-box",
              }}
            >
              <span>✓</span>
              <span>Registered</span>
            </div>
          )}
        </div>

        {/* GEMINI AI "FILL-A-SPOT" RESIDENT MATCHING SECTION */}
        <div
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #fef8e3 100%)",
            borderRadius: "18px",
            border: "1.5px solid #f5c842",
            padding: "16px",
            boxShadow: "0 4px 12px rgba(245, 200, 66, 0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "16px" }}>✨</span>
              <strong style={{ fontSize: "13.5px", fontWeight: 900, color: "#111215" }}>
                Gemini AI Resident Matching
              </strong>
            </div>
            <span
              style={{
                fontSize: "9.5px",
                fontWeight: 800,
                background: "#111215",
                color: "#f5c842",
                padding: "2px 6px",
                borderRadius: "5px",
              }}
            >
              Gemini 2.5
            </span>
          </div>

          <p style={{ margin: 0, fontSize: "11px", color: "#555", lineHeight: 1.4 }}>
            Let AI find the best matching local residents to fill open spot(s) based on skill levels, schedule, and interests.
          </p>

          <button
            onClick={handleTriggerAIMatch}
            disabled={isMatching}
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1.5px solid #111215",
              background: isMatching ? "#e7e4dc" : "#111215",
              color: isMatching ? "#666" : "#ffffff",
              fontSize: "12px",
              fontWeight: 800,
              cursor: isMatching ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
            type="button"
          >
            {isMatching ? "✨ AI Analyzing Profiles..." : "✨ Find Matching Buddies with AI"}
          </button>

          {/* AI Match Results Display */}
          {aiMatches.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#8c6500" }}>
                Top Recommended Matches:
              </span>
              {aiMatches.map((match: any, i: number) => (
                <div
                  key={i}
                  style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #f5c842",
                    padding: "10px 12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "12px", color: "#111215" }}>
                      {match.name || match.residentName || `Resident Match #${i + 1}`}
                    </strong>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 900,
                        background: "#eaf8f0",
                        color: "#197142",
                        padding: "2px 6px",
                        borderRadius: "6px",
                      }}
                    >
                      {match.matchScore || match.match_percentage || "92%"} Match
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "10.5px", color: "#666", lineHeight: 1.35 }}>
                    {match.reason || match.match_reason || "Great skill alignment and mutual activity preferences."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WHO'S GOING SECTION */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            border: "1.5px solid #e7e4dc",
            padding: "16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
            display: "flex",
            flexDirection: "column",
            gap: "11px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 900, color: "#111215" }}>
                Who's Going
              </h2>
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: 800,
                  background: isAlexJoined ? "#eaf8f0" : "#fef8e3",
                  color: isAlexJoined ? "#197142" : "#8c6500",
                  padding: "2px 7px",
                  borderRadius: "6px",
                  border: isAlexJoined ? "1px solid #38b776" : "1px solid #f5c842",
                }}
              >
                {event.joined} {isAlexJoined ? "Confirmed" : "Going"}
              </span>
            </div>

            <span style={{ fontSize: "11px", color: "#777", fontWeight: 600 }}>
              {event.spots >= 900 ? "Unlimited capacity" : `${event.spots} spots left`}
            </span>
          </div>

          {isAlexJoined ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {fullAttendees.map((attendee) => (
                <div
                  key={attendee.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 10px",
                    borderRadius: "12px",
                    background: attendee.isYou ? "#fef8e3" : "#f9f8f5",
                    border: attendee.isYou ? "1px solid #f5c842" : "1px solid #ede9e0",
                  }}
                >
                  <CustomAvatar config={getAvatar(attendee.key)} size={30} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 800,
                        color: "#111215",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {attendee.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "1px" }}>
                      {attendee.isHost ? (
                        <span style={{ fontSize: "9px", fontWeight: 800, color: "#8c6500" }}>Host</span>
                      ) : attendee.isYou ? (
                        <span style={{ fontSize: "9px", fontWeight: 800, color: "#197142" }}>You</span>
                      ) : attendee.isFriend ? (
                        <span style={{ fontSize: "9px", fontWeight: 800, color: "#d9480f" }}>Buddy</span>
                      ) : (
                        <span style={{ fontSize: "9px", fontWeight: 600, color: "#777" }}>Neighbour</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "#fbfaf7",
                borderRadius: "14px",
                border: "1px solid #ede9e0",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "9px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#555" }}>
                  Someone you know attending:
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 800,
                    background: "#fef8e3",
                    color: "#8c6500",
                    padding: "2px 6px",
                    borderRadius: "5px",
                    border: "1px solid #f5c842",
                  }}
                >
                  {previewAttendees.length} Connected
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
                {previewAttendees.map((p) => (
                  <div
                    key={p.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#ffffff",
                      padding: "4px 9px 4px 5px",
                      borderRadius: "99px",
                      border: "1px solid #dedad0",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                    }}
                  >
                    <CustomAvatar config={getAvatar(p.key)} size={22} />
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#111215" }}>
                      {p.name}
                    </span>
                    {p.isFriend && (
                      <span style={{ fontSize: "8.5px", color: "#d9480f", fontWeight: 800 }}>Buddy</span>
                    )}
                    {p.isHost && (
                      <span style={{ fontSize: "8.5px", color: "#8c6500", fontWeight: 800 }}>Host</span>
                    )}
                  </div>
                ))}

                {othersCount > 0 && (
                  <div
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      color: "#777",
                      padding: "3px 6px",
                    }}
                  >
                    + {othersCount} other neighbours
                  </div>
                )}
              </div>

              <p style={{ margin: "2px 0 0", fontSize: "10.5px", color: "#888", fontWeight: 500 }}>
                Register to view the complete attendee roster and connect in group chat.
              </p>
            </div>
          )}
        </div>

        {/* About Event Section */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            border: "1.5px solid #e7e4dc",
            padding: "15px 16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
          }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "13.5px",
              fontWeight: 800,
              color: "#111215",
              letterSpacing: "-0.01em",
            }}
          >
            About Event
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "12.5px",
              color: "#444",
              lineHeight: 1.55,
              fontWeight: 500,
            }}
          >
            {event.description ||
              "Join us for this community event in Elmina! Meet your township neighbours, stay active, and connect."}
          </p>
        </div>

        {/* Action Buttons: Add to Calendar & Invite Friend */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <button
            onClick={handleAddToCalendar}
            style={{
              padding: "12px 14px",
              borderRadius: "14px",
              border: "1.5px solid #dedad0",
              background: calendarAdded ? "#eaf8f0" : "#ffffff",
              color: calendarAdded ? "#197142" : "#111215",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
            type="button"
          >
            <span>{calendarAdded ? "✓ Added" : "+ Calendar"}</span>
          </button>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            style={{
              padding: "12px 14px",
              borderRadius: "14px",
              border: "1.5px solid #dedad0",
              background: "#ffffff",
              color: "#111215",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
            type="button"
          >
            <span>+ Invite Friend</span>
          </button>
        </div>
      </div>

      {/* INVITE FRIEND MODAL */}
      {isInviteModalOpen && (
        <div
          aria-modal="true"
          className="modal-backdrop"
          onClick={() => setIsInviteModalOpen(false)}
          role="dialog"
          style={{ zIndex: 100 }}
        >
          <div
            className="playful-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            <button
              className="modal-close-pill"
              onClick={() => setIsInviteModalOpen(false)}
              type="button"
            >
              ✕
            </button>

            <h2 style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 800, color: "#111215" }}>
              Invite Friends to Event
            </h2>
            <p style={{ margin: "0 0 14px", fontSize: "11.5px", color: "#666", fontWeight: 600 }}>
              Invite your township buddies to join {event.title}.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              {buddies.map((buddy) => {
                const isInvited = invitedBuddyIds.includes(buddy.id);

                return (
                  <div
                    key={buddy.id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      border: "1.5px solid #eae7de",
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                      <CustomAvatar config={getAvatar(buddy.avatarKey)} size={34} />
                      <div>
                        <strong style={{ fontSize: "12.5px", color: "#111215", display: "block" }}>
                          {buddy.name}
                        </strong>
                        <span style={{ fontSize: "10.5px", color: "#777", fontWeight: 600 }}>
                          {buddy.interests.join(" · ")}
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={isInvited}
                      onClick={() => handleInviteBuddy(buddy)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "99px",
                        border: 0,
                        background: isInvited ? "#eaf8f0" : "#111215",
                        color: isInvited ? "#197142" : "#ffffff",
                        fontSize: "11px",
                        fontWeight: 800,
                        cursor: isInvited ? "default" : "pointer",
                        transition: "all 0.15s ease",
                      }}
                      type="button"
                    >
                      {isInvited ? "Invited ✓" : "Invite"}
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsInviteModalOpen(false)}
              style={{
                marginTop: "14px",
                width: "100%",
                padding: "10px",
                borderRadius: "12px",
                border: "1.5px solid #dedad0",
                background: "#ffffff",
                color: "#111215",
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer",
              }}
              type="button"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* POST-REGISTRATION POP-OUT MODAL */}
      {showRegisteredModal && (
        <div
          aria-modal="true"
          className="modal-backdrop"
          onClick={() => setShowRegisteredModal(false)}
          role="dialog"
          style={{ zIndex: 120 }}
        >
          <div
            className="playful-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{ textAlign: "center", padding: "24px 20px 20px" }}
          >
            <button
              className="modal-close-pill"
              onClick={() => setShowRegisteredModal(false)}
              type="button"
            >
              ✕
            </button>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "99px",
                background: "#fef8e3",
                color: "#8c6500",
                border: "1.5px solid #f5c842",
                fontSize: "13px",
                fontWeight: 900,
                boxShadow: "0 2px 8px rgba(245, 200, 66, 0.25)",
                marginBottom: "12px",
              }}
            >
              <span>🎉</span>
              <span>+20 Community Points Earned!</span>
            </div>

            <h2 style={{ margin: "2px 0 6px", fontSize: "19px", fontWeight: 900, color: "#111215" }}>
              Registered Successfully!
            </h2>
            <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#666", lineHeight: 1.45 }}>
              You have secured your spot for <strong>{event.title}</strong>.
            </p>

            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1.5px solid #f5c842",
                padding: "14px 16px",
                marginBottom: "16px",
                textAlign: "left",
                boxShadow: "0 4px 14px rgba(245, 200, 66, 0.16)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span style={{ fontSize: "16px" }}>💬</span>
                  <strong style={{ fontSize: "13px", color: "#111215", fontWeight: 800 }}>
                    Group Chat & Polls Unlocked
                  </strong>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    background: "#eaf8f0",
                    color: "#197142",
                    padding: "2px 7px",
                    borderRadius: "6px",
                    border: "1px solid #38b776",
                  }}
                >
                  ✓ Ready
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "11.5px", color: "#666", lineHeight: 1.45 }}>
                Connect with {event.host} and participants, discuss arrangements, and vote on polls.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={() => {
                  setShowRegisteredModal(false);
                  onOpenChat();
                }}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "14px",
                  background: "var(--folder-yellow, #f5c842)",
                  color: "#111215",
                  border: 0,
                  fontSize: "13.5px",
                  fontWeight: 900,
                  cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(245, 200, 66, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
                type="button"
              >
                Open Group Chat Now ›
              </button>

              <button
                onClick={() => setShowRegisteredModal(false)}
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: "14px",
                  border: "1.5px solid #dedad0",
                  background: "#ffffff",
                  color: "#111215",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
                type="button"
              >
                Stay on Event Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetailsPage;