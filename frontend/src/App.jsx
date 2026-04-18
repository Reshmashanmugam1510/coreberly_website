import { useEffect, useMemo, useState } from "react";
import { api } from "./api";

const DEFAULT_LIFE_CONTENT = {
  title: "Inside Our World",
  description: "A glimpse into our culture, innovation, and collaboration where ideas turn into impactful digital products.",
  highlight1: "Fast-paced Learning Environment",
  highlight2: "Collaborative Team Culture",
  highlight3: "Innovation & Creativity",
  stat1Value: "50+",
  stat1Label: "Projects Completed",
  stat2Value: "30+",
  stat2Label: "Interns Trained",
  stat3Value: "10+",
  stat3Label: "Technologies Used",
  image:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80"
};

const defaultData = {
  team: [],
  partners: [],
  gallery: [],
  life: DEFAULT_LIFE_CONTENT,
  process: [],
  internship: [],
  hero: {
    tagline: "",
    projects: "",
    satisfaction: "",
    engineers: "",
    countries: "",
    tquote: "",
    tname: "",
    trole: ""
  },
  contact: { email: "", linkedin: "#", instagram: "#", twitter: "#" }
};

const galleryIcons = ["🧑‍💻", "🎨", "🚀", "💡", "🤝", "📸"];

const SERVICE_CARDS = [
  {
    num: "01",
    cls: "bento-card accent",
    icon: "🖥️",
    title: "Web Development",
    body:
      "Scalable, performant web applications built with React, Next.js, Node.js and modern full-stack architectures tailored to your business goals. From MVPs to enterprise platforms."
  },
  {
    num: "02",
    cls: "bento-card accent",
    icon: "📱",
    title: "Mobile App Development",
    body: "Cross-platform and native iOS/Android apps delivering seamless user experiences."
  },
  {
    num: "03",
    cls: "bento-card accent",
    icon: "☁️",
    title: "Cloud & DevOps",
    body: "AWS, Azure & GCP infrastructure, CI/CD pipelines, and cost-optimised cloud migrations."
  },
  {
    num: "04",
    cls: "bento-card accent",
    icon: "🤖",
    title: "AI & Machine Learning",
    body:
      "LLM integrations, computer vision, and intelligent automation that transforms raw data into real business value."
  },
  {
    num: "05",
    cls: "bento-card accent",
    icon: "🎨",
    title: "UI/UX Design",
    body: "Pixel-perfect design systems that make products effortless."
  },
  {
    num: "06",
    cls: "bento-card accent",
    icon: "🔒",
    title: "Security & QA",
    body: "Audits, pen-testing, compliance."
  }
];

const PROCESS_STEPS = [
  {
    phase: "01",
    icon: "🔍",
    title: "Discovery & Strategy",
    body:
      "We deep-dive into your business objectives, technical requirements, and user needs to craft a bulletproof roadmap."
  },
  {
    phase: "02",
    icon: "🎨",
    title: "Design & Prototype",
    body:
      "Interactive wireframes and high-fidelity designs aligned with your brand identity. You see and approve the product experience before development begins — ensuring zero surprises at launch."
  },
  {
    phase: "03",
    icon: "⚙️",
    title: "Agile Development",
    body:
      "Iterative sprints with regular demos, daily standups, and full transparency via your preferred project management tools. You're never left wondering — you're always in the loop."
  },
  {
    phase: "04",
    icon: "🚀",
    title: "Launch & Grow",
    body:
      "Rigorous QA, smooth deployment, and ongoing post-launch support. We don't disappear after go-live — we stay as your long-term technology partner."
  }
];

const WHY_ITEMS = [
  { icon: "⚡", title: "Speed Without Compromise", text: "Our agile teams move fast without cutting corners. Average project kickoff within 48 hours." },
  { icon: "🔍", title: "Radical Transparency", text: "Real-time dashboards, weekly reports, and zero hidden costs. You always know where things stand." },
  { icon: "🌍", title: "Global Standards, Local Rates", text: "World-class engineering quality at India-competitive pricing — the best ROI in the market." },
  { icon: "🛡️", title: "Security & IP Protection", text: "NDAs, secure development practices, and full IP transfer — your code and ideas are always yours." }
];

const INDUSTRY_TAGS = [
  "🏦 FinTech & Banking",
  "🏥 HealthTech",
  "🛒 E-Commerce & Retail",
  "🎓 EdTech",
  "🏭 Manufacturing & IIoT",
  "🚚 Logistics & Supply Chain",
  "🏗️ PropTech & Real Estate",
  "🎮 Gaming & Media",
  "🌿 AgriTech",
  "✈️ Travel & Hospitality",
  "⚡ EnergyTech",
  "🔐 Cybersecurity"
];

const DEFAULT_INTERNSHIP_BLOCKS = [
  {
    title: "Full-Stack Web Development",
    description: "Work on React, Node.js, and modern web applications. Learn best practices in frontend and backend development.",
    duration: "3-6 months",
    mode: "In-office & Remote",
    support: "Mentorship"
  },
  {
    title: "Mobile App Development",
    description: "Develop iOS/Android applications with experienced mobile engineers. Build real apps used by thousands.",
    duration: "3-6 months",
    mode: "In-office & Remote",
    support: "Mentorship"
  },
  {
    title: "UI/UX Design",
    description: "Design beautiful, user-centric interfaces. Work with Figma, user research, and design systems.",
    duration: "3-6 months",
    mode: "In-office & Remote",
    support: "Mentorship"
  }
];

function Logo() {
  return (
    <img src="/coreberly.png" alt="Coreberly" className="company-logo" />
  );
}

const initials = (name) =>
  (name || "")
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function teamBadge(m) {
  return m.badge || m.role || "";
}

function teamTitle(m) {
  return m.title || "";
}

function teamSkills(m) {
  const rawSkills = m.skills || m.skill || "";
  if (Array.isArray(rawSkills)) return rawSkills.filter(Boolean);
  return String(rawSkills)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function teamExperience(m) {
  return m.experience || m.experienceYears || m.years || "";
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 17.25V20h2.75L17.8 8.95l-2.75-2.75L4 17.25Z" fill="currentColor" />
      <path d="M15.1 4.9l2.75 2.75 1.4-1.4a1 1 0 0 0 0-1.41l-.94-.94a1 1 0 0 0-1.41 0l-1.8 1Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 3.75h6a1.5 1.5 0 0 1 1.5 1.5v1.5H19v2h-1.15l-.66 9.15A2.25 2.25 0 0 1 14.94 20H9.06a2.25 2.25 0 0 1-2.25-2.1L6.15 8.75H5v-2h2.5v-1.5A1.5 1.5 0 0 1 9 3.75Zm1 3h4v-1h-4v1Zm-1.88 2 .58 8.04c.02.32.29.56.61.56h5.38c.32 0 .59-.24.61-.56L15.88 8.75H8.12Z" fill="currentColor" />
    </svg>
  );
}

function SocialIcon({ type }) {
  if (type === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 8l7 5 7-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "twitter") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M15.5 8.5h1.9V5.8h-2.2c-2.6 0-4.1 1.6-4.1 4.3v1.9H8.9v2.7h2.2V19h2.8v-4.3H17l.4-2.7h-3v-1.7c0-.9.4-1.8 1.1-1.8Z" fill="currentColor" />
      </svg>
    );
  }

  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (type === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6.5 9.5V18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M6.5 6.8v.2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M10 18v-4.8c0-1.8 1-3.1 2.7-3.1 1.7 0 2.6 1.2 2.6 3.1V18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.5 18V9.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 6.5h16L12 13l-8-6.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 6.5V17h16V6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function SocialLink({ href, label, type }) {
  const safeHref = href && href !== "#" ? href : undefined;

  return (
    <a
      href={safeHref}
      target={safeHref && type !== "email" ? "_blank" : undefined}
      rel={safeHref && type !== "email" ? "noreferrer" : undefined}
      className="social-btn"
      aria-label={label}
      title={label}
      onClick={(e) => {
        if (!safeHref) e.preventDefault();
      }}
    >
      <SocialIcon type={type} />
      <span className="sr-only">{label}</span>
    </a>
  );
}

export default function App() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  const [lockPassword, setLockPassword] = useState("");
  const [showLockPassword, setShowLockPassword] = useState(false);
  const [lockErr, setLockErr] = useState("");
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || "");
  const [tab, setTab] = useState("team");
  const [clicks, setClicks] = useState(0);
  const [newMember, setNewMember] = useState({
    name: "",
    badge: "",
    title: "",
    bio: "",
    skills: "",
    experience: "",
    photo: "",
    linkedin: ""
  });
  const [editingMember, setEditingMember] = useState(null);
  const [editedMember, setEditedMember] = useState({
    name: "",
    badge: "",
    title: "",
    bio: "",
    skills: "",
    experience: "",
    photo: "",
    linkedin: ""
  });
  const [newPartner, setNewPartner] = useState({ name: "", type: "", icon: "", badge: "", photo: "" });
  const [editingPartner, setEditingPartner] = useState(null);
  const [editedPartner, setEditedPartner] = useState({ name: "", type: "", icon: "", badge: "", photo: "" });
  const [partnerPhotoPreview, setPartnerPhotoPreview] = useState("");
  const [newGallery, setNewGallery] = useState({ url: "", caption: "" });
  const [editingProcess, setEditingProcess] = useState(null);
  const [editedProcess, setEditedProcess] = useState({ phase: "", icon: "", title: "", body: "" });
  const [newProcess, setNewProcess] = useState({ phase: "", icon: "", title: "", body: "" });
  const [editingInternship, setEditingInternship] = useState(null);
  const [editedInternship, setEditedInternship] = useState({ title: "", description: "", duration: "", mode: "", support: "" });
  const [newInternship, setNewInternship] = useState({ title: "", description: "", duration: "", mode: "", support: "" });
  const [internshipStartIndex, setInternshipStartIndex] = useState(0);
  const [internshipVisibleCount, setInternshipVisibleCount] = useState(3);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [lifeImagePreview, setLifeImagePreview] = useState("");
  const [memberPhotoPreview, setMemberPhotoPreview] = useState("");
  const [galleryPhotoPreview, setGalleryPhotoPreview] = useState("");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    projectType: "",
    message: ""
  });

  const hero = useMemo(() => data.hero || defaultData.hero, [data.hero]);
  const contact = useMemo(() => data.contact || defaultData.contact, [data.contact]);
  const life = useMemo(() => ({ ...DEFAULT_LIFE_CONTENT, ...(data.life || {}) }), [data.life]);
  const lifeHighlights = useMemo(
    () => [life.highlight1, life.highlight2, life.highlight3].filter(Boolean),
    [life.highlight1, life.highlight2, life.highlight3]
  );
  const lifeStats = useMemo(
    () => [
      { value: life.stat1Value, label: life.stat1Label },
      { value: life.stat2Value, label: life.stat2Label },
      { value: life.stat3Value, label: life.stat3Label }
    ].filter((item) => item.value || item.label),
    [life.stat1Label, life.stat1Value, life.stat2Label, life.stat2Value, life.stat3Label, life.stat3Value]
  );
  const internshipBlocks = useMemo(
    () => (Array.isArray(data.internship) && data.internship.length > 0 ? data.internship : DEFAULT_INTERNSHIP_BLOCKS),
    [data.internship]
  );
  const processSteps = useMemo(
    () => (Array.isArray(data.process) && data.process.length > 0 ? data.process : PROCESS_STEPS),
    [data.process]
  );

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) {
        setInternshipVisibleCount(1);
      } else if (window.innerWidth < 1200) {
        setInternshipVisibleCount(2);
      } else {
        setInternshipVisibleCount(3);
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const maxStart = Math.max(0, internshipBlocks.length - internshipVisibleCount);
    setInternshipStartIndex((prev) => Math.min(prev, maxStart));
  }, [internshipBlocks.length, internshipVisibleCount]);

  const canSlideInternship = internshipBlocks.length > internshipVisibleCount;
  const maxInternshipStart = Math.max(0, internshipBlocks.length - internshipVisibleCount);
  const visibleInternshipBlocks = canSlideInternship
    ? internshipBlocks.slice(internshipStartIndex, internshipStartIndex + internshipVisibleCount)
    : internshipBlocks;

  const goPrevInternship = () => {
    setInternshipStartIndex((prev) => Math.max(0, prev - 1));
  };

  const goNextInternship = () => {
    setInternshipStartIndex((prev) => Math.min(maxInternshipStart, prev + 1));
  };

  useEffect(() => {
    api
      .getSiteData()
      .then((d) => setData({ ...defaultData, ...d }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data, loading, internshipStartIndex, internshipVisibleCount]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const handleFileUpload = (file, callback) => {
    if (!file) return;
    
    // Check file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      showToast("Only PNG and JPEG images allowed");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
    };
    reader.onerror = () => {
      showToast("Failed to read file");
    };
    reader.readAsDataURL(file);
  };

  const resetFileInput = (inputId) => {
    const input = document.getElementById(inputId);
    if (input) input.value = "";
  };

  const saveData = async (next) => {
    try {
      if (!adminToken) throw new Error("Please unlock admin first");
      localStorage.setItem("token", adminToken);
      await api.saveSiteData(next);
      setData(next);
       // Refetch to confirm persistence
       const confirmation = await api.getSiteData();
       setData({ ...defaultData, ...confirmation });
       showToast("Saved successfully");
    } catch (e) {
       showToast("Error: " + e.message);
    }
  };

  const validateHeroData = () => {
    if (!hero.tagline?.trim()) return "Tagline is required";
    if (!hero.projects?.trim()) return "Projects stat is required";
    if (!hero.satisfaction?.trim()) return "Satisfaction stat is required";
    if (!hero.engineers?.trim()) return "Engineers stat is required";
    if (!hero.countries?.trim()) return "Countries stat is required";
    if (!hero.tquote?.trim()) return "Testimonial quote is required";
    if (!hero.tname?.trim()) return "Testimonial name is required";
    if (!hero.trole?.trim()) return "Testimonial role is required";
    return "";
  };

  const validateContactData = () => {
    if (!contact.email?.trim()) return "Contact email is required";
    if (!/^\S+@\S+\.\S+$/.test(contact.email.trim())) return "Enter a valid contact email";
    return "";
  };

  const validateLifeData = () => {
    if (!life.title?.trim()) return "Life section title is required";
    if (!life.description?.trim()) return "Life section description is required";
    if (!life.highlight1?.trim() || !life.highlight2?.trim() || !life.highlight3?.trim()) {
      return "All three life highlights are required";
    }
    if (!life.stat1Value?.trim() || !life.stat1Label?.trim()) return "Stat 1 value and label are required";
    if (!life.stat2Value?.trim() || !life.stat2Label?.trim()) return "Stat 2 value and label are required";
    if (!life.stat3Value?.trim() || !life.stat3Label?.trim()) return "Stat 3 value and label are required";
    if (!life.image?.trim()) return "Life section image is required";
    return "";
  };

  const unlock = async () => {
    try {
      const res = await api.adminUnlock(lockPassword);
      setAdminToken(res.token);
      localStorage.setItem("adminToken", res.token);
      localStorage.setItem("token", res.token);
      setLockOpen(false);
      setAdminOpen(true);
      setLockPassword("");
      setLockErr("");
    } catch (e) {
      setLockErr(e.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <nav>
        <a href="#" className="nav-brand" aria-label="Coreberly home">
          <Logo />
        </a>
        <ul className="nav-links">
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#why">Why Coreberly</a>
          </li>
          <li>
            <a href="#process">How We Work</a>
          </li>
          <li>
            <a href="#partners">Collaborations</a>
          </li>
          <li>
            <a href="#team">Team</a>
          </li>
          <li>
            <a href="#internship">Internship</a>
          </li>
          <li>
            <button type="button" className="nav-cta" onClick={() => setContactModalOpen(true)}>
              Get Started
            </button>
          </li>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="hero-badge">
            <span className="badge-dot" />
            India&apos;s Emerging Tech Partner
          </div>
          <h1>
            We Build <em>Digital</em>
            <br />
            Products That Scale
          </h1>
          <p className="hero-tagline">{hero.tagline}</p>
          <div className="hero-actions">
            <button type="button" className="btn-primary" onClick={() => setContactModalOpen(true)}>
              Start a Project →
            </button>
            <a href="#services" className="btn-secondary">
              Explore Services
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <span className="pill pill-1">⚡ Live Dashboard</span>
            <div className="card-top">
              <span className="cd cd-r" />
              <span className="cd cd-y" />
              <span className="cd cd-g" />
              &nbsp; Coreberly Analytics
            </div>
            <div className="metric-grid">
              <div className="metric">
                <div className="metric-val">{hero.projects}</div>
                <div className="metric-label">Projects Delivered</div>
              </div>
              <div className="metric">
                <div className="metric-val">{hero.satisfaction}</div>
                <div className="metric-label">Client Satisfaction</div>
              </div>
              <div className="metric">
                <div className="metric-val">{hero.engineers}</div>
                <div className="metric-label">Expert Engineers</div>
              </div>
              <div className="metric">
                <div className="metric-val">{hero.countries}</div>
                <div className="metric-label">Countries Served</div>
              </div>
            </div>
            <span className="pill pill-2">🇮🇳 Based in India</span>
          </div>
        </div>
      </section>

      <section id="services" className="section-dark">
        <div className="services-header">
          <div>
            <div className="sec-label">What We Do</div>
            <h2 className="sec-title light">
              End-to-End Digital
              <br />
              Solutions
            </h2>
          </div>
          <p className="sec-sub light">
            From ideation to launch and beyond — Coreberly covers every layer of the technology stack.
          </p>
        </div>
        <div className="bento">
          {SERVICE_CARDS.map((s) => (
            <div key={s.num} className={`${s.cls} fade-up`}>
              {s.tag ? <div className="bento-tag">{s.tag}</div> : null}
              <div className="bento-icon">{s.icon}</div>
              <div className="bento-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="why" className="section-why">
        <div className="sec-label">Why Coreberly</div>
        <h2 className="sec-title light">
          Built Different,
          <br />
          Delivered Better
        </h2>
        <p className="sec-sub light">
          We&apos;re not just an agency — we become a seamless extension of your team, invested in your outcomes.
        </p>
        <div className="why-grid">
          <div className="why-features">
            {WHY_ITEMS.map((w) => (
              <div className="why-item fade-up" key={w.title}>
                <div className="why-icon">{w.icon}</div>
                <div>
                  <h4>{w.title}</h4>
                  <p>{w.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="why-card fade-up">
            <div className="stars">★ ★ ★ ★ ★</div>
            <p className="t-quote">{hero.tquote}</p>
            <div className="t-author">
              <div className="avatar">{initials(hero.tname)}</div>
              <div>
                <div className="author-name">{hero.tname}</div>
                <div className="author-role">{hero.trole}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="process">
        <div className="sec-label">How We Work</div>
        <h2 className="sec-title">Our Proven Process</h2>
        <p className="sec-sub">
          A structured, transparent approach that keeps every project on time, on budget, and above expectations.
        </p>
        <div className="process-timeline">
          {processSteps.map((step, i) => {
            const card = (
              <div className="process-card fade-up">
                <span className="phase-badge">Phase {step.phase}</span>
                <div className="process-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            );

            const rail = (
              <div className="process-dot-wrap fade-up">
                <div className="process-dot">{step.phase}</div>
              </div>
            );

            return (
              <div key={`${step.phase}-${i}`} className="process-row">
                {i % 2 === 0 ? (
                  <>
                    <div className="process-card-col">{card}</div>
                    {rail}
                    <div className="process-card-col" />
                  </>
                ) : (
                  <>
                    <div className="process-card-col" />
                    {rail}
                    <div className="process-card-col">{card}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section id="partners" className="section-dark">
        <div className="partners-intro">
          <div className="sec-label">Collaborations</div>
          <h2 className="sec-title light">Our Tie-Up Partners</h2>
          <p className="sec-sub light">Strategic alliances that amplify what we can build and deliver for you.</p>
        </div>
        <div className="partners-grid">
           {(data.partners || []).map((p, i) => (
            <div className="partner-card fade-up" key={`${p.name}-${i}`}>
              <div className="partner-logo">
                {p.photo ? <img src={p.photo} alt={p.name} /> : <span>{p.icon || "🏢"}</span>}
              </div>
              <div className="partner-info">
                <div className="partner-name">{p.name}</div>
                <div className="partner-type">{p.type}</div>
                {p.badge ? <span className="partner-badge">{p.badge}</span> : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="team">
        <div className="sec-label">The People</div>
        <h2 className="sec-title">Meet Our Team</h2>
        <p className="sec-sub">
          Passionate engineers, designers, and strategists united by a single mission: building products that matter.
        </p>
        <div className="team-grid">
           {(data.team || []).map((m, i) => (
            <div className="team-card fade-up" key={`${m.name}-${i}`}>
              <div className={`team-photo ${i < 2 ? "team-photo--top-focus" : ""}`}>
                {m.photo ? (
                  <img src={m.photo} alt={m.name} />
                ) : (
                  <div className="team-photo-placeholder">
                    <div className="team-initials-big">{initials(m.name)}</div>
                  </div>
                )}
                {teamBadge(m) ? <div className="team-role-badge">{teamBadge(m)}</div> : null}
              </div>
              <div className="team-info">
                <div className="team-name">{m.name}</div>
                {teamTitle(m) ? <div className="team-title-line">{teamTitle(m)}</div> : null}
                {m.bio ? <div className="team-bio">{m.bio}</div> : null}
                {teamSkills(m).length > 0 ? (
                  <div className="team-skill-list">
                    {teamSkills(m).map((skill) => (
                      <span className="team-skill-chip" key={`${m.name}-${skill}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : null}
                {teamExperience(m) ? <div className="team-experience">EXP: {teamExperience(m)}</div> : null}
                {m.linkedin ? (
                  <div className="team-footer">
                    <a href={m.linkedin} target="_blank" rel="noreferrer" className="team-social-link">
                      in
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery">
        <div className="sec-label">Life at Coreberly</div>
        <div className="life-showcase">
          <div className="life-content">
            <h2 className="sec-title">{life.title}</h2>
            <p className="sec-sub">{life.description}</p>
            <div className="life-highlights">
              {lifeHighlights.map((item) => (
                <div className="life-highlight" key={item}>
                  <span className="life-highlight-icon">🤝</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="life-image-wrap">
            {life.image ? (
              <img src={life.image} alt="Life at Coreberly" className="life-image" />
            ) : (
              <div className="life-image-placeholder">Upload image from admin</div>
            )}
          </div>
        </div>
        <div className="life-stats">
          {lifeStats.map((item, idx) => (
            <div className="life-stat" key={`${item.label}-${idx}`}>
              <div className="life-stat-value">{item.value}</div>
              <div className="life-stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="industries">
        <div className="sec-label">Sectors We Serve</div>
        <h2 className="sec-title">
          Domain Expertise
          <br />
          Across Industries
        </h2>
        <p className="sec-sub">Deep vertical knowledge that lets us hit the ground running — no learning curve on your dime.</p>
        <div className="industry-marquee">
          <div className="industry-track">
            {[...INDUSTRY_TAGS, ...INDUSTRY_TAGS].map((t, i) => (
              <span className="industry-tag" key={`${t}-${i}`} aria-hidden={i >= INDUSTRY_TAGS.length}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="internship" className="section-dark">
        <div className="sec-label">Build Your Future</div>
        <h2 className="sec-title light">
          Internship Program
          <br />
          at Coreberly
        </h2>
        <p className="sec-sub light">
          Join our team and gain real-world experience building cutting-edge digital products alongside industry experts.
        </p>
        {canSlideInternship ? (
          <div className="internship-nav" aria-label="Internship cards navigation">
            <button
              type="button"
              className="internship-nav-btn"
              onClick={goPrevInternship}
              disabled={internshipStartIndex === 0}
              aria-label="Show previous internship blocks"
            >
              <span aria-hidden="true">&#8249;</span>
            </button>
            <div className="internship-nav-meta">
              {internshipStartIndex + 1}-{Math.min(internshipStartIndex + internshipVisibleCount, internshipBlocks.length)} of {internshipBlocks.length}
            </div>
            <button
              type="button"
              className="internship-nav-btn"
              onClick={goNextInternship}
              disabled={internshipStartIndex >= maxInternshipStart}
              aria-label="Show next internship blocks"
            >
              <span aria-hidden="true">&#8250;</span>
            </button>
          </div>
        ) : null}
        <div className="internship-grid">
          {visibleInternshipBlocks.map((item, i) => (
            <div className="internship-card fade-up" key={`${item.title}-${i}`}>
              <div className="internship-number">{String(internshipStartIndex + i + 1).padStart(2, "0")}</div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <div className="internship-perks">
                <span className="perk">🎯 {item.duration}</span>
                <span className="perk">🏙️ {item.mode}</span>
                <span className="perk">💡 {item.support}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="internship-cta">
          <p>Ready to kickstart your tech career?</p>
          <button type="button" className="btn-primary" onClick={() => setContactModalOpen(true)}>Apply Now</button>
        </div>
      </section>

      <section id="cta" className="section-cta">
        <div className="sec-label">Let&apos;s Build Together</div>
        <h2 className="sec-title light">
          Ready to Launch Your
          <br />
          Next Big Idea?
        </h2>
        <p className="sec-sub light">
          Tell us about your project and get a free consultation and technical estimate within 24 hours.
        </p>
        <button type="button" className="btn-white" onClick={() => setContactModalOpen(true)}>
          Book a Free Consultation →
        </button>
      </section>

      <footer>
        <div className="footer-grid">
          <div>
            <Logo />
            <p className="footer-about">
              Powering digital transformation for startups and enterprises. Headquartered in India, serving clients worldwide.
            </p>
          </div>
          <div className="footer-col">
            <h5>Services</h5>
            <ul>
              <li>
                <a href="#services">Web Development</a>
              </li>
              <li>
                <a href="#services">Mobile Apps</a>
              </li>
              <li>
                <a href="#services">Cloud &amp; DevOps</a>
              </li>
              <li>
                <a href="#services">AI &amp; ML</a>
              </li>
              <li>
                <a href="#services">UI/UX Design</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#team">Our Team</a>
              </li>
              <li>
                <a href="#gallery">Gallery</a>
              </li>
              <li>
                <a href="#partners">Partners</a>
              </li>
              <li>
                <a href="#cta">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <a href="https://coreberly.in" target="_blank" rel="noreferrer">
                  coreberly.in
                </a>
              </li>
              <li>
                <a href={contact.linkedin !== "#" ? contact.linkedin : "#"} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={contact.twitter !== "#" ? contact.twitter : "#"} target="_blank" rel="noreferrer">
                  Twitter / X
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Coreberly. All rights reserved.</span>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </footer>

      {contactModalOpen && (
        <div id="contact-modal" className="contact-modal-overlay">
          <div className="contact-modal">
            <button type="button" className="modal-close" onClick={() => setContactModalOpen(false)}>✕</button>
            
            <div className="contact-modal-content">
              <div className="contact-form-section">
                <h2>Send Us a Message</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  showToast("Message sent! We'll be in touch soon.");
                  setContactForm({ name: "", email: "", projectType: "", message: "" });
                  setContactModalOpen(false);
                }}>
                  <div className="form-group">
                    <label>YOUR NAME</label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>EMAIL ADDRESS</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>PROJECT TYPE</label>
                    <input
                      type="text"
                      placeholder="e.g., Smart Contract, dApp, DeFi Solution"
                      value={contactForm.projectType}
                      onChange={(e) => setContactForm({ ...contactForm, projectType: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>YOUR MESSAGE</label>
                    <textarea
                      placeholder="Tell us about your project, goals, and timeline..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="form-submit">Send Message</button>
                </form>
              </div>

              <div className="contact-info-section">
                <h2>Contact Information</h2>
                <p className="contact-intro">Have a project in mind or want to learn more about our solutions? Reach out to us through any of the channels below.</p>
                
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div>
                    <div className="contact-label">EMAIL</div>
                    <a href={`mailto:${contact.email}`} className="contact-value">{contact.email}</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <div className="contact-label">LOCATION</div>
                    <div className="contact-value">Chennai, India</div>
                  </div>
                </div>

                <div className="contact-socials">
                  <h3>Connect With Us</h3>
                  <div className="social-links">
                    <SocialLink href={`mailto:${contact.email}`} label="Email" type="email" />
                    <SocialLink href={contact.linkedin} label="LinkedIn" type="linkedin" />
                    <SocialLink href={contact.instagram} label="Instagram" type="instagram" />
                    <SocialLink href={contact.twitter} label="Twitter / X" type="twitter" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        id="admin-trigger"
        aria-label="Admin"
        onClick={() => {
          const next = clicks + 1;
          setClicks(next);
          setTimeout(() => setClicks(0), 2000);
          if (next >= 5) {
            setClicks(0);
            setLockOpen(true);
          }
        }}
      />

      {lockOpen && (
        <div id="admin-lock" className="open">
          <div className="lock-box">
            <h3>Admin Access</h3>
            <p className="lock-hint">Enter password to continue</p>
            <div className="lock-pass-wrap">
              <input
                value={lockPassword}
                onChange={(e) => setLockPassword(e.target.value)}
                type={showLockPassword ? "text" : "password"}
                placeholder="Enter password"
                onKeyDown={(e) => e.key === "Enter" && unlock()}
              />
              <button
                type="button"
                className="lock-pass-toggle"
                onClick={() => setShowLockPassword((v) => !v)}
                aria-label={showLockPassword ? "Hide password" : "Show password"}
                title={showLockPassword ? "Hide password" : "Show password"}
              >
                {showLockPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M3 4.4 4.4 3 21 19.6 19.6 21l-3.2-3.2A11.35 11.35 0 0 1 12 18.8C6.75 18.8 2.35 15.67.8 12c.68-1.6 1.83-3.05 3.3-4.24L3 6.6l1.4-1.4 16.6 16.6-1.4 1.4-2.18-2.18M9.04 12l2.96 2.96a3.2 3.2 0 0 1-2.96-2.96m7.88 1.22L14.7 11a3.2 3.2 0 0 0-3.7-3.7L9.2 5.5c.88-.26 1.8-.4 2.8-.4 5.25 0 9.65 3.13 11.2 6.8-.58 1.36-1.46 2.6-2.58 3.62l-1.7-1.7c.61-.55 1.1-1.18 1.47-1.82-.98-2.08-3.08-3.74-5.53-4.45l1.9 1.9a3.2 3.2 0 0 1-.84 3.77" fill="currentColor" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 5.2c5.25 0 9.65 3.13 11.2 6.8-1.55 3.67-5.95 6.8-11.2 6.8S2.35 15.67.8 12C2.35 8.33 6.75 5.2 12 5.2Zm0 2c-3.95 0-7.35 2.23-8.95 4.8 1.6 2.57 5 4.8 8.95 4.8s7.35-2.23 8.95-4.8c-1.6-2.57-5-4.8-8.95-4.8Zm0 1.8a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" fill="currentColor" />
                  </svg>
                )}
              </button>
            </div>
            <div className="lock-err">{lockErr}</div>
            <button className="lock-btn" type="button" onClick={unlock}>
              Unlock Panel
            </button>
            <button className="lock-btn muted-btn" type="button" onClick={() => setLockOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {adminOpen && (
        <div id="admin-panel" className="open">
          <div className="ap-header">
            <h2>Admin Panel</h2>
            <button className="ap-close" type="button" onClick={() => setAdminOpen(false)}>
              ✕
            </button>
          </div>
          <div className="ap-body">
            <div className="ap-tabs">
              {["team", "partners", "gallery", "life", "process", "internship", "hero", "contact"].map((t) => (
                <button key={t} type="button" className={`ap-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                  {t}
                </button>
              ))}
            </div>

            {tab === "team" && (
              <div className="ap-section active">
                 {(data.team || []).map((m, i) => (
                  <div key={`${m.name}-${i}`}>
                    {editingMember === i ? (
                      <div className="ap-edit-form">
                        <input
                          placeholder="Full name (required)"
                          value={editedMember.name}
                          onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })}
                        />
                        <input
                          placeholder="Badge on photo (required, e.g. FOUNDER & CEO)"
                          value={editedMember.badge}
                          onChange={(e) => setEditedMember({ ...editedMember, badge: e.target.value })}
                        />
                        <input
                          placeholder="Title under name (required, e.g. CEO)"
                          value={editedMember.title}
                          onChange={(e) => setEditedMember({ ...editedMember, title: e.target.value })}
                        />
                        <textarea
                          placeholder="Bio (optional)"
                          value={editedMember.bio}
                          onChange={(e) => setEditedMember({ ...editedMember, bio: e.target.value })}
                        />
                        <input
                          placeholder="Skills (comma separated)"
                          value={editedMember.skills || ""}
                          onChange={(e) => setEditedMember({ ...editedMember, skills: e.target.value })}
                        />
                        <input
                          placeholder="Experience (e.g. 4+ Years)"
                          value={editedMember.experience || ""}
                          onChange={(e) => setEditedMember({ ...editedMember, experience: e.target.value })}
                        />
                        <div className="upload-box">
                          <label className="upload-label">
                            Employee Photo (PNG/JPEG)
                            <input
                              id={`edit-member-photo-${i}`}
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={(e) => {
                                handleFileUpload(e.target.files[0], (data) => {
                                  setEditedMember({ ...editedMember, photo: data });
                                });
                                resetFileInput(`edit-member-photo-${i}`);
                              }}
                            />
                          </label>
                          {editedMember.photo && (
                            <div className="upload-preview">
                              <img src={editedMember.photo} alt="preview" />
                            </div>
                          )}
                        </div>
                        <input
                          placeholder="LinkedIn URL (optional)"
                          value={editedMember.linkedin}
                          onChange={(e) => setEditedMember({ ...editedMember, linkedin: e.target.value })}
                        />
                        <div className="ap-form-buttons">
                          <button
                            type="button"
                            className="ap-btn"
                            onClick={() => {
                              if (!editedMember.name || !editedMember.badge || !editedMember.title) return showToast("Name, badge and title are required");
                              const updatedTeam = [...(data.team || [])];
                              updatedTeam[i] = editedMember;
                              saveData({ ...data, team: updatedTeam });
                              setEditingMember(null);
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="ap-btn ap-cancel-btn"
                            onClick={() => setEditingMember(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="ap-member-item">
                        <span>{m.name}</span>
                        <div className="ap-actions">
                          <button
                            type="button"
                            className="ap-edit-btn"
                            onClick={() => {
                              setEditedMember({ ...m });
                              setEditingMember(i);
                            }}
                            title="Edit member"
                            aria-label="Edit member"
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            className="ap-del-btn"
                            onClick={() => saveData({ ...data, team: (data.team || []).filter((_, idx) => idx !== i) })}
                            title="Delete member"
                            aria-label="Delete member"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <input placeholder="Full name (required)" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
                <input
                  placeholder="Badge on photo (required, e.g. FOUNDER & CEO)"
                  value={newMember.badge}
                  onChange={(e) => setNewMember({ ...newMember, badge: e.target.value })}
                />
                <input placeholder="Title under name (required, e.g. CEO)" value={newMember.title} onChange={(e) => setNewMember({ ...newMember, title: e.target.value })} />
                <textarea placeholder="Bio (optional)" value={newMember.bio} onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })} />
                <input
                  placeholder="Skills (comma separated)"
                  value={newMember.skills}
                  onChange={(e) => setNewMember({ ...newMember, skills: e.target.value })}
                />
                <input
                  placeholder="Experience (e.g. 4+ Years)"
                  value={newMember.experience}
                  onChange={(e) => setNewMember({ ...newMember, experience: e.target.value })}
                />
                <div className="upload-box">
                  <label className="upload-label">
                    Employee Photo (PNG/JPEG)
                    <input
                      id="add-member-photo"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => {
                        handleFileUpload(e.target.files[0], (data) => {
                          setMemberPhotoPreview(data);
                          setNewMember({ ...newMember, photo: data });
                        });
                        resetFileInput("add-member-photo");
                      }}
                    />
                  </label>
                  {memberPhotoPreview && (
                    <div className="upload-preview">
                      <img src={memberPhotoPreview} alt="preview" />
                    </div>
                  )}
                </div>
                <input placeholder="LinkedIn URL (optional)" value={newMember.linkedin} onChange={(e) => setNewMember({ ...newMember, linkedin: e.target.value })} />
                <button
                  type="button"
                  className="ap-btn"
                  onClick={() => {
                    if (!newMember.name || !newMember.badge || !newMember.title) return showToast("Name, badge and title are required");
                     saveData({ ...data, team: [...(data.team || []), { ...newMember }] });
                    setNewMember({ name: "", badge: "", title: "", bio: "", skills: "", experience: "", photo: "", linkedin: "" });
                  }}
                >
                  Add Member
                </button>
              </div>
            )}

            {tab === "partners" && (
              <div className="ap-section active">
                {(data.partners || []).map((p, i) => (
                  <div key={`${p.name}-${i}`}>
                    {editingPartner === i ? (
                      <div className="ap-edit-form">
                        <input
                          placeholder="Company name (required)"
                          value={editedPartner.name}
                          onChange={(e) => setEditedPartner({ ...editedPartner, name: e.target.value })}
                        />
                        <input
                          placeholder="Partner type (required, e.g. Cloud Partner)"
                          value={editedPartner.type}
                          onChange={(e) => setEditedPartner({ ...editedPartner, type: e.target.value })}
                        />
                        <input
                          placeholder="Icon / emoji"
                          value={editedPartner.icon}
                          onChange={(e) => setEditedPartner({ ...editedPartner, icon: e.target.value })}
                        />
                        <input
                          placeholder="Badge (optional)"
                          value={editedPartner.badge}
                          onChange={(e) => setEditedPartner({ ...editedPartner, badge: e.target.value })}
                        />
                        <div className="upload-box">
                          <label className="upload-label">
                            Partner Image / Logo
                            <input
                              id={`edit-partner-photo-${i}`}
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={(e) => {
                                handleFileUpload(e.target.files[0], (data) => {
                                  setEditedPartner({ ...editedPartner, photo: data });
                                });
                                resetFileInput(`edit-partner-photo-${i}`);
                              }}
                            />
                          </label>
                          {editedPartner.photo && (
                            <div className="upload-preview">
                              <img src={editedPartner.photo} alt="preview" />
                            </div>
                          )}
                        </div>
                        <div className="ap-form-buttons">
                          <button
                            type="button"
                            className="ap-btn"
                            onClick={() => {
                              if (!editedPartner.name || !editedPartner.type) return showToast("Company name and type are required");
                              const updatedPartners = [...(data.partners || [])];
                              updatedPartners[i] = editedPartner;
                              saveData({ ...data, partners: updatedPartners });
                              setEditingPartner(null);
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="ap-btn ap-cancel-btn"
                            onClick={() => setEditingPartner(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="ap-member-item">
                        <span>{p.name}</span>
                        <div className="ap-actions">
                          <button
                            type="button"
                            className="ap-edit-btn"
                            onClick={() => {
                              setEditedPartner({ ...p });
                              setEditingPartner(i);
                            }}
                            title="Edit partner"
                            aria-label="Edit partner"
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            className="ap-del-btn"
                            onClick={() => saveData({ ...data, partners: (data.partners || []).filter((_, idx) => idx !== i) })}
                            title="Delete partner"
                            aria-label="Delete partner"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <input placeholder="Company name (required)" value={newPartner.name} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })} />
                <input placeholder="Partner type (required, e.g. Cloud Partner)" value={newPartner.type} onChange={(e) => setNewPartner({ ...newPartner, type: e.target.value })} />
                <input placeholder="Icon / emoji" value={newPartner.icon} onChange={(e) => setNewPartner({ ...newPartner, icon: e.target.value })} />
                <input placeholder="Badge (optional)" value={newPartner.badge} onChange={(e) => setNewPartner({ ...newPartner, badge: e.target.value })} />
                <div className="upload-box">
                  <label className="upload-label">
                    Partner Image / Logo
                    <input
                      id="add-partner-photo"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => {
                        handleFileUpload(e.target.files[0], (data) => {
                          setPartnerPhotoPreview(data);
                          setNewPartner({ ...newPartner, photo: data });
                        });
                        resetFileInput("add-partner-photo");
                      }}
                    />
                  </label>
                  {partnerPhotoPreview && (
                    <div className="upload-preview">
                      <img src={partnerPhotoPreview} alt="preview" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="ap-btn"
                  onClick={() => {
                    if (!newPartner.name || !newPartner.type) return showToast("Company name and type are required");
                    saveData({ ...data, partners: [...(data.partners || []), { ...newPartner, icon: newPartner.icon || "🏢" }] });
                    setNewPartner({ name: "", type: "", icon: "", badge: "", photo: "" });
                    setPartnerPhotoPreview("");
                  }}
                >
                  Add Partner
                </button>
              </div>
            )}

            {tab === "gallery" && (
              <div className="ap-section active">
                 {(data.gallery || []).map((g, i) => (
                  <div className="ap-member-item" key={`${g.caption}-${i}`}>
                    <span>{g.caption}</span>
                    <button
                      type="button"
                      className="ap-del-btn"
                       onClick={() => saveData({ ...data, gallery: (data.gallery || []).filter((_, idx) => idx !== i) })}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <input placeholder="Photo caption (required)" value={newGallery.caption} onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })} />
                <div className="upload-box">
                  <label className="upload-label">
                    Gallery Photo (PNG/JPEG)
                    <input
                      id="gallery-photo"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => {
                        handleFileUpload(e.target.files[0], (data) => {
                          setGalleryPhotoPreview(data);
                          setNewGallery({ ...newGallery, url: data });
                        });
                        resetFileInput("gallery-photo");
                      }}
                    />
                  </label>
                  {galleryPhotoPreview && (
                    <div className="upload-preview">
                      <img src={galleryPhotoPreview} alt="preview" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="ap-btn"
                  onClick={() => {
                    if (!newGallery.caption) return showToast("Caption required");
                    if (!newGallery.url) return showToast("Image required");
                     saveData({ ...data, gallery: [...(data.gallery || []), { ...newGallery }] });
                    setNewGallery({ url: "", caption: "" });
                    setGalleryPhotoPreview("");
                  }}
                >
                  Add Photo
                </button>
              </div>
            )}

            {tab === "life" && (
              <div className="ap-section active">
                <input
                  placeholder="Section title (required, e.g. Inside Our World)"
                  value={life.title}
                  onChange={(e) => setData({ ...data, life: { ...life, title: e.target.value } })}
                />
                <textarea
                  placeholder="Section description (required)"
                  value={life.description}
                  onChange={(e) => setData({ ...data, life: { ...life, description: e.target.value } })}
                />
                <input
                  placeholder="Highlight 1 (required)"
                  value={life.highlight1}
                  onChange={(e) => setData({ ...data, life: { ...life, highlight1: e.target.value } })}
                />
                <input
                  placeholder="Highlight 2 (required)"
                  value={life.highlight2}
                  onChange={(e) => setData({ ...data, life: { ...life, highlight2: e.target.value } })}
                />
                <input
                  placeholder="Highlight 3 (required)"
                  value={life.highlight3}
                  onChange={(e) => setData({ ...data, life: { ...life, highlight3: e.target.value } })}
                />

                <input
                  placeholder="Stat 1 value (required, e.g. 50+)"
                  value={life.stat1Value}
                  onChange={(e) => setData({ ...data, life: { ...life, stat1Value: e.target.value } })}
                />
                <input
                  placeholder="Stat 1 label (required, e.g. Projects Completed)"
                  value={life.stat1Label}
                  onChange={(e) => setData({ ...data, life: { ...life, stat1Label: e.target.value } })}
                />
                <input
                  placeholder="Stat 2 value (required, e.g. 30+)"
                  value={life.stat2Value}
                  onChange={(e) => setData({ ...data, life: { ...life, stat2Value: e.target.value } })}
                />
                <input
                  placeholder="Stat 2 label (required, e.g. Interns Trained)"
                  value={life.stat2Label}
                  onChange={(e) => setData({ ...data, life: { ...life, stat2Label: e.target.value } })}
                />
                <input
                  placeholder="Stat 3 value (required, e.g. 10+)"
                  value={life.stat3Value}
                  onChange={(e) => setData({ ...data, life: { ...life, stat3Value: e.target.value } })}
                />
                <input
                  placeholder="Stat 3 label (required, e.g. Technologies Used)"
                  value={life.stat3Label}
                  onChange={(e) => setData({ ...data, life: { ...life, stat3Label: e.target.value } })}
                />

                <div className="upload-box">
                  <label className="upload-label">
                    Life Section Image (PNG/JPEG)
                    <input
                      id="life-image"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => {
                        handleFileUpload(e.target.files[0], (imageData) => {
                          setLifeImagePreview(imageData);
                          setData({ ...data, life: { ...life, image: imageData } });
                        });
                        resetFileInput("life-image");
                      }}
                    />
                  </label>
                  {(lifeImagePreview || life.image) && (
                    <div className="upload-preview">
                      <img src={lifeImagePreview || life.image} alt="preview" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="ap-btn"
                  onClick={() => {
                    const err = validateLifeData();
                    if (err) return showToast(err);
                    saveData(data);
                  }}
                >
                  Save Life Section
                </button>
              </div>
            )}

            {tab === "process" && (
              <div className="ap-section active">
                {processSteps.map((step, i) => (
                  <div key={`${step.phase}-${i}`}>
                    {editingProcess === i ? (
                      <div className="ap-edit-form">
                        <input
                          placeholder="Phase number (required, e.g. 01)"
                          value={editedProcess.phase}
                          onChange={(e) => setEditedProcess({ ...editedProcess, phase: e.target.value })}
                        />
                        <input
                          placeholder="Icon / emoji (required, e.g. 🔍)"
                          value={editedProcess.icon}
                          onChange={(e) => setEditedProcess({ ...editedProcess, icon: e.target.value })}
                        />
                        <input
                          placeholder="Step title (required)"
                          value={editedProcess.title}
                          onChange={(e) => setEditedProcess({ ...editedProcess, title: e.target.value })}
                        />
                        <textarea
                          placeholder="Step description (required)"
                          value={editedProcess.body}
                          onChange={(e) => setEditedProcess({ ...editedProcess, body: e.target.value })}
                        />
                        <div className="ap-form-buttons">
                          <button
                            type="button"
                            className="ap-btn"
                            onClick={() => {
                              if (!editedProcess.phase || !editedProcess.icon || !editedProcess.title || !editedProcess.body) {
                                return showToast("All process fields are required");
                              }
                              const updatedSteps = [...processSteps];
                              updatedSteps[i] = editedProcess;
                              saveData({ ...data, process: updatedSteps });
                              setEditingProcess(null);
                            }}
                          >
                            Save
                          </button>
                          <button type="button" className="ap-btn ap-cancel-btn" onClick={() => setEditingProcess(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="ap-member-item">
                        <span>{`Phase ${step.phase} - ${step.title}`}</span>
                        <div className="ap-actions">
                          <button
                            type="button"
                            className="ap-edit-btn"
                            onClick={() => {
                              setEditedProcess({
                                phase: step.phase || "",
                                icon: step.icon || "",
                                title: step.title || "",
                                body: step.body || ""
                              });
                              setEditingProcess(i);
                            }}
                            title="Edit process step"
                            aria-label="Edit process step"
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            className="ap-del-btn"
                            onClick={() => {
                              const updatedSteps = processSteps.filter((_, idx) => idx !== i);
                              saveData({ ...data, process: updatedSteps });
                            }}
                            title="Delete process step"
                            aria-label="Delete process step"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <input
                  placeholder="Phase number (required, e.g. 05)"
                  value={newProcess.phase}
                  onChange={(e) => setNewProcess({ ...newProcess, phase: e.target.value })}
                />
                <input
                  placeholder="Icon / emoji (required, e.g. 📊)"
                  value={newProcess.icon}
                  onChange={(e) => setNewProcess({ ...newProcess, icon: e.target.value })}
                />
                <input
                  placeholder="Step title (required)"
                  value={newProcess.title}
                  onChange={(e) => setNewProcess({ ...newProcess, title: e.target.value })}
                />
                <textarea
                  placeholder="Step description (required)"
                  value={newProcess.body}
                  onChange={(e) => setNewProcess({ ...newProcess, body: e.target.value })}
                />
                <button
                  type="button"
                  className="ap-btn"
                  onClick={() => {
                    if (!newProcess.phase || !newProcess.icon || !newProcess.title || !newProcess.body) {
                      return showToast("All process fields are required");
                    }
                    saveData({ ...data, process: [...processSteps, { ...newProcess }] });
                    setNewProcess({ phase: "", icon: "", title: "", body: "" });
                  }}
                >
                  Add Process Step
                </button>
              </div>
            )}

            {tab === "internship" && (
              <div className="ap-section active">
                {internshipBlocks.map((item, i) => (
                  <div key={`${item.title}-${i}`}>
                    {editingInternship === i ? (
                      <div className="ap-edit-form">
                        <input
                          placeholder="Internship title (required)"
                          value={editedInternship.title}
                          onChange={(e) => setEditedInternship({ ...editedInternship, title: e.target.value })}
                        />
                        <textarea
                          placeholder="Internship description (required)"
                          value={editedInternship.description}
                          onChange={(e) => setEditedInternship({ ...editedInternship, description: e.target.value })}
                        />
                        <input
                          placeholder="Duration (required, e.g. 3-6 months)"
                          value={editedInternship.duration}
                          onChange={(e) => setEditedInternship({ ...editedInternship, duration: e.target.value })}
                        />
                        <input
                          placeholder="Mode (required, e.g. In-office & Remote)"
                          value={editedInternship.mode}
                          onChange={(e) => setEditedInternship({ ...editedInternship, mode: e.target.value })}
                        />
                        <input
                          placeholder="Support (required, e.g. Mentorship)"
                          value={editedInternship.support}
                          onChange={(e) => setEditedInternship({ ...editedInternship, support: e.target.value })}
                        />
                        <div className="ap-form-buttons">
                          <button
                            type="button"
                            className="ap-btn"
                            onClick={() => {
                              if (!editedInternship.title || !editedInternship.description || !editedInternship.duration || !editedInternship.mode || !editedInternship.support) {
                                return showToast("All internship fields are required");
                              }
                              const updatedInternships = [...internshipBlocks];
                              updatedInternships[i] = editedInternship;
                              saveData({ ...data, internship: updatedInternships });
                              setEditingInternship(null);
                            }}
                          >
                            Save
                          </button>
                          <button type="button" className="ap-btn ap-cancel-btn" onClick={() => setEditingInternship(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="ap-member-item">
                        <span>{item.title}</span>
                        <div className="ap-actions">
                          <button
                            type="button"
                            className="ap-edit-btn"
                            onClick={() => {
                              setEditedInternship({
                                title: item.title || "",
                                description: item.description || "",
                                duration: item.duration || "",
                                mode: item.mode || "",
                                support: item.support || ""
                              });
                              setEditingInternship(i);
                            }}
                            title="Edit internship"
                            aria-label="Edit internship"
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            className="ap-del-btn"
                            onClick={() => {
                              const updatedInternships = internshipBlocks.filter((_, idx) => idx !== i);
                              saveData({ ...data, internship: updatedInternships });
                            }}
                            title="Delete internship"
                            aria-label="Delete internship"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <input
                  placeholder="Internship title (required)"
                  value={newInternship.title}
                  onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })}
                />
                <textarea
                  placeholder="Internship description (required)"
                  value={newInternship.description}
                  onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                />
                <input
                  placeholder="Duration (required, e.g. 3-6 months)"
                  value={newInternship.duration}
                  onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                />
                <input
                  placeholder="Mode (required, e.g. In-office & Remote)"
                  value={newInternship.mode}
                  onChange={(e) => setNewInternship({ ...newInternship, mode: e.target.value })}
                />
                <input
                  placeholder="Support (required, e.g. Mentorship)"
                  value={newInternship.support}
                  onChange={(e) => setNewInternship({ ...newInternship, support: e.target.value })}
                />
                <button
                  type="button"
                  className="ap-btn"
                  onClick={() => {
                    if (!newInternship.title || !newInternship.description || !newInternship.duration || !newInternship.mode || !newInternship.support) {
                      return showToast("All internship fields are required");
                    }
                    saveData({ ...data, internship: [...internshipBlocks, { ...newInternship }] });
                    setNewInternship({ title: "", description: "", duration: "", mode: "", support: "" });
                  }}
                >
                  Add Internship Block
                </button>
              </div>
            )}

            {tab === "hero" && (
              <div className="ap-section active">
                <label className="ap-label">Company Logo</label>
                <div className="upload-box">
                  <label className="upload-label">
                    Upload Logo (PNG/JPEG)
                    <input
                      id="hero-logo"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => {
                        handleFileUpload(e.target.files[0], (data) => {
                          setLogoPreview(data);
                          localStorage.setItem("coreberly-logo", data);
                        });
                        resetFileInput("hero-logo");
                      }}
                    />
                  </label>
                  {logoPreview && (
                    <div className="upload-preview">
                      <img src={logoPreview} alt="logo" />
                    </div>
                  )}
                </div>
                <label className="ap-label">Tagline</label>
                <textarea placeholder="Main hero tagline (required)" value={hero.tagline} onChange={(e) => setData({ ...data, hero: { ...hero, tagline: e.target.value } })} />
                <label className="ap-label">Stats</label>
                <input placeholder="Projects completed (required, e.g. 150+)" value={hero.projects} onChange={(e) => setData({ ...data, hero: { ...hero, projects: e.target.value } })} />
                <input placeholder="Client satisfaction (required, e.g. 98%)" value={hero.satisfaction} onChange={(e) => setData({ ...data, hero: { ...hero, satisfaction: e.target.value } })} />
                <input placeholder="Engineers count (required, e.g. 40+)" value={hero.engineers} onChange={(e) => setData({ ...data, hero: { ...hero, engineers: e.target.value } })} />
                <input placeholder="Countries served (required, e.g. 12+)" value={hero.countries} onChange={(e) => setData({ ...data, hero: { ...hero, countries: e.target.value } })} />
                <label className="ap-label">Testimonial</label>
                <textarea placeholder="Testimonial quote (required)" value={hero.tquote} onChange={(e) => setData({ ...data, hero: { ...hero, tquote: e.target.value } })} />
                <input placeholder="Client name (required)" value={hero.tname} onChange={(e) => setData({ ...data, hero: { ...hero, tname: e.target.value } })} />
                <input placeholder="Client role/company (required)" value={hero.trole} onChange={(e) => setData({ ...data, hero: { ...hero, trole: e.target.value } })} />
                <button
                  type="button"
                  className="ap-btn"
                  onClick={() => {
                    const err = validateHeroData();
                    if (err) return showToast(err);
                    saveData(data);
                  }}
                >
                  Save Hero
                </button>
              </div>
            )}

            {tab === "contact" && (
              <div className="ap-section active">
                <input placeholder="Business email (required)" value={contact.email} onChange={(e) => setData({ ...data, contact: { ...contact, email: e.target.value } })} />
                <input placeholder="LinkedIn URL (optional)" value={contact.linkedin} onChange={(e) => setData({ ...data, contact: { ...contact, linkedin: e.target.value } })} />
                <input placeholder="Instagram URL (optional)" value={contact.instagram} onChange={(e) => setData({ ...data, contact: { ...contact, instagram: e.target.value } })} />
                <input placeholder="Twitter/X URL (optional)" value={contact.twitter} onChange={(e) => setData({ ...data, contact: { ...contact, twitter: e.target.value } })} />
                <button
                  type="button"
                  className="ap-btn"
                  onClick={() => {
                    const err = validateContactData();
                    if (err) return showToast(err);
                    saveData(data);
                  }}
                >
                  Save Contact
                </button>
                <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button
                  type="button"
                  className="ap-btn"
                  onClick={async () => {
                    if (newPassword.length < 6) return showToast("Min 6 chars");
                    if (newPassword !== confirmPassword) return showToast("Passwords do not match");
                    localStorage.setItem("token", adminToken);
                    await api.changeAdminPassword(newPassword);
                    setNewPassword("");
                    setConfirmPassword("");
                    showToast("Password updated");
                  }}
                >
                  Update Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`ap-toast ${toast ? "show" : ""}`}>{toast}</div>
    </>
  );
}
