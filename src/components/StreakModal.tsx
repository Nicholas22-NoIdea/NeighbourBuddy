import React, { useState } from "react";

export type StreakTheme = "sunset" | "golden" | "peach";

export function FlameMascot({
  size = 96,
  isPulsing = true,
}: {
  size?: number;
  isPulsing?: boolean;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-grid",
        placeItems: "center",
      }}
    >
      {/* Underlying glow aura */}
      <div
        style={{
          position: "absolute",
          width: size * 0.95,
          height: size * 0.38,
          bottom: 2,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(255, 122, 0, 0.45) 0%, rgba(255, 179, 0, 0) 72%)",
          filter: "blur(6px)",
        }}
      />

      <svg
        height={size}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          animation: isPulsing ? "avatar-breathe 2.6s ease-in-out infinite" : "none",
        }}
        viewBox="0 0 100 100"
        width={size}
      >
        <defs>
          <linearGradient id="streakFlameOuter" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ffb347" />
            <stop offset="45%" stopColor="#ff7a00" />
            <stop offset="100%" stopColor="#f33924" />
          </linearGradient>

          <filter id="streakFlameShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#ff6b4a" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer Flame Silhouette matching the reference image */}
        <path
          d="M50 10 C53 22, 66 26, 73 40 C80 54, 78 76, 68 86 C58 96, 42 96, 32 86 C22 76, 20 54, 27 40 C32 30, 42 26, 44 18 C46 13, 48 11, 50 10 Z"
          fill="url(#streakFlameOuter)"
          filter="url(#streakFlameShadow)"
        />

        {/* Top Flame Flick Highlight */}
        <path
          d="M50 13 C53 20, 62 25, 68 35 C64 30, 56 27, 52 28 Z"
          fill="#ffeaa7"
          opacity="0.85"
        />

        {/* Inner Droplet with Mascot Face */}
        <path
          d="M50 42 C56 50, 62 58, 62 69 C62 78, 56 83, 50 83 C44 83, 38 78, 38 69 C38 58, 44 50, 50 42 Z"
          fill="#ffffff"
        />

        {/* Droplet Warmth Gradient Tint */}
        <ellipse cx="50" cy="74" rx="8" ry="5" fill="#ffe5c4" opacity="0.75" />

        {/* Mascot Eyes */}
        <ellipse cx="46" cy="67" rx="2.2" ry="3.2" fill="#2d1b09" />
        <ellipse cx="54" cy="67" rx="2.2" ry="3.2" fill="#2d1b09" />

        {/* Eye Sparkles */}
        <circle cx="47" cy="65.5" r="0.85" fill="#ffffff" />
        <circle cx="55" cy="65.5" r="0.85" fill="#ffffff" />

        {/* Soft Blushes */}
        <ellipse cx="42" cy="71" rx="2" ry="1.2" fill="#ff7675" opacity="0.5" />
        <ellipse cx="58" cy="71" rx="2" ry="1.2" fill="#ff7675" opacity="0.5" />

        {/* Happy Smile */}
        <path
          d="M47.8 72 Q50 74.2 52.2 72"
          fill="none"
          stroke="#843b18"
          strokeLinecap="round"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}

export function DayFlameBadge({
  dayName,
  dayNum,
  isActive = false,
  isToday = false,
}: {
  dayName: string;
  dayNum: number;
  isActive?: boolean;
  isToday?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color: isActive ? "#d9480f" : "#9ca3af",
        }}
      >
        {dayName}
      </span>

      <div
        style={{
          width: 34,
          height: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {isActive ? (
          <svg height="40" viewBox="0 0 32 38" width="30">
            <defs>
              <linearGradient id={`dayGrad_${dayNum}`} x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#ffa94d" />
                <stop offset="100%" stopColor="#ff5252" />
              </linearGradient>
            </defs>
            <path
              d="M16 2 C18 9, 26 12, 28 20 C31 29, 27 36, 16 37 C5 36, 1 29, 4 20 C7 13, 13 12, 14 6 C15 3.5, 15.5 2.5, 16 2 Z"
              fill={`url(#dayGrad_${dayNum})`}
              filter="drop-shadow(0 2px 4px rgba(255, 107, 74, 0.35))"
            />
            {/* White day number */}
            <text
              fill="#ffffff"
              fontSize="11"
              fontWeight="900"
              textAnchor="middle"
              x="16"
              y="27"
            >
              {dayNum}
            </text>
          </svg>
        ) : (
          <svg height="38" viewBox="0 0 32 38" width="28">
            <path
              d="M16 3 C18 9, 25 12, 27 19 C30 27, 26 34, 16 35 C6 34, 2 27, 5 19 C8 13, 13 12, 14 7 Z"
              fill={isToday ? "#fffaf0" : "none"}
              stroke={isToday ? "#ff922b" : "#e5e7eb"}
              strokeDasharray={isToday ? "none" : "2.5, 2"}
              strokeWidth="1.8"
            />
            {isToday && (
              <text
                fill="#ff922b"
                fontSize="10"
                fontWeight="800"
                textAnchor="middle"
                x="16"
                y="26"
              >
                {dayNum}
              </text>
            )}
          </svg>
        )}
      </div>
    </div>
  );
}

export function StreakModal({
  isOpen,
  onClose,
  streak = 5,
  points = 380,
  checkedIn = false,
  onCheckIn,
}: {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  points: number;
  checkedIn: boolean;
  onCheckIn: () => void;
}) {
  const [theme, setTheme] = useState<StreakTheme>("sunset");

  if (!isOpen) return null;

  const weekDays = [
    { name: "Su", dayNum: 1, active: streak >= 1 },
    { name: "Mo", dayNum: 2, active: streak >= 2 },
    { name: "Tu", dayNum: 3, active: streak >= 3 },
    { name: "We", dayNum: 4, active: streak >= 4 },
    { name: "Th", dayNum: 5, active: streak >= 5 },
    { name: "Fr", dayNum: 6, active: streak >= 6, isToday: streak === 5 },
    { name: "Sa", dayNum: 7, active: streak >= 7 },
  ];

  // Theme backgrounds matching the user's reference image 3 variants
  const getThemeBackground = () => {
    switch (theme) {
      case "peach":
        return "linear-gradient(180deg, #fff3e6 0%, #fff8f0 35%, #ffffff 100%)";
      case "golden":
        return "linear-gradient(180deg, #fff3bf 0%, #ffec99 22%, #faf9f5 48%, #ffffff 100%)";
      case "sunset":
      default:
        return "linear-gradient(180deg, #ff922b 0%, #ffa94d 24%, #fff9f4 50%, #ffffff 100%)";
    }
  };

  const getHeaderTextColor = () => {
    return theme === "sunset" ? "#ffffff" : "#17181c";
  };

  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog" style={{ zIndex: 120 }}>
      <div
        className="streak-sheet"
        style={{
          background: getThemeBackground(),
          borderRadius: "32px",
          width: "100%",
          maxWidth: "350px",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "16px 16px 20px",
          position: "relative",
          boxShadow: "0 24px 48px rgba(0,0,0,0.22)",
          scrollbarWidth: "none",
        }}
      >
        {/* Arch background for golden theme option */}
        {theme === "golden" && (
          <div
            style={{
              position: "absolute",
              top: 55,
              left: -40,
              right: -40,
              height: 120,
              borderTopLeftRadius: "50% 60px",
              borderTopRightRadius: "50% 60px",
              background: "linear-gradient(180deg, #ffd43b 0%, #ffe066 100%)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "6px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 900,
                color: getHeaderTextColor(),
                letterSpacing: "-0.3px",
              }}
            >
              Streak
            </h2>

            {/* Quick Theme Switcher Pills */}
            <div
              style={{
                display: "inline-flex",
                background: "rgba(0,0,0,0.06)",
                padding: "2px",
                borderRadius: "99px",
                backdropFilter: "blur(4px)",
              }}
            >
              {(
                [
                  { id: "sunset", label: "🌅" },
                  { id: "golden", label: "☀️" },
                  { id: "peach", label: "🍦" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  style={{
                    background: theme === t.id ? "white" : "transparent",
                    border: 0,
                    borderRadius: "99px",
                    padding: "2px 6px",
                    fontSize: "10px",
                    cursor: "pointer",
                    boxShadow: theme === t.id ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
                  }}
                  title={`Switch to ${t.id} style`}
                  type="button"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.95)",
              border: "1px solid rgba(0,0,0,0.08)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: "14px",
              color: "#333",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Hero Mascot Flame + Big Number */}
        <div
          style={{
            textAlign: "center",
            padding: "8px 0 10px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <FlameMascot size={92} />

          <div
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#e65100",
              lineHeight: 1,
              marginTop: "2px",
              letterSpacing: "-1.5px",
            }}
          >
            {streak}
          </div>
          <div
            style={{
              fontSize: "13.5px",
              fontWeight: 800,
              color: "#b23b00",
              marginTop: "2px",
              letterSpacing: "0.2px",
            }}
          >
            days streak!
          </div>
        </div>

        {/* 7-Day Weekly Calendar Tracker Card */}
        <div
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "12px 10px",
            boxShadow: "0 4px 18px rgba(255, 122, 0, 0.08)",
            border: "1px solid #ffe8cc",
            marginBottom: "14px",
            position: "relative",
            zIndex: 2,
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
                key={d.name}
                dayName={d.name}
                dayNum={d.dayNum}
                isActive={d.active}
                isToday={d.isToday}
              />
            ))}
          </div>
        </div>

        {/* Streak Challenge Section */}
        <div style={{ marginBottom: "14px", position: "relative", zIndex: 2 }}>
          <h3
            style={{
              margin: "0 0 8px 4px",
              fontSize: "14px",
              fontWeight: 800,
              color: "#17181c",
              letterSpacing: "-0.2px",
            }}
          >
            Streak challenge
          </h3>

          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "14px",
              border: "1px solid #f1f1eb",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            }}
          >
            {/* Header: 14 days challenge / Day 8 of 14 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <strong style={{ fontSize: "12.5px", fontWeight: 800, color: "#17181c" }}>
                14 days challenge
              </strong>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#71717a" }}>
                Day {Math.min(streak, 14)} of 14
              </span>
            </div>

            {/* Striped Orange Progress Track with Milestone Badges */}
            <div style={{ position: "relative", marginBottom: "14px", paddingTop: "6px" }}>
              {/* The Track */}
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
                    color: streak >= 7 ? "#e65100" : "#a1a1aa",
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
                paddingTop: "10px",
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "12px", fontWeight: 900, color: "#18181b" }}>
                  Nov 15, 2025
                </div>
                <div style={{ fontSize: "10px", color: "#71717a", fontWeight: 600 }}>
                  Streak started
                </div>
              </div>
              <div style={{ borderLeft: "1px solid #f4f4f5" }}>
                <div style={{ fontSize: "12px", fontWeight: 900, color: "#18181b" }}>
                  11 days
                </div>
                <div style={{ fontSize: "10px", color: "#71717a", fontWeight: 600 }}>
                  Streak record
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Streak Milestones Section */}
        <div style={{ marginBottom: "16px", position: "relative", zIndex: 2 }}>
          <h3
            style={{
              margin: "0 0 8px 4px",
              fontSize: "14px",
              fontWeight: 800,
              color: "#17181c",
              letterSpacing: "-0.2px",
            }}
          >
            Streak milestones
          </h3>

          <div style={{ display: "grid", gap: "6px" }}>
            {[
              { days: 7, reward: "Township Badge & +50 Pts", unlocked: streak >= 7 },
              { days: 14, reward: "Free Kopi / Smoothie Coupon", unlocked: streak >= 14 },
              { days: 30, reward: "Community MVP Crown & Court Pass", unlocked: streak >= 30 },
            ].map((item) => (
              <div
                key={item.days}
                style={{
                  background: item.unlocked ? "#fffcf5" : "white",
                  borderRadius: "16px",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: item.unlocked ? "1.5px solid #ffd43b" : "1px solid #ecece6",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* Calendar Icon Badge like reference image */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      background: item.unlocked ? "#ff922b" : "#f4f4f5",
                      color: item.unlocked ? "white" : "#a1a1aa",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      boxShadow: item.unlocked ? "0 2px 6px rgba(255, 146, 43, 0.35)" : "none",
                    }}
                  >
                    <div style={{ fontSize: "7px", textTransform: "uppercase", lineHeight: 1 }}>
                      Day
                    </div>
                    <div style={{ fontSize: "12px", lineHeight: 1 }}>{item.days}</div>
                  </div>

                  <div>
                    <strong style={{ fontSize: "12px", color: "#18181b", display: "block" }}>
                      {item.days} days streak
                    </strong>
                    <span
                      style={{
                        fontSize: "10px",
                        color: item.unlocked ? "#d9480f" : "#71717a",
                        fontWeight: 600,
                      }}
                    >
                      {item.reward}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "99px",
                    background: item.unlocked ? "#e6fcf5" : "#f4f4f5",
                    color: item.unlocked ? "#0ca678" : "#a1a1aa",
                    fontSize: "10px",
                    fontWeight: 800,
                  }}
                >
                  {item.unlocked ? "Claimed ✓" : `In ${Math.max(0, item.days - streak)}d`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Claim / Check-In Action Button */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <button
            disabled={checkedIn}
            onClick={onCheckIn}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "16px",
              border: 0,
              background: checkedIn
                ? "#e4e4e7"
                : "linear-gradient(135deg, #ff922b 0%, #fa5252 100%)",
              color: checkedIn ? "#71717a" : "white",
              fontSize: "13px",
              fontWeight: 900,
              cursor: checkedIn ? "default" : "pointer",
              boxShadow: checkedIn ? "none" : "0 6px 20px rgba(255, 107, 74, 0.38)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            type="button"
          >
            {checkedIn
              ? "Checked in for Today! 🔥 Keep it burning"
              : "Check In for Today (+10 pts) 🔥"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StreakModal;
