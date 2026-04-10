import { motion } from "framer-motion";

const GREEN = "#2D5A27";
const AMBER = "#C68B42";
const CREAM = "#ffffff";
const DARKGREEN = "#1C3A18";

const categories = [
  {
    id: "herb",
    title: "Herb Boxes",
    note: "Small teak herb planters with drainage feet.",
    rows: [
      { dimensions: '13"L × 3"W × 3"H', retail: 73, wholesale: 17.74 },
      { dimensions: '19"L × 4"W × 4"H', retail: 93, wholesale: 33.75 },
    ],
  },
  {
    id: "wb6",
    title: 'Window Boxes — 6"',
    note: "Teak mounting supports sold separately.",
    rows: [
      { dimensions: '24"L × 6"W × 6"H', retail: 136, wholesale: 47.97 },
      { dimensions: '30"L × 6"W × 6"H', retail: 157, wholesale: 55.09 },
      { dimensions: '36"L × 6"W × 6"H', retail: 167, wholesale: 60.39 },
      { dimensions: '48"L × 6"W × 6"H', retail: 219, wholesale: 92.36 },
    ],
  },
  {
    id: "wb8",
    title: 'Window Boxes — 8"',
    rows: [
      { dimensions: '24"L × 8"W × 8"H', retail: 167, wholesale: 63.94 },
      { dimensions: '30"L × 8"W × 8"H', retail: 188, wholesale: 72.75 },
      { dimensions: '36"L × 8"W × 8"H', retail: 209, wholesale: 83.47 },
      { dimensions: '48"L × 8"W × 8"H', retail: 243, wholesale: 106.59 },
    ],
  },
  {
    id: "wb12",
    title: 'Window Boxes — 12"',
    rows: [
      { dimensions: '24"L × 12"W × 12"H', retail: 219, wholesale: 81.68 },
      { dimensions: '30"L × 12"W × 12"H', retail: 237, wholesale: 97.53 },
      { dimensions: '36"L × 12"W × 12"H', retail: 268, wholesale: 106.59 },
      { dimensions: '48"L × 12"W × 12"H', retail: 309, wholesale: 134.97 },
    ],
  },
  {
    id: "tree",
    title: "Tree Boxes",
    note: "Thicker floors for stability. Raised feet for drainage. Sizes nest for easy shipping.",
    rows: [
      { dimensions: '12" × 12" × 12"', retail: 227, wholesale: 101.37 },
      { dimensions: '16" × 16" × 16"', retail: 315, wholesale: 144.86 },
      { dimensions: '20" × 20" × 20"', retail: 510, wholesale: 199.17 },
      { dimensions: '24" × 24" × 24"', retail: 639, wholesale: 266.13 },
      { dimensions: '28" × 28" × 28"', retail: 1338, wholesale: 369.3 },
      { dimensions: '24"L × 16"W × 16"H', retail: 443, wholesale: 179.23 },
      { dimensions: '36"L × 16"W × 16"H', retail: 572, wholesale: 228.1 },
      { dimensions: '48"L × 16"W × 16"H', retail: 648, wholesale: 282.38 },
      { dimensions: '36"L × 20"W × 20"H', retail: 700, wholesale: 275.18 },
      { dimensions: '48"L × 20"W × 20"H', retail: 1132, wholesale: 365.66 },
      { dimensions: '60"L × 20"W × 20"H', retail: 1338, wholesale: 429.06 },
    ],
  },
  {
    id: "trellis",
    title: "Trellises",
    note: "Fully assembled with stainless steel hardware.",
    rows: [
      { dimensions: '24" × 36"', retail: 84, wholesale: 33.48 },
      { dimensions: '24" × 48"', retail: 113, wholesale: 45.21 },
      { dimensions: '24" × 60"', retail: 139, wholesale: 55.61 },
      { dimensions: '24" × 72"', retail: 165, wholesale: 66.12 },
      { dimensions: '36" × 36"', retail: 126, wholesale: 50.23 },
      { dimensions: '36" × 48"', retail: 169, wholesale: 67.78 },
      { dimensions: '36" × 72"', retail: 249, wholesale: 99.61 },
      { dimensions: '36" × 96"', retail: 391, wholesale: 156.5 },
      { dimensions: '48" × 48"', retail: 222, wholesale: 88.72 },
      { dimensions: '48" × 72"', retail: 337, wholesale: 134.74 },
      { dimensions: '60" × 72"', retail: 454, wholesale: 181.62 },
      { dimensions: '48" × 96"', retail: 513, wholesale: 205.04 },
    ],
  },
  {
    id: "supports",
    title: "Box Supports",
    note: "Solid teak mounting brackets. Priced per pair.",
    rows: [
      { dimensions: '4"', retail: 19, wholesale: 7.7 },
      { dimensions: '6"', retail: 22, wholesale: 8.8 },
      { dimensions: '8"', retail: 25, wholesale: 9.9 },
      { dimensions: '12"', retail: 30, wholesale: 12.1 },
    ],
  },
];

const margin = (r, w) => Math.round(((r - w) / r) * 100);

const PriceTable = ({ rows }) => (
  <div
    style={{
      overflowX: "auto",
      borderRadius: 10,
      border: `1px solid ${GREEN}22`,
    }}
  >
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: GREEN }}>
          {["Dimensions", "Wholesale", "Retail", "Margin"].map((h) => (
            <th
              key={h}
              style={{
                padding: "8px 12px",
                textAlign: h === "Dimensions" ? "left" : "right",
                color: "#fff",
                fontWeight: 600,
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
                fontSize: 12,
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const m = margin(row.retail, row.wholesale);
          return (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "#fff" : "#f7faf6",
                borderTop: `1px solid ${GREEN}18`,
              }}
            >
              <td
                style={{ padding: "7px 12px", color: "#222", fontWeight: 500 }}
              >
                {row.dimensions}
              </td>
              <td
                style={{
                  padding: "7px 12px",
                  textAlign: "right",
                  color: GREEN,
                  fontWeight: 700,
                }}
              >
                ${row.wholesale.toFixed(2)}
              </td>
              <td
                style={{
                  padding: "7px 12px",
                  textAlign: "right",
                  color: "#666",
                }}
              >
                ${row.retail}
              </td>
              <td style={{ padding: "7px 12px", textAlign: "right" }}>
                <span
                  style={{
                    background:
                      m >= 60 ? "#e8f5e3" : m >= 50 ? "#fdf3e3" : "#f5f5f5",
                    color: m >= 60 ? GREEN : m >= 50 ? AMBER : "#666",
                    fontWeight: 700,
                    fontSize: 12,
                    padding: "2px 7px",
                    borderRadius: 20,
                  }}
                >
                  {m}%
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default function WholesaleDTH() {
  return (
    <div
      style={{
        fontFamily: "'Georgia', serif",
        background: CREAM,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        body { margin: 0; }
        .dth-sans { font-family: 'DM Sans', sans-serif; }
        .nav-scroll::-webkit-scrollbar { display: none; }
        .nav-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* HERO */}
      <div
        style={{
          background: `linear-gradient(160deg, ${DARKGREEN} 0%, ${GREEN} 100%)`,
          padding: "48px 24px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle texture rings */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 20,
            padding: "4px 14px",
            fontSize: 12,
            color: "#d4f0c8",
            marginBottom: 18,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          &#127807; Spring 2026 · Wholesale Program
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            color: "#fff",
            fontSize: "clamp(32px, 8vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.15,
            margin: "0 0 10px",
            letterSpacing: "-0.02em",
          }}
        >
          Wholesale Teak
          <br />
          Planters & Trellises
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="dth-sans"
          style={{
            color: "#b8ddb0",
            fontSize: 15,
            margin: "0 0 28px",
            lineHeight: 1.5,
          }}
        >
          Costa Rican teak · Ships fully assembled · No liner needed
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="dth-sans"
            style={{
              background: "#fff",
              color: GREEN,
              fontWeight: 700,
              fontSize: 15,
              padding: "13px 28px",
              borderRadius: 50,
              textDecoration: "none",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            See Pricing
          </a>
          <a
            href="mailto:jack@forevergreen.earth?subject=Interest%20in%20Teak%20Planters%20or%20Trellises"
            className="dth-sans"
            style={{
              background: "transparent",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              padding: "13px 28px",
              borderRadius: 50,
              textDecoration: "none",
              border: "2px solid rgba(255,255,255,0.5)",
              cursor: "pointer",
            }}
          >
            Learn more
          </a>
        </motion.div>
      </div>
      {/* PHOTO GALLERY */}
      <div style={{ padding: "24px 20px 0", maxWidth: 800, margin: "0 auto" }}>
        <img
          src="data:image/jpeg;base64,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"
          alt="Diamond Tropical Hardwoods teak planters and trellises"
          style={{ width: "100%", borderRadius: 18, display: "block" }}
        />
      </div>

      {/* PRICING */}
      <div
        id="pricing"
        style={{ padding: "32px 20px 8px", maxWidth: 720, margin: "0 auto" }}
      >
        <h2
          style={{
            color: DARKGREEN,
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 4,
            letterSpacing: "-0.02em",
          }}
        >
          2026 Wholesale Price List
        </h2>
        <p
          className="dth-sans"
          style={{ color: "#777", fontSize: 13, marginBottom: 28 }}
        >
          All prices per unit. Volume discounts available — reach out to
          discuss.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {categories.map((cat) => (
            <div key={cat.id} id={cat.id}>
              <div style={{ marginBottom: 8 }}>
                <h3
                  style={{
                    color: DARKGREEN,
                    fontSize: 17,
                    fontWeight: 700,
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {cat.title}
                </h3>
                {cat.note && (
                  <p
                    className="dth-sans"
                    style={{ color: "#888", fontSize: 12, margin: "4px 0 0" }}
                  >
                    {cat.note}
                  </p>
                )}
              </div>
              <PriceTable rows={cat.rows} />
            </div>
          ))}
        </div>

        <p
          className="dth-sans"
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#aaa",
            marginTop: 28,
            marginBottom: 0,
          }}
        >
          Custom sizes and finishes available. Call for pricing.
        </p>
      </div>

      {/* WHY TEAK CALLOUT */}
      <div style={{ padding: "32px 20px", maxWidth: 720, margin: "0 auto" }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${GREEN}12, ${AMBER}12)`,
            border: `1px solid ${GREEN}25`,
            borderRadius: 14,
            padding: "20px 22px",
          }}
        >
          <h3
            style={{
              color: DARKGREEN,
              fontSize: 16,
              fontWeight: 700,
              margin: "0 0 10px",
              letterSpacing: "-0.01em",
            }}
          >
            Why teak sells itself
          </h3>
          <div
            className="dth-sans"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 16px",
              fontSize: 13,
              color: "#444",
            }}
          >
            {[
              "Same wood used on ship decks",
              "Zero maintenance — fully weatherproof",
              "Bundles naturally with plants",
              "Increases avg. ticket for your store",
              "Ships fully assembled, display-ready",
              "No liner needed — plant directly in soil",
            ].map((pt) => (
              <div
                key={pt}
                style={{ display: "flex", alignItems: "flex-start", gap: 6 }}
              >
                <span style={{ color: GREEN, fontWeight: 700, marginTop: 1 }}>
                  ✓
                </span>
                {pt}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div
        id="contact"
        style={{
          padding: "8px 20px 48px",
          maxWidth: 520,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: DARKGREEN,
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          Interested in carrying our planters?
        </h2>
        <p
          className="dth-sans"
          style={{
            color: "#777",
            fontSize: 14,
            marginBottom: 28,
            lineHeight: 1.6,
          }}
        >
          Shoot us an email — we'll send pricing, minimums, and can arrange a
          sample delivery to your store.
        </p>
        <a
          href="mailto:jack@forevergreen.earth?subject=Interest%20in%20Teak%20Planters%20or%20Trellises"
          className="dth-sans"
          style={{
            display: "inline-block",
            background: GREEN,
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            padding: "16px 36px",
            borderRadius: 50,
            textDecoration: "none",
            letterSpacing: "0.01em",
            boxShadow: "0 4px 20px rgba(45,90,39,0.25)",
          }}
        >
          Send Us an Email →
        </a>
        <p
          className="dth-sans"
          style={{ color: "#bbb", fontSize: 12, marginTop: 14 }}
        >
          jack@forevergreen.earth
        </p>
      </div>

      {/* FOOTER */}
      <div
        style={{
          background: DARKGREEN,
          padding: "24px 20px",
          textAlign: "center",
        }}
      >
        <p
          className="dth-sans"
          style={{
            color: "#b8ddb0",
            fontSize: 13,
            margin: "0 0 4px",
            fontWeight: 600,
          }}
        >
          Diamond Tropical Hardwoods
        </p>
        <a
          href="mailto:jack@forevergreen.earth"
          className="dth-sans"
          style={{ color: "#7ab86e", fontSize: 13, textDecoration: "none" }}
        >
          jack@forevergreen.earth
        </a>
        <p
          className="dth-sans"
          style={{ color: "#5a8054", fontSize: 11, margin: "10px 0 0" }}
        >
          Custom sizes available · Costa Rican teak
        </p>
      </div>
    </div>
  );
}
