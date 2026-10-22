import React, { useState, useId } from "react";
import { EventData } from "../App";

interface CreateEventPageProps {
  onBack: () => void;
  onCreateEvent: (newEvent: EventData) => void;
}

export function CreateEventPage({ onBack, onCreateEvent }: CreateEventPageProps) {
  const customTagId = useId();

  // Form State
  const [title, setTitle] = useState("Saturday Morning Badminton Sparring");
  const [selectedTag, setSelectedTag] = useState("#Sports");
  const [venue, setVenue] = useState("Elmina Sports Complex");

  // Venue & Custom Location Boxes State
  const [venueChips, setVenueChips] = useState<string[]>([
    "Elmina Central Park",
    "Elmina Lakeside Mall",
    "Elmina Sports Complex",
    "Elmina Rainforest Center",
    "Elmina Valley Park",
    "Elmina Pavilion",
  ]);
  const [isAddingCustomVenue, setIsAddingCustomVenue] = useState(false);
  const [newCustomVenueInput, setNewCustomVenueInput] = useState("");
  const customVenueInputId = useId();

  const handleAddCustomVenueBox = (customName: string) => {
    const trimmed = customName.trim();
    if (!trimmed) return;
    if (!venueChips.some((chip) => chip.toLowerCase() === trimmed.toLowerCase())) {
      setVenueChips((prev) => [...prev, trimmed]);
    }
    setVenue(trimmed);
    setNewCustomVenueInput("");
    setIsAddingCustomVenue(false);
  };

  // Date & Time State
  const todayStr = new Date().toISOString().split("T")[0];
  const [eventDate, setEventDate] = useState(todayStr);
  const [eventTime, setEventTime] = useState("08:30");
  const [datePreset, setDatePreset] = useState<"Today" | "Tomorrow" | "Weekend" | "Custom">("Weekend");

  // Max Capacity State (can have NO max capacity)
  const [isUnlimitedCapacity, setIsUnlimitedCapacity] = useState(false);
  const [spots, setSpots] = useState(6);
  const [isCapacityDropdownOpen, setIsCapacityDropdownOpen] = useState(false);

  // Description
  const [description, setDescription] = useState(
    "Join us for a friendly doubles session at Sports Hall. Clean indoor courts reserved. Open to all township residents and neighbours."
  );

  // Skill Requirements
  const [requiresSkill, setRequiresSkill] = useState(true);
  const [selectedSkillTier, setSelectedSkillTier] = useState("intermediate");

  // Categories (#labels) with DIFFERENT COLOR BOXES and DEEPER COLOR BORDER on select (NO black border)
  const [categoryList, setCategoryList] = useState<
    {
      id: string;
      tag: string;
      appCategory: EventData["category"];
      colorTheme: {
        bg: string;
        border: string;
        text: string;
        activeBg: string;
        activeBorder: string;
        activeText: string;
      };
    }[]
  >([
    {
      id: "sports",
      tag: "#Sports",
      appCategory: "Sports",
      colorTheme: {
        bg: "#fef8e3",
        border: "#f5c842",
        text: "#8c6500",
        activeBg: "#f5c842",
        activeBorder: "#b87d00", // Deeper golden amber border
        activeText: "#111215",
      },
    },
    {
      id: "social",
      tag: "#Social",
      appCategory: "Social",
      colorTheme: {
        bg: "#fef3e7",
        border: "#f28b24",
        text: "#a45300",
        activeBg: "#f28b24",
        activeBorder: "#b34e00", // Deeper dark orange border
        activeText: "#ffffff",
      },
    },
    {
      id: "hobbies",
      tag: "#Hobbies",
      appCategory: "Hobbies",
      colorTheme: {
        bg: "#f4effe",
        border: "#ba9cfc",
        text: "#5c32b6",
        activeBg: "#9775fa",
        activeBorder: "#5f3dc4", // Deeper purple border
        activeText: "#ffffff",
      },
    },
    {
      id: "carpool",
      tag: "#Carpool",
      appCategory: "Carpool",
      colorTheme: {
        bg: "#eef5ff",
        border: "#3d8bfd",
        text: "#1864ab",
        activeBg: "#3d8bfd",
        activeBorder: "#1864ab", // Deeper navy blue border
        activeText: "#ffffff",
      },
    },
    {
      id: "women_only",
      tag: "#Women-Only",
      appCategory: "Women-Only",
      colorTheme: {
        bg: "#fef0ef",
        border: "#f36458",
        text: "#c92a2a",
        activeBg: "#f36458",
        activeBorder: "#b02517", // Deeper crimson salmon border (no black border)
        activeText: "#ffffff",
      },
    },
    {
      id: "fitness",
      tag: "#Fitness",
      appCategory: "Sports",
      colorTheme: {
        bg: "#eaf8f0",
        border: "#38b776",
        text: "#197142",
        activeBg: "#38b776",
        activeBorder: "#197142", // Deeper forest green border
        activeText: "#ffffff",
      },
    },
  ]);

  // Adding Custom Category
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = newTagInput.trim().replace(/^#+/, "");
    if (!cleanTag) return;

    const formattedTag = `#${cleanTag}`;
    const rotatingThemes = [
      { bg: "#eaf8f0", border: "#38b776", text: "#197142", activeBg: "#38b776", activeBorder: "#197142", activeText: "#ffffff" },
      { bg: "#fef3e7", border: "#f28b24", text: "#a45300", activeBg: "#f28b24", activeBorder: "#b34e00", activeText: "#ffffff" },
      { bg: "#f4effe", border: "#ba9cfc", text: "#5c32b6", activeBg: "#9775fa", activeBorder: "#5f3dc4", activeText: "#ffffff" },
      { bg: "#eef5ff", border: "#3d8bfd", text: "#1864ab", activeBg: "#3d8bfd", activeBorder: "#1864ab", activeText: "#ffffff" },
    ];
    const picked = rotatingThemes[categoryList.length % rotatingThemes.length];

    const newCategoryItem = {
      id: `custom_${Date.now()}`,
      tag: formattedTag,
      appCategory: "Social" as EventData["category"],
      colorTheme: picked,
    };

    setCategoryList((prev) => [...prev, newCategoryItem]);
    setSelectedTag(formattedTag);
    setNewTagInput("");
    setIsAddingTag(false);
  };

  // City of Elmina (Sime Darby Property) Places API Database
  const elminaPlacesApi = [
    {
      id: "elmina_1",
      name: "Elmina Central Park - Rainbow Bridge Loop",
      facility: "300-Acre Central Recreational Park",
      zone: "Elmina Central",
      distance: "250m away",
      highlight: "Iconic Bridge & 5km Trail",
    },
    {
      id: "elmina_2",
      name: "Elmina Lakeside Mall - Waterfront Piazza",
      facility: "Lifestyle Waterfront Mall & Promenade",
      zone: "Lakeside Precinct",
      distance: "400m away",
      highlight: "Cafes & Outdoor Piazza",
    },
    {
      id: "elmina_3",
      name: "Elmina Sports Complex - Court 2",
      facility: "Indoor Sports Arena (Badminton & Futsal)",
      zone: "Elmina West Hub",
      distance: "300m away",
      highlight: "Air-conditioned Indoor Courts",
    },
    {
      id: "elmina_4",
      name: "Elmina Rainforest Knowledge Centre (ERKC)",
      facility: "Urban Biodiversity Park & Arboretum",
      zone: "Greenway Corridor",
      distance: "550m away",
      highlight: "Scenic Nature Trails & Pavilion",
    },
    {
      id: "elmina_5",
      name: "Elmina Pavilion & Community Terrace",
      facility: "Sime Darby Property Gallery & Lawn",
      zone: "Elmina East",
      distance: "200m away",
      highlight: "Open Lawn & Event Space",
    },
    {
      id: "elmina_6",
      name: "Elmina Valley Recreation Park (Valley 3)",
      facility: "Neighbourhood Lake & Children Playground",
      zone: "Elmina Valley",
      distance: "350m away",
      highlight: "Family Lawn & Reflexology Path",
    },
    {
      id: "elmina_7",
      name: "Elmina Green Community Park",
      facility: "Fitness Station & Multipurpose Court",
      zone: "Elmina Green",
      distance: "600m away",
      highlight: "Basketball & Outdoor Gym",
    },
    {
      id: "elmina_8",
      name: "Elmina 90km Wellness Cycling Track",
      facility: "Dedicated Continuous Bike & Jogging Lane",
      zone: "Township Wide",
      distance: "150m away",
      highlight: "Lighted Safe Running Route",
    },
  ];



  // Skill Options with distinct color boxes matching app theme
  const skillOptions = [
    {
      id: "all_welcome",
      tier: "All Levels Welcome",
      badge: "Open Tier",
      description: "Beginner and casual friendly. Focus is on light exercise & meeting neighbours.",
      tag: "All Levels Welcome · Friendly",
      theme: {
        cardBg: "#f6fcf8",
        border: "#38b776",
        activeBorder: "#197142",
        badgeBg: "#eaf8f0",
        badgeText: "#197142",
        dotColor: "#279e60",
      },
    },
    {
      id: "social",
      tier: "Casual & Social",
      badge: "Level 1",
      description: "Basic rules understood. Relaxed non-competitive pace with fun rallies.",
      tag: "Casual / Social Vibe",
      theme: {
        cardBg: "#f5f9ff",
        border: "#3d8bfd",
        activeBorder: "#1864ab",
        badgeBg: "#eef5ff",
        badgeText: "#1864ab",
        dotColor: "#1c7ed6",
      },
    },
    {
      id: "intermediate",
      tier: "Intermediate Tier",
      badge: "Level 2",
      description: "Consistent returns, court rotation, or steady 5:30 min/km jog pace.",
      tag: "Intermediate (Rally & Pace)",
      theme: {
        cardBg: "#fffdf5",
        border: "#f5c842",
        activeBorder: "#b87d00",
        badgeBg: "#fef8e3",
        badgeText: "#8c6500",
        dotColor: "#d99b00",
      },
    },
    {
      id: "competitive",
      tier: "Competitive / Fast",
      badge: "Level 3",
      description: "High stamina, tactical match play & sparring for experienced participants.",
      tag: "Advanced / Competitive",
      theme: {
        cardBg: "#fff7f6",
        border: "#f36458",
        activeBorder: "#b02517",
        badgeBg: "#fef0ef",
        badgeText: "#c92a2a",
        dotColor: "#e03131",
      },
    },
  ];

  const handleDatePreset = (preset: "Today" | "Tomorrow" | "Weekend") => {
    setDatePreset(preset);
    const d = new Date();
    if (preset === "Today") {
      setEventDate(d.toISOString().split("T")[0]);
    } else if (preset === "Tomorrow") {
      d.setDate(d.getDate() + 1);
      setEventDate(d.toISOString().split("T")[0]);
    } else if (preset === "Weekend") {
      const day = d.getDay();
      const diff = (6 - day + 7) % 7 || 7;
      d.setDate(d.getDate() + diff);
      setEventDate(d.toISOString().split("T")[0]);
    }
  };

  const handleReset = () => {
    setTitle("");
    setSelectedTag("#Sports");
    setVenue("Elmina Sports Complex");
    setDatePreset("Weekend");
    setSpots(6);
    setIsUnlimitedCapacity(false);
    setDescription("");
    setRequiresSkill(true);
    setSelectedSkillTier("intermediate");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedCategory = categoryList.find((c) => c.tag === selectedTag);
    const matchedSkill = skillOptions.find((s) => s.id === selectedSkillTier);

    const dateObj = new Date(eventDate);
    const formattedDate = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
      : "Upcoming";

    const [h, m] = eventTime.split(":");
    const hourNum = parseInt(h, 10);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const formattedHour = hourNum % 12 || 12;
    const formattedTimeStr = `${formattedHour}:${m || "00"} ${ampm}`;

    const newEvent: EventData = {
      id: Date.now(),
      title: title.trim(),
      category: matchedCategory ? matchedCategory.appCategory : "Social",
      date: formattedDate,
      time: formattedTimeStr,
      venue: venue.trim() || "Township Community Facility",
      joined: 1,
      spots: isUnlimitedCapacity ? 999 : Math.max(1, spots),
      host: "Alex (You)",
      hostAvatarKey: "alex",
      sticker: "●",
      color: "yellow",
      isWomenOnly: selectedTag === "#Women-Only",
      skillTag: requiresSkill ? (matchedSkill?.tag || "Skill Assessed") : "Open to All",
      smartRecReason: `Hosted in ${selectedTag} by Alex`,
      chatSnippet: {
        sender: "Alex (You)",
        avatarKey: "alex",
        text: description.trim() || "Event published. Looking forward to meeting everyone.",
      },
      chatHistory: [
        {
          id: 1,
          sender: "Alex (You)",
          avatarKey: "alex",
          time: "Just now",
          text: description.trim() || "Event created. Feel free to ask questions here.",
          isUser: true,
        },
      ],
      description: description.trim(),
      attendeeKeys: ["alex"],
    };

    onCreateEvent(newEvent);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        background: "var(--bg-cream, #f6f5f0)",
        color: "#111215",
        position: "relative",
        overflowX: "hidden", // Prevents page sliding out of bounds
        overflowY: "hidden",
        boxSizing: "border-box",
        fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Phone Status Bar */}
      <div
        className="status-bar light-theme"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px 4px",
          fontSize: "12px",
          fontWeight: 800,
          color: "#111215",
          zIndex: 10,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <span>9:41</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Screen Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 18px 12px",
          background: "transparent",
          zIndex: 10,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            aria-label="Back"
            onClick={onBack}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#ffffff",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
              color: "#111215",
              transition: "transform 0.15s ease",
            }}
            type="button"
          >
            <svg
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="18"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div>
            <h1
              className="screen-title"
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                color: "#111215",
              }}
            >
              Create Event
            </h1>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#c92a2a", letterSpacing: "0.2px" }}>
              City of Elmina · Sime Darby Property
            </span>
          </div>
        </div>

        <button
          onClick={handleReset}
          style={{
            background: "rgba(0, 0, 0, 0.05)",
            border: "none",
            borderRadius: "99px",
            color: "#555860",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            padding: "5px 12px",
          }}
          type="button"
        >
          Reset
        </button>
      </div>

      {/* Main Scrollable Form (Guaranteed strictly NO horizontal overflow, hidden scrollbar) */}
      <div
        className="no-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden", // Fixes 出界 error completely!
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          padding: "10px 18px 100px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <form
          id="create-event-form"
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            // Prevent accidental form submission when pressing Enter in any text input
            if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
              e.preventDefault();
            }
          }}
          style={{ width: "100%", boxSizing: "border-box" }}
        >
          {/* 1. EVENT NAME */}
          <div style={{ marginBottom: "18px", width: "100%", boxSizing: "border-box" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 800,
                color: "#111215",
                marginBottom: "6px",
                letterSpacing: "-0.02em",
              }}
            >
              Event Name
            </label>
            <input
              placeholder="e.g. Saturday Morning Badminton Sparring"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "13px 15px",
                borderRadius: "16px",
                border: "1.5px solid #e5e2da",
                fontSize: "14px",
                fontWeight: 600,
                color: "#111215",
                background: "#ffffff",
                outline: "none",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
                boxSizing: "border-box",
              }}
              type="text"
            />
          </div>

          {/* 2. CATEGORY (#labels) - SELECTED HAS DEEPER SHADE BORDER OF ORIGINAL COLOR (NO BLACK BORDER) */}
          <div style={{ marginBottom: "18px", width: "100%", boxSizing: "border-box" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "#111215",
                  letterSpacing: "-0.02em",
                }}
              >
                Category (#labels)
              </label>
              <span style={{ fontSize: "11px", color: "#777", fontWeight: 600 }}>
                Tap to pick or add custom
              </span>
            </div>

            {/* List of Different Colour Boxes with Deeper Border on Select */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", width: "100%" }}>
              {categoryList.map((cat) => {
                const isSelected = selectedTag === cat.tag;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedTag(cat.tag)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "12px",
                      // User feedback: When select, NOT black border, but a deeper colour of the original colour!
                      border: isSelected
                        ? `2.5px solid ${cat.colorTheme.activeBorder}`
                        : `1.5px solid ${cat.colorTheme.border}`,
                      background: isSelected ? cat.colorTheme.activeBg : cat.colorTheme.bg,
                      color: isSelected ? cat.colorTheme.activeText : cat.colorTheme.text,
                      fontSize: "12px",
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: isSelected
                        ? "0 4px 10px rgba(0, 0, 0, 0.12)"
                        : "0 1px 3px rgba(0, 0, 0, 0.02)",
                      transition: "all 0.15s ease",
                    }}
                    type="button"
                  >
                    {cat.tag}
                  </button>
                );
              })}

              {/* Add Custom Category Button */}
              {!isAddingTag ? (
                <button
                  onClick={() => setIsAddingTag(true)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "12px",
                    border: "1.5px dashed #bbb",
                    background: "#ffffff",
                    color: "#555",
                    fontSize: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  type="button"
                >
                  <span>+</span> Add #tag
                </button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "#ffffff",
                    border: "1.5px solid #888",
                    borderRadius: "12px",
                    padding: "2px 6px",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#777" }}>#</span>
                  <label htmlFor={customTagId} style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", border: 0 }}>Custom tag name</label>
                  <input
                    id={customTagId}
                    autoFocus
                    placeholder="tag name"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddNewCategory(e);
                      }
                      if (e.key === "Escape") {
                        setIsAddingTag(false);
                      }
                    }}
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: "12px",
                      fontWeight: 700,
                      width: "80px",
                      padding: "4px 2px",
                    }}
                    type="text"
                  />
                  <button
                    onClick={handleAddNewCategory}
                    style={{
                      border: "none",
                      background: "#111215",
                      color: "#fff",
                      fontSize: "10.5px",
                      fontWeight: 800,
                      borderRadius: "6px",
                      padding: "3px 7px",
                      cursor: "pointer",
                    }}
                    type="button"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsAddingTag(false)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#999",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. LOCATION & VENUE - FOCUSED ON CITY OF ELMINA, SIME DARBY PROPERTY */}
          <div style={{ marginBottom: "18px", position: "relative", width: "100%", boxSizing: "border-box" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#111215",
                    letterSpacing: "-0.02em",
                    display: "block",
                  }}
                >
                  Location &amp; Venue
                </label>
                <span style={{ fontSize: "11px", color: "#777", fontWeight: 600 }}>
                  Featuring City of Elmina landmarks
                </span>
              </div>
            </div>

            {/* Venue Chips / Boxes (Includes quick Elmina chips and user-added custom location boxes) */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
              {venueChips.map((chip) => {
                const isSelected = venue.trim().toLowerCase() === chip.trim().toLowerCase();
                return (
                  <button
                    key={chip}
                    onClick={() => {
                      setVenue(chip);
                    }}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "99px",
                      border: isSelected ? "1.5px solid #111215" : "1.5px solid #e0dcd4",
                      background: isSelected ? "#111215" : "#ffffff",
                      color: isSelected ? "#ffffff" : "#444",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    type="button"
                  >
                    <span>📍</span>
                    <span>{chip}</span>
                    {isSelected && <span style={{ fontSize: "10px", marginLeft: "2px" }}>✓</span>}
                  </button>
                );
              })}

              {/* Add Custom Location Button / Inline Input */}
              {!isAddingCustomVenue ? (
                <button
                  onClick={() => setIsAddingCustomVenue(true)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "99px",
                    border: "1.5px dashed #b0aba2",
                    background: "#faf9f5",
                    color: "#555",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  type="button"
                >
                  <span>+</span> Add Custom
                </button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "#ffffff",
                    border: "1.5px solid #111215",
                    borderRadius: "14px",
                    padding: "3px 6px",
                  }}
                >
                  <label
                    htmlFor={customVenueInputId}
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "1px",
                      padding: 0,
                      margin: "-1px",
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      border: 0,
                    }}
                  >
                    Custom location name
                  </label>
                  <span style={{ fontSize: "12px" }}>📍</span>
                  <input
                    id={customVenueInputId}
                    autoFocus
                    placeholder="e.g. Clubhouse BBQ"
                    value={newCustomVenueInput}
                    onChange={(e) => setNewCustomVenueInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomVenueBox(newCustomVenueInput);
                      }
                      if (e.key === "Escape") {
                        setIsAddingCustomVenue(false);
                      }
                    }}
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      width: "125px",
                      padding: "3px 2px",
                    }}
                    type="text"
                  />
                  <button
                    onClick={() => handleAddCustomVenueBox(newCustomVenueInput)}
                    style={{
                      border: "none",
                      background: "#111215",
                      color: "#fff",
                      fontSize: "10.5px",
                      fontWeight: 800,
                      borderRadius: "8px",
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                    type="button"
                  >
                    Add Box
                  </button>
                  <button
                    onClick={() => setIsAddingCustomVenue(false)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#999",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 4. DATE & TIME */}
          <div style={{ marginBottom: "18px", width: "100%", boxSizing: "border-box" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "#111215",
                  letterSpacing: "-0.02em",
                }}
              >
                Date & Time
              </label>
              <span style={{ fontSize: "11px", color: "#777", fontWeight: 600 }}>
                Smart slot & direct picker
              </span>
            </div>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
              {(["Today", "Tomorrow", "Weekend", "Custom"] as const).map((preset) => {
                const isSelected = datePreset === preset;
                return (
                  <button
                    key={preset}
                    onClick={() => {
                      if (preset !== "Custom") handleDatePreset(preset);
                      else setDatePreset("Custom");
                    }}
                    style={{
                      padding: "6px 13px",
                      borderRadius: "99px",
                      border: "none",
                      background: isSelected ? "#111215" : "#e8e5dc",
                      color: isSelected ? "#ffffff" : "#444",
                      fontSize: "11.5px",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    type="button"
                  >
                    {preset === "Weekend" ? "This Weekend" : preset}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "8px", width: "100%", boxSizing: "border-box" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#666", marginBottom: "3px" }}>
                  Calendar Date
                </label>
                <input
                  min={todayStr}
                  value={eventDate}
                  onChange={(e) => {
                    setEventDate(e.target.value);
                    setDatePreset("Custom");
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "14px",
                    border: "1.5px solid #e5e2da",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#111215",
                    background: "#ffffff",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  type="date"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#666", marginBottom: "3px" }}>
                  Meetup Time
                </label>
                <input
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "14px",
                    border: "1.5px solid #e5e2da",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#111215",
                    background: "#ffffff",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  type="time"
                />
              </div>
            </div>
          </div>

          {/* 5. MAX CAPACITY - COMPLETELY FIXED OVERFLOW*/}
          <div style={{ marginBottom: "18px", width: "100%", boxSizing: "border-box" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "#111215",
                  letterSpacing: "-0.02em",
                }}
              >
                Max Capacity
              </label>
              <span style={{ fontSize: "12px", fontWeight: 800, color: isUnlimitedCapacity ? "#2b8a3e" : "#111215" }}>
                {isUnlimitedCapacity ? "No Max Capacity (Open to all)" : `${spots} spots max`}
              </span>
            </div>

            {/* Row 1: Full-width Unlimited Capacity Toggle Button */}
            <button
              onClick={() => setIsUnlimitedCapacity((prev) => !prev)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "14px",
                border: isUnlimitedCapacity ? "2px solid #2b8a3e" : "1.5px solid #e5e2da",
                background: isUnlimitedCapacity ? "#eaf8f0" : "#ffffff",
                color: isUnlimitedCapacity ? "#197142" : "#555",
                fontSize: "12.5px",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
                boxSizing: "border-box",
                transition: "all 0.15s ease",
              }}
              type="button"
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px" }}>∞</span>
                <span>No Max Capacity (Open to Everyone)</span>
              </span>
              <span
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: isUnlimitedCapacity ? "#2b8a3e" : "#e0dcd4",
                  color: "#ffffff",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                }}
              >
                {isUnlimitedCapacity ? "✓" : ""}
              </span>
            </button>

            {/* Row 2: Slide-Down Capacity Selector Card (No slider track!) */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1.5px solid #e5e2da",
                padding: "10px 14px",
                boxSizing: "border-box",
                width: "100%",
              }}
            >
              {/* Stepper and Slide-Down button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* Stepper buttons [-] and [+] */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    aria-label="Decrease capacity"
                    onClick={() => {
                      setIsUnlimitedCapacity(false);
                      setSpots((s) => Math.max(2, s - 1));
                    }}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "10px",
                      border: "1.5px solid #e5e2da",
                      background: "#f8f7f4",
                      color: "#111215",
                      fontSize: "16px",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    type="button"
                  >
                    -
                  </button>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 900,
                      color: isUnlimitedCapacity ? "#888" : "#111215",
                      minWidth: "75px",
                      textAlign: "center",
                    }}
                  >
                    {isUnlimitedCapacity ? "Unlimited" : `${spots} ppl`}
                  </span>
                  <button
                    aria-label="Increase capacity"
                    onClick={() => {
                      setIsUnlimitedCapacity(false);
                      setSpots((s) => Math.min(50, s + 1));
                    }}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "10px",
                      border: "1.5px solid #e5e2da",
                      background: "#f8f7f4",
                      color: "#111215",
                      fontSize: "16px",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    type="button"
                  >
                    +
                  </button>
                </div>

                {/* Button that slides down more presets */}
                <button
                  onClick={() => setIsCapacityDropdownOpen((prev) => !prev)}
                  style={{
                    background: isCapacityDropdownOpen ? "#fef8e3" : "#f5f4ef",
                    border: isCapacityDropdownOpen ? "1.5px solid #f5c842" : "1px solid #e5e2da",
                    borderRadius: "10px",
                    padding: "6px 12px",
                    fontSize: "11.5px",
                    fontWeight: 800,
                    color: isCapacityDropdownOpen ? "#8c6500" : "#444",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    transition: "all 0.15s ease",
                  }}
                  type="button"
                >
                  <span>Select</span>
                  <span style={{ fontSize: "9px" }}>{isCapacityDropdownOpen ? "▲" : "▼"}</span>
                </button>
              </div>

              {/* Slide-Down Preset Options (Opens smoothly when tapped) */}
              {isCapacityDropdownOpen && (
                <div
                  style={{
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px dashed #e5e2da",
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "6px",
                  }}
                >
                  {[2, 4, 6, 8, 10, 12, 16, 20, 25, 30].map((num) => {
                    const isSelected = !isUnlimitedCapacity && spots === num;
                    return (
                      <button
                        key={num}
                        onClick={() => {
                          setIsUnlimitedCapacity(false);
                          setSpots(num);
                          setIsCapacityDropdownOpen(false);
                        }}
                        style={{
                          height: "34px",
                          borderRadius: "10px",
                          border: isSelected ? "2px solid #111215" : "1.5px solid #e5e2da",
                          background: isSelected ? "#111215" : "#ffffff",
                          color: isSelected ? "#ffffff" : "#444",
                          fontSize: "12px",
                          fontWeight: 800,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.15s ease",
                        }}
                        type="button"
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 6. SKILL LEVEL - DIFFERENT COLOUR BOXES TO REPRESENT DIFFERENT SKILL LEVELS */}
          <div style={{ marginBottom: "18px", width: "100%", boxSizing: "border-box" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#111215",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Skill Level Requirement
                </label>
                <span style={{ fontSize: "11px", color: "#777", fontWeight: 600 }}>
                  Different color boxes for each tier
                </span>
              </div>
              <button
                onClick={() => setRequiresSkill((prev) => !prev)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "99px",
                  border: "none",
                  background: requiresSkill ? "#111215" : "#e0dcd4",
                  color: requiresSkill ? "#ffffff" : "#666",
                  fontSize: "11px",
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                type="button"
              >
                {requiresSkill ? "Required" : "Optional"}
              </button>
            </div>

            {requiresSkill ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", boxSizing: "border-box" }}>
                {skillOptions.map((opt) => {
                  const isSelected = selectedSkillTier === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedSkillTier(opt.id)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "12px 14px",
                        borderRadius: "16px",
                        border: isSelected
                          ? `2px solid ${opt.theme.activeBorder}`
                          : `1.5px solid ${opt.theme.border}`,
                        background: opt.theme.cardBg,
                        boxShadow: isSelected
                          ? `0 4px 14px rgba(0, 0, 0, 0.08)`
                          : `0 1px 3px rgba(0, 0, 0, 0.02)`,
                        textAlign: "left",
                        cursor: "pointer",
                        width: "100%",
                        boxSizing: "border-box",
                        transition: "all 0.15s ease",
                      }}
                      type="button"
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          border: isSelected
                            ? `5px solid ${opt.theme.dotColor}`
                            : `2px solid ${opt.theme.border}`,
                          background: "#ffffff",
                          flexShrink: 0,
                          marginTop: "2px",
                          boxSizing: "border-box",
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span
                            style={{
                              fontSize: "13.5px",
                              fontWeight: 800,
                              color: "#111215",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {opt.tier}
                          </span>
                          <span
                            style={{
                              fontSize: "10.5px",
                              fontWeight: 800,
                              padding: "2px 8px",
                              borderRadius: "6px",
                              background: opt.theme.badgeBg,
                              color: opt.theme.badgeText,
                              border: `1px solid ${opt.theme.border}`,
                            }}
                          >
                            {opt.badge}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: "3px 0 0",
                            fontSize: "11.5px",
                            lineHeight: 1.35,
                            color: "#555",
                            fontWeight: 500,
                          }}
                        >
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  padding: "12px",
                  borderRadius: "14px",
                  background: "#ffffff",
                  border: "1.5px dashed #d5d0c6",
                  color: "#777",
                  fontSize: "12px",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Open to all residents without skill prerequisites
              </div>
            )}
          </div>

          {/* 7. DESCRIPTION */}
          <div style={{ marginBottom: "18px", width: "100%", boxSizing: "border-box" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 800,
                color: "#111215",
                marginBottom: "6px",
                letterSpacing: "-0.02em",
              }}
            >
              Description & Notes
            </label>
            <textarea
              placeholder="Describe event agenda, equipment needed, or meetup instructions..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "16px",
                border: "1.5px solid #e5e2da",
                fontSize: "13px",
                fontWeight: 500,
                color: "#111215",
                background: "#ffffff",
                outline: "none",
                lineHeight: 1.45,
                resize: "none",
                boxSizing: "border-box",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
              }}
            />
          </div>
        </form>
      </div>

      {/* App Theme Bottom Action Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 18px 20px",
          background: "linear-gradient(to top, var(--bg-cream, #f6f5f0) 80%, rgba(246, 245, 240, 0.8) 100%)",
          borderTop: "1px solid rgba(0, 0, 0, 0.06)",
          zIndex: 20,
          display: "flex",
          gap: "10px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <button
          onClick={onBack}
          style={{
            flex: "0 0 80px",
            height: "48px",
            borderRadius: "16px",
            border: "1.5px solid #dedad0",
            background: "#ffffff",
            color: "#555860",
            fontSize: "13px",
            fontWeight: 800,
            cursor: "pointer",
          }}
          type="button"
        >
          Cancel
        </button>

        <button
          form="create-event-form"
          style={{
            flex: 1,
            height: "48px",
            borderRadius: "16px",
            border: "none",
            background: "var(--folder-yellow, #f5c842)",
            color: "#111215",
            fontSize: "14px",
            fontWeight: 900,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(245, 200, 66, 0.35)",
            letterSpacing: "-0.01em",
            transition: "transform 0.15s ease",
          }}
          type="submit"
        >
          Create Event
        </button>
      </div>
    </div>
  );
}

export default CreateEventPage;
