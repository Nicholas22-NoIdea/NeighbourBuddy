export type HairStyle = "fade" | "curly" | "wavy" | "cap" | "ponytail" | "sporty" | "bun" | "beanie" | "afro";
export type Expression = "smile" | "cool" | "wink" | "laugh" | "sporty" | "star-eyes" | "tongue";
export type Accessory = "none" | "badminton" | "headband" | "headphones" | "coffee" | "shades" | "boba" | "medal" | "catears" | "halo" | "party";
export type Outfit = "jersey" | "hoodie" | "tee" | "yoga" | "jacket";
export type AvatarAnimation = "idle" | "wave" | "bounce" | "cheer" | "spin" | "none";

export type AvatarConfig = {
  id?: string;
  name?: string;
  skinTone: string;
  hairStyle: HairStyle;
  hairColor: string;
  expression: Expression;
  accessory: Accessory;
  outfit: Outfit;
  outfitColor: string;
  bgGradient: string;
  animation?: AvatarAnimation;
};

export const defaultAvatars: Record<string, AvatarConfig> = {
  alex: {
    id: "alex",
    name: "Alex Tan",
    skinTone: "#f5c6a5",
    hairStyle: "fade",
    hairColor: "#1e1e24",
    expression: "sporty",
    accessory: "badminton",
    outfit: "jersey",
    outfitColor: "#246b50",
    bgGradient: "linear-gradient(135deg, #f5c842, #f28b24)",
    animation: "idle",
  },
  jamie: {
    id: "jamie",
    name: "Jamie",
    skinTone: "#e5b895",
    hairStyle: "curly",
    hairColor: "#3e2723",
    expression: "smile",
    accessory: "boba",
    outfit: "hoodie",
    outfitColor: "#f36458",
    bgGradient: "linear-gradient(135deg, #f36458, #f8c83a)",
    animation: "idle",
  },
  michelle: {
    id: "michelle",
    name: "Michelle",
    skinTone: "#fcd5b8",
    hairStyle: "ponytail",
    hairColor: "#211a1d",
    expression: "cool",
    accessory: "headphones",
    outfit: "tee",
    outfitColor: "#38b776",
    bgGradient: "linear-gradient(135deg, #38b776, #3d8bfd)",
    animation: "idle",
  },
  sarah: {
    id: "sarah",
    name: "Sarah",
    skinTone: "#f5c6a5",
    hairStyle: "bun",
    hairColor: "#5d4037",
    expression: "laugh",
    accessory: "badminton",
    outfit: "jersey",
    outfitColor: "#ba9cfc",
    bgGradient: "linear-gradient(135deg, #ba9cfc, #f06292)",
    animation: "idle",
  },
  daniel: {
    id: "daniel",
    name: "Daniel",
    skinTone: "#d89e78",
    hairStyle: "sporty",
    hairColor: "#1f1d1d",
    expression: "wink",
    accessory: "headband",
    outfit: "tee",
    outfitColor: "#3d8bfd",
    bgGradient: "linear-gradient(135deg, #3d8bfd, #38b776)",
    animation: "idle",
  },
  emily: {
    id: "emily",
    name: "Emily",
    skinTone: "#fce0cb",
    hairStyle: "wavy",
    hairColor: "#8d5b4c",
    expression: "star-eyes",
    accessory: "catears",
    outfit: "yoga",
    outfitColor: "#f06292",
    bgGradient: "linear-gradient(135deg, #f06292, #f5c842)",
    animation: "idle",
  },
  priya: {
    id: "priya",
    name: "Priya",
    skinTone: "#a16b47",
    hairStyle: "bun",
    hairColor: "#111111",
    expression: "cool",
    accessory: "shades",
    outfit: "jacket",
    outfitColor: "#ba9cfc",
    bgGradient: "linear-gradient(135deg, #f28b24, #d94876)",
    animation: "idle",
  },
};

export function CustomAvatar({
  config = defaultAvatars.alex,
  size = 48,
  className = "",
  showGlow = false,
  forcedAnimation,
}: {
  config?: AvatarConfig;
  size?: number;
  className?: string;
  showGlow?: boolean;
  forcedAnimation?: AvatarAnimation;
}) {
  const {
    skinTone = "#f5c6a5",
    hairStyle = "fade",
    hairColor = "#1e1e24",
    expression = "smile",
    accessory = "none",
    outfit = "jersey",
    outfitColor = "#246b50",
    bgGradient = "linear-gradient(135deg, #f5c842, #f28b24)",
    animation = "idle",
  } = config;

  const currentAnim = forcedAnimation !== undefined ? forcedAnimation : animation;
  const animClass = currentAnim && currentAnim !== "none" ? `anim-${currentAnim}` : "";

  return (
    <div
      className={`custom-avatar-wrapper ${animClass} ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bgGradient,
        display: "inline-grid",
        placeItems: "center",
        flexShrink: 0,
        position: "relative",
        boxShadow: showGlow ? "0 6px 18px rgba(0,0,0,0.18)" : "none",
        overflow: "hidden",
      }}
    >
      <svg
        height={size}
        style={{ width: "100%", height: "100%", display: "block" }}
        viewBox="0 0 100 100"
        width={size}
      >
        <defs>
          <clipPath id="avatar-circle">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>

        {/* Floating Halo if accessory === halo (peeks outside clip) */}
        {accessory === "halo" && (
          <ellipse
            className="animated-halo"
            cx="50"
            cy="12"
            fill="none"
            rx="20"
            ry="6"
            stroke="#ffd700"
            strokeWidth="3"
          />
        )}

        <g clipPath="url(#avatar-circle)">
          {/* Badminton Racket & Shuttlecock */}
          {accessory === "badminton" && (
            <g>
              <g className="animated-racket">
                <ellipse cx="14" cy="18" fill="none" rx="11" ry="14" stroke="#ffffff" strokeWidth="2.5" />
                <line stroke="#ffffff" strokeWidth="2.5" x1="14" x2="14" y1="32" y2="60" />
                <line opacity="0.6" stroke="#ffffff" strokeWidth="0.8" x1="6" x2="22" y1="14" y2="14" />
                <line opacity="0.6" stroke="#ffffff" strokeWidth="0.8" x1="6" x2="22" y1="18" y2="18" />
                <line opacity="0.6" stroke="#ffffff" strokeWidth="0.8" x1="6" x2="22" y1="22" y2="22" />
                <line opacity="0.6" stroke="#ffffff" strokeWidth="0.8" x1="10" x2="10" y1="6" y2="30" />
                <line opacity="0.6" stroke="#ffffff" strokeWidth="0.8" x1="14" x2="14" y1="5" y2="31" />
                <line opacity="0.6" stroke="#ffffff" strokeWidth="0.8" x1="18" x2="18" y1="6" y2="30" />
              </g>
              {/* Floating animated shuttlecock */}
              <g className="animated-shuttlecock">
                <polygon fill="#ffffff" points="0,0 8,2 7,8 1,6" opacity="0.9" />
                <circle cx="2" cy="7" fill="#f5c842" r="2.2" />
              </g>
            </g>
          )}

          {/* Neck */}
          <rect fill={skinTone} height="20" rx="4" width="16" x="42" y="62" />

          {/* Outfits */}
          {outfit === "jersey" && (
            <g>
              <path d="M16 100 C16 75, 30 70, 50 70 C70 70, 84 75, 84 100 Z" fill={outfitColor} />
              <path d="M40 70 L50 82 L60 70 Z" fill={skinTone} />
              <line stroke="#ffffff" strokeWidth="2" x1="26" x2="30" y1="78" y2="100" />
              <line stroke="#ffffff" strokeWidth="2" x1="74" x2="70" y1="78" y2="100" />
              <text fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle" x="50" y="94">7</text>
            </g>
          )}

          {outfit === "hoodie" && (
            <g>
              <path d="M14 100 C14 74, 30 68, 50 68 C70 68, 86 74, 86 100 Z" fill={outfitColor} />
              <path d="M36 68 C44 76, 56 76, 64 68 Z" fill="#1b1c20" opacity="0.25" />
              <circle cx="45" cy="80" fill="#ffffff" r="2" />
              <circle cx="55" cy="80" fill="#ffffff" r="2" />
              <line stroke="#ffffff" strokeWidth="1.5" x1="45" x2="45" y1="80" y2="92" />
              <line stroke="#ffffff" strokeWidth="1.5" x1="55" x2="55" y1="80" y2="92" />
            </g>
          )}

          {outfit === "tee" && (
            <g>
              <path d="M16 100 C16 76, 32 72, 50 72 C68 72, 84 76, 84 100 Z" fill={outfitColor} />
              <path d="M42 72 C42 78, 58 78, 58 72 Z" fill={skinTone} />
            </g>
          )}

          {outfit === "yoga" && (
            <g>
              <path d="M22 100 C22 78, 34 74, 50 74 C66 74, 78 78, 78 100 Z" fill={outfitColor} />
              <path d="M38 74 C38 84, 62 84, 62 74 Z" fill={skinTone} />
            </g>
          )}

          {outfit === "jacket" && (
            <g>
              {/* Varsity jacket body */}
              <path d="M14 100 C14 74, 30 68, 50 68 C70 68, 86 74, 86 100 Z" fill={outfitColor} />
              {/* White leather sleeves */}
              <path d="M14 100 C14 74, 26 72, 34 76 L32 100 Z" fill="#f8f9fa" />
              <path d="M86 100 C86 74, 74 72, 66 76 L68 100 Z" fill="#f8f9fa" />
              {/* Letterman collar & Initial B for Buddy */}
              <path d="M42 68 L50 80 L58 68 Z" fill="#1b1c20" />
              <circle cx="50" cy="84" fill="#f5c842" r="1.5" />
              <circle cx="50" cy="90" fill="#f5c842" r="1.5" />
              <text fill="#ffd700" fontSize="9" fontWeight="900" x="38" y="88">B</text>
            </g>
          )}

          {/* Champion Gold Medal if accessory === medal */}
          {accessory === "medal" && (
            <g>
              <line stroke="#3d8bfd" strokeWidth="2.5" x1="42" x2="49" y1="68" y2="82" />
              <line stroke="#ff4757" strokeWidth="2.5" x1="58" x2="51" y1="68" y2="82" />
              <circle cx="50" cy="84" fill="#ffd700" r="5" stroke="#b8860b" strokeWidth="1" />
              <text fill="#683d00" fontSize="6" fontWeight="900" textAnchor="middle" x="50" y="86">1</text>
            </g>
          )}

          {/* Head */}
          <ellipse cx="50" cy="46" fill={skinTone} rx="21" ry="24" />

          {/* Ears */}
          <circle cx="28" cy="46" fill={skinTone} r="5" />
          <circle cx="72" cy="46" fill={skinTone} r="5" />

          {/* Cheeks Blush */}
          <ellipse cx="37" cy="50" fill="#ff6b81" opacity="0.35" rx="4.5" ry="2.8" />
          <ellipse cx="63" cy="50" fill="#ff6b81" opacity="0.35" rx="4.5" ry="2.8" />

          {/* Expressions with Natural Eye Blinking & Micro-Animations */}
          {expression === "smile" && (
            <g>
              <path d="M36 36 Q41 33 46 36" fill="none" stroke="#222" strokeLinecap="round" strokeWidth="2.2" />
              <path d="M54 36 Q59 33 64 36" fill="none" stroke="#222" strokeLinecap="round" strokeWidth="2.2" />
              {/* Blinking eyes */}
              <g className="avatar-blink-group">
                <circle cx="41" cy="42" fill="#1e1e24" r="3.2" />
                <circle cx="59" cy="42" fill="#1e1e24" r="3.2" />
                <circle cx="42" cy="41" fill="#ffffff" r="1.2" />
                <circle cx="60" cy="41" fill="#ffffff" r="1.2" />
              </g>
              <path d="M43 52 Q50 60 57 52" fill="none" stroke="#873e23" strokeLinecap="round" strokeWidth="2.2" />
            </g>
          )}

          {expression === "sporty" && (
            <g>
              <path d="M36 34 L46 36" fill="none" stroke="#111" strokeLinecap="round" strokeWidth="2.4" />
              <path d="M64 34 L54 36" fill="none" stroke="#111" strokeLinecap="round" strokeWidth="2.4" />
              <g className="avatar-blink-group">
                <circle cx="41" cy="42" fill="#111" r="3" />
                <circle cx="59" cy="42" fill="#111" r="3" />
                <circle cx="42" cy="41" fill="#ffffff" r="1" />
                <circle cx="60" cy="41" fill="#ffffff" r="1" />
              </g>
              <path d="M44 54 Q50 58 58 53" fill="none" stroke="#873e23" strokeLinecap="round" strokeWidth="2.2" />
            </g>
          )}

          {expression === "wink" && (
            <g>
              <path d="M36 36 Q41 33 46 36" fill="none" stroke="#222" strokeLinecap="round" strokeWidth="2.2" />
              <path d="M54 35 Q59 32 64 35" fill="none" stroke="#222" strokeLinecap="round" strokeWidth="2.2" />
              <g className="avatar-blink-group">
                <circle cx="41" cy="42" fill="#1e1e24" r="3.2" />
                <circle cx="42" cy="41" fill="#ffffff" r="1.2" />
              </g>
              <path d="M55 42 Q59 39 63 42" fill="none" stroke="#111" strokeLinecap="round" strokeWidth="2.6" />
              <path d="M42 52 Q50 62 58 52 Z" fill="#ffffff" stroke="#873e23" strokeWidth="1.8" />
            </g>
          )}

          {expression === "cool" && (
            <g>
              <path d="M36 35 Q41 33 46 35" fill="none" stroke="#222" strokeLinecap="round" strokeWidth="2.2" />
              <path d="M54 35 Q59 33 64 35" fill="none" stroke="#222" strokeLinecap="round" strokeWidth="2.2" />
              <g className="avatar-blink-group">
                <circle cx="41" cy="42" fill="#1e1e24" r="3" />
                <circle cx="59" cy="42" fill="#1e1e24" r="3" />
              </g>
              <path d="M44 53 Q52 57 57 52" fill="none" stroke="#873e23" strokeLinecap="round" strokeWidth="2.2" />
            </g>
          )}

          {expression === "laugh" && (
            <g>
              <path d="M37 42 Q41 37 45 42" fill="none" stroke="#111" strokeLinecap="round" strokeWidth="2.6" />
              <path d="M55 42 Q59 37 63 42" fill="none" stroke="#111" strokeLinecap="round" strokeWidth="2.6" />
              <path d="M42 50 Q50 64 58 50 Z" fill="#ffffff" stroke="#873e23" strokeWidth="2" />
              <path d="M45 57 Q50 63 55 57" fill="#ff4757" opacity="0.6" />
            </g>
          )}

          {/* Star Eyes (Excited/Hyped) */}
          {expression === "star-eyes" && (
            <g>
              <path d="M36 34 Q41 30 46 34" fill="none" stroke="#111" strokeLinecap="round" strokeWidth="2.4" />
              <path d="M54 34 Q59 30 64 34" fill="none" stroke="#111" strokeLinecap="round" strokeWidth="2.4" />
              {/* Star Eyes */}
              <g transform="translate(41, 42)">
                <polygon
                  className="animated-star-eye"
                  fill="#ffd700"
                  points="0,-4 1.2,-1.2 4,0 1.2,1.2 0,4 -1.2,1.2 -4,0 -1.2,-1.2"
                  stroke="#b8860b"
                  strokeWidth="0.6"
                />
              </g>
              <g transform="translate(59, 42)">
                <polygon
                  className="animated-star-eye"
                  fill="#ffd700"
                  points="0,-4 1.2,-1.2 4,0 1.2,1.2 0,4 -1.2,1.2 -4,0 -1.2,-1.2"
                  stroke="#b8860b"
                  strokeWidth="0.6"
                />
              </g>
              {/* Big excited open mouth */}
              <ellipse cx="50" cy="54" fill="#78231c" rx="6" ry="4" />
              <path d="M46 52 Q50 50 54 52" fill="#ffffff" />
            </g>
          )}

          {/* Tongue Out (Playful) */}
          {expression === "tongue" && (
            <g>
              <path d="M36 36 Q41 33 46 36" fill="none" stroke="#222" strokeLinecap="round" strokeWidth="2.2" />
              <path d="M54 36 Q59 33 64 36" fill="none" stroke="#222" strokeLinecap="round" strokeWidth="2.2" />
              <g className="avatar-blink-group">
                <circle cx="41" cy="42" fill="#1e1e24" r="3.2" />
                <circle cx="59" cy="42" fill="#1e1e24" r="3.2" />
              </g>
              {/* Mouth with cute tongue */}
              <path d="M43 51 Q50 56 57 51" fill="none" stroke="#873e23" strokeLinecap="round" strokeWidth="2.2" />
              <path d="M47 52 C47 60, 53 60, 53 52 Z" fill="#ff6b81" stroke="#d63031" strokeWidth="1" />
              <line stroke="#c0392b" strokeWidth="0.8" x1="50" x2="50" y1="52" y2="57" />
            </g>
          )}

          {/* Nose */}
          <path d="M49 43 Q47 47 50 48" fill="none" stroke="#d4916a" strokeLinecap="round" strokeWidth="1.8" />

          {/* Hair Styles */}
          {hairStyle === "fade" && (
            <g fill={hairColor}>
              <path d="M28 42 C28 22, 40 18, 50 18 C60 18, 72 22, 72 42 C72 36, 68 28, 50 28 C32 28, 28 36, 28 42 Z" />
              <path d="M30 36 C34 22, 46 20, 50 20 C58 20, 68 24, 70 36 C64 26, 54 24, 46 24 C38 24, 32 28, 30 36 Z" />
              <path d="M26 42 Q28 48 30 50 L28 44 Z" opacity="0.4" />
              <path d="M74 42 Q72 48 70 50 L72 44 Z" opacity="0.4" />
            </g>
          )}

          {hairStyle === "sporty" && (
            <g fill={hairColor}>
              <path d="M26 38 C28 20, 36 16, 44 14 L50 22 L56 14 C64 16, 72 20, 74 38 C70 26, 60 22, 50 24 C40 22, 30 26, 26 38 Z" />
            </g>
          )}

          {hairStyle === "curly" && (
            <g fill={hairColor}>
              <circle cx="34" cy="28" r="9" />
              <circle cx="44" cy="22" r="10" />
              <circle cx="56" cy="22" r="10" />
              <circle cx="66" cy="28" r="9" />
              <circle cx="28" cy="36" r="7" />
              <circle cx="72" cy="36" r="7" />
              <path d="M30 38 C34 26, 66 26, 70 38 C64 30, 36 30, 30 38 Z" />
            </g>
          )}

          {hairStyle === "ponytail" && (
            <g fill={hairColor}>
              <path d="M28 42 C28 26, 40 22, 50 22 C60 22, 72 26, 72 42 C68 32, 58 28, 50 28 C42 28, 32 32, 28 42 Z" />
              <path d="M68 26 C80 20, 88 32, 84 48 C80 36, 76 30, 68 26 Z" />
              <circle cx="68" cy="26" fill="#f5c842" r="3" />
            </g>
          )}

          {hairStyle === "bun" && (
            <g fill={hairColor}>
              <path d="M28 42 C28 26, 40 22, 50 22 C60 22, 72 26, 72 42 C68 32, 58 28, 50 28 C42 28, 32 32, 28 42 Z" />
              <ellipse cx="50" cy="16" rx="10" ry="8" />
              <ellipse cx="50" cy="21" fill="#f06292" rx="6" ry="2.5" />
            </g>
          )}

          {hairStyle === "wavy" && (
            <g fill={hairColor}>
              <path d="M26 44 C26 24, 38 20, 50 20 C62 20, 74 24, 74 44 C72 32, 62 26, 50 26 C38 26, 28 32, 26 44 Z" />
              <path d="M24 44 C22 56, 26 68, 30 74 C26 66, 26 52, 28 44 Z" />
              <path d="M76 44 C78 56, 74 68, 70 74 C74 66, 74 52, 72 44 Z" />
            </g>
          )}

          {hairStyle === "cap" && (
            <g>
              <path d="M26 38 C28 24, 40 20, 50 20 C60 20, 72 24, 74 38 Z" fill="#1b1c20" />
              <path d="M22 38 Q50 32 78 38 L84 41 Q50 35 16 41 Z" fill="#2d3038" />
              <circle cx="50" cy="20" fill="#f5c842" r="2" />
            </g>
          )}

          {hairStyle === "beanie" && (
            <g>
              <path d="M24 42 C24 20, 36 12, 50 12 C64 12, 76 20, 76 42 Z" fill={hairColor} />
              <rect fill="#1b1c20" height="8" rx="3" width="54" x="23" y="34" />
              <circle cx="50" cy="10" fill="#f5c842" r="3.5" />
            </g>
          )}

          {hairStyle === "afro" && (
            <g fill={hairColor}>
              <circle cx="30" cy="32" r="11" />
              <circle cx="42" cy="20" r="12" />
              <circle cx="58" cy="20" r="12" />
              <circle cx="70" cy="32" r="11" />
              <circle cx="26" cy="44" r="9" />
              <circle cx="74" cy="44" r="9" />
              <ellipse cx="50" cy="34" rx="24" ry="16" />
            </g>
          )}

          {/* Accessories */}
          {accessory === "headband" && (
            <g>
              <path d="M27 34 Q50 30 73 34 L73 40 Q50 36 27 40 Z" fill="#ffffff" />
              <line stroke="#ff4757" strokeWidth="1.2" x1="28" x2="72" y1="37" y2="37" />
            </g>
          )}

          {accessory === "shades" && (
            <g>
              <rect fill="#1b1c20" height="9" rx="3" width="16" x="33" y="38" />
              <rect fill="#1b1c20" height="9" rx="3" width="16" x="51" y="38" />
              <line stroke="#1b1c20" strokeWidth="2.5" x1="49" x2="51" y1="41" y2="41" />
              <line opacity="0.6" stroke="#ffffff" strokeWidth="1.2" x1="36" x2="44" y1="40" y2="44" />
              <line opacity="0.6" stroke="#ffffff" strokeWidth="1.2" x1="54" x2="62" y1="40" y2="44" />
            </g>
          )}

          {accessory === "headphones" && (
            <g>
              <path d="M26 44 Q24 20 50 20 Q76 20 74 44" fill="none" stroke="#222" strokeWidth="4" />
              <rect fill="#f5c842" height="14" rx="4" width="7" x="22" y="40" />
              <rect fill="#f5c842" height="14" rx="4" width="7" x="71" y="40" />
            </g>
          )}

          {accessory === "coffee" && (
            <g transform="translate(68, 56)">
              {/* Coffee cup */}
              <polygon fill="#ffffff" points="4,12 18,12 16,30 6,30" stroke="#ddd" strokeWidth="1" />
              <rect fill="#8b5a2b" height="6" rx="1" width="12" x="5" y="18" />
              <ellipse cx="11" cy="12" fill="#555" rx="7" ry="2" />
              {/* Rising steam */}
              <path
                className="animated-steam"
                d="M9 10 Q11 6 9 2"
                fill="none"
                stroke="#ffffff"
                strokeLinecap="round"
                strokeWidth="1.2"
              />
              <path
                className="animated-steam"
                d="M13 10 Q15 6 13 2"
                fill="none"
                stroke="#ffffff"
                strokeLinecap="round"
                strokeWidth="1.2"
              />
            </g>
          )}

          {/* Boba Bubble Tea with Tapioca Pearls */}
          {accessory === "boba" && (
            <g className="animated-boba" transform="translate(68, 52)">
              {/* Straw */}
              <line stroke="#ff4757" strokeWidth="2.5" x1="14" x2="16" y1="2" y2="16" />
              {/* Cup */}
              <polygon fill="#fff0db" points="4,10 18,10 16,32 6,32" stroke="#222" strokeWidth="1.2" />
              {/* Tea level */}
              <polygon fill="#e6a760" points="5,14 17,14 15.5,31 6.5,31" />
              {/* Tapioca pearls */}
              <circle cx="8" cy="28" fill="#2d1b09" r="1.6" />
              <circle cx="11.5" cy="29" fill="#2d1b09" r="1.6" />
              <circle cx="14" cy="27" fill="#2d1b09" r="1.6" />
              <circle cx="10" cy="25" fill="#2d1b09" r="1.5" />
            </g>
          )}

          {/* Cat Ears Headband */}
          {accessory === "catears" && (
            <g className="animated-cat-ears">
              {/* Headband arch */}
              <path d="M28 34 Q50 20 72 34" fill="none" stroke="#222" strokeWidth="2" />
              {/* Left ear */}
              <polygon fill="#f06292" points="30,28 33,12 42,24" stroke="#222" strokeWidth="1.2" />
              <polygon fill="#ffffff" points="32,25 34,16 39,23" />
              {/* Right ear */}
              <polygon fill="#f06292" points="70,28 67,12 58,24" stroke="#222" strokeWidth="1.2" />
              <polygon fill="#ffffff" points="68,25 66,16 61,23" />
            </g>
          )}

          {/* Party Cone Hat */}
          {accessory === "party" && (
            <g transform="translate(42, 6) rotate(12)">
              <polygon fill="#f5c842" points="8,0 0,22 16,22" stroke="#e67e22" strokeWidth="1" />
              <circle cx="8" cy="0" fill="#ff4757" r="2.5" />
              <circle cx="8" cy="8" fill="#3d8bfd" r="1.2" />
              <circle cx="5" cy="14" fill="#38b776" r="1.2" />
              <circle cx="11" cy="16" fill="#f06292" r="1.2" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
