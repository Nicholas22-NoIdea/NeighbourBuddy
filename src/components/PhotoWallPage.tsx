import React, { useState, useRef } from "react";
import { AvatarConfig } from "./Avatar";

export interface ScrapbookItem {
  id: string;
  type: "photo" | "quote" | "circle-coffee" | "spotify";
  title: string;
  tag: string;
  image?: string;
  quoteText?: string;
  spotifyData?: {
    songTitle: string;
    artist: string;
    lyrics: string;
  };
  author: string;
  date: string;
  likes: number;
  hasLiked?: boolean;
  story?: string;
  aspect?: "portrait" | "landscape" | "square" | "circle";
  tiltDeg?: number;
}

export const defaultScrapbookItems: ScrapbookItem[] = [
  {
    id: "hobby",
    type: "photo",
    title: "Waterfall Trekking Adventure",
    tag: "hobby",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=700&q=80",
    author: "Sarah",
    date: "Last Saturday",
    likes: 42,
    aspect: "portrait",
    tiltDeg: -2,
    story: "Weekend waterfall trekking with neighbours! River trail was refreshing and cold. We all made it to the summit pool safely.",
  },
  {
    id: "quote",
    type: "quote",
    title: "Daily Motivation",
    tag: "quote",
    quoteText: "be proud of all the progress you've made; no matter how small.",
    author: "Michelle",
    date: "Sunday Morning",
    likes: 68,
    aspect: "square",
    tiltDeg: 1,
    story: "Pinned this quote on the community board this week. Remember consistency beats intensity every time!",
  },
  {
    id: "view",
    type: "photo",
    title: "Golden Hour Central Lake",
    tag: "view",
    image: "https://images.unsplash.com/photo-1758520705254-1e9d913d78ea?auto=format&fit=crop&w=700&q=80",
    author: "Daniel",
    date: "Sunday 6:45 PM",
    likes: 54,
    aspect: "portrait",
    tiltDeg: 1.5,
    story: "Spectacular sunset beam splitting the sky over the central lake loop. Caught right at the 4.5km mark during evening jog.",
  },
  {
    id: "work",
    type: "photo",
    title: "Tech Park Work Commute",
    tag: "work",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80",
    author: "Priya",
    date: "Tuesday 8:30 AM",
    likes: 35,
    aspect: "portrait",
    tiltDeg: -1.5,
    story: "Carpool with neighbours to Tech Park went so smoothly today! Arrived 20 minutes early without highway jam stress.",
  },
  {
    id: "selfie",
    type: "photo",
    title: "Badminton Doubles Sparring",
    tag: "selfie",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
    author: "Sarah & Jamie",
    date: "Monday 9:15 AM",
    likes: 48,
    aspect: "portrait",
    tiltDeg: 2,
    story: "Post-court selfie after a 3-set intense rally! Sweating buckets but laughing all the way to breakfast.",
  },
  {
    id: "coffee",
    type: "circle-coffee",
    title: "Central Cafe Heart Latte",
    tag: "coffee",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    author: "Alex",
    date: "Yesterday 10:00 AM",
    likes: 61,
    aspect: "circle",
    tiltDeg: -1,
    story: "Iced latte with cold brew coffee heart ice cubes at Central Cafe. The perfect reward after morning check-in!",
  },
  {
    id: "food",
    type: "photo",
    title: "Township Potluck Feast",
    tag: "food",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80",
    author: "Michelle",
    date: "Oct 15",
    likes: 73,
    aspect: "square",
    tiltDeg: 1.5,
    story: "Homemade Malaysian delicacies brought by residents for the weekend potluck. Nasi lemak sambal was out of this world!",
  },
  {
    id: "playlist",
    type: "spotify",
    title: "Township Run Playlist",
    tag: "playlist",
    author: "Daniel",
    date: "Oct 12",
    likes: 39,
    aspect: "square",
    tiltDeg: -2,
    spotifyData: {
      songTitle: "Got good at goodbyes",
      artist: "Spotify Running Mix",
      lyrics: "Got good at goodbyes\nJust know that I will find\nmy way from you\nLike flowers from a tomb\nwhile you decide who\nyou are",
    },
    story: "Pacing beats for evening 5k jogs around the lake. Keeps the cadence right at 170 spm.",
  },
  {
    id: "random-pic",
    type: "photo",
    title: "Community Library Corner",
    tag: "random pic",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=700&q=80",
    author: "Emily",
    date: "Oct 10",
    likes: 29,
    aspect: "portrait",
    tiltDeg: -1,
    story: "Cozy afternoon reading corner at Resident Lounge. 14 new books added to the shared shelf this week.",
  },
  {
    id: "friends",
    type: "photo",
    title: "Township Gathering Laughs",
    tag: "friends",
    image: "https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=800&q=80",
    author: "Priya & Friends",
    date: "Oct 8",
    likes: 85,
    aspect: "landscape",
    tiltDeg: 1,
    story: "Celebrating community bonds under the gazebo lights. Moving to this township was the best decision ever!",
  },
];

interface PhotoWallPageProps {
  onBack: () => void;
  getAvatar: (key?: string) => AvatarConfig;
}

export function PhotoWallPage({ onBack }: PhotoWallPageProps) {
  const [items, setItems] = useState<ScrapbookItem[]>(defaultScrapbookItems);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [viewingItem, setViewingItem] = useState<ScrapbookItem | null>(null);

  // Full-Page View Switcher: "wall" or "upload"
  const [pageView, setPageView] = useState<"wall" | "upload">("wall");

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadTag, setUploadTag] = useState("hobby");
  const [uploadStory, setUploadStory] = useState("");
  const [uploadImage, setUploadImage] = useState<string>("");
  const [uploadAspect, setUploadAspect] = useState<"portrait" | "square" | "circle" | "landscape">("portrait");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableTags = [
    { label: "hobby", color: "#1971c2" },
    { label: "view", color: "#2f9e44" },
    { label: "coffee", color: "#f59f00" },
    { label: "food", color: "#f76707" },
    { label: "friends", color: "#e03131" },
    { label: "selfie", color: "#d6336c" },
    { label: "quote", color: "#7950f2" },
    { label: "random pic", color: "#868e96" },
    { label: "playlist", color: "#1098ad" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const wallScrollRef = useRef<HTMLDivElement>(null);

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAddSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const finalTitle =
      uploadTitle.trim() ||
      `${uploadTag.charAt(0).toUpperCase() + uploadTag.slice(1)} Memory`;

    const finalImage =
      uploadImage ||
      "https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=700&q=80";

    const newItem: ScrapbookItem = {
      id: `custom-${Date.now()}`,
      type: uploadAspect === "circle" ? "circle-coffee" : "photo",
      title: finalTitle,
      tag: uploadTag,
      image: finalImage,
      author: "Alex (You)",
      date: "Just now",
      likes: 1,
      hasLiked: true,
      story: uploadStory.trim() || "Shared to township memory scrapbook.",
      aspect: uploadAspect,
      tiltDeg: Math.random() * 3 - 1.5,
    };

    setItems([newItem, ...items]);
    setUploadTitle("");
    setUploadStory("");
    setUploadImage("");
    setSelectedTag("All"); // Show all items so newly pinned memory is directly visible
    setPageView("wall");

    setTimeout(() => {
      wallScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 60);
  };

  const handleToggleLike = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const willLike = !it.hasLiked;
        return {
          ...it,
          hasLiked: willLike,
          likes: willLike ? it.likes + 1 : Math.max(0, it.likes - 1),
        };
      })
    );
    if (viewingItem && viewingItem.id === id) {
      setViewingItem((v) =>
        v
          ? {
              ...v,
              hasLiked: !v.hasLiked,
              likes: !v.hasLiked ? v.likes + 1 : Math.max(0, v.likes - 1),
            }
          : null
      );
    }
  };

  const filteredItems =
    selectedTag === "All"
      ? items
      : items.filter((it) => it.tag.toLowerCase() === selectedTag.toLowerCase());

  // ==========================================================
  // FULL-PAGE VIEW 2: DIRECT PHOTO UPLOAD & PIN SCREEN
  // ==========================================================
  if (pageView === "upload") {
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setPageView("wall")}
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
              title="Cancel"
              type="button"
            >
              ←
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: "15px", fontWeight: 900, color: "#111215" }}>
                Add Memory Polaroid
              </h1>
              <span style={{ fontSize: "10px", color: "#666", fontWeight: 600 }}>
                Upload photo & pin to township moodboard
              </span>
            </div>
          </div>
        </div>

        {/* Full-Page Upload Form Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 16px 30px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            boxSizing: "border-box",
          }}
        >
          {/* Direct File Upload Area */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#333", marginBottom: "6px" }}>
              PHOTO UPLOAD:
            </label>

            <input
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
              type="file"
            />

            <div
              onClick={handleTriggerUpload}
              style={{
                border: "2px dashed #faad14",
                borderRadius: "18px",
                padding: "18px 12px",
                textAlign: "center",
                background: uploadImage ? "#ffffff" : "#fef8e3",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                transition: "all 0.15s ease",
              }}
            >
              {uploadImage ? (
                /* Polaroid Preview of Uploaded Photo */
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: uploadAspect === "circle" ? "50%" : "6px",
                      padding: uploadAspect === "circle" ? "5px" : "6px 6px 14px",
                      border: "1px solid #e7e4dc",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
                      maxWidth: "200px",
                      width: uploadAspect === "circle" ? "140px" : "100%",
                      height: uploadAspect === "circle" ? "140px" : "auto",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      alt="Uploaded preview"
                      src={uploadImage}
                      style={{
                        width: "100%",
                        height: uploadAspect === "circle" ? "100%" : uploadAspect === "landscape" ? "110px" : "160px",
                        objectFit: "cover",
                        borderRadius: uploadAspect === "circle" ? "50%" : "3px",
                        display: "block",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "10.5px", color: "#1971c2", fontWeight: 800, marginTop: "10px" }}>
                    📷 Tap to choose another photo
                  </span>
                </div>
              ) : (
                /* Empty Upload Prompt */
                <div>
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      background: "#f5c842",
                      color: "#111215",
                      fontSize: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 8px",
                    }}
                  >
                    📸
                  </div>
                  <strong style={{ fontSize: "13px", color: "#111215", display: "block" }}>
                    Tap to Upload Photo directly
                  </strong>
                  <span style={{ fontSize: "10.5px", color: "#666", display: "block", marginTop: "2px" }}>
                    Select any picture from your device or gallery
                  </span>
                </div>
              )}
            </div>

            {/* Quick Sample Presets */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
              <span style={{ fontSize: "9.5px", color: "#888", fontWeight: 700, flexShrink: 0 }}>Quick presets:</span>
              {[
                { label: "🏸 Badminton", url: "https://images.unsplash.com/photo-1723633236252-eb7badabb34c?auto=format&fit=crop&w=700&q=80", tag: "hobby" },
                { label: "🌅 Sunset 5k", url: "https://images.unsplash.com/photo-1758520705254-1e9d913d78ea?auto=format&fit=crop&w=700&q=80", tag: "view" },
                { label: "☕ Iced Latte", url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80", tag: "coffee" },
                { label: "🎲 Board Games", url: "https://images.unsplash.com/photo-1758691031197-fee3ccad4d68?auto=format&fit=crop&w=700&q=80", tag: "hobby" },
                { label: "🍲 Potluck Feast", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80", tag: "food" },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setUploadImage(p.url);
                    setUploadTag(p.tag);
                  }}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "99px",
                    border: "1px solid #ddd",
                    background: "white",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                  type="button"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Polaroid Frame Style */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#333", marginBottom: "6px" }}>
              FRAME STYLE:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
              {[
                { id: "portrait", label: "Portrait", icon: "📱" },
                { id: "square", label: "Square", icon: "⏹️" },
                { id: "circle", label: "Circle", icon: "⚪" },
                { id: "landscape", label: "Landscape", icon: "🖼️" },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setUploadAspect(fmt.id as any)}
                  style={{
                    padding: "8px 4px",
                    borderRadius: "12px",
                    border: uploadAspect === fmt.id ? "2px solid #111" : "1px solid #ddd",
                    background: uploadAspect === fmt.id ? "var(--folder-yellow-light)" : "white",
                    fontSize: "10px",
                    fontWeight: 800,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  type="button"
                >
                  <div style={{ fontSize: "15px", marginBottom: "2px" }}>{fmt.icon}</div>
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Memory Title */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#333", marginBottom: "4px" }}>
              TITLE:
            </label>
            <input
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. Saturday Badminton Rally Meetup"
              required
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "12px",
                border: "1.5px solid #dcd8cf",
                background: "white",
                fontSize: "12px",
                color: "#111",
                boxSizing: "border-box",
                outline: "none",
              }}
              type="text"
              value={uploadTitle}
            />
          </div>

          {/* Dot Label Tag (Matching Screenshot) */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#333", marginBottom: "4px" }}>
              CHOOSE DOT LABEL TAG:
            </label>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {availableTags.map((t) => {
                const isSelected = uploadTag === t.label;
                return (
                  <button
                    key={t.label}
                    onClick={() => setUploadTag(t.label)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "99px",
                      border: isSelected ? "1.5px solid #111215" : "1px solid #dcd8cf",
                      background: isSelected ? "#111215" : "#ffffff",
                      color: isSelected ? "#ffffff" : "#333333",
                      fontSize: "10.5px",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                    type="button"
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: isSelected ? "#ffffff" : t.color,
                      }}
                    />
                    ● {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Story & Description */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#333", marginBottom: "4px" }}>
              STORY & DESCRIPTION:
            </label>
            <textarea
              onChange={(e) => setUploadStory(e.target.value)}
              placeholder="Share the story behind this memory, who you were with, and highlights from the activity..."
              rows={3}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "12px",
                border: "1.5px solid #dcd8cf",
                background: "white",
                fontSize: "11.5px",
                color: "#111",
                boxSizing: "border-box",
                outline: "none",
                resize: "none",
              }}
              value={uploadStory}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              onClick={() => setPageView("wall")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "12px",
                border: "1.5px solid #ddd",
                background: "white",
                fontSize: "12px",
                fontWeight: 800,
                color: "#666",
                cursor: "pointer",
              }}
              type="button"
            >
              Cancel
            </button>

            <button
              onClick={handleAddSubmit}
              style={{
                flex: 2,
                padding: "10px",
                borderRadius: "12px",
                border: "1.5px solid #111",
                background: "#f5c842",
                fontSize: "12px",
                fontWeight: 800,
                color: "#111",
                cursor: "pointer",
                boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
              }}
              type="button"
            >
              Pin to Scrapbook ✨
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // FULL-PAGE VIEW 1: MACOS FINDER SCRAPBOOK MOODBOARD
  // ==========================================================
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: "#9ec5e8", // Soft macOS desktop wallpaper blue
        backgroundImage: "radial-gradient(at 20% 20%, #b8dcf9 0px, transparent 50%), radial-gradient(at 80% 80%, #7db4e4 0px, transparent 50%)",
        position: "relative",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Mobile Phone Status Bar */}
      <div className="status-bar light-theme" style={{ zIndex: 30, background: "rgba(255,255,255,0.4)" }}>
        <span>9:41</span>
        <div className="status-icons">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Main macOS Finder Window Container (Full Page) */}
      <div
        style={{
          flex: 1,
          margin: "4px 6px 8px",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 18px 45px rgba(15, 35, 60, 0.28), 0 2px 10px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.8)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* macOS Window Title Bar */}
        <div
          style={{
            background: "linear-gradient(180deg, #f7f6f5 0%, #ebe9e6 100%)",
            borderBottom: "1px solid #dcd8cf",
            padding: "9px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            userSelect: "none",
          }}
        >
          {/* Traffic Light Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={onBack}
              style={{
                width: "11px",
                height: "11px",
                borderRadius: "50%",
                background: "#ff5f56",
                border: "0.5px solid #e0443e",
                cursor: "pointer",
                padding: 0,
              }}
              title="Close window (Back to Home)"
              type="button"
            />
            <button
              onClick={() => setSelectedTag("All")}
              style={{
                width: "11px",
                height: "11px",
                borderRadius: "50%",
                background: "#ffbd2e",
                border: "0.5px solid #dea123",
                cursor: "pointer",
                padding: 0,
              }}
              title="Reset Filters"
              type="button"
            />
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                width: "11px",
                height: "11px",
                borderRadius: "50%",
                background: "#27c93f",
                border: "0.5px solid #1aab29",
                cursor: "pointer",
                padding: 0,
              }}
              title="Toggle Finder Sidebar"
              type="button"
            />
          </div>

          {/* Navigation & Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "3px", color: "#666", fontSize: "12px", fontWeight: 700 }}>
              <button
                onClick={onBack}
                style={{
                  background: "none",
                  border: 0,
                  color: "#555",
                  fontSize: "13px",
                  cursor: "pointer",
                  padding: "0 3px",
                }}
                type="button"
              >
                ‹
              </button>
              <button
                style={{
                  background: "none",
                  border: 0,
                  color: "#aaa",
                  fontSize: "13px",
                  cursor: "default",
                  padding: "0 3px",
                }}
                type="button"
              >
                ›
              </button>
            </div>
            <strong style={{ fontSize: "12.5px", fontWeight: 800, color: "#111215", letterSpacing: "-0.01em" }}>
              Recents
            </strong>
          </div>

          {/* Top Actions: Direct Upload Button & Sidebar Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: sidebarOpen ? "#e2ded5" : "transparent",
                border: "1px solid #dcd8cf",
                borderRadius: "6px",
                width: "24px",
                height: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                cursor: "pointer",
                padding: 0,
                color: "#444",
              }}
              title="Toggle Sidebar"
              type="button"
            >
              ◧
            </button>

            <button
              onClick={() => setPageView("upload")}
              style={{
                background: "#111215",
                color: "#ffffff",
                border: 0,
                borderRadius: "8px",
                padding: "4px 8px",
                fontSize: "10.5px",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              }}
              title="Upload New Photo"
              type="button"
            >
              <span>+</span> Upload
            </button>
          </div>
        </div>

        {/* Content Area: Sidebar + Scrapbook Board */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
          {/* macOS Finder Left Sidebar (Overlay Drawer) */}
          {sidebarOpen && (
            <>
              <div
                onClick={() => setSidebarOpen(false)}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.25)",
                  zIndex: 35,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: "150px",
                  background: "#f4f3f0",
                  borderRight: "1.5px solid #dcd8cf",
                  padding: "12px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  overflowY: "auto",
                  fontSize: "10.5px",
                  zIndex: 40,
                  boxShadow: "4px 0 16px rgba(0,0,0,0.18)",
                }}
              >
              <div>
                <button
                  onClick={() => setSelectedTag("All")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    background: selectedTag === "All" ? "#1971c2" : "transparent",
                    color: selectedTag === "All" ? "#ffffff" : "#333333",
                    border: 0,
                    fontWeight: 700,
                    fontSize: "10.5px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  type="button"
                >
                  <span>🕒</span> Recents
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 8px", color: "#666", fontWeight: 600 }}>
                  <span>📁</span> Shared
                </div>
              </div>

              <div>
                <span style={{ fontSize: "9px", fontWeight: 800, color: "#888", paddingLeft: "6px", letterSpacing: "0.03em" }}>
                  FAVORITES
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "3px" }}>
                  <div style={{ padding: "3px 6px", color: "#555" }}>Applications</div>
                  <div style={{ padding: "3px 6px", color: "#555" }}>Documents</div>
                  <div style={{ padding: "3px 6px", color: "#555" }}>Downloads</div>
                  <div style={{ padding: "3px 6px", color: "#555" }}>Desktop</div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: "9px", fontWeight: 800, color: "#888", paddingLeft: "6px", letterSpacing: "0.03em" }}>
                  TAGS
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "3px" }}>
                  {availableTags.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => setSelectedTag(t.label)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "3px 6px",
                        borderRadius: "5px",
                        background: selectedTag === t.label ? "#e6e3da" : "transparent",
                        border: 0,
                        fontSize: "10px",
                        fontWeight: selectedTag === t.label ? 800 : 600,
                        color: "#333",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                      type="button"
                    >
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: t.color }} />
                      {t.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedTag("All")}
                    style={{
                      padding: "3px 6px",
                      color: "#666",
                      fontSize: "9.5px",
                      background: "none",
                      border: 0,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    type="button"
                  >
                    ◯ All Tags...
                  </button>
                </div>
              </div>
            </div>
            </>
          )}

          {/* Scrapbook Moodboard Canvas with Doodles & Polaroid Photos */}
          <div
            ref={wallScrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              padding: "16px 14px 44px",
              background: "#ffffff",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            {/* Top Quick Action Banner */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
                background: "#f9f8f5",
                borderRadius: "14px",
                padding: "8px 12px",
                border: "1px solid #edebe4",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "16px" }}>✨</span>
                <span style={{ fontSize: "10.5px", color: "#555", fontWeight: 700 }}>
                  Township Scrapbook Wall
                </span>
              </div>
              <button
                onClick={() => setPageView("upload")}
                style={{
                  background: "#111215",
                  color: "#ffffff",
                  borderRadius: "8px",
                  border: 0,
                  padding: "4px 10px",
                  fontSize: "10px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                type="button"
              >
                <span>📷</span> Upload Photo
              </button>
            </div>

            {/* ========================================================
                HAND-DRAWN CRAYON VECTOR DOODLES (MATCHING SCREENSHOT)
                ======================================================== */}
            {/* Doodle 1: Pink Sketch Cat (Top Left) */}
            <svg
              style={{
                position: "absolute",
                top: "52px",
                left: "14px",
                width: "48px",
                height: "36px",
                pointerEvents: "none",
                zIndex: 5,
              }}
              viewBox="0 0 100 80"
            >
              <path
                d="M 20 50 C 15 35, 12 25, 20 15 C 26 8, 38 12, 45 22 C 55 12, 68 8, 75 16 C 82 25, 80 40, 70 55 C 60 70, 30 70, 20 50 Z"
                fill="#ffd0de"
                stroke="#ff4081"
                strokeDasharray="4 2"
                strokeLinecap="round"
                strokeWidth="4.5"
              />
              <polygon fill="#ff4081" points="22,18 10,2 30,12" />
              <polygon fill="#ff4081" points="70,18 60,3 82,10" />
              <circle cx="34" cy="36" fill="#ff4081" r="3.5" />
              <circle cx="58" cy="36" fill="#ff4081" r="3.5" />
              <line stroke="#ff4081" strokeWidth="3" x1="10" x2="26" y1="38" y2="40" />
              <line stroke="#ff4081" strokeWidth="3" x1="66" x2="84" y1="40" y2="38" />
              <path d="M 75 52 Q 95 45 92 65" fill="none" stroke="#ff4081" strokeLinecap="round" strokeWidth="4.5" />
            </svg>

            {/* Doodle 2: Crayon Stars (Top Center) */}
            <svg
              style={{
                position: "absolute",
                top: "50px",
                left: "48%",
                width: "55px",
                height: "40px",
                pointerEvents: "none",
                zIndex: 5,
              }}
              viewBox="0 0 100 80"
            >
              <polygon
                fill="none"
                points="50,5 57,25 78,25 61,38 67,58 50,45 33,58 39,38 22,25 43,25"
                stroke="#fcc419"
                strokeLinejoin="round"
                strokeWidth="5"
              />
              <polygon
                fill="none"
                points="20,40 24,50 35,50 26,56 29,66 20,60 11,66 14,56 5,50 16,50"
                stroke="#4dabf7"
                strokeLinejoin="round"
                strokeWidth="4"
              />
              <polygon
                fill="none"
                points="80,35 84,45 95,45 86,51 89,61 80,55 71,61 74,51 65,45 76,45"
                stroke="#ff6b6b"
                strokeLinejoin="round"
                strokeWidth="4"
              />
            </svg>

            {/* Doodle 3: Stack of 4 Pink Sketch Hearts (Left Margin) */}
            <svg
              style={{
                position: "absolute",
                top: "260px",
                left: "8px",
                width: "28px",
                height: "120px",
                pointerEvents: "none",
                zIndex: 5,
              }}
              viewBox="0 0 50 200"
            >
              <path d="M 25,35 C 10,15 0,35 25,60 C 50,35 40,15 25,35 Z" fill="none" stroke="#fa5252" strokeLinecap="round" strokeWidth="4" />
              <path d="M 20,85 C 8,70 0,85 20,105 C 40,85 32,70 20,85 Z" fill="none" stroke="#fa5252" strokeLinecap="round" strokeWidth="3.5" />
              <path d="M 28,135 C 18,120 10,135 28,155 C 46,135 38,120 28,135 Z" fill="none" stroke="#fa5252" strokeLinecap="round" strokeWidth="3.5" />
              <path d="M 24,175 C 15,165 8,175 24,192 C 40,175 33,165 24,175 Z" fill="none" stroke="#fa5252" strokeLinecap="round" strokeWidth="3" />
            </svg>

            {/* Doodle 4: Red Burst Lines near Coffee */}
            <svg
              style={{
                position: "absolute",
                top: "175px",
                left: "148px",
                width: "36px",
                height: "36px",
                pointerEvents: "none",
                zIndex: 5,
              }}
              viewBox="0 0 60 60"
            >
              <line stroke="#e03131" strokeLinecap="round" strokeWidth="4" x1="10" x2="25" y1="35" y2="28" />
              <line stroke="#e03131" strokeLinecap="round" strokeWidth="4" x1="18" x2="30" y1="18" y2="22" />
              <line stroke="#e03131" strokeLinecap="round" strokeWidth="4" x1="38" x2="36" y1="10" y2="24" />
            </svg>

            {/* Doodle 5: Purple Cute Flower (Center) */}
            <svg
              style={{
                position: "absolute",
                top: "245px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "38px",
                height: "38px",
                pointerEvents: "none",
                zIndex: 5,
              }}
              viewBox="0 0 80 80"
            >
              <circle cx="40" cy="24" fill="#d0bfff" stroke="#845ef7" strokeWidth="3" r="14" />
              <circle cx="56" cy="38" fill="#d0bfff" stroke="#845ef7" strokeWidth="3" r="14" />
              <circle cx="48" cy="56" fill="#d0bfff" stroke="#845ef7" strokeWidth="3" r="14" />
              <circle cx="30" cy="54" fill="#d0bfff" stroke="#845ef7" strokeWidth="3" r="14" />
              <circle cx="24" cy="36" fill="#d0bfff" stroke="#845ef7" strokeWidth="3" r="14" />
              <circle cx="40" cy="40" fill="#ffd43b" stroke="#fab005" strokeWidth="3" r="11" />
            </svg>

            {/* Doodle 6: Crayon Rocket Blasting Off (Right Center) */}
            <svg
              style={{
                position: "absolute",
                top: "190px",
                right: "12px",
                width: "44px",
                height: "56px",
                pointerEvents: "none",
                zIndex: 5,
              }}
              viewBox="0 0 80 100"
            >
              <path d="M 40 10 C 60 30 65 65 55 80 L 25 80 C 15 65 20 30 40 10 Z" fill="#ffa94d" stroke="#f76707" strokeWidth="4" />
              <polygon fill="#ff6b6b" points="40,10 52,32 28,32" stroke="#e03131" strokeWidth="3" />
              <circle cx="40" cy="48" fill="#4dabf7" r="8" stroke="#1c7ed6" strokeWidth="3" />
              <polygon fill="#ff8787" points="25,65 5,85 25,80" />
              <polygon fill="#ff8787" points="55,65 75,85 55,80" />
              <polygon fill="#ffd43b" points="30,82 40,102 50,82" stroke="#f59f00" strokeWidth="3" />
            </svg>

            {/* Doodle 7: Green Sketch Frog (Right near playlist) */}
            <svg
              style={{
                position: "absolute",
                top: "245px",
                right: "26px",
                width: "42px",
                height: "36px",
                pointerEvents: "none",
                zIndex: 5,
              }}
              viewBox="0 0 100 80"
            >
              <ellipse cx="50" cy="50" fill="none" rx="35" ry="25" stroke="#69db7c" strokeWidth="4" />
              <circle cx="32" cy="28" fill="none" r="12" stroke="#69db7c" strokeWidth="4" />
              <circle cx="68" cy="28" fill="none" r="12" stroke="#69db7c" strokeWidth="4" />
              <circle cx="32" cy="28" fill="#37b24d" r="4" />
              <circle cx="68" cy="28" fill="#37b24d" r="4" />
              <path d="M 35 55 Q 50 65 65 55" fill="none" stroke="#69db7c" strokeLinecap="round" strokeWidth="4" />
            </svg>

            {/* Doodle 8: Blue Sketch Sun (Right Lower) */}
            <svg
              style={{
                position: "absolute",
                top: "320px",
                right: "10px",
                width: "40px",
                height: "40px",
                pointerEvents: "none",
                zIndex: 5,
              }}
              viewBox="0 0 80 80"
            >
              <circle cx="40" cy="40" fill="none" r="16" stroke="#4dabf7" strokeWidth="3.5" />
              <line stroke="#4dabf7" strokeLinecap="round" strokeWidth="3.5" x1="40" x2="40" y1="12" y2="18" />
              <line stroke="#4dabf7" strokeLinecap="round" strokeWidth="3.5" x1="40" x2="40" y1="62" y2="68" />
              <line stroke="#4dabf7" strokeLinecap="round" strokeWidth="3.5" x1="12" x2="18" y1="40" y2="40" />
              <line stroke="#4dabf7" strokeLinecap="round" strokeWidth="3.5" x1="62" x2="68" y1="40" y2="40" />
              <line stroke="#4dabf7" strokeLinecap="round" strokeWidth="3.5" x1="20" x2="25" y1="20" y2="25" />
              <line stroke="#4dabf7" strokeLinecap="round" strokeWidth="3.5" x1="55" x2="60" y1="55" y2="60" />
            </svg>

            {/* Doodle 9: Crayon Rainbow (Bottom Left) */}
            <svg
              style={{
                position: "absolute",
                bottom: "10px",
                left: "24px",
                width: "65px",
                height: "44px",
                pointerEvents: "none",
                zIndex: 5,
              }}
              viewBox="0 0 100 65"
            >
              <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="#ff6b6b" strokeDasharray="3 2" strokeLinecap="round" strokeWidth="4.5" />
              <path d="M 20 55 A 30 30 0 0 1 80 55" fill="none" stroke="#ffd43b" strokeDasharray="3 2" strokeLinecap="round" strokeWidth="4.5" />
              <path d="M 30 55 A 20 20 0 0 1 70 55" fill="none" stroke="#38d9a9" strokeDasharray="3 2" strokeLinecap="round" strokeWidth="4.5" />
              <path d="M 40 55 A 10 10 0 0 1 60 55" fill="none" stroke="#4dabf7" strokeDasharray="3 2" strokeLinecap="round" strokeWidth="4.5" />
            </svg>

            {/* Doodle 10: Cute Green Dinosaur (Bottom Right) */}
            <svg
              style={{
                position: "absolute",
                bottom: "8px",
                right: "12px",
                width: "46px",
                height: "46px",
                pointerEvents: "none",
                zIndex: 5,
              }}
              viewBox="0 0 90 90"
            >
              <path
                d="M 25 75 L 25 55 C 25 40, 20 25, 45 20 L 70 20 C 78 20, 80 28, 75 35 L 60 38 C 65 50, 65 65, 75 70 C 80 72, 85 70, 80 78 C 65 82, 50 78, 45 75 Z"
                fill="#b2f2bb"
                stroke="#2b8a3e"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <polygon fill="#2b8a3e" points="40,16 45,21 35,21" />
              <polygon fill="#2b8a3e" points="52,16 57,21 47,21" />
              <polygon fill="#2b8a3e" points="30,32 35,37 25,37" />
              <polygon fill="#2b8a3e" points="26,45 31,50 21,50" />
              <circle cx="62" cy="26" fill="#111" r="3" />
              <path d="M 64 34 Q 70 34 72 30" fill="none" stroke="#111" strokeWidth="2.5" />
              <line stroke="#2b8a3e" strokeLinecap="round" strokeWidth="5" x1="38" x2="38" y1="75" y2="85" />
              <line stroke="#2b8a3e" strokeLinecap="round" strokeWidth="5" x1="52" x2="52" y1="75" y2="85" />
            </svg>

            {/* ========================================================
                SCRAPBOOK POLAROID & MOODBOARD CARDS GRID
                ======================================================== */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "16px 12px",
                transform: `scale(${zoomScale})`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease",
                padding: "8px 2px",
              }}
            >
              {filteredItems.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => setViewingItem(item)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      transform: `rotate(${item.tiltDeg || 0}deg)`,
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      position: "relative",
                      zIndex: 2,
                      minWidth: 0,
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Item Container based on Type */}
                    {item.type === "circle-coffee" ? (
                      /* Round Circular Coffee Cutout */
                      <div
                        style={{
                          width: "116px",
                          height: "116px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "5px solid #ffffff",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.16), 0 1px 4px rgba(0,0,0,0.06)",
                          background: "#ffffff",
                        }}
                      >
                        <img
                          alt={item.title}
                          src={item.image}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    ) : item.type === "quote" ? (
                      /* Minimalist Clean Quote Card */
                      <div
                        style={{
                          width: "100%",
                          background: "#ffffff",
                          borderRadius: "4px",
                          padding: "18px 12px",
                          boxShadow: "0 5px 16px rgba(0,0,0,0.11), 0 1px 3px rgba(0,0,0,0.05)",
                          border: "1px solid #ebe8e2",
                          boxSizing: "border-box",
                          textAlign: "center",
                          minHeight: "105px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontFamily: "Georgia, serif",
                            fontSize: "12px",
                            lineHeight: 1.45,
                            color: "#1a1a1a",
                            fontWeight: 600,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          &ldquo;{item.quoteText}&rdquo;
                        </p>
                      </div>
                    ) : item.type === "spotify" ? (
                      /* Spotify Music Card */
                      <div
                        style={{
                          width: "100%",
                          background: "#121212",
                          borderRadius: "8px",
                          padding: "12px 10px",
                          color: "#ffffff",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.22)",
                          boxSizing: "border-box",
                          minHeight: "115px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <span style={{ fontSize: "14px" }}>🎧</span>
                          <strong style={{ fontSize: "10px", color: "#1db954" }}>
                            {item.spotifyData?.songTitle}
                          </strong>
                        </div>
                        <p
                          style={{
                            margin: "6px 0",
                            fontSize: "10px",
                            lineHeight: 1.35,
                            color: "#e0e0e0",
                            whiteSpace: "pre-line",
                            fontStyle: "italic",
                          }}
                        >
                          {item.spotifyData?.lyrics}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
                          <span style={{ fontSize: "8.5px", color: "#888" }}>Spotify</span>
                          <span style={{ fontSize: "9px", color: "#1db954" }}>●●●</span>
                        </div>
                      </div>
                    ) : (
                      /* Classic White Frame Polaroid Photo */
                      <div
                        style={{
                          width: "100%",
                          background: "#ffffff",
                          borderRadius: "4px",
                          padding: "5px 5px 8px 5px",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06)",
                          border: "1px solid #f0eee9",
                          boxSizing: "border-box",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: item.aspect === "landscape" ? "88px" : item.aspect === "square" ? "108px" : "130px",
                            overflow: "hidden",
                            borderRadius: "2px",
                            background: "#eae8e3",
                          }}
                        >
                          <img
                            alt={item.title}
                            src={item.image}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Photo Details: Dot Tag, Title, and Description snippet directly on Photo Wall */}
                    <div
                      style={{
                        width: "100%",
                        padding: "5px 2px 2px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      {/* Blue Dot Label Pill (Matching Screenshot: ● hobby, ● quote, ● view...) */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: "#339af0",
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#1c2434",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {item.tag}
                        </span>
                      </div>

                      {/* Memory Title directly visible */}
                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 800,
                          color: "#111215",
                          marginTop: "2px",
                          lineHeight: 1.25,
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                        }}
                      >
                        {item.title}
                      </span>

                      {/* Story/Description snippet directly visible */}
                      {item.story && (
                        <span
                          style={{
                            fontSize: "9.5px",
                            color: "#777",
                            marginTop: "1px",
                            lineHeight: 1.25,
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "block",
                          }}
                        >
                          {item.story}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* macOS Bottom Status Bar with Items Count & Zoom Slider */}
        <div
          style={{
            background: "#f7f6f5",
            borderTop: "1px solid #dcd8cf",
            padding: "6px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            fontSize: "10.5px",
            color: "#666",
            userSelect: "none",
          }}
        >
          <span style={{ fontWeight: 600 }}>{filteredItems.length} items</span>

          {/* Interactive Zoom Slider */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "9px" }}>—</span>
            <input
              max="1.3"
              min="0.8"
              onChange={(e) => setZoomScale(parseFloat(e.target.value))}
              step="0.05"
              style={{
                width: "60px",
                height: "3px",
                accentColor: "#1971c2",
                cursor: "pointer",
              }}
              type="range"
              value={zoomScale}
            />
            <span style={{ fontSize: "11px" }}>+</span>
          </div>
        </div>
      </div>

      {/* Detail Preview Modal when tapping any polaroid */}
      {viewingItem && (
        <div aria-modal="true" className="modal-backdrop" role="dialog" style={{ zIndex: 100 }}>
          <div className="playful-sheet" style={{ maxWidth: "340px", width: "90%", padding: "16px" }}>
            <button
              className="modal-close-pill"
              onClick={() => setViewingItem(null)}
              type="button"
            >
              ✕
            </button>

            {viewingItem.image && (
              <div
                style={{
                  borderRadius: "14px",
                  overflow: "hidden",
                  maxHeight: "200px",
                  marginBottom: "12px",
                  border: "1px solid #eee",
                }}
              >
                <img
                  alt={viewingItem.title}
                  src={viewingItem.image}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#339af0" }} />
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#1971c2", textTransform: "lowercase" }}>
                ● {viewingItem.tag}
              </span>
              <span style={{ fontSize: "10px", color: "#888", marginLeft: "auto" }}>
                {viewingItem.date}
              </span>
            </div>

            <h3 style={{ margin: "2px 0 6px", fontSize: "16px", fontWeight: 800, color: "#111215" }}>
              {viewingItem.title}
            </h3>

            <p style={{ margin: "0 0 14px", fontSize: "11.5px", color: "#555", lineHeight: 1.45 }}>
              {viewingItem.story || viewingItem.quoteText || "Township memory shared by residents."}
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0eee6", paddingTop: "10px" }}>
              <span style={{ fontSize: "11px", color: "#666", fontWeight: 600 }}>
                Shared by <strong>{viewingItem.author}</strong>
              </span>

              <button
                onClick={() => handleToggleLike(viewingItem.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "99px",
                  border: viewingItem.hasLiked ? "1.5px solid #ff6b6b" : "1px solid #ddd",
                  background: viewingItem.hasLiked ? "#fff0f0" : "#ffffff",
                  color: viewingItem.hasLiked ? "#e03131" : "#444",
                  fontSize: "11px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                type="button"
              >
                <span>{viewingItem.hasLiked ? "❤️" : "🤍"}</span> {viewingItem.likes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
