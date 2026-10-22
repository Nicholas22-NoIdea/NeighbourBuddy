import { useState } from "react";
import { AvatarConfig, CustomAvatar, HairStyle, Expression, Accessory, Outfit, AvatarAnimation } from "./Avatar";

const skinTones = [
  { label: "Fair", value: "#fce0cb" },
  { label: "Peach", value: "#f5c6a5" },
  { label: "Warm Tan", value: "#e5b895" },
  { label: "Golden", value: "#d89e78" },
  { label: "Deep Bronze", value: "#a16b47" },
  { label: "Rich Mocha", value: "#6e472a" },
];

const hairStyles: { label: string; value: HairStyle; icon: string }[] = [
  { label: "Fade", value: "fade", icon: "💈" },
  { label: "Sporty", value: "sporty", icon: "⚡" },
  { label: "Curly", value: "curly", icon: "🌀" },
  { label: "Ponytail", value: "ponytail", icon: "🎀" },
  { label: "Top Bun", value: "bun", icon: "🍡" },
  { label: "Wavy", value: "wavy", icon: "🌊" },
  { label: "Cap", value: "cap", icon: "🧢" },
  { label: "Beanie", value: "beanie", icon: "🧶" },
  { label: "Afro", value: "afro", icon: "👑" },
];

const hairColors = [
  { label: "Jet Black", value: "#1e1e24" },
  { label: "Espresso", value: "#3e2723" },
  { label: "Chestnut", value: "#5d4037" },
  { label: "Honey", value: "#b07d4b" },
  { label: "Platinum", value: "#d9d9d9" },
  { label: "Neon Pink", value: "#f06292" },
  { label: "Sky Blue", value: "#3d8bfd" },
];

const expressions: { label: string; value: Expression; icon: string }[] = [
  { label: "Happy", value: "smile", icon: "😊" },
  { label: "Sporty", value: "sporty", icon: "😏" },
  { label: "Wink", value: "wink", icon: "😉" },
  { label: "Cool", value: "cool", icon: "😎" },
  { label: "Laugh", value: "laugh", icon: "😄" },
  { label: "Star Eyes", value: "star-eyes", icon: "🤩" },
  { label: "Tongue", value: "tongue", icon: "😋" },
];

const accessories: { label: string; value: Accessory; icon: string }[] = [
  { label: "None", value: "none", icon: "🚫" },
  { label: "Badminton", value: "badminton", icon: "🏸" },
  { label: "Boba Tea", value: "boba", icon: "🧋" },
  { label: "Cat Ears", value: "catears", icon: "🐱" },
  { label: "Gold Medal", value: "medal", icon: "🥇" },
  { label: "Star Halo", value: "halo", icon: "😇" },
  { label: "Party Hat", value: "party", icon: "🥳" },
  { label: "Headband", value: "headband", icon: "🔴" },
  { label: "Headphones", value: "headphones", icon: "🎧" },
  { label: "Coffee", value: "coffee", icon: "☕" },
  { label: "Shades", value: "shades", icon: "🕶️" },
];

const outfits: { label: string; value: Outfit; icon: string }[] = [
  { label: "Jersey #7", value: "jersey", icon: "🎽" },
  { label: "Hoodie", value: "hoodie", icon: "🧥" },
  { label: "Casual Tee", value: "tee", icon: "👕" },
  { label: "Yoga Tank", value: "yoga", icon: "🧘" },
  { label: "Varsity Jacket", value: "jacket", icon: "🏆" },
];

const avatarMoves: { label: string; value: AvatarAnimation; icon: string; desc: string }[] = [
  { label: "Idle Float", value: "idle", icon: "🍃", desc: "Gentle breathing & eye blinks" },
  { label: "Happy Wave", value: "wave", icon: "👋", desc: "Waving cheerfully to neighbours" },
  { label: "Spring Bounce", value: "bounce", icon: "🦘", desc: "Energetic bounce of joy" },
  { label: "Victory Cheer", value: "cheer", icon: "🎉", desc: "Celebration double bounce" },
  { label: "360 Spin", value: "spin", icon: "🌀", desc: "Fun 360-degree pirouette" },
];

const outfitColors = [
  { label: "Township Green", value: "#246b50" },
  { label: "Coral Red", value: "#f36458" },
  { label: "Cobalt Blue", value: "#3d8bfd" },
  { label: "Sunny Yellow", value: "#f5c842" },
  { label: "Lilac Purple", value: "#ba9cfc" },
  { label: "Carbon Black", value: "#1e2025" },
];

const bgGradients = [
  { label: "Sunburst", value: "linear-gradient(135deg, #f5c842, #f28b24)" },
  { label: "Matcha", value: "linear-gradient(135deg, #38b776, #3d8bfd)" },
  { label: "Berry", value: "linear-gradient(135deg, #f36458, #f8c83a)" },
  { label: "Lavender", value: "linear-gradient(135deg, #ba9cfc, #f06292)" },
  { label: "Ocean", value: "linear-gradient(135deg, #3d8bfd, #38b776)" },
  { label: "Neon Pink", value: "linear-gradient(135deg, #f06292, #f5c842)" },
];

export function AvatarStudioModal({
  currentAvatar,
  onSave,
  onClose,
  neighbourList = [],
  onSelectNeighbour,
  selectedNeighbourId = "alex",
}: {
  currentAvatar: AvatarConfig;
  onSave: (saved: AvatarConfig) => void;
  onClose: () => void;
  neighbourList?: { id: string; name: string }[];
  onSelectNeighbour?: (id: string) => void;
  selectedNeighbourId?: string;
}) {
  const [avatar, setAvatar] = useState<AvatarConfig>(currentAvatar);
  const [activeTab, setActiveTab] = useState<"hair" | "face" | "gear" | "outfit" | "moves" | "color">("gear");
  const [previewAnim, setPreviewAnim] = useState<AvatarAnimation>(avatar.animation || "idle");

  const triggerLiveMove = (move: AvatarAnimation) => {
    setPreviewAnim(move);
    setAvatar((prev) => ({ ...prev, animation: move }));
  };

  const randomize = () => {
    const randomSkin = skinTones[Math.floor(Math.random() * skinTones.length)].value;
    const randomHairStyle = hairStyles[Math.floor(Math.random() * hairStyles.length)].value;
    const randomHairColor = hairColors[Math.floor(Math.random() * hairColors.length)].value;
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)].value;
    const randomAccessory = accessories[Math.floor(Math.random() * accessories.length)].value;
    const randomOutfit = outfits[Math.floor(Math.random() * outfits.length)].value;
    const randomOutfitColor = outfitColors[Math.floor(Math.random() * outfitColors.length)].value;
    const randomBg = bgGradients[Math.floor(Math.random() * bgGradients.length)].value;
    const randomMove = avatarMoves[Math.floor(Math.random() * avatarMoves.length)].value;

    setAvatar({
      ...avatar,
      skinTone: randomSkin,
      hairStyle: randomHairStyle,
      hairColor: randomHairColor,
      expression: randomExpression,
      accessory: randomAccessory,
      outfit: randomOutfit,
      outfitColor: randomOutfitColor,
      bgGradient: randomBg,
      animation: randomMove,
    });
    setPreviewAnim(randomMove);
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
      {/* Status Bar */}
      <div className="status-bar light-theme">
        <span>9:41</span>
        <div className="status-icons">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Top Header Bar */}
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
            onClick={onClose}
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
          <div>
            <h1 style={{ margin: 0, fontSize: "15px", fontWeight: 900, color: "#111215", letterSpacing: "-0.01em" }}>
              Animated Avatar Studio
            </h1>
            <span style={{ fontSize: "10.5px", color: "#666", fontWeight: 600 }}>
              Equip sports gear & customize resident moves
            </span>
          </div>
        </div>

        <button
          onClick={randomize}
          style={{
            padding: "6px 12px",
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
          }}
          type="button"
        >
          🎲 Shuffle
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          boxSizing: "border-box",
        }}
      >
        {/* Neighbour selector pill row if list provided */}
        {neighbourList.length > 0 && onSelectNeighbour && (
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "8px", scrollbarWidth: "none" }}>
            {neighbourList.map((n) => (
              <button
                key={n.id}
                onClick={() => onSelectNeighbour(n.id)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "99px",
                  border: selectedNeighbourId === n.id ? "1.5px solid #111" : "1px solid #ddd",
                  background: selectedNeighbourId === n.id ? "#111" : "white",
                  color: selectedNeighbourId === n.id ? "white" : "#444",
                  fontSize: "10px",
                  fontWeight: 700,
                  flexShrink: 0,
                  cursor: "pointer",
                }}
                type="button"
              >
                {n.name}
              </button>
            ))}
          </div>
        )}

        {/* Live Large Animated Avatar Showcase */}
        <div
          style={{
            background: "linear-gradient(180deg, #fbfbf9 0%, #edece6 100%)",
            borderRadius: "22px",
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            marginBottom: "12px",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%", justifyContent: "center" }}>
            <div style={{ position: "relative" }}>
              <CustomAvatar config={avatar} forcedAnimation={previewAnim} showGlow={true} size={102} />
              <span
                style={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  background: "#111",
                  color: "white",
                  fontSize: "9px",
                  fontWeight: 800,
                  padding: "2px 6px",
                  borderRadius: "99px",
                  border: "1.5px solid white",
                }}
              >
                LIVE 🟢
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <strong style={{ fontSize: "14px" }}>{avatar.name || "Alex Tan"}</strong>
              <span style={{ fontSize: "10px", color: "#666" }}>
                ✨ {avatar.hairStyle} · {avatar.accessory !== "none" ? avatar.accessory : "no gear"}
              </span>

              <button
                onClick={randomize}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "5px 10px",
                  borderRadius: "10px",
                  border: "1.5px solid #111",
                  background: "var(--folder-yellow)",
                  fontSize: "10.5px",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                }}
                type="button"
              >
                🎲 Shuffle Style
              </button>
            </div>
          </div>

          {/* Quick interactive move triggers */}
          <div style={{ display: "flex", gap: "5px", marginTop: "12px", width: "100%", justifyContent: "center", overflowX: "auto" }}>
            {avatarMoves.map((m) => (
              <button
                key={m.value}
                onClick={() => triggerLiveMove(m.value)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "8px",
                  background: previewAnim === m.value ? "#111" : "white",
                  color: previewAnim === m.value ? "white" : "#333",
                  border: "1px solid #ddd",
                  fontSize: "9.5px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  flexShrink: 0,
                }}
                type="button"
              >
                <span>{m.icon}</span> {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "3px",
            background: "#f0f0ea",
            padding: "3px",
            borderRadius: "14px",
            marginBottom: "10px",
          }}
        >
          {[
            { id: "gear", label: "Gear 🏸" },
            { id: "moves", label: "Moves 🕺" },
            { id: "face", label: "Face 😊" },
            { id: "hair", label: "Hair 💇" },
            { id: "outfit", label: "Outfit 👕" },
            { id: "color", label: "Glow 🎨" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: "6px 2px",
                borderRadius: "10px",
                border: 0,
                background: activeTab === t.id ? "white" : "transparent",
                color: activeTab === t.id ? "#111" : "#666",
                fontSize: "9.5px",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: activeTab === t.id ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                transition: "all .15s ease",
              }}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Sport Gear & Fun Accessories */}
        {activeTab === "gear" && (
          <div>
            <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#666", marginBottom: "6px" }}>EQUIP GEAR & ACCESSORIES</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px", maxHeight: "170px", overflowY: "auto" }}>
              {accessories.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setAvatar({ ...avatar, accessory: a.value })}
                  style={{
                    padding: "8px 4px",
                    borderRadius: "12px",
                    border: avatar.accessory === a.value ? "2px solid #111" : "1px solid #e2e2dc",
                    background: avatar.accessory === a.value ? "var(--folder-yellow-light)" : "white",
                    fontSize: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  type="button"
                >
                  <div style={{ fontSize: "20px", marginBottom: "2px" }}>{a.icon}</div>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Living Moves & Dances */}
        {activeTab === "moves" && (
          <div>
            <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#666", marginBottom: "6px" }}>CHOOSE LIVING MOVE / DANCE</div>
            <div style={{ display: "grid", gap: "6px", maxHeight: "170px", overflowY: "auto" }}>
              {avatarMoves.map((m) => (
                <button
                  key={m.value}
                  onClick={() => triggerLiveMove(m.value)}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "12px",
                    border: (avatar.animation || "idle") === m.value ? "2px solid #111" : "1px solid #e2e2dc",
                    background: (avatar.animation || "idle") === m.value ? "var(--folder-yellow-light)" : "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  type="button"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "22px" }}>{m.icon}</span>
                    <div>
                      <strong style={{ fontSize: "11px", display: "block" }}>{m.label}</strong>
                      <span style={{ fontSize: "9.5px", color: "#666" }}>{m.desc}</span>
                    </div>
                  </div>
                  {(avatar.animation || "idle") === m.value && (
                    <span style={{ fontSize: "12px", fontWeight: 900, color: "#111" }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Face & Expressions */}
        {activeTab === "face" && (
          <div>
            <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#666", marginBottom: "6px" }}>EXPRESSION</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "5px", marginBottom: "10px" }}>
              {expressions.map((e) => (
                <button
                  key={e.value}
                  onClick={() => setAvatar({ ...avatar, expression: e.value })}
                  style={{
                    padding: "7px 2px",
                    borderRadius: "12px",
                    border: avatar.expression === e.value ? "2px solid #111" : "1px solid #e2e2dc",
                    background: avatar.expression === e.value ? "var(--folder-yellow-light)" : "white",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  type="button"
                >
                  <div style={{ fontSize: "18px" }}>{e.icon}</div>
                  {e.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#666", marginBottom: "6px" }}>SKIN TONE</div>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {skinTones.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setAvatar({ ...avatar, skinTone: s.value })}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: s.value,
                    border: avatar.skinTone === s.value ? "3px solid #111" : "2px solid white",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                  title={s.label}
                  type="button"
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab: Hair Style & Color */}
        {activeTab === "hair" && (
          <div>
            <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#666", marginBottom: "6px" }}>HAIR STYLE</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px", marginBottom: "10px", maxHeight: "130px", overflowY: "auto" }}>
              {hairStyles.map((h) => (
                <button
                  key={h.value}
                  onClick={() => setAvatar({ ...avatar, hairStyle: h.value })}
                  style={{
                    padding: "7px 4px",
                    borderRadius: "12px",
                    border: avatar.hairStyle === h.value ? "2px solid #111" : "1px solid #e2e2dc",
                    background: avatar.hairStyle === h.value ? "var(--folder-yellow-light)" : "white",
                    fontSize: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  type="button"
                >
                  <div style={{ fontSize: "16px" }}>{h.icon}</div>
                  {h.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#666", marginBottom: "6px" }}>HAIR COLOR</div>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {hairColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setAvatar({ ...avatar, hairColor: c.value })}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: c.value,
                    border: avatar.hairColor === c.value ? "3px solid #111" : "2px solid white",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                  title={c.label}
                  type="button"
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab: Outfit Style & Color */}
        {activeTab === "outfit" && (
          <div>
            <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#666", marginBottom: "6px" }}>OUTFIT STYLE</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px", marginBottom: "10px" }}>
              {outfits.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setAvatar({ ...avatar, outfit: o.value })}
                  style={{
                    padding: "8px 2px",
                    borderRadius: "12px",
                    border: avatar.outfit === o.value ? "2px solid #111" : "1px solid #e2e2dc",
                    background: avatar.outfit === o.value ? "var(--folder-yellow-light)" : "white",
                    fontSize: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  type="button"
                >
                  <div style={{ fontSize: "18px" }}>{o.icon}</div>
                  {o.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#666", marginBottom: "6px" }}>OUTFIT COLOR</div>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {outfitColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setAvatar({ ...avatar, outfitColor: c.value })}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: c.value,
                    border: avatar.outfitColor === c.value ? "3px solid #111" : "2px solid white",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                  title={c.label}
                  type="button"
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab: Background Glow */}
        {activeTab === "color" && (
          <div>
            <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#666", marginBottom: "6px" }}>BACKGROUND GLOW</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px", marginBottom: "12px" }}>
              {bgGradients.map((g) => (
                <button
                  key={g.label}
                  onClick={() => setAvatar({ ...avatar, bgGradient: g.value })}
                  style={{
                    height: "36px",
                    borderRadius: "12px",
                    background: g.value,
                    border: avatar.bgGradient === g.value ? "2.5px solid #111" : "1px solid rgba(0,0,0,0.1)",
                    color: "white",
                    fontSize: "9.5px",
                    fontWeight: 800,
                    cursor: "pointer",
                    textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  }}
                  type="button"
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Save Action Bar */}
      <div
        style={{
          background: "#ffffff",
          borderTop: "1.5px solid #e7e4dc",
          padding: "12px 16px 14px",
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "10px",
          flexShrink: 0,
          boxShadow: "0 -4px 14px rgba(0,0,0,0.05)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "12px",
            borderRadius: "12px",
            border: "1.5px solid #dedad0",
            background: "#ffffff",
            color: "#111215",
            fontSize: "12.5px",
            fontWeight: 800,
            cursor: "pointer",
          }}
          type="button"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onSave(avatar);
            onClose();
          }}
          style={{
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
          Save Avatar ✨
        </button>
      </div>
    </div>
  );
}
