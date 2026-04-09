import { useEffect, useMemo, useState } from "react";
import { api } from "./api";

const defaultData = {
  team: [],
  partners: [],
  gallery: [],
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
  const [lockErr, setLockErr] = useState("");
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || "");
  const [tab, setTab] = useState("team");
  const [clicks, setClicks] = useState(0);
  const [newMember, setNewMember] = useState({
    name: "",
    badge: "",
    title: "",
    bio: "",
    photo: "",
    linkedin: ""
  });
  const [editingMember, setEditingMember] = useState(null);
  const [editedMember, setEditedMember] = useState({
    name: "",
    badge: "",
    title: "",
    bio: "",
    photo: "",
    linkedin: ""
  });
  const [newPartner, setNewPartner] = useState({ name: "", type: "", icon: "", badge: "" });
  const [newGallery, setNewGallery] = useState({ url: "", caption: "" });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
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
  }, [data, loading]);

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
    reader.readAsDataURL(file);
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
          {PROCESS_STEPS.map((step, i) => {
            const card = (
              <div className="process-card fade-up">
                <span className="phase-badge">Phase {step.phase}</span>
                <div className="process-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            );
            const rail = (
              <div className="process-rail">
                <div className="process-line" />
                <div className="process-dot">{step.phase}</div>
              </div>
            );
            return (
              <div key={step.phase} className="process-row">
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
              <div className="partner-logo">{p.icon || "🏢"}</div>
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
              <div className="team-photo">
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
        <h2 className="sec-title">Inside Our World</h2>
        <p className="sec-sub">A glimpse into the culture, energy, and space where great products are born.</p>
        <div className="gallery-grid">
           {(data.gallery || []).slice(0, 6).map((g, i) => (
            <div className={`g-item g-item-${i + 1}`} key={`${g.caption}-${i}`}>
              {g.url ? (
                <img src={g.url} alt={g.caption} />
              ) : (
                <div className="g-placeholder">
                  <span className="g-icon">{galleryIcons[i] || "📷"}</span>
                  <span className="g-label">{g.caption}</span>
                </div>
              )}
              <div className="g-overlay">
                <div className="g-caption">{g.caption}</div>
              </div>
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
        <div className="industry-tags">
          {INDUSTRY_TAGS.map((t) => (
            <span className="industry-tag" key={t}>
              {t}
            </span>
          ))}
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
        <div className="internship-grid">
          <div className="internship-card fade-up">
            <div className="internship-number">01</div>
            <h4>Full-Stack Web Development</h4>
            <p>Work on React, Node.js, and modern web applications. Learn best practices in frontend and backend development.</p>
            <div className="internship-perks">
              <span className="perk">🎯 3-6 months</span>
              <span className="perk">🏙️ In-office & Remote</span>
              <span className="perk">💡 Mentorship</span>
            </div>
          </div>
          <div className="internship-card fade-up">
            <div className="internship-number">02</div>
            <h4>Mobile App Development</h4>
            <p>Develop iOS/Android applications with experienced mobile engineers. Build real apps used by thousands.</p>
            <div className="internship-perks">
              <span className="perk">🎯 3-6 months</span>
              <span className="perk">🏙️ In-office & Remote</span>
              <span className="perk">💡 Mentorship</span>
            </div>
          </div>
          <div className="internship-card fade-up">
            <div className="internship-number">03</div>
            <h4>UI/UX Design</h4>
            <p>Design beautiful, user-centric interfaces. Work with Figma, user research, and design systems.</p>
            <div className="internship-perks">
              <span className="perk">🎯 3-6 months</span>
              <span className="perk">🏙️ In-office & Remote</span>
              <span className="perk">💡 Mentorship</span>
            </div>
          </div>
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
            <input
              value={lockPassword}
              onChange={(e) => setLockPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
              onKeyDown={(e) => e.key === "Enter" && unlock()}
            />
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
// Admin Panel JSX
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
              {["team", "partners", "gallery", "hero", "contact"].map((t) => (
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
                          placeholder="Full name"
                          value={editedMember.name}
                          onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })}
                        />
                        <input
                          placeholder="Badge on photo (e.g. FOUNDER & CEO)"
                          value={editedMember.badge}
                          onChange={(e) => setEditedMember({ ...editedMember, badge: e.target.value })}
                        />
                        <input
                          placeholder="Title under name (e.g. CEO)"
                          value={editedMember.title}
                          onChange={(e) => setEditedMember({ ...editedMember, title: e.target.value })}
                        />
                        <textarea
                          placeholder="Bio (optional)"
                          value={editedMember.bio}
                          onChange={(e) => setEditedMember({ ...editedMember, bio: e.target.value })}
                        />
                        <div className="upload-box">
                          <label className="upload-label">
                            Employee Photo (PNG/JPEG)
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={(e) => handleFileUpload(e.target.files[0], (data) => {
                                setEditedMember({ ...editedMember, photo: data });
                              })}
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
                              if (!editedMember.name || !editedMember.badge) return showToast("Name and badge required");
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
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="ap-del-btn"
                            onClick={() => saveData({ ...data, team: (data.team || []).filter((_, idx) => idx !== i) })}
                            title="Delete member"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <input placeholder="Full name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
                <input
                  placeholder="Badge on photo (e.g. FOUNDER & CEO)"
                  value={newMember.badge}
                  onChange={(e) => setNewMember({ ...newMember, badge: e.target.value })}
                />
                <input placeholder="Title under name (e.g. CEO)" value={newMember.title} onChange={(e) => setNewMember({ ...newMember, title: e.target.value })} />
                <textarea placeholder="Bio (optional)" value={newMember.bio} onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })} />
                <div className="upload-box">
                  <label className="upload-label">
                    Employee Photo (PNG/JPEG)
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => handleFileUpload(e.target.files[0], (data) => {
                        setMemberPhotoPreview(data);
                        setNewMember({ ...newMember, photo: data });
                      })}
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
                    if (!newMember.name || !newMember.badge) return showToast("Name and badge required");
                     saveData({ ...data, team: [...(data.team || []), { ...newMember }] });
                    setNewMember({ name: "", badge: "", title: "", bio: "", photo: "", linkedin: "" });
                  }}
                >
                  Add Member
                </button>
              </div>
            )}

            {tab === "partners" && (
              <div className="ap-section active">
                 {(data.partners || []).map((p, i) => (
                  <div className="ap-member-item" key={`${p.name}-${i}`}>
                    <span>{p.name}</span>
                    <button
                      type="button"
                      className="ap-del-btn"
                       onClick={() => saveData({ ...data, partners: (data.partners || []).filter((_, idx) => idx !== i) })}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <input placeholder="Company Name" value={newPartner.name} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })} />
                <input placeholder="Type" value={newPartner.type} onChange={(e) => setNewPartner({ ...newPartner, type: e.target.value })} />
                <input placeholder="Icon / emoji" value={newPartner.icon} onChange={(e) => setNewPartner({ ...newPartner, icon: e.target.value })} />
                <input placeholder="Badge (optional)" value={newPartner.badge} onChange={(e) => setNewPartner({ ...newPartner, badge: e.target.value })} />
                <button
                  type="button"
                  className="ap-btn"
                  onClick={() => {
                    if (!newPartner.name) return showToast("Company name required");
                     saveData({ ...data, partners: [...(data.partners || []), { ...newPartner, icon: newPartner.icon || "🏢" }] });
                    setNewPartner({ name: "", type: "", icon: "", badge: "" });
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
                <input placeholder="Caption" value={newGallery.caption} onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })} />
                <div className="upload-box">
                  <label className="upload-label">
                    Gallery Photo (PNG/JPEG)
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => handleFileUpload(e.target.files[0], (data) => {
                        setGalleryPhotoPreview(data);
                        setNewGallery({ ...newGallery, url: data });
                      })}
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

            {tab === "hero" && (
              <div className="ap-section active">
                <label className="ap-label">Company Logo</label>
                <div className="upload-box">
                  <label className="upload-label">
                    Upload Logo (PNG/JPEG)
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => handleFileUpload(e.target.files[0], (data) => {
                        setLogoPreview(data);
                        localStorage.setItem("coreberly-logo", data);
                      })}
                    />
                  </label>
                  {logoPreview && (
                    <div className="upload-preview">
                      <img src={logoPreview} alt="logo" />
                    </div>
                  )}
                </div>
                <label className="ap-label">Tagline</label>
                <textarea value={hero.tagline} onChange={(e) => setData({ ...data, hero: { ...hero, tagline: e.target.value } })} />
                <label className="ap-label">Stats</label>
                <input value={hero.projects} onChange={(e) => setData({ ...data, hero: { ...hero, projects: e.target.value } })} />
                <input value={hero.satisfaction} onChange={(e) => setData({ ...data, hero: { ...hero, satisfaction: e.target.value } })} />
                <input value={hero.engineers} onChange={(e) => setData({ ...data, hero: { ...hero, engineers: e.target.value } })} />
                <input value={hero.countries} onChange={(e) => setData({ ...data, hero: { ...hero, countries: e.target.value } })} />
                <label className="ap-label">Testimonial</label>
                <textarea value={hero.tquote} onChange={(e) => setData({ ...data, hero: { ...hero, tquote: e.target.value } })} />
                <input value={hero.tname} onChange={(e) => setData({ ...data, hero: { ...hero, tname: e.target.value } })} />
                <input value={hero.trole} onChange={(e) => setData({ ...data, hero: { ...hero, trole: e.target.value } })} />
                <button type="button" className="ap-btn" onClick={() => saveData(data)}>
                  Save Hero
                </button>
              </div>
            )}

            {tab === "contact" && (
              <div className="ap-section active">
                <input value={contact.email} onChange={(e) => setData({ ...data, contact: { ...contact, email: e.target.value } })} />
                <input value={contact.linkedin} onChange={(e) => setData({ ...data, contact: { ...contact, linkedin: e.target.value } })} />
                <input value={contact.instagram} onChange={(e) => setData({ ...data, contact: { ...contact, instagram: e.target.value } })} />
                <input value={contact.twitter} onChange={(e) => setData({ ...data, contact: { ...contact, twitter: e.target.value } })} />
                <button type="button" className="ap-btn" onClick={() => saveData(data)}>
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
