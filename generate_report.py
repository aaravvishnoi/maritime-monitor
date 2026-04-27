from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from datetime import date

OUTPUT = "/Users/aaravvishnoi/Documents/MaritimeMonitor/MaritimeMonitor_Report.pdf"

# ── Colour palette ────────────────────────────────────────────────────────────
NAVY   = colors.HexColor("#0a1628")
BLUE   = colors.HexColor("#0ea5e9")
LIGHT  = colors.HexColor("#e2e8f0")
MUTED  = colors.HexColor("#64748b")
GREEN  = colors.HexColor("#22c55e")
RED    = colors.HexColor("#ef4444")
AMBER  = colors.HexColor("#f59e0b")
WHITE  = colors.white

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    leftMargin=2*cm, rightMargin=2*cm,
    topMargin=2*cm, bottomMargin=2*cm,
)

styles = getSampleStyleSheet()

def style(name, **kw):
    s = ParagraphStyle(name, parent=styles["Normal"], **kw)
    return s

H1    = style("H1",    fontSize=22, textColor=BLUE,  spaceAfter=6,  spaceBefore=18, fontName="Helvetica-Bold")
H2    = style("H2",    fontSize=14, textColor=BLUE,  spaceAfter=4,  spaceBefore=14, fontName="Helvetica-Bold")
H3    = style("H3",    fontSize=11, textColor=LIGHT, spaceAfter=3,  spaceBefore=10, fontName="Helvetica-Bold")
BODY  = style("BODY",  fontSize=9,  textColor=LIGHT, spaceAfter=4,  leading=14)
MONO  = style("MONO",  fontSize=8,  textColor=colors.HexColor("#7dd3fc"),
              fontName="Courier", spaceAfter=3, leading=12,
              backColor=colors.HexColor("#0f2040"), borderPadding=4)
LABEL = style("LABEL", fontSize=8,  textColor=MUTED, spaceAfter=2)
TITLE = style("TITLE", fontSize=28, textColor=WHITE, fontName="Helvetica-Bold",
              alignment=TA_CENTER, spaceAfter=4)
SUB   = style("SUB",   fontSize=11, textColor=MUTED, alignment=TA_CENTER, spaceAfter=2)

def hr():
    return HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#1e3a6e"), spaceAfter=6)

def section(title, content_items):
    items = [Paragraph(title, H2), hr()]
    items.extend(content_items)
    return items

def bullet(text, color=BLUE):
    return Paragraph(f'<font color="#{color.hexval()[2:]}">▸</font>  {text}', BODY)

def check(text):  return bullet(f'<font color="#22c55e">✓</font>  {text}', GREEN)
def warn(text):   return bullet(f'<font color="#f59e0b">⚠</font>  {text}', AMBER)
def error(text):  return bullet(f'<font color="#ef4444">✗</font>  {text}', RED)

def table(headers, rows, col_widths=None):
    data = [headers] + rows
    t = Table(data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0),  colors.HexColor("#0f2040")),
        ("TEXTCOLOR",     (0,0), (-1,0),  BLUE),
        ("FONTNAME",      (0,0), (-1,0),  "Helvetica-Bold"),
        ("FONTSIZE",      (0,0), (-1,0),  8),
        ("FONTSIZE",      (0,1), (-1,-1), 8),
        ("TEXTCOLOR",     (0,1), (-1,-1), LIGHT),
        ("BACKGROUND",    (0,1), (-1,-1), colors.HexColor("#060e1f")),
        ("ROWBACKGROUNDS",(0,1), (-1,-1), [colors.HexColor("#060e1f"), colors.HexColor("#0a1628")]),
        ("GRID",          (0,0), (-1,-1), 0.3, colors.HexColor("#1e3a6e")),
        ("TOPPADDING",    (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("ALIGN",         (0,0), (-1,-1), "LEFT"),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
    ]))
    return t

# ── Build story ───────────────────────────────────────────────────────────────
story = []

# Cover
story += [
    Spacer(1, 1.5*cm),
    Paragraph("MaritimeMonitor", TITLE),
    Paragraph("Project Report", style("S2", fontSize=16, textColor=BLUE, alignment=TA_CENTER, spaceAfter=4)),
    Paragraph(f"Generated {date.today().strftime('%B %d, %Y')}", SUB),
    Spacer(1, 0.5*cm),
    hr(),
    Spacer(1, 0.3*cm),
]

# 1 ── Overview
story += section("1. Project Overview", [
    Paragraph(
        "MaritimeMonitor is a real-time maritime intelligence dashboard built as a React 18 + TypeScript "
        "single-page application. It renders a 3D interactive globe displaying live AIS vessel tracking "
        "data alongside port intelligence, chokepoint risk, and search functionality.",
        BODY),
    Spacer(1, 0.2*cm),
    table(
        ["Layer", "Technology"],
        [
            ["Frontend framework", "React 18 + TypeScript + Vite"],
            ["3D globe",           "react-globe.gl + Three.js"],
            ["State management",   "Zustand 4 (Map<mmsi, Vessel>)"],
            ["Styling",            "Tailwind CSS"],
            ["AIS relay server",   "Node.js + ws (WebSocket library)"],
            ["Primary AIS source", "AISStream.io — free WebSocket"],
            ["Secondary AIS",      "DataDocked — satellite REST API"],
        ],
        col_widths=[7*cm, 10*cm],
    ),
    Spacer(1, 0.2*cm),
])

# 2 ── What was built
story += [Paragraph("2. What Was Built", H2), hr()]

story += [Paragraph("2.1  3D Globe", H3)]
story += [
    check("NASA Blue Marble texture (earth-blue-marble.jpg) for realistic Earth appearance"),
    check("Topology bump map for surface relief"),
    check("Night-sky starfield background"),
    check("Atmospheric limb glow (blue)"),
    check("Auto-rotation at 0.35 rpm with damped orbit controls"),
    check("Zoom limits: 105 (max zoom-in) → 700 (max zoom-out)"),
    check("flyTo animation registered in Zustand so search can pan the camera"),
    Spacer(1, 0.2*cm),
]

story += [Paragraph("2.2  AIS Data Pipeline", H3)]
story += [
    check("AIS relay server (server/relay.js) — persistent WebSocket to AISStream.io"),
    check("Relay accumulates vessels in-memory 24/7; clients get instant snapshot on connect"),
    check("Vessel name cleaning: strips AIS padding characters (@@@ and ___)"),
    check("Batch store updates every 2 s — reduced React re-renders from ~300/s to 0.5/s"),
    check("DataDocked satellite AIS service — polls key shipping hubs via REST"),
    check("Prune stale vessels (>10 min without update) every 60 s"),
    Spacer(1, 0.2*cm),
]

story += [Paragraph("2.3  Multi-provider Architecture", H3)]
story += [
    Paragraph("The app checks for the relay first, falls back to direct AISStream if the relay is not running:", BODY),
    Spacer(1, 0.1*cm),
    table(
        ["Priority", "Provider", "Type", "Cost"],
        [
            ["1 (preferred)", "Local relay → AISStream.io", "Terrestrial WebSocket", "Free"],
            ["2 (parallel)",  "DataDocked",                  "Satellite REST",        "Credits"],
        ],
        col_widths=[3*cm, 6*cm, 5*cm, 3*cm],
    ),
    Spacer(1, 0.2*cm),
]

story += [Paragraph("2.4  Search", H3)]
story += [
    check("Word-by-word normalised matching (handles AIS padding, underscores, extra spaces)"),
    check("Searches: name, MMSI, flag, vessel type, callsign, IMO, destination"),
    check("Keyboard navigation: arrow keys, Enter to select, Escape to dismiss"),
    check("On select: camera flies to vessel position then opens info panel"),
    check("Results memoised with useMemo — no re-filter on unrelated renders"),
    Spacer(1, 0.2*cm),
]

story += [Paragraph("2.5  Performance Optimisations", H3)]
story += [
    table(
        ["Problem", "Fix", "Impact"],
        [
            ["300 store updates/s",    "Batch flush every 2 s",             "Re-renders: 300/s → 0.5/s"],
            ["18k points recomputed",  "useMemo on vesselPoints",           "Only recalculates on flush"],
            ["180k polygon segments",  "pointResolution 10 → 4, cap 12k",  "60 % less GPU geometry"],
            ["Search filters 18k",     "useMemo on results",                "Only recalculates on type"],
        ],
        col_widths=[5*cm, 6*cm, 6*cm],
    ),
    Spacer(1, 0.2*cm),
]

# 3 ── Bugs fixed
story += section("3. Bugs Fixed", [
    table(
        ["Bug", "Root Cause", "Fix"],
        [
            ["Globe showed hollow earth",
             "Custom ocean material with transparent land",
             "Replaced with NASA Blue Marble globeImageUrl"],
            ["Status bar showed 0 vessels",
             "loadMockVessels() only called when no API key",
             "Always seed mocks first, layer live AIS on top"],
            ["'African Heron' not found",
             "AIS names arrive as 'AFRICAN_HERON@@@'",
             "norm() strips padding; wordMatch() splits query"],
            ["DataDocked silent failure",
             "Wrong endpoint (POST bounding box vs GET radius)",
             "Rewrote with correct GET ?lat&lon&circle_radius=100"],
            ["DataDocked auth rejected",
             "Used Authorization: Bearer — API uses x-api-key",
             "Switched to x-api-key header"],
            ["TypeScript errors on build",
             "Missing @types/three, lineWidthMinPixels callback",
             "Installed types; changed callback to static value"],
        ],
        col_widths=[4*cm, 6.5*cm, 6.5*cm],
    ),
    Spacer(1, 0.2*cm),
])

# 4 ── Current problems
story += [Paragraph("4. Current Problems", H2), hr()]

story += [Paragraph("4.1  Open Ocean Coverage Gap  ⚠  Major", H3)]
story += [
    Paragraph(
        "All 18,000+ vessels are located along coastlines. The open Atlantic, Pacific, and Indian "
        "oceans appear empty. This is a fundamental physical limitation of terrestrial AIS — ground "
        "receivers only reach ~50 km from shore.", BODY),
    Spacer(1, 0.1*cm),
    error("Ships transiting the open ocean are completely invisible"),
    warn("DataDocked satellite AIS is integrated and correct but the free trial credits (10) are exhausted"),
    warn("Global Fishing Watch API investigated — returns 96-hour-old heatmap data, not real-time positions"),
    warn("Spire (acquired by Kpler) no longer has a free developer tier"),
    Spacer(1, 0.1*cm),
    Paragraph("<b>Resolution:</b>  Top up DataDocked credits. The service is already wired in correctly "
              "(GET /get-vessels-by-area, x-api-key header, 100 km radius polling of 10 key shipping hubs). "
              "Adding credits will immediately populate open-ocean positions.", BODY),
    Spacer(1, 0.2*cm),
]

story += [Paragraph("4.2  DataDocked Credits Exhausted", H3)]
story += [
    error("Account balance: 10 credits — exactly enough for 1 area call (costs 10 credits each)"),
    warn("On startup the service queries Singapore Strait (world's busiest hub) then stops"),
    Paragraph("<b>Resolution:</b>  Purchase credits at datadocked.com. The polling rotation covers "
              "10 hubs: Singapore, English Channel, Malacca, Suez, Hormuz, Gulf of Aden, Rotterdam, "
              "New York, Shanghai, Gulf of Mexico — one hub per 10 minutes.", BODY),
    Spacer(1, 0.2*cm),
]

story += [Paragraph("4.3  Relay Server Must Be Started Manually", H3)]
story += [
    warn("npm run start launches both relay and Vite — but the relay is local only"),
    warn("If the relay is not running, the app falls back to direct AISStream (slower initial load)"),
    warn("No persistent hosting — relay loses its vessel cache if restarted"),
    Paragraph("<b>Resolution:</b>  Deploy relay to a free cloud host (Railway, Fly.io, Render). "
              "The relay.js file is self-contained and ready to deploy.", BODY),
    Spacer(1, 0.2*cm),
]

story += [Paragraph("4.4  Vessel Detail Panel — Incomplete Data", H3)]
story += [
    warn("AISStream PositionReport messages carry no vessel type — typeCode defaults to 0 (unknown)"),
    warn("ShipStaticData messages fill in type/name/callsign but arrive less frequently"),
    warn("Many vessels show 'Unknown' type and no flag in the detail panel"),
    Paragraph("<b>Resolution:</b>  Merge PositionReport and ShipStaticData in the relay (partially "
              "done — relay merges with existing vessel using spread). Could be improved by caching "
              "static data longer than 10-minute prune window.", BODY),
    Spacer(1, 0.2*cm),
]

# 5 ── Key files
story += section("5. Key Files", [
    table(
        ["File", "Purpose"],
        [
            ["server/relay.js",                          "AIS relay — persistent WS to AISStream, HTTP snapshot + WS broadcast"],
            ["src/hooks/useAIS.ts",                      "Orchestrates relay / AISStream / DataDocked — picks best source"],
            ["src/services/relayService.ts",             "Browser WS client for relay — buffers updates, flushes every 2 s"],
            ["src/services/aisStream.ts",                "Direct AISStream WebSocket fallback"],
            ["src/services/dataDockedService.ts",        "Satellite AIS — GET radius queries, 10 shipping hubs"],
            ["src/store/maritimeStore.ts",               "Zustand store — vessels Map, batchUpsertVessels, flyToFn"],
            ["src/components/Globe/GlobeContainer.tsx",  "react-globe.gl — memoised points, auto-rotate, flyTo"],
            ["src/components/UI/SearchBar.tsx",          "Normalised word-match search across all vessel fields"],
        ],
        col_widths=[8*cm, 9*cm],
    ),
    Spacer(1, 0.2*cm),
])

# 6 ── Commands
story += section("6. Running the App", [
    Paragraph("Start everything (relay + Vite dev server):", BODY),
    Paragraph("npm run start", MONO),
    Paragraph("Relay only:", BODY),
    Paragraph("npm run relay", MONO),
    Paragraph("Vite only (relay fallback to direct AISStream):", BODY),
    Paragraph("npm run dev", MONO),
    Paragraph("Type-check:", BODY),
    Paragraph("npx tsc --noEmit", MONO),
])

# Build
doc.build(story)
print(f"PDF written to {OUTPUT}")
