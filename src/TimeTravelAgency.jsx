import React, { useState, useRef, useEffect } from "react";

/* ============================================================
   TimeTravel Agency — Webapp interactive
   Agence de voyage temporel de luxe
   Destinations : Paris 1889 · Crétacé -65M · Florence 1504
   ------------------------------------------------------------
   - Hero immersif + ambiance temporelle animée
   - Galerie de 3 destinations (cards + fiche détaillée)
   - Chatbot IA fonctionnel (API Anthropic, voir <Chatbot/>)
   - Quiz de recommandation personnalisée (bonus ex. 3.2)
   - Animations au scroll, responsive mobile-first
   ============================================================ */

/* -------------------- DATA -------------------- */

const PALETTE = {
  ink: "#0a0b0d",
  panel: "#121319",
  panel2: "#171922",
  line: "rgba(212,175,55,0.16)",
  gold: "#d8b65a",
  goldSoft: "#e7cd8a",
  cream: "#f3ecdd",
  muted: "#9c968a",
};

const DESTINATIONS = [
  {
    id: "paris",
    era: "1889",
    name: "Paris",
    tagline: "La Belle Époque",
    accent: "#d8b65a",
    glow: "rgba(216,182,90,0.30)",
    bg: "linear-gradient(180deg, rgba(10,11,13,0.45) 0%, rgba(10,11,13,0.2) 40%, rgba(10,11,13,0.9) 100%), url('/paris-1889.jpg') center/cover",
    price: "12 400 €",
    duration: "5 jours",
    intro:
      "L'Exposition Universelle bat son plein. La Tour Eiffel, toute neuve, domine un Paris illuminé au gaz et à l'électricité naissante.",
    highlights: [
      "Inauguration de la Tour Eiffel (1 710 marches)",
      "Galerie des Machines & pavillons des nations",
      "Cafés-concerts, fiacres et grands boulevards",
    ],
    long:
      "1889 : Paris fête le centenaire de la Révolution avec une Exposition Universelle démesurée. Vous arrivez au pied d'une Tour Eiffel encore couleur rouge-brun, objet de toutes les controverses. Promenez-vous Champ-de-Mars, assistez aux premières démonstrations électriques, dînez dans un restaurant de l'époque et croisez l'effervescence d'un monde qui bascule dans la modernité.",
  },
  {
    id: "cretace",
    era: "-65 M",
    name: "Crétacé",
    tagline: "Le monde d'avant",
    accent: "#5fae86",
    glow: "rgba(95,174,134,0.28)",
    bg: "linear-gradient(180deg, rgba(10,11,13,0.45) 0%, rgba(10,11,13,0.2) 40%, rgba(10,11,13,0.9) 100%), url('/cretace.jpg') center/cover",
    price: "28 900 €",
    duration: "3 jours",
    intro:
      "Forêts luxuriantes, fougères géantes et géants de chair. Les derniers jours d'un monde dominé par les dinosaures.",
    highlights: [
      "Observation encadrée d'un troupeau de Tricératops",
      "Survol des forêts primitives en capsule",
      "Ciel sans pollution, faune intacte",
    ],
    long:
      "Reculez de 65 millions d'années, à la fin du Crétacé. L'air est dense, chaud, saturé de vie. Depuis des points d'observation sécurisés, vous croisez Tyrannosaures, Tricératops et ptérosaures planant au-dessus de la canopée. Une expérience rare, encadrée par nos guides paléo-temporels — pour aventuriers avertis uniquement.",
  },
  {
    id: "florence",
    era: "1504",
    name: "Florence",
    tagline: "La Renaissance",
    accent: "#c97b54",
    glow: "rgba(201,123,84,0.28)",
    bg: "linear-gradient(180deg, rgba(10,11,13,0.45) 0%, rgba(10,11,13,0.2) 40%, rgba(10,11,13,0.9) 100%), url('/florence-1504.jpg') center/cover",
    price: "15 200 €",
    duration: "6 jours",
    intro:
      "Michel-Ange achève son David. Léonard peint, les Médicis règnent. La cité-état la plus créative de l'Histoire.",
    highlights: [
      "Dévoilement du David de Michel-Ange",
      "Atelier de Léonard de Vinci",
      "Cour des Médicis & ateliers d'artistes",
    ],
    long:
      "Florence, 1504. Le marbre du David est enfin dressé sur la Piazza della Signoria et la ville retient son souffle. Léonard et Michel-Ange se croisent, rivaux de génie. Déambulez dans les ateliers, observez naître les œuvres qui définiront l'art occidental, et goûtez à la table raffinée du Quattrocento finissant.",
  },
];

/* Personnalité de l'agent (sert de "system" à l'IA du chatbot) */
const BOT_SYSTEM = `Tu es l'assistant virtuel de TimeTravel Agency, une agence de voyage temporel de luxe (fictive).
Ton rôle : conseiller les clients sur les meilleures destinations temporelles.

Ton ton : professionnel mais chaleureux, passionné d'histoire, enthousiaste sans être familier. Tu réponds en français, de façon concise (2 à 5 phrases), en t'adaptant à la question.

Destinations proposées et tarifs (fictifs mais à respecter) :
- Paris 1889 — Belle Époque, Tour Eiffel, Exposition Universelle. 12 400 € / 5 jours. Idéal pour les amateurs d'élégance, d'architecture et d'histoire moderne.
- Crétacé -65M — dinosaures, nature préhistorique. 28 900 € / 3 jours. Pour aventuriers, amoureux de nature sauvage. Destination premium et encadrée.
- Florence 1504 — Renaissance, art, Michel-Ange, Léonard de Vinci. 15 200 € / 6 jours. Pour les passionnés d'art et de culture.

Tu peux suggérer une destination selon les intérêts du client, répondre aux questions de prix, de sécurité, de durée, et aux FAQ classiques d'une agence de voyage. Si une question sort du cadre, ramène avec tact vers les voyages temporels.`;

/* -------------------- HOOKS -------------------- */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "none";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* -------------------- COMPONENTS -------------------- */

function Stars() {
  // ambiance "temporelle" : poussière d'étoiles + ondes lentes
  const dots = Array.from({ length: 60 });
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {dots.map((_, i) => {
        const size = Math.random() * 2 + 0.5;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: PALETTE.goldSoft,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `twinkle ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

function Nav({ onChat }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px clamp(20px, 5vw, 64px)",
        background: solid ? "rgba(10,11,13,0.82)" : "transparent",
        backdropFilter: solid ? "blur(10px)" : "none",
        borderBottom: solid ? `1px solid ${PALETTE.line}` : "1px solid transparent",
        transition: "all .4s ease",
      }}
    >
      <a href="#top" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: PALETTE.gold, fontSize: 18, letterSpacing: 2 }}>◷</span>
        <span style={{ fontFamily: "Georgia, serif", color: PALETTE.cream, fontSize: 18, letterSpacing: 1 }}>
          TimeTravel <span style={{ color: PALETTE.gold }}>Agency</span>
        </span>
      </a>
      <nav style={{ display: "flex", alignItems: "center", gap: "clamp(14px,3vw,30px)" }}>
        <a href="#destinations" style={navLink}>Destinations</a>
        <a href="#quiz" style={navLink} className="hide-sm">Trouver mon époque</a>
        <button onClick={onChat} style={navBtn}>Parler à un conseiller</button>
      </nav>
    </header>
  );
}

const navLink = {
  color: PALETTE.muted,
  textDecoration: "none",
  fontSize: 14,
  letterSpacing: 0.5,
  transition: "color .2s",
};
const navBtn = {
  background: "transparent",
  color: PALETTE.gold,
  border: `1px solid ${PALETTE.gold}`,
  borderRadius: 999,
  padding: "9px 18px",
  fontSize: 13,
  letterSpacing: 0.5,
  cursor: "pointer",
  transition: "all .25s",
};

function Hero() {
  return (
    <section
      id="top"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 24px 80px",
        background:
          "radial-gradient(130% 100% at 50% -10%, #1a1606 0%, #0d0e12 50%, #08090b 100%)",
        overflow: "hidden",
      }}
    >
      <Stars />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 50% at 50% 40%, rgba(216,182,90,0.10), transparent 70%)" }} />
      <div style={{ position: "relative", maxWidth: 880 }}>
        <p
          style={{
            color: PALETTE.gold,
            letterSpacing: 6,
            fontSize: 12,
            textTransform: "uppercase",
            marginBottom: 24,
            opacity: 0,
            animation: "fadeUp .9s ease .2s forwards",
          }}
        >
          Agence de voyage temporel · depuis « toujours »
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: PALETTE.cream,
            fontSize: "clamp(40px, 8vw, 86px)",
            lineHeight: 1.02,
            fontWeight: 600,
            margin: 0,
            opacity: 0,
            animation: "fadeUp 1s ease .4s forwards",
          }}
        >
          Le temps n'est plus
          <br />
          une frontière.
        </h1>
        <p
          style={{
            color: PALETTE.muted,
            fontSize: "clamp(15px, 2.4vw, 19px)",
            maxWidth: 560,
            margin: "26px auto 0",
            lineHeight: 1.7,
            opacity: 0,
            animation: "fadeUp 1s ease .6s forwards",
          }}
        >
          Trois époques, un seul voyagiste. Nous orchestrons des séjours d'exception
          à travers les siècles — de la Belle Époque parisienne aux derniers jours
          des dinosaures.
        </p>
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 38,
            opacity: 0,
            animation: "fadeUp 1s ease .8s forwards",
          }}
        >
          <a href="#destinations" style={ctaPrimary}>Explorer les destinations</a>
          <a href="#quiz" style={ctaGhost}>Trouver mon époque</a>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", color: PALETTE.muted, fontSize: 12, letterSpacing: 2, animation: "float 2.4s ease-in-out infinite" }}>
        ↓ défiler
      </div>
    </section>
  );
}

const ctaPrimary = {
  background: PALETTE.gold,
  color: "#1a1407",
  textDecoration: "none",
  padding: "14px 28px",
  borderRadius: 999,
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: 0.3,
  boxShadow: "0 10px 40px rgba(216,182,90,0.25)",
};
const ctaGhost = {
  background: "transparent",
  color: PALETTE.cream,
  textDecoration: "none",
  padding: "14px 28px",
  borderRadius: 999,
  fontSize: 15,
  border: `1px solid ${PALETTE.line}`,
};

function Agency() {
  useReveal();
  const stats = [
    ["3", "époques au catalogue"],
    ["100%", "retours garantis*"],
    ["∞", "souvenirs rapportés"],
  ];
  return (
    <section style={{ padding: "100px clamp(20px,6vw,80px)", maxWidth: 1100, margin: "0 auto" }}>
      <div
        data-reveal
        style={{ opacity: 0, transform: "translateY(24px)", transition: "all .8s ease" }}
      >
        <p style={eyebrow}>L'agence</p>
        <h2 style={h2}>Voyager dans le temps, avec le goût du détail.</h2>
        <p style={{ color: PALETTE.muted, fontSize: 18, lineHeight: 1.8, maxWidth: 680 }}>
          TimeTravel Agency conçoit des séjours temporels sur mesure. Chaque départ
          est encadré par nos guides historiens, sécurisé par notre protocole
          chrono-stabilisé, et pensé pour que vous viviez l'Histoire de l'intérieur —
          sans jamais la perturber.
        </p>
        <div style={{ display: "flex", gap: 48, marginTop: 50, flexWrap: "wrap" }}>
          {stats.map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 44, color: PALETTE.gold }}>{n}</div>
              <div style={{ color: PALETTE.muted, fontSize: 14, letterSpacing: 0.5 }}>{l}</div>
            </div>
          ))}
        </div>
        <p style={{ color: "rgba(156,150,138,0.5)", fontSize: 12, marginTop: 24 }}>
          *Hors paradoxes temporels. Voir conditions générales de voyage.
        </p>
      </div>
    </section>
  );
}

function DestinationCard({ d, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <article
      data-reveal
      onClick={() => onOpen(d)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: 18,
        overflow: "hidden",
        minHeight: 440,
        background: d.bg,
        border: `1px solid ${hover ? d.accent : PALETTE.line}`,
        boxShadow: hover ? `0 24px 60px ${d.glow}` : "0 10px 30px rgba(0,0,0,0.4)",
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        transition: "all .45s cubic-bezier(.2,.7,.2,1)",
        opacity: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 26,
      }}
    >
      {/* Astuce : remplacez `d.bg` par votre image hero du projet 1 */}
      <span
        style={{
          position: "absolute",
          top: 22,
          left: 26,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 13,
          letterSpacing: 3,
          color: d.accent,
          border: `1px solid ${d.accent}`,
          borderRadius: 999,
          padding: "5px 12px",
        }}
      >
        {d.era}
      </span>
      <div style={{ position: "relative" }}>
        <p style={{ color: d.accent, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 6px" }}>
          {d.tagline}
        </p>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 34, color: PALETTE.cream, margin: "0 0 12px" }}>
          {d.name}
        </h3>
        <p style={{ color: PALETTE.muted, fontSize: 15, lineHeight: 1.6, margin: "0 0 18px" }}>{d.intro}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: PALETTE.cream, fontSize: 15 }}>
            dès <strong style={{ color: d.accent }}>{d.price}</strong>
          </span>
          <span style={{ color: hover ? d.accent : PALETTE.muted, fontSize: 14, transition: "color .3s" }}>
            Découvrir →
          </span>
        </div>
      </div>
    </article>
  );
}

function Destinations({ onOpen }) {
  useReveal();
  return (
    <section id="destinations" style={{ padding: "60px clamp(20px,6vw,80px) 100px", maxWidth: 1200, margin: "0 auto" }}>
      <div data-reveal style={{ opacity: 0, transform: "translateY(24px)", transition: "all .8s ease", marginBottom: 50 }}>
        <p style={eyebrow}>Destinations</p>
        <h2 style={h2}>Trois portes vers l'ailleurs.</h2>
      </div>
      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
        }}
      >
        {DESTINATIONS.map((d) => (
          <DestinationCard key={d.id} d={d} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

function DestinationModal({ d, onClose, onChat }) {
  useEffect(() => {
    if (!d) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [d, onClose]);
  if (!d) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(5,6,8,0.78)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn .3s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 620,
          width: "100%",
          maxHeight: "88vh",
          overflowY: "auto",
          borderRadius: 20,
          border: `1px solid ${d.accent}`,
          background: PALETTE.panel,
          animation: "popIn .35s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <div style={{ height: 180, background: d.bg, position: "relative", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
          <button onClick={onClose} aria-label="Fermer" style={closeBtn}>✕</button>
          <span
            style={{
              position: "absolute",
              bottom: 16,
              left: 24,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 13,
              letterSpacing: 3,
              color: d.accent,
              border: `1px solid ${d.accent}`,
              borderRadius: 999,
              padding: "5px 12px",
            }}
          >
            {d.era}
          </span>
        </div>
        <div style={{ padding: "28px 30px 32px" }}>
          <p style={{ color: d.accent, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>{d.tagline}</p>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, color: PALETTE.cream, margin: "6px 0 16px" }}>
            {d.name} {d.era}
          </h3>
          <p style={{ color: PALETTE.muted, fontSize: 16, lineHeight: 1.8 }}>{d.long}</p>

          <div style={{ display: "flex", gap: 28, margin: "22px 0", flexWrap: "wrap" }}>
            <div>
              <div style={{ color: PALETTE.muted, fontSize: 12, letterSpacing: 1 }}>À PARTIR DE</div>
              <div style={{ color: d.accent, fontSize: 22, fontFamily: "'Playfair Display', Georgia, serif" }}>{d.price}</div>
            </div>
            <div>
              <div style={{ color: PALETTE.muted, fontSize: 12, letterSpacing: 1 }}>DURÉE</div>
              <div style={{ color: PALETTE.cream, fontSize: 22, fontFamily: "'Playfair Display', Georgia, serif" }}>{d.duration}</div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${PALETTE.line}`, paddingTop: 18 }}>
            <div style={{ color: PALETTE.cream, fontSize: 14, marginBottom: 12, letterSpacing: 1 }}>AU PROGRAMME</div>
            {d.highlights.map((h) => (
              <div key={h} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8, color: PALETTE.muted, fontSize: 15 }}>
                <span style={{ color: d.accent }}>◆</span> {h}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
            <button style={{ ...ctaPrimary, border: "none", background: d.accent, cursor: "pointer" }}>Réserver ce voyage</button>
            <button onClick={onChat} style={{ ...ctaGhost, cursor: "pointer" }}>Poser une question</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const closeBtn = {
  position: "absolute",
  top: 14,
  right: 14,
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "none",
  background: "rgba(0,0,0,0.5)",
  color: "#fff",
  cursor: "pointer",
  fontSize: 14,
};

/* -------------------- QUIZ (bonus 3.2) -------------------- */

const QUIZ = [
  {
    q: "Quel type d'expérience recherchez-vous ?",
    a: [
      ["Culturelle et artistique", "florence"],
      ["Aventure et nature", "cretace"],
      ["Élégance et raffinement", "paris"],
    ],
  },
  {
    q: "Votre période de prédilection ?",
    a: [
      ["Histoire moderne (XIXe siècle)", "paris"],
      ["Temps anciens et origines", "cretace"],
      ["Renaissance et classicisme", "florence"],
    ],
  },
  {
    q: "Vous préférez…",
    a: [
      ["L'effervescence urbaine", "paris"],
      ["La nature sauvage", "cretace"],
      ["L'art et l'architecture", "florence"],
    ],
  },
  {
    q: "Votre activité idéale :",
    a: [
      ["Flâner dans une ville d'exception", "paris"],
      ["Observer une faune unique", "cretace"],
      ["Explorer ateliers et musées", "florence"],
    ],
  },
];

function Quiz({ onOpen }) {
  useReveal();
  const [step, setStep] = useState(-1); // -1 = intro
  const [scores, setScores] = useState({ paris: 0, cretace: 0, florence: 0 });

  const pick = (id) => {
    const next = { ...scores, [id]: scores[id] + 1 };
    setScores(next);
    setStep(step + 1);
  };
  const reset = () => {
    setScores({ paris: 0, cretace: 0, florence: 0 });
    setStep(-1);
  };

  const finished = step >= QUIZ.length;
  const winnerId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const winner = DESTINATIONS.find((d) => d.id === winnerId);

  return (
    <section id="quiz" style={{ padding: "40px clamp(20px,6vw,80px) 110px", maxWidth: 760, margin: "0 auto" }}>
      <div
        data-reveal
        style={{
          opacity: 0,
          transform: "translateY(24px)",
          transition: "all .8s ease",
          background: PALETTE.panel,
          border: `1px solid ${PALETTE.line}`,
          borderRadius: 22,
          padding: "clamp(28px,5vw,48px)",
        }}
      >
        <p style={{ ...eyebrow, textAlign: "center" }}>Recommandation personnalisée</p>
        <h2 style={{ ...h2, textAlign: "center", marginBottom: 8 }}>Quelle époque est faite pour vous ?</h2>

        {step === -1 && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: PALETTE.muted, fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: "10px auto 28px" }}>
              Quatre questions, et notre conseiller vous orientera vers la destination
              temporelle idéale.
            </p>
            <button onClick={() => setStep(0)} style={{ ...ctaPrimary, border: "none", cursor: "pointer" }}>
              Commencer le quiz
            </button>
          </div>
        )}

        {step >= 0 && !finished && (
          <div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", margin: "18px 0 26px" }}>
              {QUIZ.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: 28,
                    height: 4,
                    borderRadius: 2,
                    background: i <= step ? PALETTE.gold : "rgba(255,255,255,0.12)",
                    transition: "background .3s",
                  }}
                />
              ))}
            </div>
            <h3 style={{ color: PALETTE.cream, fontSize: 22, textAlign: "center", marginBottom: 24, fontFamily: "'Playfair Display', Georgia, serif" }}>
              {QUIZ[step].q}
            </h3>
            <div style={{ display: "grid", gap: 12 }}>
              {QUIZ[step].a.map(([label, id]) => (
                <button key={label} onClick={() => pick(id)} style={quizOption}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {finished && winner && (
          <div style={{ textAlign: "center", animation: "fadeIn .5s ease" }}>
            <p style={{ color: PALETTE.muted, marginTop: 14 }}>Votre époque idéale :</p>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 40, color: winner.accent, margin: "6px 0 4px" }}>
              {winner.name} {winner.era}
            </h3>
            <p style={{ color: PALETTE.cream, fontSize: 16, marginBottom: 6 }}>{winner.tagline}</p>
            <p style={{ color: PALETTE.muted, fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 26px" }}>
              {winner.intro}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => onOpen(winner)} style={{ ...ctaPrimary, border: "none", background: winner.accent, cursor: "pointer" }}>
                Voir la destination
              </button>
              <button onClick={reset} style={{ ...ctaGhost, cursor: "pointer" }}>Refaire le quiz</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const quizOption = {
  background: PALETTE.panel2,
  color: PALETTE.cream,
  border: `1px solid ${PALETTE.line}`,
  borderRadius: 12,
  padding: "16px 20px",
  fontSize: 15,
  textAlign: "left",
  cursor: "pointer",
  transition: "all .2s",
};

/* -------------------- CHATBOT (IA fonctionnelle) -------------------- */

function Chatbot({ open, setOpen }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Bonjour et bienvenue chez TimeTravel Agency ✦ Je suis votre conseiller temporel. Posez-moi vos questions sur nos destinations, leurs tarifs ou laissez-moi vous orienter !",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const history = [...messages, { role: "user", text }];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: BOT_SYSTEM,
          messages: history.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      const reply = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      setMessages((m) => [
        ...m,
        { role: "assistant", text: reply || "Pardonnez-moi, je n'ai pas pu formuler de réponse. Reformulez votre question ?" },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Connexion au flux temporel interrompue. Réessayez dans un instant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bulle flottante */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Ouvrir le chat"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 90,
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "none",
          background: PALETTE.gold,
          color: "#1a1407",
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "0 12px 40px rgba(216,182,90,0.4)",
          transition: "transform .25s",
          transform: open ? "scale(0.9)" : "scale(1)",
        }}
      >
        {open ? "✕" : "✦"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 96,
            right: 24,
            zIndex: 90,
            width: "min(380px, calc(100vw - 32px))",
            height: "min(560px, calc(100vh - 130px))",
            display: "flex",
            flexDirection: "column",
            borderRadius: 18,
            overflow: "hidden",
            background: PALETTE.panel,
            border: `1px solid ${PALETTE.line}`,
            boxShadow: "0 24px 70px rgba(0,0,0,0.6)",
            animation: "popIn .3s cubic-bezier(.2,.8,.2,1)",
          }}
        >
          <div style={{ padding: "16px 18px", borderBottom: `1px solid ${PALETTE.line}`, background: PALETTE.panel2 }}>
            <div style={{ color: PALETTE.cream, fontSize: 15, fontFamily: "'Playfair Display', Georgia, serif" }}>
              Conseiller temporel <span style={{ color: PALETTE.gold }}>✦</span>
            </div>
            <div style={{ color: PALETTE.muted, fontSize: 12 }}>En ligne · répond en quelques secondes</div>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "82%",
                  background: m.role === "user" ? PALETTE.gold : PALETTE.panel2,
                  color: m.role === "user" ? "#1a1407" : PALETTE.cream,
                  padding: "10px 14px",
                  borderRadius: 14,
                  borderBottomRightRadius: m.role === "user" ? 4 : 14,
                  borderBottomLeftRadius: m.role === "user" ? 14 : 4,
                  fontSize: 14,
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", color: PALETTE.muted, fontSize: 14, padding: "10px 14px" }}>
                <span className="dots">Le conseiller consulte les archives</span>
              </div>
            )}
          </div>

          <div style={{ padding: 12, borderTop: `1px solid ${PALETTE.line}`, display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Posez-moi vos questions sur les voyages temporels…"
              style={{
                flex: 1,
                background: PALETTE.panel2,
                border: `1px solid ${PALETTE.line}`,
                borderRadius: 10,
                padding: "10px 12px",
                color: PALETTE.cream,
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              onClick={send}
              disabled={loading}
              style={{
                background: PALETTE.gold,
                color: "#1a1407",
                border: "none",
                borderRadius: 10,
                padding: "0 16px",
                cursor: loading ? "default" : "pointer",
                fontSize: 16,
                opacity: loading ? 0.6 : 1,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${PALETTE.line}`, padding: "48px clamp(20px,6vw,80px)", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ fontFamily: "Georgia, serif", color: PALETTE.cream, fontSize: 18 }}>
            TimeTravel <span style={{ color: PALETTE.gold }}>Agency</span>
          </div>
          <p style={{ color: PALETTE.muted, fontSize: 13, marginTop: 8 }}>
            Le temps n'est plus une frontière.
          </p>
        </div>
        <div style={{ color: PALETTE.muted, fontSize: 13, lineHeight: 2 }}>
          Paris 1889 · Crétacé -65M · Florence 1504
          <br />
          Projet pédagogique — Webapp interactive · IA générative
        </div>
      </div>
      <p style={{ color: "rgba(156,150,138,0.4)", fontSize: 12, marginTop: 28 }}>
        © TimeTravel Agency — agence fictive. Aucun paradoxe n'a été créé durant la conception de ce site.
      </p>
    </footer>
  );
}

/* -------------------- APP -------------------- */

export default function App() {
  const [modal, setModal] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const openChat = () => setChatOpen(true);

  return (
    <div style={{ background: PALETTE.ink, color: PALETTE.cream, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 88px; }
        body, #root { overflow-x: hidden; max-width: 100%; }
        a:hover { color: ${PALETTE.gold} !important; }
        button:hover { filter: brightness(1.06); }
        [style*="quizOption"]:hover { border-color: ${PALETTE.gold}; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(22px);} to { opacity:1; transform:none; } }
        @keyframes fadeIn { from { opacity:0;} to { opacity:1; } }
        @keyframes popIn { from { opacity:0; transform: translateY(16px) scale(.98);} to { opacity:1; transform:none; } }
        @keyframes float { 0%,100%{ transform: translate(-50%,0);} 50%{ transform: translate(-50%,8px);} }
        @keyframes twinkle { 0%,100%{ opacity:.1;} 50%{ opacity:.7;} }
        .dots::after { content:''; animation: dots 1.4s steps(4,end) infinite; }
        @keyframes dots { 0%{content:'';} 25%{content:'.';} 50%{content:'..';} 75%{content:'...';} }
        @media (max-width: 640px){ .hide-sm { display:none !important; } }
        @media (prefers-reduced-motion: reduce){ * { animation: none !important; scroll-behavior: auto !important; } }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: rgba(216,182,90,0.25); border-radius: 8px; }
      `}</style>

      <Nav onChat={openChat} />
      <Hero />
      <Agency />
      <Destinations onOpen={setModal} />
      <Quiz onOpen={setModal} />
      <Footer />

      <DestinationModal d={modal} onClose={() => setModal(null)} onChat={() => { setModal(null); openChat(); }} />
      <Chatbot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}

const eyebrow = { color: PALETTE.gold, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 };
const h2 = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 5vw, 46px)", color: PALETTE.cream, margin: "0 0 20px", lineHeight: 1.1, fontWeight: 600 };
