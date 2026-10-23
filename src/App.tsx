import { useState, useEffect } from "react";
import { getActivities } from "./services/api"; // Added API service helper
import { AvatarConfig, CustomAvatar, defaultAvatars } from "./components/Avatar";
import { AvatarStudioModal } from "./components/AvatarStudio";
import { StreakPage } from "./components/StreakPage";
import { CreateEventPage } from "./components/CreateEventPage";
import { EventChatPage } from "./components/EventChatPage";
import { EventDetailsPage } from "./components/EventDetailsPage";
import { FlameMascot } from "./components/StreakModal";
import { CommunityChatPage, CommunityData, CommunityChatMessage } from "./components/CommunityChatPage";
import { CommunitiesPage } from "./components/CommunitiesPage";
import { PhotoWallPage } from "./components/PhotoWallPage";
import { IndividualChatPage, DirectChatData, DirectChatMessage } from "./components/IndividualChatPage";
import { RewardsPage } from "./components/RewardsPage";

export type TabName = "today" | "communities" | "wall" | "chats" | "buddies" | "profile";

export type PollOption = {
  id: number;
  text: string;
  votes: number;
};

export type PollData = {
  id: number;
  question: string;
  options: PollOption[];
  userVotedId?: number | null;
  createdBy?: string;
  createdAt?: string;
};

export type ChatMessage = {
  id: number;
  sender: string;
  avatarKey: string;
  time: string;
  text?: string;
  isUser?: boolean;
  poll?: PollData;
};

export type EventData = {
  id: number;
  title: string;
  category: "Sports" | "Social" | "Hobbies" | "Carpool" | "Women-Only";
  date: string;
  time: string;
  venue: string;
  joined: number;
  spots: number;
  host: string;
  hostAvatarKey: string;
  sticker: string;
  color: "yellow" | "green" | "purple" | "salmon" | "blue" | "orange";
  isWomenOnly?: boolean;
  isRecurring?: string;
  skillTag?: string;
  smartRecReason?: string;
  needPlusOne?: string;
  description?: string;
  chatSnippet: {
    sender: string;
    avatarKey: string;
    text: string;
  };
  poll?: PollData;
  chatHistory: ChatMessage[];
  attendeeKeys: string[];
};

export type Buddy = {
  id: number;
  name: string;
  avatarKey: string;
  interests: string[];
  availability: string;
  skillNote: string;
  isFriend: boolean;
  isWomenOnly?: boolean;
  statusMsg: string;
};


export type PhotoMemory = {
  id: number;
  title: string;
  date: string;
  image: string;
  likes: number;
  author: string;
};

// Initial Events List
const initialEvents: EventData[] = [
  {
    id: 1,
    title: "Weekend Badminton Meetup",
    category: "Sports",
    date: "Saturday, 24 Oct",
    time: "8:00 AM",
    venue: "Sports Hall Court 2",
    joined: 8,
    spots: 4,
    host: "Sarah",
    hostAvatarKey: "sarah",
    sticker: "🏸",
    color: "yellow",
    isRecurring: "Every Saturday 8:00 AM",
    skillTag: "🏸 Intermediate (Rally & Rotations)",
    smartRecReason: "Matches your Badminton interest & 2 friends going",
    needPlusOne: "Need 1 more player for 4-player doubles!",
    chatSnippet: {
      sender: "Jamie",
      avatarKey: "jamie",
      text: "Bringing 2 spare Yonex carbon rackets so you don't stress!",
    },
    poll: {
      id: 101,
      question: "Warm-up preference before match play?",
      options: [
        { id: 1, text: "15 min court footwork drills", votes: 5 },
        { id: 2, text: "Straight into friendly rally sets", votes: 3 },
      ],
      userVotedId: null,
    },
    chatHistory: [
      { id: 1, sender: "Sarah", avatarKey: "sarah", time: "8:40 AM", text: "Court 2 & 3 booked! Non-marking shoes required." },
      {
        id: 2,
        sender: "Sarah",
        avatarKey: "sarah",
        time: "8:45 AM",
        poll: {
          id: 101,
          question: "Warm-up preference before match play?",
          options: [
            { id: 1, text: "15 min court footwork drills", votes: 5 },
            { id: 2, text: "Straight into friendly rally sets", votes: 3 },
          ],
          userVotedId: null,
          createdBy: "Sarah",
        },
      },
      { id: 3, sender: "Jamie", avatarKey: "jamie", time: "8:55 AM", text: "Bringing 2 spare Yonex carbon rackets so you don't stress!" },
    ],
    description: "Join us for a friendly doubles sparring session at Sports Hall Court 2. Clean indoor courts reserved. Non-marking badminton shoes required. Open to all township residents and neighbours.",
    attendeeKeys: ["sarah", "jamie", "michelle", "alex"],
  },
  {
    id: 2,
    title: "Sunrise Jog & Township Coffee",
    category: "Sports",
    date: "Sunday, 25 Oct",
    time: "7:00 AM",
    venue: "Central Lake Park",
    joined: 12,
    spots: 6,
    host: "Daniel",
    hostAvatarKey: "daniel",
    sticker: "🏃",
    color: "green",
    isRecurring: "Weekly Sunday 7:00 AM",
    skillTag: "🏃 Target Pace: 5:30 min/km · 5 km",
    smartRecReason: "Matches your 5:30 min/km running target pace",
    description: "Morning scenic 5k trail loop around Central Lake Park. Target pace 5:30 min/km with gentle recovery pauses. Relaxed post-run coffee at Greenhouse Artisan Coffee afterwards!",
    chatSnippet: {
      sender: "Daniel",
      avatarKey: "daniel",
      text: "I found a scenic 5k trail loop today, coffee after at Greenhouse!",
    },
    poll: {
      id: 201,
      question: "Post-run breakfast hangout spot?",
      options: [
        { id: 1, text: "Greenhouse Artisan Coffee", votes: 8 },
        { id: 2, text: "Township Kopi Corner", votes: 4 },
      ],
      userVotedId: null,
      createdBy: "Daniel",
    },
    chatHistory: [
      { id: 1, sender: "Daniel", avatarKey: "daniel", time: "Yesterday", text: "Meet at Clock Tower 6:55 AM sharp!" },
      {
        id: 2,
        sender: "Daniel",
        avatarKey: "daniel",
        time: "Yesterday",
        poll: {
          id: 201,
          question: "Post-run breakfast hangout spot?",
          options: [
            { id: 1, text: "Greenhouse Artisan Coffee", votes: 8 },
            { id: 2, text: "Township Kopi Corner", votes: 4 },
          ],
          userVotedId: null,
          createdBy: "Daniel",
        },
      },
      { id: 3, sender: "Daniel", avatarKey: "daniel", time: "7:10 AM", text: "I found a scenic 5k trail loop today, coffee after at Greenhouse!" },
    ],
    attendeeKeys: ["daniel", "michelle", "alex"],
  },
  {
    id: 3,
    title: "Women-Only Morning Yoga & Smoothies",
    category: "Women-Only",
    date: "Sunday, 25 Oct",
    time: "9:30 AM",
    venue: "Clubhouse Lawn",
    joined: 9,
    spots: 3,
    host: "Emily",
    hostAvatarKey: "emily",
    sticker: "🌸",
    color: "salmon",
    isWomenOnly: true,
    skillTag: "🌸 Casual / All Levels Welcome",
    smartRecReason: "Women-Only safe space · Gentle recovery session",
    description: "Women-only safe space for morning relaxation and gentle vinyasa yoga flow on the Clubhouse Lawn. Fresh mango kale smoothies prepared for everyone after the session. Bring your own yoga mat!",
    chatSnippet: {
      sender: "Emily",
      avatarKey: "emily",
      text: "Fresh mango kale smoothies prepared for after our lawn yoga flow 🥭",
    },
    chatHistory: [
      { id: 1, sender: "Emily", avatarKey: "emily", time: "Yesterday", text: "Bring your yoga mat! Fresh smoothies provided." },
    ],
    attendeeKeys: ["emily", "priya", "sarah"],
  },
  {
    id: 4,
    title: "Tech Park Morning Commute Carpool",
    category: "Carpool",
    date: "Monday, 26 Oct",
    time: "7:35 AM",
    venue: "Guardhouse Gate 2",
    joined: 3,
    spots: 1,
    host: "Priya",
    hostAvatarKey: "priya",
    sticker: "🚗",
    color: "blue",
    skillTag: "🚗 Departure: 7:35 AM sharp",
    needPlusOne: "1 passenger seat left to Cyberjaya Tech Park",
    description: "Daily morning carpool from Guardhouse Gate 2 to Cyberjaya Tech Park. Departing promptly at 7:35 AM to beat the highway jam. 1 passenger seat remaining!",
    chatSnippet: {
      sender: "Priya",
      avatarKey: "priya",
      text: "Leaving promptly at 7:35 AM to skip the highway jam! 1 seat left.",
    },
    chatHistory: [
      { id: 1, sender: "Priya", avatarKey: "priya", time: "7:00 PM", text: "Leaving promptly at 7:35 AM to skip highway jam." },
    ],
    attendeeKeys: ["priya", "alex"],
  },
  {
    id: 5,
    title: "Township Board Games & Catan Night",
    category: "Hobbies",
    date: "Tuesday, 27 Oct",
    time: "7:30 PM",
    venue: "Community Lounge",
    joined: 6,
    spots: 4,
    host: "Emily",
    hostAvatarKey: "emily",
    sticker: "🎲",
    color: "purple",
    skillTag: "🎲 Casual to Strategy",
    description: "Casual board game night at Community Lounge! We have Catan (with expansion pack), Wingspan, and Ticket to Ride ready. Snacks, drinks, and beginners welcome.",
    chatSnippet: {
      sender: "Daniel",
      avatarKey: "daniel",
      text: "We have Catan, Wingspan, and Ticket to Ride ready! Who is bringing snacks?",
    },
    chatHistory: [
      { id: 1, sender: "Daniel", avatarKey: "daniel", time: "2 days ago", text: "Catan expansion pack unlocked!" },
    ],
    attendeeKeys: ["emily", "daniel", "jamie"],
  },
];

const initialBuddies: Buddy[] = [
  {
    id: 1,
    name: "Jamie",
    avatarKey: "jamie",
    interests: ["Badminton", "Coffee", "Cycling"],
    availability: "Weekday eve & Sat AM",
    skillNote: "🏸 Intermediate (Rally & Rotations)",
    isFriend: true,
    statusMsg: "🏸 Court 2 sparring @ 8am!",
  },
  {
    id: 2,
    name: "Michelle",
    avatarKey: "michelle",
    interests: ["Jogging", "Running", "Photography"],
    availability: "Tue / Thu 6:30 PM & Sun 7 AM",
    skillNote: "🏃 Target 5:15 - 5:45 min/km",
    isFriend: false,
    isWomenOnly: true,
    statusMsg: "🏃 Evening 5k Lake Loop",
  },
  {
    id: 3,
    name: "Priya",
    avatarKey: "priya",
    interests: ["Carpool", "Yoga", "Gardening"],
    availability: "Weekday 7:30 AM commute",
    skillNote: "🚗 Daily Tech Park Commuter",
    isFriend: true,
    isWomenOnly: true,
    statusMsg: "☕ Coffee at Central Cafe",
  },
  {
    id: 4,
    name: "Daniel",
    avatarKey: "daniel",
    interests: ["Running", "Board Games", "Trail"],
    availability: "Weekends all day",
    skillNote: "🏃 Casual 6:00 pace & Catan Lover",
    isFriend: false,
    statusMsg: "🎲 Catan night at 7:30pm",
  },
];


const photoWallMemories: PhotoMemory[] = [
  { id: 1, title: "12-Player Badminton Rally Meetup", date: "Last Saturday", image: "https://images.unsplash.com/photo-1723633236252-eb7badabb34c?auto=format&fit=crop&w=400&q=80", likes: 24, author: "Sarah" },
  { id: 2, title: "Lake Sunset 5K Jog & Coffee", date: "Sunday Afternoon", image: "https://images.unsplash.com/photo-1758520705254-1e9d913d78ea?auto=format&fit=crop&w=400&q=80", likes: 31, author: "Daniel" },
  { id: 3, title: "Catan Championship & Snacks Night", date: "Oct 18", image: "https://images.unsplash.com/photo-1758691031197-fee3ccad4d68?auto=format&fit=crop&w=400&q=80", likes: 18, author: "Emily" },
  { id: 4, title: "Deepavali Township Potluck Gathering", date: "Oct 12", image: "https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=400&q=80", likes: 45, author: "Priya" },
];

export const initialCommunities: CommunityData[] = [
  {
    id: "sports",
    name: "Badminton & Sports Club",
    hashtag: "#Sports",
    category: "Sports",
    description: "Township badminton courts, pickleball sessions & equipment sharing. Intermediate & casual sparring with friendly neighbours.",
    memberCount: 42,
    isJoined: true,
    leadAvatarKey: "sarah",
    leadName: "Sarah",
    sticker: "🏸",
    badge: "Courts & Sparring",
    themeColor: "#8c6500",
    bgLight: "#fef8e3",
    borderLight: "#f5c842",
    sharedResource: "4 spare Yonex racquets & shuttlecock tubes kept at Sports Complex Guardhouse (locker #04).",
    chatHistory: [
      {
        id: 1,
        sender: "Sarah",
        avatarKey: "sarah",
        time: "Yesterday",
        text: "Hi everyone! Court 2 is reserved for Saturday 8:00 AM. We also replenished 2 new tubes of Aeroplane shuttlecocks in the shared locker!",
      },
      {
        id: 2,
        sender: "Jamie",
        avatarKey: "jamie",
        time: "10:15 AM",
        text: "Awesome! I will bring extra grip tape if anyone needs a re-wrap before morning rallies.",
      },
      {
        id: 3,
        sender: "Sarah",
        avatarKey: "sarah",
        time: "11:30 AM",
        poll: {
          id: 101,
          question: "Which warm-up drill should we prioritize this Saturday?",
          options: [
            { id: 1, text: "High clear & drop shot rotations", votes: 8 },
            { id: 2, text: "Smash & defensive lift drills", votes: 5 },
            { id: 3, text: "Front court net play & tumble", votes: 4 },
          ],
          userVotedId: 1,
          createdBy: "Sarah",
          createdAt: "11:30 AM",
        },
      },
    ],
  },
  {
    id: "running",
    name: "Sunset Runners & Lake Loop",
    hashtag: "#Running",
    category: "Running",
    description: "Evening 5K loops around Central Lake, weekend trail endurance, and friendly pacing groups (5:00 - 6:30 min/km).",
    memberCount: 38,
    isJoined: true,
    leadAvatarKey: "daniel",
    leadName: "Daniel",
    sticker: "🏃",
    badge: "5km Lake Loop",
    themeColor: "#2b8a3e",
    bgLight: "#ebfbee",
    borderLight: "#b2f2bb",
    sharedResource: "Electrolyte hydration dispenser & basic first aid kit located at Central Gazebo.",
    chatHistory: [
      {
        id: 1,
        sender: "Daniel",
        avatarKey: "daniel",
        time: "2 days ago",
        text: "Sunset pacing today will be split into two groups: 5:15 pace with Michelle and 6:00 recovery loop with me!",
      },
      {
        id: 2,
        sender: "Michelle",
        avatarKey: "michelle",
        time: "Yesterday",
        text: "Lake perimeter lights are all functioning nicely! Don't forget bug spray for post-run stretches.",
      },
    ],
  },
  {
    id: "women-only",
    name: "Women's Circle & Wellness Lounge",
    hashtag: "#Women-Only",
    category: "Women-Only",
    description: "Safe, supportive community for women residents. Sunrise lawn yoga, matcha coffee catchups, evening safe walks.",
    memberCount: 29,
    isJoined: false,
    leadAvatarKey: "emily",
    leadName: "Emily",
    sticker: "🌸",
    badge: "Safe Space & Yoga",
    themeColor: "#c2185b",
    bgLight: "#fff0f6",
    borderLight: "#fcc2d7",
    sharedResource: "10 sanitized yoga mats & bluetooth meditation speaker in Community Room A closet.",
    chatHistory: [
      {
        id: 1,
        sender: "Emily",
        avatarKey: "emily",
        time: "3 days ago",
        text: "Welcome to all new sisters who moved into Phase 3! Our upcoming Sunday yoga will feature fresh citrus iced tea.",
      },
      {
        id: 2,
        sender: "Priya",
        avatarKey: "priya",
        time: "2 days ago",
        text: "I can bring lavender essential oils for the cooling relaxation phase at the end!",
      },
    ],
  },
  {
    id: "hobbies",
    name: "Board Games & Strategy Hub",
    hashtag: "#Hobbies",
    category: "Hobbies",
    description: "Tabletop enthusiasts, Catan tournaments, chess, Wingspan, and cozy puzzle nights. Beginners warmly guided!",
    memberCount: 34,
    isJoined: true,
    leadAvatarKey: "jamie",
    leadName: "Jamie",
    sticker: "🎲",
    badge: "Tabletop & Strategy",
    themeColor: "#6741d9",
    bgLight: "#f3f0ff",
    borderLight: "#d0bfff",
    sharedResource: "Community board game library with 14 boxed games on Resident Lounge Shelf B.",
    chatHistory: [
      {
        id: 1,
        sender: "Jamie",
        avatarKey: "jamie",
        time: "Yesterday",
        text: "Catan expansion 5-6 player pack just arrived! We will test it on Tuesday evening.",
      },
      {
        id: 2,
        sender: "Alex (You)",
        avatarKey: "alex",
        time: "10:00 AM",
        isUser: true,
        text: "Count me in! I will bring potato chips and sparkling water.",
      },
    ],
  },
  {
    id: "carpool",
    name: "Tech Park Daily Carpool",
    hashtag: "#Carpool",
    category: "Carpool",
    description: "Daily commuters pooling rides to Cyberjaya, Damansara, and KL Sentral. Cut commute stress and carbon footprint.",
    memberCount: 21,
    isJoined: false,
    leadAvatarKey: "priya",
    leadName: "Priya",
    sticker: "🚗",
    badge: "7:35 AM Commute",
    themeColor: "#1864ab",
    bgLight: "#e7f5ff",
    borderLight: "#a5d8ff",
    sharedResource: "Dedicated Resident Carpool pickup point at Precinct 4 Guardhouse with shade.",
    chatHistory: [
      {
        id: 1,
        sender: "Priya",
        avatarKey: "priya",
        time: "Monday",
        text: "I have 2 seats available for Tuesday morning commute heading towards Damansara Uptown at 7:35 AM.",
      },
    ],
  },
  {
    id: "social",
    name: "Township Potluck & Celebrations",
    hashtag: "#Social",
    category: "Social",
    description: "Festive gatherings, weekend barbecues, green gardening exchanges, and welcoming newcomers to the township.",
    memberCount: 56,
    isJoined: true,
    leadAvatarKey: "michelle",
    leadName: "Michelle",
    sticker: "🎉",
    badge: "Festive & Potlucks",
    themeColor: "#d9480f",
    bgLight: "#fff4e6",
    borderLight: "#ffd8a8",
    sharedResource: "4 foldable 6ft banquet tables, 2 canopy tents & outdoor BBQ grill tools.",
    chatHistory: [
      {
        id: 1,
        sender: "Michelle",
        avatarKey: "michelle",
        time: "Oct 15",
        text: "Thank you to everyone who shared dishes for the potluck! Photos are posted on the Photo Wall.",
      },
    ],
  },
];

export const initialDirectChats: DirectChatData[] = [
  {
    buddyId: 1,
    buddyName: "Jamie",
    avatarKey: "jamie",
    subtitle: "🏸 Intermediate Racquet Partner",
    statusMsg: "🏸 Court 2 sparring @ 8am!",
    lastMessage: "Awesome, let's pair up for doubles!",
    lastTime: "10:24 AM",
    unreadCount: 1,
    messages: [
      {
        id: 1,
        sender: "Jamie",
        avatarKey: "jamie",
        time: "10:18 AM",
        text: "Hey Alex! Are you going for Saturday court 2 badminton meetup?",
      },
      {
        id: 2,
        sender: "Alex (You)",
        avatarKey: "alex",
        time: "10:20 AM",
        text: "Yes, registered! Got court 2 at 8:00 AM.",
        isUser: true,
      },
      {
        id: 3,
        sender: "Jamie",
        avatarKey: "jamie",
        time: "10:24 AM",
        text: "Awesome, let's pair up for doubles! I will bring extra grip tape.",
      },
    ],
  },
  {
    buddyId: 2,
    buddyName: "Michelle",
    avatarKey: "michelle",
    subtitle: "🏃 5:30 Lake Loop Jogger",
    statusMsg: "🏃 Evening 5k Lake Loop",
    lastMessage: "Perfect, let's pace together at the gazebo!",
    lastTime: "Yesterday",
    messages: [
      {
        id: 1,
        sender: "Michelle",
        avatarKey: "michelle",
        time: "Yesterday",
        text: "Hey Alex! What pace are you targeting for tomorrow's lake run?",
      },
      {
        id: 2,
        sender: "Alex (You)",
        avatarKey: "alex",
        time: "Yesterday",
        text: "Aiming for steady 5:30 min/km around the 5k loop.",
        isUser: true,
      },
      {
        id: 3,
        sender: "Michelle",
        avatarKey: "michelle",
        time: "Yesterday",
        text: "Perfect, let's pace together at the gazebo! See you there.",
      },
    ],
  },
  {
    buddyId: 3,
    buddyName: "Priya",
    avatarKey: "priya",
    subtitle: "🚗 Tech Park Morning Carpool",
    statusMsg: "☕ Coffee at Central Cafe",
    lastMessage: "I have 2 seats open for tomorrow 7:35 AM.",
    lastTime: "2d ago",
    messages: [
      {
        id: 1,
        sender: "Priya",
        avatarKey: "priya",
        time: "2d ago",
        text: "Morning! I have 2 seats open for tomorrow 7:35 AM commute if you need a ride to Tech Park.",
      },
    ],
  },
];

export default function App() {
  const [tab, setTab] = useState<TabName>("today");
  const [chatCategoryTab, setChatCategoryTab] = useState<"groups" | "direct">("groups");
  const [events, setEvents] = useState<EventData[]>(initialEvents);
  const [communities, setCommunities] = useState<CommunityData[]>(initialCommunities);
  const [activeCommunityChat, setActiveCommunityChat] = useState<CommunityData | null>(null);
  const [directChats, setDirectChats] = useState<DirectChatData[]>(initialDirectChats);
  const [activeDirectChat, setActiveDirectChat] = useState<DirectChatData | null>(null);
  const [buddies, setBuddies] = useState<Buddy[]>(initialBuddies);
  useEffect(() => {
    getActivities()
      .then((backendActivities) => {
        if (backendActivities && backendActivities.length > 0) {
          const formattedEvents: EventData[] = backendActivities.map((act: any) => ({
            id: act.id,
            title: act.title,
            category: act.category || "Sports",
            date: "Today",
            time: "7:00 PM",
            venue: act.venue,
            joined: 1,
            spots: act.spots_left || 3,
            host: "Community Host",
            hostAvatarKey: "daniel",
            sticker: act.category === "Sports" ? "🏸" : "🎲",
            color: "yellow",
            skillTag: `Required Level: ${act.required_skill_level || 1}`,
            chatSnippet: { sender: "Host", avatarKey: "daniel", text: "Welcome to the event!" },
            chatHistory: [],
            attendeeKeys: [],
          }));

          setEvents(formattedEvents);
        }
      })
      .catch((err) => console.error("Failed to load activities from backend:", err));
  }, []);
  const [viewingEvent, setViewingEvent] = useState<EventData | null>(null);
  const [chatEvent, setChatEvent] = useState<EventData | null>(null);
  const [chatSource, setChatSource] = useState<"chats" | "event_details">("chats");
  const [joinModalEvent, setJoinModalEvent] = useState<EventData | null>(null);
  const [avatarStudioOpen, setAvatarStudioOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [photoWallOpen, setPhotoWallOpen] = useState(false);
  const [buddyModalOpen, setBuddyModalOpen] = useState(false);
  const [editSkillsOpen, setEditSkillsOpen] = useState(false);
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false);
  const [editingNeighbourId, setEditingNeighbourId] = useState("alex");
  const [womenOnlyFilter, setWomenOnlyFilter] = useState(false);
  const [activePage, setActivePage] = useState<
    "main" | "streak" | "create_event" | "avatar_studio" | "photo_wall" | "rewards"
  >("main");

  // User Profile Settings State (Editable Name & Details)
  const [userName, setUserName] = useState("Alex Tan");
  const [userUnit, setUserUnit] = useState("Precinct 4 · Unit B-12-03");
  const [userBio, setUserBio] = useState("Passionate about weekend badminton, morning 5k lake loops & discovering good coffee.");
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);

  // Global In-App Toast Notification State (No Browser Alerts)
  const [appToast, setAppToast] = useState<{
    id: string;
    title: string;
    message?: string;
    icon?: string;
  } | null>(null);

  const showAppToast = (toastData: { title: string; message?: string; icon?: string }) => {
    const id = String(Date.now());
    setAppToast({ ...toastData, id });
    setTimeout(() => {
      setAppToast((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  };

  // User Skill Self-Assessment State
  const [userSkills, setUserSkills] = useState({
    racquetTier: "Intermediate / Rally & Rotations",
    runningPace: "5:30 min/km",
    runningDistance: "5 - 10 km",
    commuteRoute: "Morning Work Commute (7:30 - 7:45 AM)",
  });

  // Avatars Database
  const [avatars, setAvatars] = useState<Record<string, AvatarConfig>>(defaultAvatars);

  // Streak & Points State
  const [streak, setStreak] = useState(5);
  const [points, setPoints] = useState(380);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkinCelebration, setCheckinCelebration] = useState(false);

  const getAvatar = (key?: string): AvatarConfig => {
    return avatars[key || "alex"] || defaultAvatars[key || "alex"] || defaultAvatars.alex;
  };

  const toggleFriend = (id: number) => {
    setBuddies((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFriend: !b.isFriend } : b))
    );
  };

  const handleDailyCheckin = () => {
    if (checkedIn) return;
    setCheckedIn(true);
    setPoints((p) => p + 10);
    setStreak((s) => s + 1);
    setCheckinCelebration(true);
    setTimeout(() => setCheckinCelebration(false), 2200);
  };

  const handleCreateEvent = (newEvent: EventData) => {
    setEvents((prev) => [newEvent, ...prev]);
    setPoints((p) => p + 30);
    setActivePage("main");
    setTab("today");
    // Directly open the created event details so user sees everything they just filled!
    setViewingEvent(newEvent);
  };

  const handleSaveAvatar = (saved: AvatarConfig) => {
    setAvatars((prev) => ({
      ...prev,
      [editingNeighbourId]: saved,
    }));
  };

  const handleSendMessage = (text: string) => {
    const active = chatEvent || viewingEvent;
    if (!text.trim() || !active) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "Alex (You)",
      avatarKey: "alex",
      time: "Just now",
      text: text.trim(),
      isUser: true,
    };
    const updatedEvents = events.map((ev) =>
      ev.id === active.id
        ? { ...ev, chatHistory: [...ev.chatHistory, newMsg] }
        : ev
    );
    setEvents(updatedEvents);

    const updatedActive = {
      ...active,
      chatHistory: [...active.chatHistory, newMsg],
    };
    if (chatEvent && chatEvent.id === active.id) setChatEvent(updatedActive);
    if (viewingEvent && viewingEvent.id === active.id) setViewingEvent(updatedActive);
  };

  const handleCreatePoll = (question: string, options: string[]) => {
    const active = chatEvent || viewingEvent;
    if (!active) return;
    const newPollMsg: ChatMessage = {
      id: Date.now(),
      sender: "Alex (You)",
      avatarKey: "alex",
      time: "Just now",
      isUser: true,
      poll: {
        id: Date.now(),
        question,
        options: options.map((optText, idx) => ({
          id: idx + 1,
          text: optText,
          votes: 0,
        })),
        userVotedId: null,
        createdBy: "Alex (You)",
        createdAt: "Just now",
      },
    };
    const updatedEvents = events.map((ev) =>
      ev.id === active.id
        ? { ...ev, chatHistory: [...ev.chatHistory, newPollMsg] }
        : ev
    );
    setEvents(updatedEvents);

    const updatedActive = {
      ...active,
      chatHistory: [...active.chatHistory, newPollMsg],
    };
    if (chatEvent && chatEvent.id === active.id) setChatEvent(updatedActive);
    if (viewingEvent && viewingEvent.id === active.id) setViewingEvent(updatedActive);
  };

  const handleVotePoll = (messageId: number, optionId: number) => {
    const active = chatEvent || viewingEvent;
    if (!active) return;
    const updatedHistory = active.chatHistory.map((msg) => {
      if (msg.id !== messageId || !msg.poll) return msg;

      const currentVoted = msg.poll.userVotedId;
      const isSame = currentVoted === optionId;
      const nextVoted = isSame ? null : optionId;

      const updatedOptions = msg.poll.options.map((opt) => {
        if (opt.id === optionId) {
          return { ...opt, votes: isSame ? Math.max(0, opt.votes - 1) : opt.votes + 1 };
        }
        if (opt.id === currentVoted) {
          return { ...opt, votes: Math.max(0, opt.votes - 1) };
        }
        return opt;
      });

      return {
        ...msg,
        poll: {
          ...msg.poll,
          options: updatedOptions,
          userVotedId: nextVoted,
        },
      };
    });

    const updatedActive = {
      ...active,
      chatHistory: updatedHistory,
    };
    if (chatEvent && chatEvent.id === active.id) setChatEvent(updatedActive);
    if (viewingEvent && viewingEvent.id === active.id) setViewingEvent(updatedActive);
    setEvents(events.map((e) => (e.id === active.id ? updatedActive : e)));
  };

  const handleConfirmJoinTogether = (mode: "solo" | "buddy" | "need_buddy", buddyKey?: string) => {
    if (!joinModalEvent) return;
    const updated = events.map((ev) => {
      if (ev.id !== joinModalEvent.id) return ev;
      return {
        ...ev,
        joined: ev.joined + (mode === "buddy" ? 2 : 1),
        spots: Math.max(0, ev.spots - (mode === "buddy" ? 2 : 1)),
        attendeeKeys: ["alex", ...ev.attendeeKeys],
      };
    });
    setEvents(updated);
    setPoints((p) => p + 20);

    if (viewingEvent && viewingEvent.id === joinModalEvent.id) {
      setViewingEvent({
        ...viewingEvent,
        joined: viewingEvent.joined + (mode === "buddy" ? 2 : 1),
        spots: Math.max(0, viewingEvent.spots - (mode === "buddy" ? 2 : 1)),
        attendeeKeys: ["alex", ...viewingEvent.attendeeKeys],
      });
    }
    if (chatEvent && chatEvent.id === joinModalEvent.id) {
      setChatEvent({
        ...chatEvent,
        joined: chatEvent.joined + (mode === "buddy" ? 2 : 1),
        spots: Math.max(0, chatEvent.spots - (mode === "buddy" ? 2 : 1)),
        attendeeKeys: ["alex", ...chatEvent.attendeeKeys],
      });
    }

    setJoinModalEvent(null);
  };

  const handleRegisterEvent = (evToRegister: EventData) => {
    const isAlreadyJoined =
      evToRegister.attendeeKeys?.includes("alex") ||
      evToRegister.host.toLowerCase().includes("alex");
    if (isAlreadyJoined) return;

    const nextAttendeeKeys = ["alex", ...(evToRegister.attendeeKeys || [])];
    const nextJoined = evToRegister.joined + 1;
    const nextSpots = Math.max(0, evToRegister.spots - 1);

    const updatedEvents = events.map((ev) => {
      if (ev.id !== evToRegister.id) return ev;
      return {
        ...ev,
        joined: nextJoined,
        spots: nextSpots,
        attendeeKeys: nextAttendeeKeys,
      };
    });
    setEvents(updatedEvents);
    setPoints((p) => p + 20);

    const updatedEvent: EventData = {
      ...evToRegister,
      joined: nextJoined,
      spots: nextSpots,
      attendeeKeys: nextAttendeeKeys,
    };

    if (viewingEvent && viewingEvent.id === evToRegister.id) {
      setViewingEvent(updatedEvent);
    }
    if (chatEvent && chatEvent.id === evToRegister.id) {
      setChatEvent(updatedEvent);
    }
  };

  const handleUnregisterEvent = (evToUnregister: EventData) => {
    const nextAttendeeKeys = (evToUnregister.attendeeKeys || []).filter((k) => k !== "alex");
    const nextJoined = Math.max(0, evToUnregister.joined - 1);
    const nextSpots = evToUnregister.spots + 1;

    const updatedEvents = events.map((ev) => {
      if (ev.id !== evToUnregister.id) return ev;
      return {
        ...ev,
        joined: nextJoined,
        spots: nextSpots,
        attendeeKeys: nextAttendeeKeys,
      };
    });
    setEvents(updatedEvents);

    const updatedEvent: EventData = {
      ...evToUnregister,
      joined: nextJoined,
      spots: nextSpots,
      attendeeKeys: nextAttendeeKeys,
    };

    if (viewingEvent && viewingEvent.id === evToUnregister.id) {
      setViewingEvent(updatedEvent);
    }
    if (chatEvent && chatEvent.id === evToUnregister.id) {
      setChatEvent(null);
    }
  };

  const isUserRegisteredForEvent = (ev?: EventData | null) => {
    if (!ev) return false;
    return Boolean(
      ev.attendeeKeys?.includes("alex") || ev.host.toLowerCase().includes("alex")
    );
  };

  const handleToggleJoinCommunity = (communityId: string) => {
    const updated = communities.map((c) => {
      if (c.id !== communityId) return c;
      const willJoin = !c.isJoined;
      if (willJoin) {
        setPoints((p) => p + 15);
      }
      return {
        ...c,
        isJoined: willJoin,
        memberCount: willJoin ? c.memberCount + 1 : Math.max(1, c.memberCount - 1),
      };
    });
    setCommunities(updated);
    if (activeCommunityChat && activeCommunityChat.id === communityId) {
      const active = updated.find((c) => c.id === communityId);
      if (active) setActiveCommunityChat(active);
    }
  };

  const handleSendCommunityMessage = (communityId: string, text: string) => {
    const newMsg: CommunityChatMessage = {
      id: Date.now(),
      sender: "Alex (You)",
      avatarKey: "alex",
      time: "Just now",
      text,
      isUser: true,
    };

    const updated = communities.map((c) => {
      if (c.id !== communityId) return c;
      return {
        ...c,
        chatHistory: [...c.chatHistory, newMsg],
      };
    });
    setCommunities(updated);
    if (activeCommunityChat && activeCommunityChat.id === communityId) {
      const active = updated.find((c) => c.id === communityId);
      if (active) setActiveCommunityChat(active);
    }
  };

  const handleCreateCommunityPoll = (communityId: string, question: string, options: string[]) => {
    const newPollMsg: CommunityChatMessage = {
      id: Date.now(),
      sender: "Alex (You)",
      avatarKey: "alex",
      time: "Just now",
      isUser: true,
      poll: {
        id: Date.now(),
        question,
        options: options.map((optText, idx) => ({
          id: idx + 1,
          text: optText,
          votes: 0,
        })),
        userVotedId: null,
        createdBy: "Alex (You)",
        createdAt: "Just now",
      },
    };

    const updated = communities.map((c) => {
      if (c.id !== communityId) return c;
      return {
        ...c,
        chatHistory: [...c.chatHistory, newPollMsg],
      };
    });
    setCommunities(updated);
    if (activeCommunityChat && activeCommunityChat.id === communityId) {
      const active = updated.find((c) => c.id === communityId);
      if (active) setActiveCommunityChat(active);
    }
  };

  const handleVoteCommunityPoll = (communityId: string, messageId: number, optionId: number) => {
    const updated = communities.map((c) => {
      if (c.id !== communityId) return c;
      const nextHistory = c.chatHistory.map((msg) => {
        if (msg.id !== messageId || !msg.poll) return msg;

        const currentVoted = msg.poll.userVotedId;
        const isSame = currentVoted === optionId;
        const nextVoted = isSame ? null : optionId;

        const updatedOptions = msg.poll.options.map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, votes: isSame ? Math.max(0, opt.votes - 1) : opt.votes + 1 };
          }
          if (opt.id === currentVoted) {
            return { ...opt, votes: Math.max(0, opt.votes - 1) };
          }
          return opt;
        });

        return {
          ...msg,
          poll: {
            ...msg.poll,
            userVotedId: nextVoted,
            options: updatedOptions,
          },
        };
      });

      return {
        ...c,
        chatHistory: nextHistory,
      };
    });

    setCommunities(updated);
    if (activeCommunityChat && activeCommunityChat.id === communityId) {
      const active = updated.find((c) => c.id === communityId);
      if (active) setActiveCommunityChat(active);
    }
  };

  const handleSendDirectMessage = (buddyId: number, text: string) => {
    const newMsg: DirectChatMessage = {
      id: Date.now(),
      sender: "Alex (You)",
      avatarKey: "alex",
      time: "Just now",
      text,
      isUser: true,
    };
    const updated = directChats.map((c) => {
      if (c.buddyId !== buddyId) return c;
      return {
        ...c,
        lastMessage: text,
        lastTime: "Just now",
        unreadCount: 0,
        messages: [...c.messages, newMsg],
      };
    });
    setDirectChats(updated);
    if (activeDirectChat && activeDirectChat.buddyId === buddyId) {
      const active = updated.find((c) => c.buddyId === buddyId);
      if (active) setActiveDirectChat(active);
    }
  };

  const handleSendEventInvite = (buddyId: number, ev: EventData) => {
    const inviteMsg: DirectChatMessage = {
      id: Date.now(),
      sender: "Alex (You)",
      avatarKey: "alex",
      time: "Just now",
      isUser: true,
      eventInvite: {
        eventId: ev.id,
        title: ev.title,
        date: ev.date,
        time: ev.time,
        venue: ev.venue,
      },
    };
    const updated = directChats.map((c) => {
      if (c.buddyId !== buddyId) return c;
      return {
        ...c,
        lastMessage: `Invited you to ${ev.title}`,
        lastTime: "Just now",
        unreadCount: 0,
        messages: [...c.messages, inviteMsg],
      };
    });
    setDirectChats(updated);
    if (activeDirectChat && activeDirectChat.buddyId === buddyId) {
      const active = updated.find((c) => c.buddyId === buddyId);
      if (active) setActiveDirectChat(active);
    }
  };

  const handleOpenDirectChatWithBuddy = (buddy: Buddy) => {
    let existing = directChats.find((c) => c.buddyId === buddy.id);
    if (!existing) {
      existing = {
        buddyId: buddy.id,
        buddyName: buddy.name,
        avatarKey: buddy.avatarKey,
        subtitle: buddy.skillNote,
        statusMsg: buddy.statusMsg,
        lastMessage: "Started a conversation",
        lastTime: "Just now",
        messages: [
          {
            id: Date.now(),
            sender: buddy.name,
            avatarKey: buddy.avatarKey,
            time: "Just now",
            text: `Hi Alex! Glad we connected on NeighbourBuddy. Let's join activities together!`,
          },
        ],
      };
      setDirectChats([existing, ...directChats]);
    }
    setActiveDirectChat(existing);
  };


  // Split events into Your Events and Other Events
  const yourEvents = events.filter(
    (e) => e.host.toLowerCase().includes("alex") || (e.attendeeKeys && e.attendeeKeys.includes("alex"))
  );
  const otherEvents = events.filter(
    (e) => !e.host.toLowerCase().includes("alex") && (!e.attendeeKeys || !e.attendeeKeys.includes("alex"))
  );

  // Group other events section by section according to date
  const otherEventsByDate: Record<string, EventData[]> = {};
  otherEvents.forEach((ev) => {
    const dateKey = ev.date || "Upcoming";
    if (!otherEventsByDate[dateKey]) {
      otherEventsByDate[dateKey] = [];
    }
    otherEventsByDate[dateKey].push(ev);
  });

  const renderEventCard = (ev: EventData, isYourEventSection: boolean) => {
    const isHost = ev.host.toLowerCase().includes("alex");
    const isAttending = Boolean(ev.attendeeKeys && ev.attendeeKeys.includes("alex"));

    const categoryThemes: Record<string, { bg: string; color: string; border: string }> = {
      Sports: { bg: "#fef8e3", color: "#8c6500", border: "#f5c842" },
      Social: { bg: "#fef3e7", color: "#b34e00", border: "#f28b24" },
      Hobbies: { bg: "#f4effe", color: "#5c32b6", border: "#ba9cfc" },
      Carpool: { bg: "#eef5ff", color: "#1864ab", border: "#3d8bfd" },
      "Women-Only": { bg: "#fef0ef", color: "#c92a2a", border: "#f36458" },
    };

    const theme = categoryThemes[ev.category] || categoryThemes.Sports;
    const cleanSkillTag = (ev.skillTag || "All levels welcome")
      .replace(/^[\p{Emoji}\p{Extended_Pictographic}\u200d\uFE0F\s]+/u, "")
      .trim();

    return (
      <div
        key={ev.id}
        onClick={() => setViewingEvent(ev)}
        style={{
          background: "#ffffff",
          borderRadius: "18px",
          border: isHost ? "2px solid #f5c842" : "1.5px solid #e7e4dc",
          padding: "13px 15px",
          boxShadow: isHost ? "0 4px 14px rgba(245, 200, 66, 0.18)" : "0 3px 10px rgba(0, 0, 0, 0.04)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: "9px",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {/* Event Title (Title First) */}
        <h3
          style={{
            margin: 0,
            fontSize: "15.5px",
            fontWeight: 900,
            color: "#111215",
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
          }}
        >
          {ev.title}
        </h3>

        {/* Labels & Meta Row (Below Title, Smaller Font) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "-3px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                padding: "2px 6px",
                borderRadius: "5px",
                background: theme.bg,
                color: theme.color,
                border: `1px solid ${theme.border}`,
              }}
            >
              #{ev.category}
            </span>
            {isHost && (
              <span
                style={{
                  fontSize: "9.5px",
                  fontWeight: 800,
                  padding: "2px 6px",
                  borderRadius: "5px",
                  background: "#111215",
                  color: "#ffffff",
                }}
              >
                Hosting
              </span>
            )}
            {!isHost && isAttending && (
              <span
                style={{
                  fontSize: "9.5px",
                  fontWeight: 800,
                  padding: "2px 6px",
                  borderRadius: "5px",
                  background: "#eaf8f0",
                  color: "#197142",
                  border: "1px solid #38b776",
                }}
              >
                Attending
              </span>
            )}
          </div>

          <span style={{ fontSize: "11px", fontWeight: 700, color: "#666" }}>
            {ev.joined}/{ev.spots >= 900 ? "∞" : ev.spots + ev.joined} spots
          </span>
        </div>

        {/* Details Box: Organiser Name, Date & Time, Venue */}
        <div
          style={{
            background: "#f9f8f5",
            borderRadius: "12px",
            padding: "9px 11px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            fontSize: "11.5px",
          }}
        >
          {/* Organiser Row: "Organised by" + Avatar + Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ color: "#777", fontWeight: 600, fontSize: "11px" }}>Organised by</span>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <CustomAvatar config={getAvatar(ev.hostAvatarKey || (isHost ? "alex" : "user"))} size={20} />
              <strong style={{ color: "#111215", fontWeight: 800, fontSize: "11.5px" }}>{ev.host}</strong>
            </div>
          </div>

          {/* Date & Time */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#777", fontWeight: 600, fontSize: "11px" }}>Date & Time:</span>
            <span style={{ fontWeight: 700, color: "#111215" }}>{ev.date}</span>
            <span style={{ color: "#bbb" }}>·</span>
            <span style={{ fontWeight: 700, color: "#d9480f" }}>{ev.time}</span>
          </div>

          {/* Venue */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#777", fontWeight: 600, fontSize: "11px" }}>Venue:</span>
            <span style={{ fontWeight: 700, color: "#111215" }}>{ev.venue}</span>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "2px" }}>
          <span
            style={{
              fontSize: "10.5px",
              color: "#777",
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "58%",
            }}
          >
            {cleanSkillTag}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewingEvent(ev);
            }}
            style={{
              padding: "5px 12px",
              borderRadius: "9px",
              border: "none",
              background: isAttending || isHost ? "#f5c842" : "#111215",
              color: isAttending || isHost ? "#111215" : "#ffffff",
              fontSize: "11px",
              fontWeight: 800,
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "3px",
              boxShadow: isAttending || isHost ? "none" : "0 2px 6px rgba(0,0,0,0.18)",
            }}
            type="button"
          >
            {isHost ? "Manage" : isAttending ? "View Event" : "Join Event"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="app-shell">
      {/* Global In-App Toast Notification Banner (No Browser Alerts!) */}
      {appToast && (
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "14px",
            right: "14px",
            zIndex: 300,
            background: "#111215",
            color: "#ffffff",
            borderRadius: "18px",
            padding: "12px 14px",
            border: "2px solid #f5c842",
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "slide-down 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <span style={{ fontSize: "22px", flexShrink: 0 }}>{appToast.icon || "🎉"}</span>
          <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
            <strong style={{ fontSize: "12.5px", display: "block", color: "#ffffff", fontWeight: 800 }}>
              {appToast.title}
            </strong>
            {appToast.message && (
              <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#e2e2e2", lineHeight: 1.3 }}>
                {appToast.message}
              </p>
            )}
          </div>
          <button
            onClick={() => setAppToast(null)}
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

      {activeDirectChat ? (
        <IndividualChatPage
          chat={activeDirectChat}
          events={events}
          getAvatar={getAvatar}
          onBack={() => setActiveDirectChat(null)}
          onSendEventInvite={handleSendEventInvite}
          onSendMessage={handleSendDirectMessage}
          onViewEvent={(ev) => {
            setViewingEvent(ev);
            setActiveDirectChat(null);
          }}
        />
      ) : activeCommunityChat ? (
        <CommunityChatPage
          community={activeCommunityChat}
          getAvatar={getAvatar}
          onBack={() => setActiveCommunityChat(null)}
          onCreatePoll={handleCreateCommunityPoll}
          onOpenRelatedEvent={(eventId) => {
            const ev = events.find((e) => e.id === eventId);
            if (ev) setViewingEvent(ev);
            setActiveCommunityChat(null);
          }}
          onSendMessage={handleSendCommunityMessage}
          onVotePoll={handleVoteCommunityPoll}
        />
      ) : chatEvent ? (
        <EventChatPage
          event={chatEvent}
          getAvatar={getAvatar}
          onBack={() => {
            if (chatSource === "event_details") {
              setViewingEvent(chatEvent);
            } else {
              setViewingEvent(null);
              setTab("chats");
            }
            setChatEvent(null);
          }}
          onCreatePoll={handleCreatePoll}
          onJoinEvent={handleRegisterEvent}
          onRegisterEvent={handleRegisterEvent}
          onSendMessage={handleSendMessage}
          onVotePoll={handleVotePoll}
        />
      ) : viewingEvent ? (
        <EventDetailsPage
          buddies={buddies}
          event={viewingEvent}
          getAvatar={getAvatar}
          onBack={() => setViewingEvent(null)}
          onOpenChat={() => {
            const isRegistered =
              viewingEvent.attendeeKeys?.includes("alex") ||
              viewingEvent.host.toLowerCase().includes("alex");
            if (isRegistered) {
              setChatSource("event_details");
              setChatEvent(viewingEvent);
              setViewingEvent(null);
            }
          }}
          onRegisterEvent={handleRegisterEvent}
          onUnregisterEvent={handleUnregisterEvent}
        />
      ) : activePage === "streak" ? (
        <StreakPage
          checkedIn={checkedIn}
          onBack={() => setActivePage("main")}
          onCheckIn={handleDailyCheckin}
          points={points}
          streak={streak}
        />
      ) : activePage === "create_event" ? (
        <CreateEventPage
          onBack={() => setActivePage("main")}
          onCreateEvent={handleCreateEvent}
        />
      ) : activePage === "avatar_studio" || avatarStudioOpen ? (
        <AvatarStudioModal
          currentAvatar={getAvatar(editingNeighbourId)}
          neighbourList={[
            { id: "alex", name: "Alex (You)" },
            { id: "jamie", name: "Jamie" },
            { id: "michelle", name: "Michelle" },
            { id: "sarah", name: "Sarah" },
            { id: "daniel", name: "Daniel" },
            { id: "priya", name: "Priya" },
          ]}
          onClose={() => {
            setAvatarStudioOpen(false);
            setActivePage("main");
          }}
          onSave={(updatedConfig) => {
            handleSaveAvatar(updatedConfig);
            setAvatarStudioOpen(false);
            setActivePage("main");
          }}
          onSelectNeighbour={(id) => setEditingNeighbourId(id)}
          selectedNeighbourId={editingNeighbourId}
        />
      ) : activePage === "photo_wall" ? (
        <PhotoWallPage
          getAvatar={getAvatar}
          onBack={() => setActivePage("main")}
        />
      ) : activePage === "rewards" ? (
        <RewardsPage
          onBack={() => setActivePage("main")}
          onDeductPoints={(cost) => setPoints((p) => Math.max(0, p - cost))}
          points={points}
        />
      ) : (
        <>
          {/* Status Bar */}
          <div className="status-bar light-theme">
            <span>9:41</span>
        <div className="status-icons">
          <button
            onClick={() => setNotificationsOpen(true)}
            style={{
              background: "none",
              border: 0,
              color: "#111",
              fontSize: "14px",
              cursor: "pointer",
              padding: "0 4px",
              position: "relative",
            }}
            title="Day-before event alert"
            type="button"
          >
            🔔
            <span style={{ position: "absolute", top: -2, right: 0, width: "6px", height: "6px", borderRadius: "50%", background: "#f7685b" }} />
          </button>
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      <main className="main-content">
        {/* ========================================================
            TAB 1: TODAY / HOME (VIBRANT FOLDER THEME)
            ======================================================== */}
        {tab === "today" && (
          <div className="today-theme-view">
            {/* Screen Header with Official Sime Darby Property Logo & App Title */}
            <div className="screen-header" style={{ alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <img
                  alt="Sime Darby Property"
                  src="/Sime_Darby_Property_SDP_Logo_New_copy.png"
                  style={{
                    height: "32px",
                    width: "auto",
                    objectFit: "contain",
                    flexShrink: 0,
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08))",
                  }}
                />
                <h1
                  className="screen-title"
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  NeighbourBuddy
                </h1>
              </div>
              <button
                aria-label="Host Event"
                className="header-host-button"
                onClick={() => setActivePage("create_event")}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#111215",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                  transition: "transform 0.15s ease, background 0.15s ease",
                  flexShrink: 0,
                }}
                title="Host Event"
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
                  <line x1="12" x2="12" y1="5" y2="19" />
                  <line x1="5" x2="19" y1="12" y2="12" />
                </svg>
              </button>
            </div>

            {/* Streak & Daily Check-in Card (Navigates to Streak Page) */}
            <div
              className="today-streak-row"
              onClick={() => setActivePage("streak")}
              role="button"
              tabIndex={0}
            >
              {/* Fire Logo with Prominent 'Streak' Label */}
              <div className="today-streak-flame-badge">
                <FlameMascot isPulsing={true} size={36} />
                <span className="today-streak-flame-tag">Streak</span>
              </div>

              {/* Text Info */}
              <div className="today-streak-info">
                <div className="today-streak-text">
                  <span>{checkinCelebration ? "🎉 +10 Claimed!" : `${streak} Days Streak!`}</span>
                  <span
                    style={{
                      fontSize: "9px",
                      padding: "1px 6px",
                      borderRadius: "99px",
                      background: "#fff4e6",
                      color: "#d9480f",
                      border: "1px solid #ffd8a8",
                      fontWeight: 800,
                    }}
                  >
                    {points} pts
                  </span>
                </div>
                <div className="today-streak-sub">
                  {checkedIn
                    ? "Checked in today · View 14d challenge"
                    : "Tap to check in & earn +10 points"}
                </div>
              </div>

              {/* Compact Non-wrapping Button */}
              <button
                className={`today-streak-btn ${checkedIn ? "done" : ""}`}
                disabled={checkedIn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDailyCheckin();
                }}
                type="button"
              >
                {checkedIn ? "View ›" : "Check In"}
              </button>
            </div>

            {/* Quick Feature Highlights: Township Photo Wall & Avatar Studio */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
              <div
                onClick={() => setActivePage("photo_wall")}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1.5px solid #e7e4dc",
                  padding: "9px 11px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                }}
              >
                <span style={{ fontSize: "20px" }}>📸</span>
                <div>
                  <strong style={{ fontSize: "11px", color: "#111215", display: "block", lineHeight: 1.2 }}>
                    Photo Wall
                  </strong>
                  <span style={{ fontSize: "9px", color: "#666" }}>Township Stories</span>
                </div>
              </div>

              <div
                onClick={() => {
                  setEditingNeighbourId("alex");
                  setActivePage("avatar_studio");
                }}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1.5px solid #e7e4dc",
                  padding: "9px 11px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                }}
              >
                <CustomAvatar config={getAvatar("alex")} size={26} />
                <div>
                  <strong style={{ fontSize: "11px", color: "#111215", display: "block", lineHeight: 1.2 }}>
                    Avatar Studio
                  </strong>
                  <span style={{ fontSize: "9px", color: "#666" }}>Gear & Moves</span>
                </div>
              </div>
            </div>

            {/* ========================================================
                SECTION 1: YOUR EVENTS
                ======================================================== */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "9px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#111215", letterSpacing: "-0.02em" }}>
                    Your Events
                  </h2>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      padding: "1px 7px",
                      borderRadius: "99px",
                      background: "#f5c842",
                      color: "#111",
                    }}
                  >
                    {yourEvents.length}
                  </span>
                </div>
              </div>

              {yourEvents.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {yourEvents.map((ev) => renderEventCard(ev, true))}
                </div>
              ) : (
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1.5px dashed #dcd8cf",
                    padding: "16px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#666", fontWeight: 600 }}>
                    You haven&apos;t joined or hosted any events yet.
                  </p>
                  <button
                    onClick={() => setActivePage("create_event")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "10px",
                      background: "#111215",
                      color: "#fff",
                      border: 0,
                      fontSize: "11px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                    type="button"
                  >
                    + Host an Event
                  </button>
                </div>
              )}
            </div>

            {/* ========================================================
                SECTION 2: OTHER EVENTS (Grouped Section by Section by Date)
                ======================================================== */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#111215", letterSpacing: "-0.02em" }}>
                    Other Events
                  </h2>
                  <span style={{ fontSize: "11px", color: "#777", fontWeight: 600 }}>
                    Upcoming community activities by date
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "2px 7px",
                    borderRadius: "99px",
                    background: "rgba(0,0,0,0.06)",
                    color: "#555",
                  }}
                >
                  {otherEvents.length} available
                </span>
              </div>

              {Object.keys(otherEventsByDate).length > 0 ? (
                Object.entries(otherEventsByDate).map(([dateLabel, dateEvents]) => (
                  <div key={dateLabel} style={{ marginBottom: "14px" }}>
                    {/* Date Sub-Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "7px",
                        paddingLeft: "2px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12.5px",
                          fontWeight: 800,
                          color: "#111215",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {dateLabel}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#777",
                          background: "#e8e5dc",
                          padding: "1px 6px",
                          borderRadius: "99px",
                        }}
                      >
                        {dateEvents.length}
                      </span>
                    </div>

                    {/* Event Cards for this date in the SAME FORMAT */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {dateEvents.map((ev) => renderEventCard(ev, false))}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1.5px solid #e7e4dc",
                    padding: "16px",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>🎉</span>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#555", fontWeight: 700 }}>
                    You&apos;re participating in every upcoming event!
                  </p>
                </div>
              )}
            </div>

            {/* Section 3: Community Features */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#17181c" }}>
                Community Features
              </span>
              <button
                onClick={() => setTab("communities")}
                style={{ background: "none", border: 0, color: "#666", fontSize: "11px", fontWeight: 700, cursor: "pointer", padding: 0 }}
                type="button"
              >
                All Communities ➔
              </button>
            </div>

            {/* 2-Column Vibrant Community Feature Cards */}
            <div className="folder-grid">
              {/* Card 1: Buddy Matching */}
              <div
                className="folder-card folder-green"
                onClick={() => {
                  setTab("chats");
                  setBuddyModalOpen(true);
                }}
              >
                <div className="folder-peek-stack">
                  <CustomAvatar config={getAvatar("jamie")} size={34} />
                  <span className="folder-peek-sticker">🤝</span>
                </div>
                <div className="folder-info">
                  <h3 className="folder-title">Find a Buddy</h3>
                  <p className="folder-count">4 neighbours nearby</p>
                  <div className="folder-footer-row">
                    <span className="folder-badge-mini">✨ Match Partner</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Photo Wall & Memories (Middle Page) */}
              <div
                className="folder-card folder-salmon"
                onClick={() => setTab("wall")}
              >
                <div className="folder-peek-stack">
                  <CustomAvatar config={getAvatar("daniel")} size={34} />
                  <span className="folder-peek-sticker">📸</span>
                </div>
                <div className="folder-info">
                  <h3 className="folder-title">Photo Wall</h3>
                  <p className="folder-count">4 event galleries</p>
                  <div className="folder-footer-row">
                    <span className="folder-badge-mini">🎉 Memories</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Avatar Studio */}
              <div
                className="folder-card folder-purple"
                onClick={() => {
                  setEditingNeighbourId("alex");
                  setAvatarStudioOpen(true);
                }}
              >
                <div className="folder-peek-stack">
                  <CustomAvatar config={getAvatar("alex")} size={34} />
                  <span className="folder-peek-sticker">🎨</span>
                </div>
                <div className="folder-info">
                  <h3 className="folder-title">Avatar Studio</h3>
                  <p className="folder-count">Customize looks & gear</p>
                  <div className="folder-footer-row">
                    <span className="folder-badge-mini">🎲 Build Avatar</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Redeem Rewards */}
              <div
                className="folder-card folder-blue"
                onClick={() => setActivePage("rewards")}
              >
                <div className="folder-peek-stack">
                  <CustomAvatar config={getAvatar("michelle")} size={34} />
                  <span className="folder-peek-sticker">🎁</span>
                </div>
                <div className="folder-info">
                  <h3 className="folder-title">Redeem Points</h3>
                  <p className="folder-count">{points} pts · Free Kopi</p>
                  <div className="folder-footer-row">
                    <span className="folder-badge-mini">🔥 {streak}d Streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: COMMUNITIES (HASHTAG CLUBS & GROUP CHATS)
            ======================================================== */}
        {tab === "communities" && (
          <CommunitiesPage
            communities={communities}
            events={events}
            getAvatar={getAvatar}
            onHostEventForCommunity={(_category) => {
              setActivePage("create_event");
            }}
            onOpenCommunityChat={(community) => {
              setActiveCommunityChat(community);
            }}
            onOpenEvent={(ev) => {
              setViewingEvent(ev);
            }}
            onOpenPhotoWall={() => {
              setTab("wall");
            }}
            onToggleJoinCommunity={handleToggleJoinCommunity}
          />
        )}

        {/* ========================================================
            TAB 4: CHATS (WITH + BUDDY ON TOP)
            ======================================================== */}
        {tab === "chats" && (
          <div style={{ paddingTop: "6px" }}>
            <div className="screen-header" style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1 className="screen-title" style={{ fontSize: "22px", fontWeight: 900, margin: 0 }}>
                  Chats
                </h1>
                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#666", fontWeight: 600 }}>
                  Active event group chats & 1-on-1 neighbour messages
                </p>
              </div>

              {/* + Buddy Button on Top of Chats */}
              <button
                onClick={() => setBuddyModalOpen(true)}
                style={{
                  padding: "7px 12px",
                  borderRadius: "99px",
                  background: "#111215",
                  border: "1.5px solid #111215",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  flexShrink: 0,
                }}
                type="button"
              >
                <span>+</span> 🤝 Buddy
              </button>
            </div>

            {/* Quick Buddy Matching Carousel on Top of Chats */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1.5px solid #e7e4dc",
                padding: "10px 12px",
                marginBottom: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ fontSize: "13px" }}>🤝</span>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#111215" }}>
                    Neighbour Buddies
                  </span>
                  <span style={{ fontSize: "9.5px", background: "#fef08a", color: "#854d0e", fontWeight: 800, padding: "1px 6px", borderRadius: "99px" }}>
                    Smart Match
                  </span>
                </div>
                <button
                  onClick={() => setBuddyModalOpen(true)}
                  style={{
                    background: "none",
                    border: 0,
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#1971c2",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  type="button"
                >
                  View All ➔
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "9px",
                  overflowX: "auto",
                  paddingBottom: "4px",
                  scrollbarWidth: "none",
                }}
              >
                {/* '+ Match Buddy' card */}
                <div
                  onClick={() => setBuddyModalOpen(true)}
                  style={{
                    minWidth: "72px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    border: "1.5px dashed #faad14",
                    background: "#fefbf0",
                    padding: "7px 4px",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#f5c842",
                      color: "#111",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: 800,
                      marginBottom: "3px",
                    }}
                  >
                    +
                  </div>
                  <span style={{ fontSize: "9px", fontWeight: 800, color: "#111" }}>+ Match</span>
                  <span style={{ fontSize: "8px", color: "#888" }}>Buddy</span>
                </div>

                {/* Buddies preview cards */}
                {buddies.map((buddy) => (
                  <div
                    key={buddy.id}
                    style={{
                      minWidth: "88px",
                      background: "#f9f8f4",
                      borderRadius: "12px",
                      border: "1px solid #ebe8e0",
                      padding: "8px 6px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <CustomAvatar config={getAvatar(buddy.avatarKey)} size={34} />
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: "#2f9e44",
                          border: "1.5px solid #fff",
                        }}
                      />
                    </div>
                    <strong style={{ fontSize: "10px", color: "#111", marginTop: "3px" }}>
                      {buddy.name}
                    </strong>
                    <span style={{ fontSize: "8px", color: "#666", marginTop: "1px", whiteSpace: "nowrap" }}>
                      {buddy.interests[0]}
                    </span>
                    <button
                      onClick={() => handleOpenDirectChatWithBuddy(buddy)}
                      style={{
                        marginTop: "5px",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        border: "1px solid #111",
                        background: buddy.isFriend ? "#111" : "#ffffff",
                        color: buddy.isFriend ? "#fff" : "#111",
                        fontSize: "8.5px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                      type="button"
                    >
                      {buddy.isFriend ? "Chat 💬" : "+ Friend"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Segmented Control: Event Groups vs Direct Buddy Chats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                background: "#edeae1",
                padding: "3px",
                borderRadius: "12px",
                marginBottom: "14px",
              }}
            >
              <button
                onClick={() => setChatCategoryTab("groups")}
                style={{
                  padding: "7px 0",
                  borderRadius: "9px",
                  border: 0,
                  background: chatCategoryTab === "groups" ? "#ffffff" : "transparent",
                  color: chatCategoryTab === "groups" ? "#111215" : "#666666",
                  fontSize: "11px",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: chatCategoryTab === "groups" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                }}
                type="button"
              >
                <span>👥</span> Event Groups ({events.filter(isUserRegisteredForEvent).length})
              </button>

              <button
                onClick={() => setChatCategoryTab("direct")}
                style={{
                  padding: "7px 0",
                  borderRadius: "9px",
                  border: 0,
                  background: chatCategoryTab === "direct" ? "#ffffff" : "transparent",
                  color: chatCategoryTab === "direct" ? "#111215" : "#666666",
                  fontSize: "11px",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: chatCategoryTab === "direct" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                }}
                type="button"
              >
                <span>💬</span> Direct Chats ({directChats.length})
              </button>
            </div>

            {/* Sub-tab 1: Registered Event Groups */}
            {chatCategoryTab === "groups" && (
              <div className="wavy-chat-list">
                {events.filter(isUserRegisteredForEvent).length > 0 ? (
                  events.filter(isUserRegisteredForEvent).map((ev, index) => {
                    const bubbleColors = [
                      "wavy-bubble-coral",
                      "wavy-bubble-yellow",
                      "wavy-bubble-orange",
                      "wavy-bubble-blue",
                      "wavy-bubble-purple",
                    ];
                    const bubbleClass = bubbleColors[index % bubbleColors.length];
                    const latestMsg = ev.chatHistory[ev.chatHistory.length - 1];
                    const displayMsg = latestMsg
                      ? latestMsg.poll
                        ? `Poll: ${latestMsg.poll.question}`
                        : latestMsg.text
                      : ev.chatSnippet?.text || "Join discussion";

                    return (
                      <div
                        className={`wavy-chat-card ${bubbleClass}`}
                        key={ev.id}
                        onClick={() => {
                          setChatSource("chats");
                          setViewingEvent(null);
                          setChatEvent(ev);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <CustomAvatar
                          config={getAvatar(ev.hostAvatarKey || (ev.host.toLowerCase().includes("alex") ? "alex" : "user"))}
                          size={44}
                        />
                        <div className="wavy-content">
                          <div className="wavy-title-row">
                            <span className="wavy-sender">{ev.host} · {ev.title}</span>
                            <span className="wavy-time">{ev.time}</span>
                          </div>
                          <p className="wavy-message">
                            &ldquo;{displayMsg || "Welcome to the group chat!"}&rdquo;
                          </p>
                        </div>
                        <div className="wavy-badge-container">
                          <span className="wavy-sticker">{ev.sticker}</span>
                          {index === 0 && <span className="unread-counter-pill">1</span>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      border: "1.5px dashed #dedad0",
                      padding: "20px 16px",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "28px", display: "block", marginBottom: "6px" }}>👥</span>
                    <strong style={{ fontSize: "13px", color: "#111215", display: "block", marginBottom: "4px" }}>
                      No Registered Event Chats Yet
                    </strong>
                    <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#666" }}>
                      Register for an activity to unlock its event group chat and coordinating polls.
                    </p>
                    <button
                      onClick={() => setTab("today")}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "10px",
                        background: "#111215",
                        color: "#fff",
                        border: 0,
                        fontSize: "11px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                      type="button"
                    >
                      Explore Events
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Sub-tab 2: Direct 1-on-1 Chats with Buddies */}
            {chatCategoryTab === "direct" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                {directChats.length > 0 ? (
                  directChats.map((chat) => (
                    <div
                      key={chat.buddyId}
                      onClick={() => setActiveDirectChat(chat)}
                      style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        border: "1.5px solid #e7e4dc",
                        padding: "11px 13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "11px",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                        transition: "transform 0.15s ease",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <CustomAvatar config={getAvatar(chat.avatarKey)} size={44} />
                        <span
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: "9px",
                            height: "9px",
                            borderRadius: "50%",
                            background: "#2f9e44",
                            border: "2px solid #ffffff",
                          }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong style={{ fontSize: "13px", color: "#111215" }}>
                            {chat.buddyName}
                          </strong>
                          <span style={{ fontSize: "9.5px", color: "#888" }}>
                            {chat.lastTime}
                          </span>
                        </div>

                        <span style={{ fontSize: "9.5px", color: "#d9480f", fontWeight: 700, display: "block" }}>
                          {chat.subtitle}
                        </span>

                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: "11px",
                            color: "#555",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          &ldquo;{chat.lastMessage}&rdquo;
                        </p>
                      </div>

                      {chat.unreadCount && chat.unreadCount > 0 ? (
                        <span
                          style={{
                            background: "#d9480f",
                            color: "#fff",
                            fontSize: "9px",
                            fontWeight: 800,
                            borderRadius: "99px",
                            padding: "2px 6px",
                            flexShrink: 0,
                          }}
                        >
                          {chat.unreadCount}
                        </span>
                      ) : (
                        <span style={{ color: "#aaa", fontSize: "12px" }}>›</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      border: "1.5px dashed #dedad0",
                      padding: "20px 16px",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "28px", display: "block", marginBottom: "6px" }}>💬</span>
                    <strong style={{ fontSize: "13px", color: "#111215", display: "block", marginBottom: "4px" }}>
                      No Direct Chats Yet
                    </strong>
                    <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#666" }}>
                      Connect with neighbours in the Buddies tab to start chatting directly and invite them to activities!
                    </p>
                    <button
                      onClick={() => setBuddyModalOpen(true)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "10px",
                        background: "#111215",
                        color: "#fff",
                        border: 0,
                        fontSize: "11px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                      type="button"
                    >
                      Find Buddies
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: PHOTO WALL SCRAPBOOK (CENTERPIECE MIDDLE TAB) ✨
            ======================================================== */}
        {tab === "wall" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: "64px",
              display: "flex",
              flexDirection: "column",
              background: "#9ec5e8",
              zIndex: 15,
              overflow: "hidden",
            }}
          >
            <PhotoWallPage
              getAvatar={getAvatar}
              onBack={() => setTab("today")}
            />
          </div>
        )}


        {/* ========================================================
            TAB 5: PROFILE & SKILL SELF-ASSESSMENT & REWARDS
            ======================================================== */}
        {tab === "profile" && (
          <div style={{ paddingTop: "6px" }}>
            <div className="screen-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h1 className="screen-title" style={{ margin: 0 }}>{userName}</h1>
                <button
                  onClick={() => setProfileSettingsOpen(true)}
                  style={{
                    background: "none",
                    border: "1px solid #dcd8cf",
                    borderRadius: "6px",
                    padding: "3px 7px",
                    fontSize: "11px",
                    cursor: "pointer",
                    color: "#555",
                    fontWeight: 700,
                  }}
                  title="Rename or Edit Profile"
                  type="button"
                >
                  ✏️ Rename
                </button>
              </div>
              <span className="screen-meta-pill">Resident #284</span>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "22px",
                padding: "18px 16px",
                textAlign: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div
                onClick={() => {
                  setEditingNeighbourId("alex");
                  setActivePage("avatar_studio");
                }}
                style={{ display: "inline-block", cursor: "pointer", position: "relative" }}
                title="Tap to customize your avatar"
              >
                <CustomAvatar config={getAvatar("alex")} showGlow={true} size={84} />
                <span style={{ position: "absolute", right: -4, bottom: 0, background: "#111", color: "white", borderRadius: "50%", width: "24px", height: "24px", display: "grid", placeItems: "center", fontSize: "11px", border: "2px solid white" }}>
                  ✏️
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", margin: "8px 0 2px" }}>
                <h2 style={{ margin: 0, fontSize: "17.5px", fontWeight: 800 }}>{userName}</h2>
                <button
                  onClick={() => setProfileSettingsOpen(true)}
                  style={{ background: "none", border: 0, cursor: "pointer", fontSize: "12px", padding: 0 }}
                  title="Rename"
                  type="button"
                >
                  ✏️
                </button>
              </div>

              <p style={{ margin: 0, fontSize: "11px", color: "#666" }}>
                {userUnit}
              </p>

              {userBio && (
                <p style={{ margin: "5px 0 0", fontSize: "10.5px", color: "#555", fontStyle: "italic", lineHeight: 1.35 }}>
                  &ldquo;{userBio}&rdquo;
                </p>
              )}

              {/* Stats Bar */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  margin: "14px 0",
                  padding: "10px 0",
                  borderBlock: "1px solid #f0f0ea",
                }}
              >
                <div
                  onClick={() => setActivePage("streak")}
                  style={{ cursor: "pointer" }}
                  title="View Streak Challenge"
                >
                  <strong style={{ fontSize: "16px", display: "block", color: "#d9480f" }}>
                    {streak}d 🔥
                  </strong>
                  <span style={{ fontSize: "9.5px", color: "#777" }}>Streak (View)</span>
                </div>

                <div
                  onClick={() => setActivePage("rewards")}
                  style={{ cursor: "pointer", background: "#fef8e3", borderRadius: "10px", padding: "4px 2px" }}
                  title="Tap to Redeem Points"
                >
                  <strong style={{ fontSize: "16px", display: "block", color: "#854d0e" }}>
                    {points} 🪙
                  </strong>
                  <span style={{ fontSize: "9.5px", color: "#854d0e", fontWeight: 800 }}>Points (Redeem)</span>
                </div>

                <div
                  onClick={() => setBuddyModalOpen(true)}
                  style={{ cursor: "pointer" }}
                  title="View Buddies"
                >
                  <strong style={{ fontSize: "16px", display: "block" }}>8 🤝</strong>
                  <span style={{ fontSize: "9.5px", color: "#777" }}>Buddies</span>
                </div>
              </div>

              {/* Skill Tiers Display */}
              <div style={{ textAlign: "left", fontSize: "11px", display: "grid", gap: "6px" }}>
                <div style={{ background: "#f9f9f6", padding: "8px 10px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span><strong>🏸 Racquet Tier:</strong> {userSkills.racquetTier}</span>
                  <button
                    onClick={() => setProfileSettingsOpen(true)}
                    style={{ background: "none", border: 0, color: "#1971c2", fontSize: "10px", fontWeight: 800, cursor: "pointer" }}
                    type="button"
                  >
                    Edit
                  </button>
                </div>
                <div style={{ background: "#f9f9f6", padding: "8px 10px", borderRadius: "10px" }}>
                  <strong>🏃 Running Target:</strong> {userSkills.runningPace} · {userSkills.runningDistance}
                </div>
                <div style={{ background: "#f9f9f6", padding: "8px 10px", borderRadius: "10px" }}>
                  <strong>🚗 Commute:</strong> {userSkills.commuteRoute}
                </div>
              </div>

              {/* Contribution Badges */}
              <div style={{ textAlign: "left", marginTop: "12px" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#777" }}>CONTRIBUTION BADGES</span>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "4px" }}>
                  <span style={{ fontSize: "9.5px", padding: "3px 7px", borderRadius: "6px", background: "#fef8e3", border: "1px solid #fae29c", fontWeight: 700 }}>
                    🌟 Active Host
                  </span>
                  <span style={{ fontSize: "9.5px", padding: "3px 7px", borderRadius: "6px", background: "#e8f5e9", border: "1px solid #c8e6c9", fontWeight: 700 }}>
                    🤝 Friendly Neighbour
                  </span>
                  <span style={{ fontSize: "9.5px", padding: "3px 7px", borderRadius: "6px", background: "#e3f2fd", border: "1px solid #bbdefb", fontWeight: 700 }}>
                    🏸 Rally Master
                  </span>
                </div>
              </div>

              {/* Profile Actions: Dedicated Full-Page Redeem Points & Settings Buttons (No Photo Wall here) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
                <button
                  className="btn-punchy yellow"
                  onClick={() => setActivePage("rewards")}
                  style={{
                    minHeight: "42px",
                    fontSize: "12px",
                    fontWeight: 800,
                    boxShadow: "0 4px 14px rgba(245,200,66,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                  type="button"
                >
                  <span>🎁</span> Redeem Community Points ({points} pts) ➔
                </button>

                <button
                  onClick={() => setProfileSettingsOpen(true)}
                  style={{
                    padding: "10px",
                    borderRadius: "14px",
                    border: "1.5px solid #dcd8cf",
                    background: "#ffffff",
                    fontSize: "11.5px",
                    fontWeight: 800,
                    color: "#333",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                  }}
                  type="button"
                >
                  <span>⚙️</span> Edit Profile & Skill Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          FLOATING PILL NAVIGATION DOCK
          ======================================================== */}
      <nav aria-label="Bottom Navigation" className="pill-nav-dock">
        <button
          aria-label="Today"
          className={`nav-dock-btn ${tab === "today" ? "active" : ""}`}
          onClick={() => setTab("today")}
          type="button"
        >
          <svg fill="none" height={19} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={19}>
            <rect height="18" rx="3" width="18" x="3" y="4" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </button>

        <button
          aria-label="Communities"
          className={`nav-dock-btn ${tab === "communities" ? "active" : ""}`}
          onClick={() => setTab("communities")}
          type="button"
        >
          <svg fill="none" height={19} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={19}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </button>

        {/* MIDDLE TAB: PHOTO WALL SCRAPBOOK ✨ */}
        <button
          aria-label="Photo Wall"
          className={`nav-dock-btn ${tab === "wall" ? "active" : ""}`}
          onClick={() => setTab("wall")}
          style={{ position: "relative" }}
          type="button"
        >
          <svg fill="none" height={20} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={20}>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span style={{ position: "absolute", top: "1px", right: "2px", fontSize: "9px" }}>✨</span>
        </button>

        <button
          aria-label="Chats"
          className={`nav-dock-btn ${tab === "chats" ? "active" : ""}`}
          onClick={() => setTab("chats")}
          type="button"
        >
          <svg fill="none" height={19} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={19}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        <button
          aria-label="Profile"
          className={`nav-dock-btn ${tab === "profile" ? "active" : ""}`}
          onClick={() => setTab("profile")}
          type="button"
        >
          <CustomAvatar config={getAvatar("alex")} size={28} />
        </button>
      </nav>

      {/* ========================================================
          NOTIFICATIONS & DAY-BEFORE ALERT DRAWER
          ======================================================== */}
      {notificationsOpen && (
        <div aria-modal="true" className="modal-backdrop" role="dialog">
          <div className="playful-sheet">
            <button className="modal-close-pill" onClick={() => setNotificationsOpen(false)} type="button">✕</button>
            <h2 style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: 800 }}>
              Township Alerts 🔔
            </h2>

            {/* Pop-up Notification Day Before Event */}
            <div
              style={{
                background: "#fef8e3",
                borderRadius: "16px",
                padding: "12px",
                border: "1.5px solid #fae29c",
                marginBottom: "10px",
              }}
            >
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "20px" }}>🏸</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: "12px", color: "#84630a", display: "block" }}>
                    Tomorrow at 8:00 AM: Weekend Badminton Meetup
                  </strong>
                  <p style={{ margin: "2px 0 6px", fontSize: "10.5px", color: "#8d6a13" }}>
                    Court 2, Community Sports Hall. Host Sarah posted warmup drills in chat.
                  </p>
                  <button
                    className="btn-punchy yellow"
                    onClick={() => {
                      setNotificationsOpen(false);
                      setViewingEvent(events[0]);
                    }}
                    style={{ minHeight: "32px", fontSize: "10.5px", padding: "0 10px" }}
                    type="button"
                  >
                    View Chat & Court Pass
                  </button>
                </div>
              </div>
            </div>

            <div style={{ background: "white", border: "1px solid #eee", borderRadius: "14px", padding: "10px" }}>
              <strong style={{ fontSize: "11px", display: "block" }}>Jamie accepted your buddy request!</strong>
              <small style={{ color: "#777" }}>You both enjoy badminton & coffee.</small>
            </div>
          </div>
        </div>
      )}




      {/* ========================================================
          PROFILE SETTINGS MODAL (RENAME & PREFERENCES)
          ======================================================== */}
      {profileSettingsOpen && (
        <div aria-modal="true" className="modal-backdrop" role="dialog" style={{ zIndex: 110 }}>
          <div className="playful-sheet" style={{ maxWidth: "340px", padding: "18px 16px", maxHeight: "88vh", overflowY: "auto" }}>
            <button className="modal-close-pill" onClick={() => setProfileSettingsOpen(false)} type="button">✕</button>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", borderBottom: "1px solid #f0eee6", paddingBottom: "10px" }}>
              <span style={{ fontSize: "22px" }}>⚙️</span>
              <div>
                <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>Profile Settings</h2>
                <span style={{ fontSize: "10px", color: "#666" }}>Edit name, residence unit & activity preferences</span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setProfileSettingsOpen(false);
              }}
              style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}
            >
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#333", marginBottom: "4px" }}>
                  FULL NAME / DISPLAY NAME:
                </label>
                <input
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Alex Tan"
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: "1.5px solid #dcd8cf",
                    fontSize: "12px",
                    color: "#111",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                  type="text"
                  value={userName}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#333", marginBottom: "4px" }}>
                  PRECINCT & RESIDENT UNIT:
                </label>
                <input
                  onChange={(e) => setUserUnit(e.target.value)}
                  placeholder="e.g. Sime Darby Township · Precinct 4"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: "1.5px solid #dcd8cf",
                    fontSize: "12px",
                    color: "#111",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                  type="text"
                  value={userUnit}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#333", marginBottom: "4px" }}>
                  ABOUT / SHORT BIO:
                </label>
                <textarea
                  onChange={(e) => setUserBio(e.target.value)}
                  placeholder="Share a short note about your hobbies or sports..."
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1.5px solid #dcd8cf",
                    fontSize: "11.5px",
                    color: "#111",
                    boxSizing: "border-box",
                    outline: "none",
                    resize: "none",
                  }}
                  value={userBio}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#333", marginBottom: "4px" }}>
                  RACQUET SPORT TIER:
                </label>
                <select
                  onChange={(e) => setUserSkills({ ...userSkills, racquetTier: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "10px",
                    border: "1.5px solid #dcd8cf",
                    fontSize: "11.5px",
                    background: "white",
                    boxSizing: "border-box",
                  }}
                  value={userSkills.racquetTier}
                >
                  <option value="Casual / Just for Sweat">Casual / Just for Sweat</option>
                  <option value="Intermediate / Rally & Rotations">Intermediate / Rally & Rotations</option>
                  <option value="Advanced / Competitive Sparring">Advanced / Competitive Sparring</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#333", marginBottom: "4px" }}>
                  RUNNING PACE & DISTANCE:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  <input
                    onChange={(e) => setUserSkills({ ...userSkills, runningPace: e.target.value })}
                    placeholder="e.g. 5:30 min/km"
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      border: "1.5px solid #dcd8cf",
                      fontSize: "11px",
                      boxSizing: "border-box",
                    }}
                    type="text"
                    value={userSkills.runningPace}
                  />
                  <input
                    onChange={(e) => setUserSkills({ ...userSkills, runningDistance: e.target.value })}
                    placeholder="e.g. 5 - 10 km"
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      border: "1.5px solid #dcd8cf",
                      fontSize: "11px",
                      boxSizing: "border-box",
                    }}
                    type="text"
                    value={userSkills.runningDistance}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "10px", paddingTop: "6px" }}>
                <button
                  onClick={() => setProfileSettingsOpen(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "12px",
                    border: "1.5px solid #ddd",
                    background: "#ffffff",
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
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                  type="submit"
                >
                  Save Profile ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT SKILL & PACE TIERS MODAL
          ======================================================== */}
      {editSkillsOpen && (
        <div aria-modal="true" className="modal-backdrop" role="dialog">
          <div className="playful-sheet">
            <button className="modal-close-pill" onClick={() => setEditSkillsOpen(false)} type="button">✕</button>
            <h2 style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: 800 }}>Skill Self-Assessment</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditSkillsOpen(false);
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, marginBottom: "3px" }}>Racquet Sports Tier</label>
                <select
                  onChange={(e) => setUserSkills({ ...userSkills, racquetTier: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "11px" }}
                  value={userSkills.racquetTier}
                >
                  <option value="Casual / Just for Sweat">Casual / Just for Sweat</option>
                  <option value="Intermediate / Rally & Rotations">Intermediate / Rally & Rotations</option>
                  <option value="Competitive / Match Play">Competitive / Match Play</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, marginBottom: "3px" }}>Target Pace</label>
                  <input
                    onChange={(e) => setUserSkills({ ...userSkills, runningPace: e.target.value })}
                    style={{ width: "100%", padding: "7px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "11px" }}
                    type="text"
                    value={userSkills.runningPace}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, marginBottom: "3px" }}>Planned Distance</label>
                  <input
                    onChange={(e) => setUserSkills({ ...userSkills, runningDistance: e.target.value })}
                    style={{ width: "100%", padding: "7px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "11px" }}
                    type="text"
                    value={userSkills.runningDistance}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, marginBottom: "3px" }}>Commute Window</label>
                <input
                  onChange={(e) => setUserSkills({ ...userSkills, commuteRoute: e.target.value })}
                  style={{ width: "100%", padding: "7px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "11px" }}
                  type="text"
                  value={userSkills.commuteRoute}
                />
              </div>

              <button className="btn-punchy yellow" type="submit">
                Save Preferences
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          REWARDS REDEMPTION MODAL
          ======================================================== */}
      {rewardsModalOpen && (
        <div aria-modal="true" className="modal-backdrop" role="dialog">
          <div className="playful-sheet" style={{ border: "2px solid #111215" }}>
            <button className="modal-close-pill" onClick={() => setRewardsModalOpen(false)} type="button">✕</button>
            <span style={{ fontSize: "28px" }}>🎁</span>
            <h2 style={{ margin: "2px 0 4px", fontSize: "18px", fontWeight: 800 }}>Redeem Rewards</h2>
            <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#666" }}>
              You have <strong>{points} Community Points</strong>
            </p>

            <div style={{ display: "grid", gap: "8px" }}>
              <div style={{ background: "#ffffff", border: "1.5px solid #111215", padding: "10px 12px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 0 #111215" }}>
                <div>
                  <strong style={{ fontSize: "12px", display: "block" }}>1-Hour Court Pass</strong>
                  <small style={{ color: "#666" }}>Badminton / Pickleball (200 pts)</small>
                </div>
                <button
                  disabled={points < 200}
                  onClick={() => {
                    setPoints((p) => p - 200);
                    showAppToast({
                      title: "Reward Redeemed!",
                      message: "1-Hour Court Pass added to your passes.",
                      icon: "🏸",
                    });
                  }}
                  style={{ padding: "6px 12px", borderRadius: "10px", background: points >= 200 ? "var(--folder-yellow)" : "#e5e7eb", border: "1.5px solid #111", fontWeight: 800, fontSize: "10.5px", cursor: points >= 200 ? "pointer" : "default" }}
                  type="button"
                >
                  Redeem
                </button>
              </div>

              <div style={{ background: "#ffffff", border: "1.5px solid #111215", padding: "10px 12px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 0 #111215" }}>
                <div>
                  <strong style={{ fontSize: "12px", display: "block" }}>Central Cafe 10% Off</strong>
                  <small style={{ color: "#666" }}>Coffee / Smoothie voucher (100 pts)</small>
                </div>
                <button
                  disabled={points < 100}
                  onClick={() => {
                    setPoints((p) => p - 100);
                    showAppToast({
                      title: "Reward Redeemed!",
                      message: "10% Central Cafe voucher saved.",
                      icon: "☕",
                    });
                  }}
                  style={{ padding: "6px 12px", borderRadius: "10px", background: points >= 100 ? "var(--folder-yellow)" : "#e5e7eb", border: "1.5px solid #111", fontWeight: 800, fontSize: "10.5px", cursor: points >= 100 ? "pointer" : "default" }}
                  type="button"
                >
                  Redeem
                </button>
              </div>
            </div>

            <button
              className="btn-punchy yellow"
              onClick={() => {
                setRewardsModalOpen(false);
                setActivePage("rewards");
              }}
              style={{ marginTop: "14px", minHeight: "40px", fontSize: "12px", fontWeight: 900, border: "2px solid #111215" }}
              type="button"
            >
              Open Full Rewards Store ➔
            </button>
          </div>
        </div>
      )}





      {/* ========================================================
          JOIN TOGETHER MODAL
          ======================================================== */}
      {joinModalEvent && (
        <div aria-modal="true" className="modal-backdrop" role="dialog">
          <div className="playful-sheet" style={{ textAlign: "center" }}>
            <button className="modal-close-pill" onClick={() => setJoinModalEvent(null)} type="button">✕</button>
            <span style={{ fontSize: "32px" }}>🤝</span>
            <h2 style={{ margin: "4px 0 2px", fontSize: "18px", fontWeight: 800 }}>Join Together</h2>
            <p style={{ margin: "0 0 14px", fontSize: "11px", color: "#666" }}>
              Never attend alone! Choose how you'd like to show up for {joinModalEvent.title}.
            </p>

            <div style={{ display: "grid", gap: "8px", textAlign: "left", marginBottom: "14px" }}>
              <button
                onClick={() => handleConfirmJoinTogether("buddy", "jamie")}
                style={{
                  padding: "10px",
                  borderRadius: "12px",
                  border: "1.5px solid #111",
                  background: "var(--folder-yellow-light)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                type="button"
              >
                <CustomAvatar config={getAvatar("jamie")} size={34} />
                <div>
                  <strong style={{ fontSize: "11px", display: "block" }}>Pair up with Jamie</strong>
                  <span style={{ fontSize: "9.5px", color: "#666" }}>You both enjoy badminton & coffee</span>
                </div>
              </button>

              <button
                onClick={() => handleConfirmJoinTogether("need_buddy")}
                style={{
                  padding: "10px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  background: "#f9f9f6",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                type="button"
              >
                <span style={{ fontSize: "20px" }}>🙋</span>
                <div>
                  <strong style={{ fontSize: "11px", display: "block" }}>Request an Activity Partner</strong>
                  <span style={{ fontSize: "9.5px", color: "#666" }}>Organizer matches you with a fellow newcomer</span>
                </div>
              </button>
            </div>

            <button
              className="btn-punchy"
              onClick={() => handleConfirmJoinTogether("solo")}
              type="button"
            >
              Just Register Me Solo
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          BUDDY MATCHING & DISCOVERY MODAL (FROM TOP OF CHATS)
          ======================================================== */}
      {buddyModalOpen && (
        <div aria-modal="true" className="modal-backdrop" role="dialog">
          <div className="playful-sheet" style={{ maxHeight: "88vh", display: "flex", flexDirection: "column" }}>
            <button className="modal-close-pill" onClick={() => setBuddyModalOpen(false)} type="button">✕</button>

            <div style={{ marginBottom: "10px", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "20px" }}>🤝</span>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>
                  Find Activity Buddies
                </h2>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#666" }}>
                Connect with neighbours who share your activity pace & sports tier
              </p>
            </div>

            {/* Smart Matching Banner */}
            <div
              style={{
                background: "#fefbf0",
                border: "1.5px solid #fae29c",
                borderRadius: "14px",
                padding: "8px 12px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "18px" }}>🎯</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ fontSize: "11px", color: "#8c6500", display: "block" }}>
                  Smart Profile Match: {userSkills.racquetTier}
                </strong>
                <span style={{ fontSize: "9.5px", color: "#666" }}>
                  Add friends to unlock 1-on-1 chats and register together
                </span>
              </div>
            </div>

            {/* Buddies List */}
            <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "10px", paddingRight: "2px" }}>
              {buddies.map((buddy) => (
                <div
                  key={buddy.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "12px",
                    border: "1.5px solid #e7e4dc",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  <div
                    onClick={() => {
                      setBuddyModalOpen(false);
                      setEditingNeighbourId(buddy.avatarKey);
                      setActivePage("avatar_studio");
                    }}
                    style={{ cursor: "pointer", position: "relative", flexShrink: 0 }}
                    title="Tap to customize avatar"
                  >
                    <CustomAvatar config={getAvatar(buddy.avatarKey)} size={44} />
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#2f9e44",
                        border: "1.5px solid #fff",
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <strong style={{ fontSize: "13px", color: "#111" }}>{buddy.name}</strong>
                      <span
                        style={{
                          fontSize: "8.5px",
                          fontWeight: 800,
                          padding: "1px 5px",
                          borderRadius: "4px",
                          background: "#eaf8f0",
                          color: "#197142",
                        }}
                      >
                        {buddy.isFriend ? "Friend ✓" : "96% Match"}
                      </span>
                    </div>
                    <div style={{ fontSize: "10px", color: "#666", marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {buddy.skillNote}
                    </div>
                    <div style={{ display: "flex", gap: "3px", marginTop: "4px", flexWrap: "wrap" }}>
                      {buddy.interests.map((interest) => (
                        <span
                          key={interest}
                          style={{
                            fontSize: "8px",
                            fontWeight: 700,
                            padding: "2px 5px",
                            borderRadius: "4px",
                            background: "#f3f4f0",
                            color: "#444",
                          }}
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 }}>
                    <button
                      onClick={() => toggleFriend(buddy.id)}
                      style={{
                        padding: "5px 9px",
                        borderRadius: "8px",
                        border: buddy.isFriend ? "1px solid #111" : "1px solid #ddd",
                        background: buddy.isFriend ? "#111" : "white",
                        color: buddy.isFriend ? "white" : "#111",
                        fontSize: "9px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                      type="button"
                    >
                      {buddy.isFriend ? "Friends ✓" : "+ Friend"}
                    </button>

                    <button
                      onClick={() => {
                        setBuddyModalOpen(false);
                        handleOpenDirectChatWithBuddy(buddy);
                      }}
                      style={{
                        padding: "5px 9px",
                        borderRadius: "8px",
                        border: "1px solid #e7e4dc",
                        background: "#f8f7f2",
                        color: "#111",
                        fontSize: "9px",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "3px",
                      }}
                      type="button"
                    >
                      💬 Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
