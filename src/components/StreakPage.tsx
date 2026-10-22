import React, { useState } from "react";
import { FlameMascot, DayFlameBadge } from "./StreakModal";

export function StreakPage({
  onBack,
  streak = 6,
  points = 390,
  checkedIn = true,
  onCheckIn,
}: {
  onBack: () => void;
  streak: number;
  points: number;
  checkedIn: boolean;
  onCheckIn: () => void;
}) {
  const weekDays = [
    { name: "Su", dayNum: 1, active: streak >= 1 },
    { name: "Mo", dayNum: 2, active: streak >= 2 },
    { name: "Tu", dayNum: 3, active: streak >= 3 },
    { name: "We", dayNum: 4, active: streak >= 4 },
    { name: "Th", dayNum: 5, active: streak >= 5 },
    { name: "Fr", dayNum: 6, active: streak >= 6, isToday: streak === 6 },
    { name: "Sa", dayNum: 7, active: streak >= 7 },
  ];

  const milestones = [
    {
      days: 3,
      icon: "🔥",
      name: "Early Spark",
      reward: "+20 Community Pts",
      description: "Consistent 3-day township check-in. The habit is forming!",
      unlocked: streak >= 3,
    },
    {
      days: 7,
      icon: "🏸",
      name: "Township Explorer",
      reward: "+50 Pts & Court Priority",
      description: "One full week active! Certified township regular.",
      unlocked: streak >= 7,
    },
    {
      days: 14,
      icon: "☕",
      name: "Kopi Master",
      reward: "Free Kopi / Smoothie Coupon",
      description: "Two weeks strong. Enjoy a morning brew at Central Cafe!",
      unlocked: streak >= 14,
    },
    {
      days: 30,
      icon: "👑",
      name: "Township MVP",
      reward: "MVP Crown & 1-Hr Court Pass",
      description: "30-Day streak legend! Sime Darby community champion.",
      unlocked: streak >= 30,
    },
  ];

  const [selectedMilestone, setSelectedMilestone] = useState<number>(() => {
    const nextLocked = milestones.find((m) => !m.unlocked);
    return nextLocked ? nextLocked.days : 7;
  });

  const activeMilestoneItem =
    milestones.find((m) => m.days === selectedMilestone) || milestones[1];

  return (
    <div
      className="streak-native-page"
      style={{
        background: "linear-gradient(180deg, #ff922b 0%, #ffa94d 22%, #fffaf5 48%, #ffffff 80%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "none",
        userSelect: "none",
      }}
    >
      {/* Top Status Bar matching Native iPhone Screen */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px 4px",
          fontSize: "12px",
          fontWeight: 800,
          color: "#ffffff",
          position: "relative",
          zIndex: 10,
        }}
      >
        <span>9:41</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>📶</span>
          <span>5G</span>
          <span>100% 🔋</span>
        </div>
      </div>

      {/* Page Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 18px 12px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "26px",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.5px",
          }}
        >
          Streak
        </h1>

        {/* Circular Back/Close button returning directly to app home */}
        <button
          aria-label="Back to home"
          onClick={onBack}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.95)",
            border: "1px solid rgba(0,0,0,0.08)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            fontWeight: 900,
            fontSize: "14px",
            color: "#333",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            transition: "transform 0.15s ease",
          }}
          type="button"
        >
          ✕
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div
        style={{
          flex: 1,
          padding: "0 16px 20px",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Hero Mascot Flame + Big Number */}
        <div style={{ textAlign: "center", padding: "6px 0 16px" }}>
          <FlameMascot isPulsing={true} size={98} />

          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "#e65100",
              lineHeight: 1,
              marginTop: "4px",
              letterSpacing: "-2px",
            }}
          >
            {streak}
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 800,
              color: "#b23b00",
              marginTop: "4px",
              letterSpacing: "0.2px",
            }}
          >
            days streak!
          </div>
        </div>

        {/* 7-Day Flame Calendar Tracker Card */}
        <div
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "14px 10px",
            boxShadow: "0 4px 18px rgba(255, 122, 0, 0.08)",
            border: "1px solid #ffe8cc",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              textAlign: "center",
            }}
          >
            {weekDays.map((d) => (
              <DayFlameBadge
                dayName={d.name}
                dayNum={d.dayNum}
                isActive={d.active}
                isToday={d.isToday}
                key={d.name}
              />
            ))}
          </div>
        </div>

        {/* Claim / Check-In Action Button (Moved on top of streak challenge) */}
        <button
          disabled={checkedIn}
          onClick={onCheckIn}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "18px",
            border: 0,
            background: checkedIn
              ? "#e4e4e7"
              : "linear-gradient(135deg, #ff922b 0%, #fa5252 100%)",
            color: checkedIn ? "#71717a" : "white",
            fontSize: "13.5px",
            fontWeight: 900,
            cursor: checkedIn ? "default" : "pointer",
            boxShadow: checkedIn ? "none" : "0 6px 20px rgba(255, 107, 74, 0.38)",
            transition: "transform 0.15s ease",
            marginBottom: "16px",
          }}
          type="button"
        >
          {checkedIn
            ? "Checked in 🔥"
            : "Check In for Today (+10 pts) 🔥"}
        </button>

        {/* Streak Challenge Section */}
        <div style={{ marginBottom: "16px" }}>
          <h2
            style={{
              margin: "0 0 8px 4px",
              fontSize: "14.5px",
              fontWeight: 800,
              color: "#17181c",
              letterSpacing: "-0.2px",
            }}
          >
            Streak challenge
          </h2>

          <div
            style={{
              background: "white",
              borderRadius: "22px",
              padding: "16px",
              border: "1px solid #f1f1eb",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            }}
          >
            {/* Header: 14 days challenge / Day X of 14 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <strong style={{ fontSize: "13px", fontWeight: 800, color: "#17181c" }}>
                14 days challenge
              </strong>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#71717a" }}>
                Day {Math.min(streak, 14)} of 14
              </span>
            </div>

            {/* Striped Orange Progress Track with Milestone Badges */}
            <div style={{ position: "relative", marginBottom: "16px", paddingTop: "4px" }}>
              <div
                style={{
                  height: "14px",
                  background: "#f4f4f5",
                  borderRadius: "99px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, (streak / 14) * 100)}%`,
                    height: "100%",
                    background:
                      "repeating-linear-gradient(45deg, #ff7a00, #ff7a00 6px, #ff922b 6px, #ff922b 12px)",
                    borderRadius: "99px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>

              {/* Milestone Indicators exactly matching reference image */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "8px",
                  padding: "0 2px",
                }}
              >
                {/* Milestone 7 */}
                <div
                  style={{
                    padding: "3px 9px",
                    borderRadius: "7px",
                    border: streak >= 7 ? "1.5px solid #ff7a00" : "1px solid #e4e4e7",
                    background: streak >= 7 ? "#fff4e6" : "#fbfbfa",
                    color: streak >= 7 ? "#e65100" : "#a1a1aa",
                    fontSize: "11px",
                    fontWeight: 900,
                    minWidth: "26px",
                    textAlign: "center",
                  }}
                >
                  7
                </div>

                {/* Day 8 Circle Badge */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: streak >= 8 ? "2px solid #ff7a00" : "1.5px solid #d4d4d8",
                    background: streak >= 8 ? "#ff7a00" : "#ffffff",
                    color: streak >= 8 ? "#ffffff" : "#a1a1aa",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "11px",
                    fontWeight: 900,
                  }}
                >
                  8
                </div>

                {/* Milestone 14 */}
                <div
                  style={{
                    padding: "3px 9px",
                    borderRadius: "7px",
                    border: streak >= 14 ? "1.5px solid #ff7a00" : "1px solid #e4e4e7",
                    background: streak >= 14 ? "#fff4e6" : "#fbfbfa",
                    color: streak >= 14 ? "#e65100" : "#a1a1aa",
                    fontSize: "11px",
                    fontWeight: 900,
                    minWidth: "26px",
                    textAlign: "center",
                  }}
                >
                  14
                </div>

                {/* Milestone 30 */}
                <div
                  style={{
                    padding: "3px 9px",
                    borderRadius: "7px",
                    border: streak >= 30 ? "1.5px solid #ff7a00" : "1px solid #e4e4e7",
                    background: streak >= 30 ? "#fff4e6" : "#fbfbfa",
                    color: streak >= 30 ? "#e65100" : "#a1a1aa",
                    fontSize: "11px",
                    fontWeight: 900,
                    minWidth: "26px",
                    textAlign: "center",
                  }}
                >
                  30
                </div>
              </div>
            </div>

            {/* Split Stats Row: Streak Started & Streak Record */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                borderTop: "1px solid #f4f4f5",
                paddingTop: "12px",
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "12.5px", fontWeight: 900, color: "#18181b" }}>
                  Nov 15, 2025
                </div>
                <div style={{ fontSize: "10px", color: "#71717a", fontWeight: 600 }}>
                  Streak started
                </div>
              </div>
              <div style={{ borderLeft: "1px solid #f4f4f5" }}>
                <div style={{ fontSize: "12.5px", fontWeight: 900, color: "#18181b" }}>
                  11 days
                </div>
                <div style={{ fontSize: "10px", color: "#71717a", fontWeight: 600 }}>
                  Streak record
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Streak Milestones Showcase (Badges in a Row, Click to reveal badge name & rewards) */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              padding: "0 4px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "14.5px",
                fontWeight: 800,
                color: "#17181c",
                letterSpacing: "-0.2px",
              }}
            >
              Streak milestones
            </h2>
            <span style={{ fontSize: "10px", color: "#868e96", fontWeight: 700 }}>
              Tap badge to inspect 👆
            </span>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "22px",
              padding: "14px",
              border: "1px solid #f1f1eb",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            }}
          >
            {/* Badges Row (排在一起) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "6px",
              }}
            >
              {milestones.map((item) => {
                const isSelected = selectedMilestone === item.days;
                return (
                  <button
                    key={item.days}
                    onClick={() => setSelectedMilestone(item.days)}
                    style={{
                      background: item.unlocked
                        ? "linear-gradient(135deg, #fff9db 0%, #fff3bf 100%)"
                        : "#f8f9fa",
                      border: isSelected
                        ? "2px solid #ff7a00"
                        : item.unlocked
                          ? "1.5px solid #ffe066"
                          : "1.5px solid #e9ecef",
                      borderRadius: "16px",
                      padding: "8px 4px 6px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      transform: isSelected ? "translateY(-2px)" : "none",
                      boxShadow: isSelected
                        ? "0 6px 14px rgba(255, 122, 0, 0.22)"
                        : item.unlocked
                          ? "0 2px 6px rgba(255, 212, 59, 0.25)"
                          : "none",
                      transition: "all 0.16s ease",
                    }}
                    type="button"
                  >
                    {/* Badge Icon Circle */}
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: item.unlocked
                          ? "linear-gradient(135deg, #ffa94d 0%, #ff6b4a 100%)"
                          : "#e9ecef",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "20px",
                        boxShadow: item.unlocked
                          ? "0 2px 8px rgba(255, 107, 74, 0.35)"
                          : "none",
                        position: "relative",
                        filter: item.unlocked ? "none" : "grayscale(0.8) opacity(0.65)",
                      }}
                    >
                      <span>{item.icon}</span>
                      {!item.unlocked && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: -2,
                            right: -2,
                            fontSize: "10px",
                            background: "white",
                            borderRadius: "50%",
                            width: "16px",
                            height: "16px",
                            display: "grid",
                            placeItems: "center",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                          }}
                        >
                          🔒
                        </span>
                      )}
                    </div>

                    {/* Day Label */}
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 900,
                        color: item.unlocked ? "#d9480f" : "#495057",
                        marginTop: "5px",
                        lineHeight: 1.1,
                      }}
                    >
                      {item.days}d
                    </span>

                    {/* Status Dot / Check */}
                    <span
                      style={{
                        fontSize: "8.5px",
                        fontWeight: 800,
                        color: item.unlocked ? "#2b8a3e" : "#868e96",
                        marginTop: "2px",
                      }}
                    >
                      {item.unlocked ? "✓ Done" : `In ${Math.max(0, item.days - streak)}d`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detail Info Card Shown When Badge is Clicked (按了才讲这个是什么badge 名字) */}
            {activeMilestoneItem && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px 12px",
                  borderRadius: "14px",
                  background: activeMilestoneItem.unlocked ? "#fff9f2" : "#f8f9fa",
                  border: activeMilestoneItem.unlocked
                    ? "1.5px solid #ffe8cc"
                    : "1px solid #e9ecef",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "12px",
                      background: activeMilestoneItem.unlocked ? "#ffedd5" : "#e9ecef",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "20px",
                      flexShrink: 0,
                    }}
                  >
                    {activeMilestoneItem.icon}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <strong
                        style={{ fontSize: "12.5px", fontWeight: 800, color: "#18181b" }}
                      >
                        {activeMilestoneItem.name}
                      </strong>
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 800,
                          padding: "1px 6px",
                          borderRadius: "99px",
                          background: activeMilestoneItem.unlocked ? "#e6fcf5" : "#f1f3f5",
                          color: activeMilestoneItem.unlocked ? "#0ca678" : "#868e96",
                        }}
                      >
                        {activeMilestoneItem.unlocked
                          ? "Unlocked ✓"
                          : `${activeMilestoneItem.days}-Day Goal`}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "10.5px",
                        color: "#d9480f",
                        fontWeight: 700,
                        marginTop: "2px",
                      }}
                    >
                      🎁 {activeMilestoneItem.reward}
                    </div>
                    <div
                      style={{ fontSize: "9.5px", color: "#6c757d", marginTop: "1px" }}
                    >
                      {activeMilestoneItem.description}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "4px 8px",
                    borderRadius: "99px",
                    background: activeMilestoneItem.unlocked ? "#2b8a3e" : "#adb5bd",
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {activeMilestoneItem.unlocked ? "Claimed" : "Locked"}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* iPhone Native Home Indicator Bar */}
        <div
          style={{
            width: "134px",
            height: "5px",
            background: "#17181c",
            borderRadius: "100px",
            margin: "12px auto 0",
            opacity: 0.25,
          }}
        />
      </div>
    </div>
  );
}

export default StreakPage;
