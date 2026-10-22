import React, { useState } from "react";

export interface RewardItem {
  id: string;
  title: string;
  category: "dining" | "sports" | "vouchers" | "eco";
  partner: string;
  pointsCost: number;
  icon: string;
  badge?: string;
  description: string;
  terms: string;
}

export interface RedeemedVoucher {
  id: string;
  rewardId: string;
  title: string;
  partner: string;
  pointsSpent: number;
  icon: string;
  code: string;
  redeemedDate: string;
  expiryDate: string;
}

export const defaultRewards: RewardItem[] = [
  {
    id: "r1",
    title: "Central Cafe Heart Iced Latte",
    category: "dining",
    partner: "Central Cafe @ Hub",
    pointsCost: 120,
    icon: "☕",
    badge: "Popular",
    description: "Signature cold brew with heart-shaped coffee ice cubes & fresh oat milk.",
    terms: "Valid on all handcrafted beverages at Central Cafe Township Hub.",
  },
  {
    id: "r2",
    title: "1-Hour Sports Hall Court Booking",
    category: "sports",
    partner: "Township Sports Complex",
    pointsCost: 200,
    icon: "🏸",
    badge: "Hot Pick",
    description: "Free 1-hour court reservation for Badminton, Pickleball, or Tennis.",
    terms: "Book via community counter or resident portal with your voucher code.",
  },
  {
    id: "r3",
    title: "Township Fresh Veggie Basket",
    category: "eco",
    partner: "Township Community Garden",
    pointsCost: 180,
    icon: "🥗",
    badge: "Organic",
    description: "Pesticide-free leafy greens and seasonal herbs harvested fresh by residents.",
    terms: "Pick up every Saturday 9:00 - 11:00 AM at the Community Garden kiosk.",
  },
  {
    id: "r4",
    title: "Weekend Family Pool Day Pass",
    category: "sports",
    partner: "Resident Clubhouse Pool",
    pointsCost: 220,
    icon: "🏊",
    badge: "Family Pass",
    description: "All-day access pass for up to 4 family members and guest pool towels.",
    terms: "Valid on Saturdays, Sundays, and public holidays with resident ID.",
  },
  {
    id: "r5",
    title: "RM15 EV Fast Charging Credit",
    category: "eco",
    partner: "Precinct 4 Charging Hub",
    pointsCost: 150,
    icon: "⚡",
    badge: "Eco Boost",
    description: "Direct RM15 credit for 60kW DC fast charging at Precinct 4 parking bay.",
    terms: "Enter voucher code in the Sime Darby Charging App to redeem credit.",
  },
  {
    id: "r6",
    title: "Sime Darby Township Eco Bottle",
    category: "eco",
    partner: "Sime Darby Property Hub",
    pointsCost: 280,
    icon: "🌿",
    badge: "Limited Edition",
    description: "Double-walled insulated 650ml thermal stainless bottle with carry strap.",
    terms: "Collect at Property Gallery Welcome Centre during operating hours.",
  },
  {
    id: "r7",
    title: "RM20 Jaya Grocer Voucher",
    category: "vouchers",
    partner: "Commercial Town Square",
    pointsCost: 350,
    icon: "🛒",
    badge: "Best Value",
    description: "RM20 cash voucher applicable across all fresh produce & grocery essentials.",
    terms: "Present digital barcode at cashier counter. Minimum spend RM30.",
  },
  {
    id: "r8",
    title: "Adventure Park Canopy Zip Pass",
    category: "sports",
    partner: "Central Forest Park",
    pointsCost: 400,
    icon: "🧗",
    badge: "Weekend Thrill",
    description: "1 admission pass for the 250m forest canopy zipline and treetop trail.",
    terms: "Safety briefing included. Suitable for ages 10 and above.",
  },
];

interface InAppToast {
  id: string;
  type: "success" | "warning";
  title: string;
  message: string;
  icon?: string;
}

interface RewardsPageProps {
  points: number;
  onDeductPoints: (cost: number) => void;
  onBack: () => void;
}

export function RewardsPage({ points, onDeductPoints, onBack }: RewardsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"catalog" | "my_vouchers">("catalog");
  const [vouchers, setVouchers] = useState<RedeemedVoucher[]>([
    {
      id: "v-initial",
      rewardId: "r1",
      title: "Central Cafe Heart Iced Latte",
      partner: "Central Cafe @ Hub",
      pointsSpent: 120,
      icon: "☕",
      code: "SDP-CAFE-9281",
      redeemedDate: "Yesterday",
      expiryDate: "Valid until 22 Nov 2026",
    },
  ]);

  // In-app interactive states (NO browser alert or window.confirm)
  const [inAppToast, setInAppToast] = useState<InAppToast | null>(null);
  const [confirmingItem, setConfirmingItem] = useState<RewardItem | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState<RedeemedVoucher | null>(null);
  const [showHowToEarn, setShowHowToEarn] = useState(false);

  const triggerToast = (toast: Omit<InAppToast, "id">) => {
    const id = String(Date.now());
    setInAppToast({ ...toast, id });
    setTimeout(() => {
      setInAppToast((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  };

  const categories = [
    { id: "all", label: "All Rewards", icon: "✨" },
    { id: "dining", label: "Cafes & Dining", icon: "☕" },
    { id: "sports", label: "Sports & Courts", icon: "🏸" },
    { id: "vouchers", label: "Shopping Vouchers", icon: "🛒" },
    { id: "eco", label: "Township Eco", icon: "🌱" },
  ];

  const filteredRewards =
    selectedCategory === "all"
      ? defaultRewards
      : defaultRewards.filter((r) => r.category === selectedCategory);

  const handleInitiateRedeem = (item: RewardItem) => {
    if (points < item.pointsCost) {
      triggerToast({
        type: "warning",
        title: "Insufficient Points",
        message: `You need ${item.pointsCost - points} more pts for ${item.title}.`,
        icon: "⚠️",
      });
      return;
    }
    setConfirmingItem(item);
  };

  const handleConfirmRedeem = () => {
    if (!confirmingItem) return;
    const item = confirmingItem;
    setConfirmingItem(null);

    // Deduct points
    onDeductPoints(item.pointsCost);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newVoucher: RedeemedVoucher = {
      id: `v-${Date.now()}`,
      rewardId: item.id,
      title: item.title,
      partner: item.partner,
      pointsSpent: item.pointsCost,
      icon: item.icon,
      code: `SDP-${item.category.toUpperCase().slice(0, 3)}-${randomSuffix}`,
      redeemedDate: "Just now",
      expiryDate: "Valid for 30 days",
    };

    setVouchers([newVoucher, ...vouchers]);

    // Show in-app success toast & live voucher modal
    triggerToast({
      type: "success",
      title: "Reward Redeemed!",
      message: `${item.title} added to My Vouchers.`,
      icon: "🎉",
    });

    setShowVoucherModal(newVoucher);
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
      {/* ========================================================
          IN-APP NOTIFICATION TOAST (NO BROWSER ALERT)
          ======================================================== */}
      {inAppToast && (
        <div
          style={{
            position: "absolute",
            top: "52px",
            left: "14px",
            right: "14px",
            zIndex: 250,
            background: inAppToast.type === "success" ? "#111215" : "#3b1717",
            color: "#ffffff",
            borderRadius: "18px",
            padding: "12px 14px",
            border: inAppToast.type === "success" ? "2px solid #f5c842" : "2px solid #ff6b6b",
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "slide-down 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <span style={{ fontSize: "22px", flexShrink: 0 }}>
            {inAppToast.icon || (inAppToast.type === "success" ? "🎉" : "⚠️")}
          </span>
          <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
            <strong style={{ fontSize: "12.5px", display: "block", color: "#ffffff", fontWeight: 800 }}>
              {inAppToast.title}
            </strong>
            <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#e2e2e2", lineHeight: 1.3 }}>
              {inAppToast.message}
            </p>
          </div>
          <button
            onClick={() => setInAppToast(null)}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: 0,
              color: "#ffffff",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "grid",
              placeItems: "center",
              fontSize: "11px",
              cursor: "pointer",
              flexShrink: 0,
            }}
            type="button"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Phone Status Bar */}
      <div className="status-bar light-theme" style={{ flexShrink: 0 }}>
        <span>9:41</span>
        <div className="status-icons">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Screen Navigation Header */}
      <div
        style={{
          background: "#ffffff",
          borderBottom: "1.5px solid #e7e4dc",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            aria-label="Back to Profile"
            onClick={onBack}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1.5px solid #e7e4dc",
              background: "#f8f7f2",
              color: "#333333",
              fontSize: "16px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              transition: "transform 0.1s ease",
            }}
            title="Back"
            type="button"
          >
            ←
          </button>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "17px",
                fontWeight: 800,
                color: "#17181c",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Redeem Rewards
            </h1>
            <span style={{ fontSize: "10.5px", color: "#666", fontWeight: 600 }}>
              Township Perks & Partner Vouchers
            </span>
          </div>
        </div>

        {/* Current Points Badge (Soft Golden Amber Pill matching Profile) */}
        <div
          style={{
            background: "#fef8e3",
            border: "1.5px solid #fae29c",
            padding: "5px 12px",
            borderRadius: "99px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            boxShadow: "0 2px 6px rgba(133, 77, 14, 0.08)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "13px" }}>🪙</span>
          <strong style={{ fontSize: "13px", color: "#854d0e", fontWeight: 800 }}>
            {points} pts
          </strong>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 14px 34px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxSizing: "border-box",
        }}
      >
        {/* ========================================================
            HERO CARD: SIGNATURE WARM FOLDER WALLET
            (Softer warm golden theme matching Today & Profile)
            ======================================================== */}
        <div
          style={{
            background: "linear-gradient(135deg, #fff9db 0%, #fef3c7 50%, #fde68a 100%)",
            border: "1.5px solid #fae29c",
            borderRadius: "22px",
            padding: "16px 18px",
            boxShadow: "0 8px 24px rgba(245, 200, 66, 0.22)",
            position: "relative",
            flexShrink: 0,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {/* Top Row: Resident Tier & Category */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#854d0e",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>⭐</span> COMMUNITY WALLET
            </span>

            <span
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                color: "#854d0e",
                fontSize: "10px",
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: "99px",
                border: "1px solid #fae29c",
                boxShadow: "0 1px 4px rgba(133, 77, 14, 0.08)",
                display: "inline-block",
              }}
            >
              🥈 Silver Resident
            </span>
          </div>

          {/* Big Balance Number — Warm Amber (Refer to other pages, not pitch black) */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "4px 0 2px" }}>
            <span
              style={{
                fontSize: "38px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#854d0e",
                lineHeight: 1,
              }}
            >
              {points}
            </span>
            <span
              style={{
                fontSize: "12.5px",
                fontWeight: 800,
                color: "#854d0e",
                background: "rgba(255, 255, 255, 0.85)",
                border: "1px solid #fae29c",
                padding: "3px 8px",
                borderRadius: "8px",
                boxShadow: "0 1.5px 4px rgba(133, 77, 14, 0.06)",
              }}
            >
              POINTS
            </span>
          </div>

          <p style={{ margin: "2px 0 10px", fontSize: "11px", color: "#78350f", fontWeight: 600 }}>
            Precinct 4 · Active Contributor
          </p>

          {/* Tier Progress Bar: Warm Amber/Orange Fill (Not pitch black) */}
          <div style={{ marginTop: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10.5px",
                fontWeight: 700,
                color: "#854d0e",
                marginBottom: "4px",
              }}
            >
              <span>Next: Gold Tier (500 pts)</span>
              <span>{Math.min(100, Math.round((points / 500) * 100))}%</span>
            </div>
            <div
              style={{
                height: "8px",
                width: "100%",
                background: "rgba(255, 255, 255, 0.85)",
                border: "1px solid #fae29c",
                borderRadius: "99px",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, (points / 500) * 100)}%`,
                  background: "linear-gradient(90deg, #f59f00, #ea580c)",
                  borderRadius: "99px",
                }}
              />
            </div>
          </div>

          {/* Streak Boost Bar & How to Earn Button */}
          <div
            style={{
              marginTop: "12px",
              paddingTop: "10px",
              borderTop: "1px dashed rgba(133, 77, 14, 0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "11px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: 700,
                color: "#78350f",
              }}
            >
              <span>🔥</span>
              <span>6d Streak: 1.2x Multiplier</span>
            </div>

            <button
              onClick={() => setShowHowToEarn(!showHowToEarn)}
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #fae29c",
                borderRadius: "8px",
                padding: "3px 9px",
                color: "#854d0e",
                fontWeight: 800,
                fontSize: "10.5px",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(133, 77, 14, 0.08)",
              }}
              type="button"
            >
              {showHowToEarn ? "Hide Guide ▲" : "How to Earn ▼"}
            </button>
          </div>
        </div>

        {/* ========================================================
            COLLAPSIBLE HOW TO EARN GUIDE (SOLID BOX)
            ======================================================== */}
        {showHowToEarn && (
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #fae29c",
              borderRadius: "18px",
              padding: "14px 16px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
              flexShrink: 0,
            }}
          >
            <strong
              style={{
                fontSize: "12px",
                color: "#854d0e",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "10px",
                fontWeight: 800,
              }}
            >
              <span>💡</span> HOW TO EARN COMMUNITY POINTS:
            </strong>
            <div style={{ display: "grid", gap: "8px", fontSize: "11px", color: "#333" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>🏸 Attend a Township Activity</span>
                <span
                  style={{
                    background: "#eaf8f0",
                    border: "1px solid #2f9e44",
                    color: "#2f9e44",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "6px",
                  }}
                >
                  +20 pts
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>📅 Daily Streak Activity Check-in</span>
                <span
                  style={{
                    background: "#eaf8f0",
                    border: "1px solid #2f9e44",
                    color: "#2f9e44",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "6px",
                  }}
                >
                  +10 pts
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>🌟 Host an Event for Neighbours</span>
                <span
                  style={{
                    background: "#eaf8f0",
                    border: "1px solid #2f9e44",
                    color: "#2f9e44",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "6px",
                  }}
                >
                  +50 pts
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>🤝 Pair up with an Activity Buddy</span>
                <span
                  style={{
                    background: "#eaf8f0",
                    border: "1px solid #2f9e44",
                    color: "#2f9e44",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "6px",
                  }}
                >
                  +15 pts
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>📸 Pin a Moment on Township Scrapbook</span>
                <span
                  style={{
                    background: "#eaf8f0",
                    border: "1px solid #2f9e44",
                    color: "#2f9e44",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "6px",
                  }}
                >
                  +10 pts
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB SWITCHER: CATALOG VS MY VOUCHERS (SOLID BOX)
            ======================================================== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "#edeae3",
            borderRadius: "14px",
            padding: "3px",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setActiveTab("catalog")}
            style={{
              padding: "8px 0",
              borderRadius: "11px",
              border: 0,
              background: activeTab === "catalog" ? "#ffffff" : "transparent",
              color: activeTab === "catalog" ? "#17181c" : "#666",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: activeTab === "catalog" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.15s ease",
            }}
            type="button"
          >
            <span>🎁</span> Rewards Catalog ({defaultRewards.length})
          </button>

          <button
            onClick={() => setActiveTab("my_vouchers")}
            style={{
              padding: "8px 0",
              borderRadius: "11px",
              border: 0,
              background: activeTab === "my_vouchers" ? "#ffffff" : "transparent",
              color: activeTab === "my_vouchers" ? "#17181c" : "#666",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: activeTab === "my_vouchers" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.15s ease",
            }}
            type="button"
          >
            <span>🎟️</span> My Vouchers ({vouchers.length})
          </button>
        </div>

        {/* ========================================================
            TAB 1: REWARDS CATALOG (SOLID BOX CARDS)
            ======================================================== */}
        {activeTab === "catalog" && (
          <>
            {/* Category Filter Pills (Soft Harmonious Pills) */}
            <div
              style={{
                display: "flex",
                gap: "7px",
                overflowX: "auto",
                scrollbarWidth: "none",
                paddingBottom: "4px",
                flexShrink: 0,
              }}
            >
              {categories.map((c) => {
                const isSelected = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    style={{
                      padding: "6px 13px",
                      borderRadius: "99px",
                      border: isSelected ? "1.5px solid #111215" : "1.5px solid #dcd8cf",
                      background: isSelected ? "#111215" : "#ffffff",
                      color: isSelected ? "#ffffff" : "#444444",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                      transition: "transform 0.1s ease",
                    }}
                    type="button"
                  >
                    <span>{c.icon}</span> {c.label}
                  </button>
                );
              })}
            </div>

            {/* Rewards Cards List — SOLID BOXES WITH WARM PALETTE */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredRewards.map((item) => {
                const canAfford = points >= item.pointsCost;

                // Category theme accent colors
                const themeTag =
                  item.category === "dining"
                    ? { bg: "#fef8e3", border: "#fae29c", color: "#854d0e", label: "☕ CAFE & DINING" }
                    : item.category === "sports"
                    ? { bg: "#eef5ff", border: "#bfdbfe", color: "#1971c2", label: "🏸 SPORTS & COURTS" }
                    : item.category === "eco"
                    ? { bg: "#eaf8f0", border: "#bbf7d0", color: "#2f9e44", label: "🌱 TOWNSHIP ECO" }
                    : { bg: "#f4effe", border: "#e9d5ff", color: "#7950f2", label: "🛒 CASH VOUCHER" };

                return (
                  <div
                    key={item.id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "20px",
                      border: "1.5px solid #e7e4dc",
                      padding: "14px 15px",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Top Row: Category Tag & Special Badge */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "9.5px",
                          fontWeight: 800,
                          padding: "2.5px 8px",
                          borderRadius: "6px",
                          background: themeTag.bg,
                          color: themeTag.color,
                          border: `1px solid ${themeTag.border}`,
                          letterSpacing: "0.03em",
                        }}
                      >
                        {themeTag.label}
                      </span>

                      {item.badge && (
                        <span
                          style={{
                            fontSize: "9.5px",
                            fontWeight: 700,
                            padding: "2.5px 8px",
                            borderRadius: "6px",
                            background: "#f4f3ee",
                            color: "#555",
                            border: "1px solid #e2ded4",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Middle Row: Icon & Details */}
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      {/* Big Icon Box (Solid Box) */}
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "16px",
                          background: themeTag.bg,
                          border: `1px solid ${themeTag.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "26px",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>

                      {/* Title & Description */}
                      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                        <strong
                          style={{
                            fontSize: "14px",
                            color: "#17181c",
                            lineHeight: 1.25,
                            fontWeight: 800,
                            display: "block",
                          }}
                        >
                          {item.title}
                        </strong>

                        <span
                          style={{
                            fontSize: "10.5px",
                            color: "#666",
                            fontWeight: 600,
                            display: "block",
                            marginTop: "2px",
                          }}
                        >
                          📍 {item.partner}
                        </span>

                        <p
                          style={{
                            margin: "4px 0 0",
                            fontSize: "11px",
                            color: "#444",
                            lineHeight: 1.38,
                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Points Pill (Warm Golden Amber, not heavy black) & Punchy Redeem Button */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "6px",
                        borderTop: "1px dashed #eee",
                      }}
                    >
                      {/* Points Cost Pill — Warm Amber matching Profile & Streak */}
                      <div
                        style={{
                          background: "#fef8e3",
                          border: "1.5px solid #fae29c",
                          borderRadius: "10px",
                          padding: "5px 11px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          boxShadow: "0 2px 6px rgba(133, 77, 14, 0.06)",
                        }}
                      >
                        <span style={{ fontSize: "13px" }}>🪙</span>
                        <strong style={{ fontSize: "12.5px", color: "#854d0e", fontWeight: 800 }}>
                          {item.pointsCost} PTS
                        </strong>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleInitiateRedeem(item)}
                        style={{
                          padding: "7px 16px",
                          borderRadius: "12px",
                          border: canAfford ? "1.5px solid rgba(0,0,0,0.12)" : "1.5px solid #dcd8cf",
                          background: canAfford ? "var(--folder-yellow, #f5c842)" : "#f1f0eb",
                          color: canAfford ? "#17181c" : "#888888",
                          fontSize: "12px",
                          fontWeight: 800,
                          cursor: canAfford ? "pointer" : "pointer",
                          boxShadow: canAfford ? "0 3px 10px rgba(245,200,66,0.3)" : "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          transition: "transform 0.1s ease",
                        }}
                        type="button"
                      >
                        <span>{canAfford ? "Redeem ➔" : `🔒 Need ${item.pointsCost - points}`}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ========================================================
            TAB 2: MY REDEEMED VOUCHERS (SOLID BOX CARDS)
            ======================================================== */}
        {activeTab === "my_vouchers" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {vouchers.length > 0 ? (
              vouchers.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setShowVoucherModal(v)}
                  style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    border: "1.5px solid #e7e4dc",
                    padding: "14px 16px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: "#fef8e3",
                      border: "1px solid #fae29c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      flexShrink: 0,
                    }}
                  >
                    {v.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <strong style={{ fontSize: "13.5px", color: "#17181c", display: "block", fontWeight: 800 }}>
                      {v.title}
                    </strong>
                    <span style={{ fontSize: "10.5px", color: "#666", display: "block", marginTop: "2px", fontWeight: 600 }}>
                      📍 {v.partner}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "5px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          fontFamily: "monospace",
                          color: "#1864ab",
                          background: "#e7f5ff",
                          border: "1px solid #a5d8ff",
                          padding: "2px 7px",
                          borderRadius: "6px",
                        }}
                      >
                        {v.code}
                      </span>
                      <span style={{ fontSize: "9.5px", color: "#2f9e44", fontWeight: 700 }}>
                        Active
                      </span>
                    </div>
                  </div>

                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <span
                      style={{
                        padding: "7px 12px",
                        borderRadius: "10px",
                        background: "#111215",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: 800,
                        display: "inline-block",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      }}
                    >
                      Show QR ➔
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  border: "1.5px dashed #dedad0",
                  padding: "28px 18px",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "36px", display: "block", marginBottom: "8px" }}>🎟️</span>
                <strong style={{ fontSize: "15px", color: "#17181c", display: "block", fontWeight: 800 }}>
                  No Redeemed Vouchers Yet
                </strong>
                <p style={{ margin: "6px 0 16px", fontSize: "11.5px", color: "#555", lineHeight: 1.4 }}>
                  Browse our community catalog to redeem your points for hot drinks, sports court passes, and grocery vouchers!
                </p>
                <button
                  onClick={() => setActiveTab("catalog")}
                  style={{
                    padding: "9px 18px",
                    borderRadius: "12px",
                    background: "var(--folder-yellow, #f5c842)",
                    color: "#17181c",
                    border: "1px solid rgba(0,0,0,0.1)",
                    boxShadow: "0 3px 10px rgba(245, 200, 66, 0.3)",
                    fontSize: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                  type="button"
                >
                  Browse Rewards Catalog
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          IN-APP CONFIRMATION MODAL SHEET (NO WINDOW.CONFIRM)
          ======================================================== */}
      {confirmingItem && (
        <div aria-modal="true" className="modal-backdrop" role="dialog" style={{ zIndex: 200 }}>
          <div
            className="playful-sheet"
            style={{
              maxWidth: "350px",
              padding: "20px 18px",
              textAlign: "center",
            }}
          >
            <button className="modal-close-pill" onClick={() => setConfirmingItem(null)} type="button">
              ✕
            </button>

            <span style={{ fontSize: "40px", display: "block", marginBottom: "6px" }}>
              {confirmingItem.icon}
            </span>

            <h3 style={{ margin: "4px 0 4px", fontSize: "17px", fontWeight: 800, color: "#17181c" }}>
              Confirm Redemption?
            </h3>
            <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#555" }}>
              Redeem <strong>{confirmingItem.title}</strong>
            </p>

            {/* Points Deduction Breakdown Box */}
            <div
              style={{
                background: "#fef8e3",
                border: "1.5px solid #fae29c",
                borderRadius: "16px",
                padding: "12px 14px",
                boxShadow: "0 2px 8px rgba(133, 77, 14, 0.06)",
                marginBottom: "16px",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "6px" }}>
                <span style={{ color: "#666" }}>Your Current Points:</span>
                <strong style={{ color: "#854d0e" }}>{points} pts</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "6px", color: "#d9480f" }}>
                <span>Item Cost:</span>
                <strong style={{ color: "#d9480f" }}>-{confirmingItem.pointsCost} pts</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  fontWeight: 800,
                  paddingTop: "6px",
                  borderTop: "1px dashed #fae29c",
                  color: "#854d0e",
                }}
              >
                <span>Remaining Balance:</span>
                <span>{points - confirmingItem.pointsCost} pts</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                className="btn-punchy yellow"
                onClick={handleConfirmRedeem}
                style={{
                  minHeight: "44px",
                  fontSize: "13px",
                  fontWeight: 800,
                }}
                type="button"
              >
                ✨ Yes, Redeem Now
              </button>

              <button
                onClick={() => setConfirmingItem(null)}
                style={{
                  minHeight: "40px",
                  borderRadius: "14px",
                  border: "1.5px solid #dcd8cf",
                  background: "#ffffff",
                  color: "#555",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
                type="button"
              >
                Not Now, Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          POPUP: LIVE VOUCHER BARCODE / QR MODAL
          ======================================================== */}
      {showVoucherModal && (
        <div aria-modal="true" className="modal-backdrop" role="dialog" style={{ zIndex: 220 }}>
          <div
            className="playful-sheet"
            style={{
              textAlign: "center",
              maxWidth: "340px",
              padding: "20px 18px",
            }}
          >
            <button className="modal-close-pill" onClick={() => setShowVoucherModal(null)} type="button">
              ✕
            </button>

            <span style={{ fontSize: "36px", display: "block", marginBottom: "4px" }}>
              {showVoucherModal.icon}
            </span>

            <span
              style={{
                fontSize: "10px",
                color: "#197142",
                fontWeight: 800,
                textTransform: "uppercase",
                background: "#eaf8f0",
                border: "1px solid #c8e6c9",
                padding: "3px 10px",
                borderRadius: "99px",
                display: "inline-block",
              }}
            >
              ✓ ACTIVE VOUCHER READY
            </span>

            <h3 style={{ margin: "8px 0 2px", fontSize: "16px", fontWeight: 800, color: "#17181c" }}>
              {showVoucherModal.title}
            </h3>
            <span style={{ fontSize: "11px", color: "#666", display: "block", marginBottom: "14px", fontWeight: 600 }}>
              📍 {showVoucherModal.partner}
            </span>

            {/* Barcode & QR Box */}
            <div
              style={{
                background: "#ffffff",
                border: "1.5px solid #e7e4dc",
                borderRadius: "16px",
                padding: "16px 14px",
                margin: "0 0 14px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {/* Simulated QR Code Graphic */}
              <div
                style={{
                  width: "124px",
                  height: "124px",
                  margin: "0 auto 12px",
                  background: "#111215",
                  padding: "8px",
                  borderRadius: "10px",
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: "3px",
                }}
              >
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      background: (i * 7 + 3) % 2 === 0 ? "#ffffff" : "#111111",
                      borderRadius: "1px",
                    }}
                  />
                ))}
              </div>

              <span style={{ fontSize: "10.5px", color: "#666", display: "block", fontWeight: 600 }}>
                Digital Voucher Code:
              </span>
              <strong
                style={{
                  fontSize: "17px",
                  letterSpacing: "0.08em",
                  color: "#17181c",
                  fontFamily: "monospace",
                  display: "block",
                  margin: "3px 0",
                  fontWeight: 800,
                }}
              >
                {showVoucherModal.code}
              </strong>
              <div style={{ fontSize: "10px", color: "#888", marginTop: "4px" }}>
                {showVoucherModal.expiryDate}
              </div>
            </div>

            <p style={{ margin: "0 0 14px", fontSize: "11px", color: "#555", lineHeight: 1.35 }}>
              Show this QR code at the counter to redeem your community reward!
            </p>

            <button
              className="btn-punchy yellow"
              onClick={() => setShowVoucherModal(null)}
              style={{
                minHeight: "42px",
                fontSize: "12.5px",
                fontWeight: 800,
              }}
              type="button"
            >
              Done & Save Voucher
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
