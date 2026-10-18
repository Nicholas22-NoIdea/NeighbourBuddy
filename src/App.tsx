import { useMemo, useState } from "react";

type IconName =
  | "home"
  | "compass"
  | "users"
  | "calendar"
  | "user"
  | "search"
  | "bell"
  | "bookmark"
  | "pin"
  | "clock"
  | "chevron"
  | "close"
  | "check"
  | "sparkles";

function Icon({ name, size = 20, filled = false }: { name: IconName; size?: number; filled?: boolean }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 9h18m-12 6 2 2 4-4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3ZM5 15l.7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15Zm14-2 .8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13Z" /></>,
  };
  return (
    <svg
      aria-hidden="true"
      className={filled ? "icon-filled" : ""}
      fill={filled ? "currentColor" : "none"}
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">{paths[name]}</g>
    </svg>
  );
}

const photos = {
  badminton: "https://images.unsplash.com/photo-1723633236252-eb7badabb34c?auto=format&fit=crop&w=1000&q=85",
  jogging: "https://images.unsplash.com/photo-1758520705254-1e9d913d78ea?auto=format&fit=crop&w=1000&q=85",
  games: "https://images.unsplash.com/photo-1758691031197-fee3ccad4d68?auto=format&fit=crop&w=1000&q=85",
  community: "https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=1000&q=85",
  jamie: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=85",
  michelle: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=85",
  alex: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=85",
  sarah: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=85",
  daniel: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=85",
  emily: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=100&q=85",
};

type EventData = {
  id: number;
  title: string;
  category: string;
  date: string;
  venue: string;
  joined: number;
  spots: number;
  host: string;
  hostPhoto: string;
  image: string;
};

const events: EventData[] = [
  { id: 1, title: "Weekend Badminton Meetup", category: "Sports", date: "Saturday, 24 October · 8:00 AM", venue: "Community Sports Hall", joined: 8, spots: 4, host: "Sarah", hostPhoto: photos.sarah, image: photos.badminton },
  { id: 2, title: "Morning Jog & Coffee", category: "Sports", date: "Sunday, 25 October · 7:00 AM", venue: "Township Central Park", joined: 12, spots: 6, host: "Daniel", hostPhoto: photos.daniel, image: photos.jogging },
  { id: 3, title: "Board Games & Chill", category: "Social", date: "Saturday, 24 October · 3:00 PM", venue: "Community Lounge", joined: 6, spots: 4, host: "Emily", hostPhoto: photos.emily, image: photos.games },
];

const categories = ["All", "Sports", "Social", "Hobbies", "Family", "Community"];

function BrandHeader({ onNotifications }: { onNotifications: () => void }) {
  const [locationOpen, setLocationOpen] = useState(false);
  return (
    <header className="top-header">
      <div className="brand-lockup">
        <span className="brand-mark"><Icon name="users" size={19} /></span>
        <div className="location-wrap">
          <strong>NeighbourBuddy</strong>
          <button aria-expanded={locationOpen} className="location-button" onClick={() => setLocationOpen(!locationOpen)} type="button">Sime Darby Township <span>⌄</span></button>
          {locationOpen && <div className="location-popover"><Icon name="pin" size={16} /><span><strong>Sime Darby Township</strong><small>Current community</small></span><Icon name="check" size={16} /></div>}
        </div>
      </div>
      <div className="header-actions">
        <button aria-label="Open notifications" className="icon-button notification-button" onClick={onNotifications} type="button">
          <Icon name="bell" size={21} /><span className="unread-dot" />
        </button>
        <img alt="Alex's profile" className="profile-avatar" src={photos.alex} />
      </div>
    </header>
  );
}

function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {action && <button className="text-button" onClick={onAction} type="button">{action} <Icon name="chevron" size={15} /></button>}
    </div>
  );
}

function EventCard({ event, saved, onSave, onOpen }: { event: EventData; saved: boolean; onSave: () => void; onOpen: () => void }) {
  return (
    <article className="event-card">
      <div className="event-image-wrap">
        <img alt={`${event.title} activity`} className="event-image" src={event.image} />
        <span className="category-badge">{event.category}</span>
        <button aria-label={saved ? "Remove bookmark" : "Save event"} className={`bookmark-button ${saved ? "saved" : ""}`} onClick={onSave} type="button">
          <Icon filled={saved} name="bookmark" size={19} />
        </button>
      </div>
      <div className="event-content">
        <h3>{event.title}</h3>
        <p className="event-meta date-meta"><Icon name="clock" size={16} />{event.date}</p>
        <p className="event-meta"><Icon name="pin" size={16} />{event.venue}</p>
        <div className="attendance-row">
          <div className="avatar-stack" aria-label={`${event.joined} people joined`}>
            <img alt="" src={photos.jamie} /><img alt="" src={photos.michelle} /><img alt="" src={event.hostPhoto} />
          </div>
          <strong>{event.joined} joined</strong>
          <span className="spots-pill">{event.spots} spots left</span>
        </div>
        <div className="card-footer">
          <div className="host">
            <img alt="" src={event.hostPhoto} />
            <span>Hosted by <strong>{event.host}</strong></span>
          </div>
          <button className="small-primary" onClick={onOpen} type="button">View Event</button>
        </div>
      </div>
    </article>
  );
}

function BuddyCard({ name, image, interests, note, requested, onAdd }: { name: string; image: string; interests: string[]; note: string; requested: boolean; onAdd: () => void }) {
  return (
    <article className="buddy-card">
      <img alt={`${name}'s profile`} className="buddy-photo" src={image} />
      <div className="buddy-name-row"><h3>{name}</h3><span className="online-dot" /></div>
      <div className="interest-list">{interests.map((interest) => <span key={interest}>{interest}</span>)}</div>
      <p><Icon name="sparkles" size={14} />{note}</p>
      <button className={requested ? "request-sent" : "add-button"} onClick={onAdd} type="button">
        {requested && <Icon name="check" size={15} />}{requested ? "Request Sent" : "Add Friend"}
      </button>
    </article>
  );
}

function EventModal({ event, joined, joining, onJoin, onClose }: { event: EventData; joined: boolean; joining: boolean; onJoin: () => void; onClose: () => void }) {
  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <div className="event-modal">
        <div className="modal-handle" />
        <button aria-label="Close event details" className="modal-close" onClick={onClose} type="button"><Icon name="close" /></button>
        <img alt={`${event.title} activity`} className="modal-image" src={event.image} />
        <div className="modal-content">
          <span className="eyebrow">{event.category} · Neighbourhood event</span>
          <h2>{event.title}</h2>
          <p className="modal-lede">Come as you are. This friendly local meetup is open to residents of all experience levels, even if you don’t know anyone yet.</p>
          <div className="detail-box">
            <p><Icon name="clock" /> <span><strong>{event.date}</strong><small>Arrive 10 minutes before start</small></span></p>
            <p><Icon name="pin" /> <span><strong>{event.venue}</strong><small>Sime Darby Township</small></span></p>
          </div>
          <div className="participant-summary">
            <div className="avatar-stack large"><img alt="" src={photos.jamie} /><img alt="" src={photos.michelle} /><img alt="" src={event.hostPhoto} /></div>
            <div><strong>{event.joined + (joined ? 1 : 0)} neighbours are going</strong><span>{Math.max(0, event.spots - (joined ? 1 : 0))} spots still available</span></div>
          </div>
          <button className={`join-button ${joined ? "joined" : ""}`} disabled={joining || joined} onClick={onJoin} type="button">
            {joining ? "Saving your spot..." : joined ? <><Icon name="check" /> You’re going!</> : "Join Event"}
          </button>
          {joined && <p className="confirmation">Confirmed. We’ve added this event to Your Activities.</p>}
          <p className="prototype-note">Prototype event · Sample details for demonstration only</p>
        </div>
      </div>
    </div>
  );
}

function Notifications({ onClose }: { onClose: () => void }) {
  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <div className="notification-sheet">
        <div className="sheet-heading"><h2>Notifications</h2><button aria-label="Close notifications" className="icon-button" onClick={onClose} type="button"><Icon name="close" /></button></div>
        <div className="notification-item new">
          <span className="notification-icon"><Icon name="calendar" /></span>
          <div><strong>Badminton starts this Saturday</strong><p>Your upcoming activity begins at 8:00 AM.</p><small>12 min ago</small></div>
        </div>
        <div className="notification-item">
          <img alt="" src={photos.jamie} />
          <div><strong>Jamie is also interested</strong><p>You both saved Weekend Badminton Meetup.</p><small>Yesterday</small></div>
        </div>
        <p className="prototype-note">Sample notifications for demonstration only</p>
      </div>
    </div>
  );
}

function HomePage({ setPage }: { setPage: (page: string) => void }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([2]);
  const [requests, setRequests] = useState<string[]>([]);
  const [selected, setSelected] = useState<EventData | null>(null);
  const [joined, setJoined] = useState<number[]>([]);
  const [joining, setJoining] = useState(false);

  const filteredEvents = useMemo(() => events.filter((event) => {
    const matchesCategory = category === "All" || event.category === category;
    const value = `${event.title} ${event.venue} ${event.host}`.toLowerCase();
    return matchesCategory && value.includes(query.toLowerCase());
  }), [category, query]);

  function joinEvent(event: EventData) {
    setJoining(true);
    window.setTimeout(() => {
      setJoined((current) => [...current, event.id]);
      setJoining(false);
    }, 650);
  }

  return (
    <>
      <section className="welcome">
        <span className="eyebrow">YOUR NEIGHBOURHOOD</span>
        <h1>Good morning, Alex <span aria-hidden="true">👋</span></h1>
        <p>Let’s make something happen in your neighbourhood.</p>
      </section>

      <label className="search-box">
        <Icon name="search" size={20} />
        <input onChange={(event) => setQuery(event.target.value)} placeholder="Search events or find neighbours..." type="search" value={query} />
      </label>

      <div className="quick-actions">
        <button className="primary-action" onClick={() => setPage("Explore")} type="button"><Icon name="compass" />Explore Events</button>
        <button className="secondary-action" onClick={() => setPage("Buddies")} type="button"><Icon name="users" />Find a Buddy</button>
      </div>

      <section className="section">
        <SectionTitle action="See all" onAction={() => setPage("Explore")} title="Happening Around You" />
        <div className="chip-scroller">
          {categories.map((item) => <button className={`chip ${category === item ? "active" : ""}`} key={item} onClick={() => setCategory(item)} type="button">{item}</button>)}
        </div>
        <div className="event-list">
          {filteredEvents.map((event) => (
            <EventCard
              event={event}
              key={event.id}
              onOpen={() => setSelected(event)}
              onSave={() => setSaved((current) => current.includes(event.id) ? current.filter((id) => id !== event.id) : [...current, event.id])}
              saved={saved.includes(event.id)}
            />
          ))}
          {!filteredEvents.length && <div className="empty-state"><span><Icon name="search" size={25} /></span><h3>No events found</h3><p>Try another search or category.</p><button onClick={() => { setQuery(""); setCategory("All"); }} type="button">Clear filters</button></div>}
        </div>
      </section>

      <section className="section buddies-section">
        <SectionTitle action="See all" onAction={() => setPage("Buddies")} title="Find Your People" />
        <p className="section-subtitle">Meet neighbours who share your interests.</p>
        <div className="buddy-scroller">
          <BuddyCard image={photos.jamie} interests={["Badminton", "Coffee"]} name="Jamie" note="You both enjoy badminton" onAdd={() => setRequests((r) => [...r, "Jamie"])} requested={requests.includes("Jamie")} />
          <BuddyCard image={photos.michelle} interests={["Jogging", "Photography"]} name="Michelle" note="2 shared interests" onAdd={() => setRequests((r) => [...r, "Michelle"])} requested={requests.includes("Michelle")} />
        </div>
      </section>

      <section className="together-banner">
        <div>
          <span className="mini-label">BETTER TOGETHER</span>
          <h2>Don’t want to go alone?</h2>
          <p>Find neighbours joining the same event and make new friends along the way.</p>
          <button onClick={() => setPage("Buddies")} type="button">Find People to Join <Icon name="chevron" size={16} /></button>
        </div>
        <img alt="Neighbours enjoying time together" src={photos.community} />
      </section>

      <section className="section">
        <SectionTitle action="View all" onAction={() => setPage("Activities")} title="Your Upcoming Activities" />
        <button className="upcoming-card" onClick={() => setSelected(events[0])} type="button">
          <img alt="" src={photos.badminton} />
          <span className="upcoming-info"><small>NEXT UP · IN 3 DAYS</small><strong>Weekend Badminton Meetup</strong><span><Icon name="clock" size={14} />Sat, 24 Oct · 8:00 AM</span><span><Icon name="pin" size={14} />Community Sports Hall</span></span>
          <span className="reminder-badge"><Icon name="bell" size={14} /> On</span>
        </button>
      </section>

      <section className="section community-section">
        <SectionTitle title="Around Your Community" />
        <article className="community-card">
          <img alt="Neighbours gathered at a community event" src={photos.community} />
          <div><span className="mini-label">COMMUNITY SPOTLIGHT</span><h3>Township Weekend Gathering</h3><p>Good food, familiar faces, and a warm welcome for every neighbour.</p><button onClick={() => setPage("Explore")} type="button">Explore the community <Icon name="chevron" size={15} /></button></div>
        </article>
      </section>

      <footer className="brand-message">Discover activities. Find your people.<br /><strong>Build your community.</strong></footer>
      {selected && <EventModal event={selected} joined={joined.includes(selected.id)} joining={joining} onClose={() => setSelected(null)} onJoin={() => joinEvent(selected)} />}
    </>
  );
}

function ListingPage({ page, onOpen }: { page: string; onOpen: (event: EventData) => void }) {
  const [saved, setSaved] = useState<number[]>([]);
  const [requests, setRequests] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const content = {
    Explore: { eyebrow: "DISCOVER", title: "Explore nearby", text: "Find something worth showing up for.", icon: "compass" as IconName },
    Buddies: { eyebrow: "CONNECTIONS", title: "Find your people", text: "Meet friendly neighbours with shared interests.", icon: "users" as IconName },
    Activities: { eyebrow: "YOUR PLANS", title: "Upcoming activities", text: "Everything you’ve joined, all in one place.", icon: "calendar" as IconName },
    Profile: { eyebrow: "YOUR SPACE", title: "Alex Tan", text: "Sime Darby Township · Member since 2024", icon: "user" as IconName },
  }[page]!;

  return (
    <div className="listing-page">
      <section className="page-intro"><span className="page-icon"><Icon name={content.icon} size={23} /></span><span className="eyebrow">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.text}</p></section>
      {page === "Explore" && <><label className="search-box"><Icon name="search" /><input placeholder="Search all events..." /></label><div className="event-list">{events.map((event) => <EventCard event={event} key={event.id} onOpen={() => onOpen(event)} onSave={() => setSaved((current) => current.includes(event.id) ? current.filter((id) => id !== event.id) : [...current, event.id])} saved={saved.includes(event.id)} />)}</div></>}
      {page === "Buddies" && <div className="buddy-grid"><BuddyCard image={photos.jamie} interests={["Badminton", "Coffee"]} name="Jamie" note="You both enjoy badminton" onAdd={() => setRequests((current) => [...current, "Jamie"])} requested={requests.includes("Jamie")} /><BuddyCard image={photos.michelle} interests={["Jogging", "Photography"]} name="Michelle" note="2 shared interests" onAdd={() => setRequests((current) => [...current, "Michelle"])} requested={requests.includes("Michelle")} /></div>}
      {page === "Activities" && <button className="upcoming-card activity-page-card" onClick={() => onOpen(events[0])} type="button"><img alt="" src={photos.badminton} /><span className="upcoming-info"><small>CONFIRMED · IN 3 DAYS</small><strong>Weekend Badminton Meetup</strong><span><Icon name="clock" size={14} />Sat, 24 Oct · 8:00 AM</span><span><Icon name="pin" size={14} />Community Sports Hall</span></span></button>}
      {page === "Profile" && <div className="profile-card"><img alt="Alex's profile" src={photos.alex} /><h2>Alex Tan</h2><p>{editing ? "Profile editing is ready for this prototype." : "Building a friendlier neighbourhood, one activity at a time."}</p><div><span><strong>3</strong>Activities</span><span><strong>8</strong>Buddies</span><span><strong>2</strong>Interests</span></div><button onClick={() => setEditing(!editing)} type="button">{editing ? "Done editing" : "Edit profile"}</button></div>}
      <p className="prototype-note">Sample content for prototype demonstration only</p>
    </div>
  );
}

const navItems: { label: string; icon: IconName }[] = [
  { label: "Home", icon: "home" },
  { label: "Explore", icon: "compass" },
  { label: "Buddies", icon: "users" },
  { label: "Activities", icon: "calendar" },
  { label: "Profile", icon: "user" },
];

export default function App() {
  const [page, setPage] = useState("Home");
  const [notifications, setNotifications] = useState(false);
  const [selected, setSelected] = useState<EventData | null>(null);
  const [joined, setJoined] = useState(false);

  function navigate(nextPage: string) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app-shell">
      <main>
        <BrandHeader onNotifications={() => setNotifications(true)} />
        {page === "Home" ? <HomePage setPage={navigate} /> : <ListingPage onOpen={setSelected} page={page} />}
      </main>
      <nav aria-label="Primary navigation" className="bottom-nav">
        {navItems.map((item) => (
          <button aria-current={page === item.label ? "page" : undefined} className={page === item.label ? "active" : ""} key={item.label} onClick={() => navigate(item.label)} type="button">
            <Icon filled={page === item.label && item.icon === "home"} name={item.icon} size={21} /><span>{item.label}</span>
          </button>
        ))}
      </nav>
      {notifications && <Notifications onClose={() => setNotifications(false)} />}
      {selected && <EventModal event={selected} joined={joined} joining={false} onClose={() => setSelected(null)} onJoin={() => setJoined(true)} />}
    </div>
  );
}
