"use strict";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { JobPortalPublic } from "./JobPortal";
import { JobPortalAuth } from "./JobPortalAuth";
import { JobPortalApplicantView } from "./JobPortalApplicantView";
import { JobPortalRecruiterView } from "./JobPortalRecruiterView";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import API from "./services/api";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
const C = {
  bg: "#09090f",
  sidebar: "#0c0c18",
  card: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.08)",
  purple: "#7c6af7",
  purpleL: "#a090ff",
  purpleDim: "rgba(124,106,247,0.18)",
  green: "#4ade80",
  greenDim: "rgba(74,222,128,0.15)",
  pink: "#f472b6",
  orange: "#fb923c",
  yellow: "#facc15",
  red: "#f87171",
  text: "#f0f0fa",
  textMid: "#9090b8",
  textDim: "#5a5a80",
  border: "rgba(255,255,255,0.07)"
};
const Icon = {
  dashboard: <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".85" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".85" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".85" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".85" />
    </svg>,
  transactions: <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
  budgets: <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4v4l3 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
  reports: <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 12L6 8l3 2 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  settings: <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
  bell: <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2a4.5 4.5 0 0 0-4.5 4.5V10l-1 1.5h11L12.5 10V6.5A4.5 4.5 0 0 0 8 2ZM6.5 13.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>,
  search: <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>,
  plus: <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>,
  upload: <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 9V2M4 5l3-3 3 3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  google: <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>,
  apple: <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor">
      <path d="M14.045 9.578c-.02-2.015 1.645-2.989 1.72-3.04-1.18-.972-2.614-.994-2.614-.994-.994.13-1.944.995-2.446.995-.502 0-1.28-.97-2.097-.944-1.076.026-2.07.636-2.627 1.62-2.123 3.67-.543 9.12 1.548 12.099 1.026 1.464 2.233 3.105 3.826 3.047 1.54-.06 2.124-.99 3.99-.99 1.867 0 2.396.99 4.028.958 1.654-.03 2.7-1.49 3.713-2.96.726-1.04.97-1.548 1.515-2.71-3.99-1.52-4.625-7.182-4.556-7.08ZM12.01 3.7c.85-1.03 1.424-2.46 1.268-3.885-1.225.052-2.71.82-3.587 1.852-.79.91-1.47 2.37-1.285 3.764 1.365.105 2.752-.69 3.604-1.73Z" />
    </svg>
};
function Card({ children, style = {} }) {
  return <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, ...style }}>
      {children}
    </div>;
}
function Badge({ status }) {
  const map = {
    Completed: ["rgba(74,222,128,0.15)", "#4ade80"],
    Pending: ["rgba(250,204,21,0.15)", "#facc15"],
    Failed: ["rgba(248,113,113,0.15)", "#f87171"],
    Revenue: ["rgba(74,222,128,0.15)", "#4ade80"]
  };
  const [bg, color] = map[status] ?? ["rgba(255,255,255,0.08)", C.textMid];
  return <span style={{ padding: "3px 10px", background: bg, color, borderRadius: 20, fontSize: "0.7rem", fontWeight: 600 }}>
      • {status}
    </span>;
}
function ProgressBar({ pct, color = C.purple, warn = false }) {
  const c = warn && pct > 100 ? C.red : pct > 85 ? C.orange : color;
  return <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: c, borderRadius: 4, transition: "width 0.4s" }} />
    </div>;
}
const NAV = [
  { id: "overview", label: "Dashboard", icon: Icon.dashboard },
  { id: "transactions", label: "Transactions", icon: Icon.transactions },
  { id: "budgets", label: "Budgets", icon: Icon.budgets },
  { id: "reports", label: "Reports", icon: Icon.reports },
  { id: "settings", label: "Settings", icon: Icon.settings }
];
function Sidebar({ page, setPage, onSignOut }) {
  return <aside style={{ width: 220, flexShrink: 0, background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif" }}>
      {
    /* Logo */
  }
      <div style={{ padding: "24px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #7c6af7, #4ade80)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fillOpacity="0.9" />
              <path d="M8 6L11 7.5V10.5L8 12L5 10.5V7.5L8 6Z" fill="white" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: C.text, lineHeight: 1.2 }}>Obsidian</div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: C.text, lineHeight: 1.2 }}>Analytics</div>
            <div style={{ fontSize: "0.6rem", color: C.purple, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2 }}>Premium Tier</div>
          </div>
        </div>
      </div>

      {
    /* Nav */
  }
      <nav style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map(({ id, label, icon }) => {
    const active = page === id;
    return <button
      key={id}
      onClick={() => setPage(id)}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? C.purpleDim : "transparent", color: active ? C.purpleL : C.textDim, fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: active ? 600 : 400, transition: "all 0.15s", textAlign: "left", width: "100%" }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
              <span style={{ color: active ? C.purple : C.textDim, display: "flex" }}>{icon}</span>
              {label}
            </button>;
  })}
      </nav>

      {
    /* Bottom */
  }
      <div style={{ padding: "12px" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(124,106,247,0.25), rgba(74,222,128,0.15))", border: `1px solid ${C.purpleDim}`, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ fontSize: "0.72rem", color: C.textMid, marginBottom: 6 }}>Free plan — 3/5 accounts</div>
          <ProgressBar pct={60} />
          <button style={{ marginTop: 10, width: "100%", padding: "7px", borderRadius: 8, background: C.purple, color: "#fff", border: "none", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
            ↑ Upgrade Plan
          </button>
        </div>
        {[{ label: "Help" }, { label: "Sign Out" }].map(({ label }) => <button
    key={label}
    onClick={label === "Sign Out" ? onSignOut : void 0}
    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", background: "transparent", border: "none", color: C.textDim, fontSize: "0.82rem", cursor: "pointer", borderRadius: 8, fontFamily: "'DM Sans', sans-serif" }}
  >
            {label}
          </button>)}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginTop: 4 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #7c6af7, #4ade80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>JD</div>
          <div>
            <div style={{ fontSize: "0.8rem", color: C.text, fontWeight: 500 }}>Jane Doe</div>
            <div style={{ fontSize: "0.68rem", color: C.textDim }}>jane@obsidian.io</div>
          </div>
        </div>
      </div>
    </aside>;
}
function Header({ title, children }) {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.75rem", color: C.text, margin: 0 }}>{title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "7px 12px" }}>
          <span style={{ color: C.textDim }}>{Icon.search}</span>
          <input placeholder="Search reports..." style={{ background: "none", border: "none", outline: "none", color: C.textMid, fontSize: "0.82rem", width: 140, fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        <button style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "7px 10px", color: C.textMid, cursor: "pointer", display: "flex" }}>{Icon.bell}</button>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7c6af7, #4ade80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#fff", cursor: "pointer" }}>JD</div>
        {children}
      </div>
    </div>;
}
const cashFlowData = [
  { m: "Jan", income: 431600, expenses: 315400 },
  { m: "Feb", income: 398400, expenses: 340300 },
  { m: "Mar", income: 514600, expenses: 298800 },
  { m: "Apr", income: 481400, expenses: 348600 },
  { m: "May", income: 589300, expenses: 323700 },
  { m: "Jun", income: 539500, expenses: 365200 },
  { m: "Jul", income: 680600, expenses: 340300 },
  { m: "Aug", income: 630800, expenses: 307100 },
  { m: "Sep", income: 738700, expenses: 381800 },
  { m: "Oct", income: 763600, expenses: 348600 },
  { m: "Nov", income: 722100, expenses: 423300 }
];
const catData = [
  { name: "Housing", value: 45, color: "#7c6af7" },
  { name: "Food & Dining", value: 25, color: "#4ade80" },
  { name: "Transport", value: 15, color: "#f472b6" },
  { name: "Entertainment", value: 15, color: "#fb923c" }
];
const RECENT_TX = [
  { name: "AWS Services", cat: "Infrastructure", amt: -103335, status: "Completed", date: "Oct 24" },
  { name: "Google Ads", cat: "Marketing", amt: -71380, status: "Pending", date: "Oct 23" },
  { name: "Stripe Payout", cat: "Revenue", amt: 1178600, status: "Completed", date: "Oct 22" }
];
function OverviewPage() {
  const [cashTab, setCashTab] = useState("monthly");
  const STATS_TOP = [
    { label: "Total Balance", value: "₹1,03,41,136.00", delta: "+2.4% from last month" },
    { label: "Monthly Spending", value: "₹7,01,370.75", delta: "+3.1% from last month" },
    { label: "Total Savings", value: "₹37,51,600.00", delta: "+1.2% from last month" },
    { label: "Budget Health", value: "85/100", delta: "Excellent", special: true }
  ];
  return <div>
      <Header title="Financial Overview">
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "rgba(124,106,247,0.15)", border: `1px solid ${C.purpleDim}`, borderRadius: 10, color: C.purpleL, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
          ↑ Export Report
        </button>
      </Header>

      {
    /* Stat cards */
  }
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {STATS_TOP.map((s) => <Card key={s.label} style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: "0.68rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: s.special ? "1.5rem" : "1.35rem", fontWeight: 700, color: C.text, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: "0.72rem", color: s.special ? C.green : C.textMid }}>{s.delta}</div>
          </Card>)}
      </div>

      {
    /* Cash flow + Category */
  }
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14, marginBottom: 20 }}>
        <Card style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: "0.8rem", color: C.textMid, marginBottom: 2 }}>Cash Flow</div>
              <div style={{ fontSize: "0.72rem", color: C.textDim }}>Income vs Expenses over time</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["monthly", "quarterly"].map((t) => <button key={t} onClick={() => setCashTab(t)} style={{ padding: "4px 10px", borderRadius: 7, fontSize: "0.72rem", fontWeight: 600, textTransform: "capitalize", background: cashTab === t ? C.purpleDim : "transparent", color: cashTab === t ? C.purpleL : C.textDim, border: cashTab === t ? `1px solid rgba(124,106,247,0.3)` : "1px solid transparent", cursor: "pointer" }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>)}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={cashFlowData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c6af7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c6af7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="m" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1e5).toFixed(1)}L`} />
              <Tooltip contentStyle={{ background: "#1a1a2e", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: "0.78rem", color: C.text }} />
              <Area type="monotone" dataKey="income" stroke={C.green} strokeWidth={2} fill="url(#incomeGrad)" dot={false} />
              <Area type="monotone" dataKey="expenses" stroke={C.purple} strokeWidth={2} fill="url(#expGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
            {[{ label: "Income", color: C.green }, { label: "Expenses", color: C.purple }].map((l) => <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", color: C.textMid }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                {l.label}
              </div>)}
          </div>
        </Card>

        <Card style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: "0.8rem", color: C.textMid, marginBottom: 2 }}>Category Breakdown</div>
          <div style={{ fontSize: "0.72rem", color: C.textDim, marginBottom: 14 }}>Top spending areas this month</div>
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={catData} innerRadius={48} outerRadius={72} dataKey="value" stroke="none">
                  {catData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
              <div style={{ fontSize: "0.65rem", color: C.textDim }}>TOTAL</div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: C.text }}>₹6.97L</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            {catData.map((d) => <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.75rem", color: C.textMid }}>{d.name}</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: C.text, fontWeight: 600 }}>{d.value}%</span>
              </div>)}
          </div>
          <button style={{ marginTop: 14, width: "100%", padding: "7px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMid, fontSize: "0.75rem", cursor: "pointer" }}>View All</button>
        </Card>
      </div>

      {
    /* Recent transactions */
  }
      <Card style={{ padding: "18px 20px" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: C.text, marginBottom: 14 }}>Recent Transactions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RECENT_TX.map((tx) => <div key={tx.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: tx.amt > 0 ? C.greenDim : C.purpleDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: tx.amt > 0 ? C.green : C.purple, fontWeight: 700 }}>
                  {tx.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: "0.82rem", color: C.text, fontWeight: 500 }}>{tx.name}</div>
                  <div style={{ fontSize: "0.7rem", color: C.textDim }}>{tx.cat} · {tx.date}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Badge status={tx.status} />
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: tx.amt > 0 ? C.green : C.text, minWidth: 80, textAlign: "right" }}>
                  {tx.amt > 0 ? "+" : ""}{tx.amt.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>)}
        </div>
      </Card>
    </div>;
}
const ALL_TX = [
  { date: "Oct 24, 2023", name: "AWS Services", cat: "Infrastructure", status: "Completed", amt: -103335 },
  { date: "Oct 23, 2023", name: "Google Ads", cat: "Marketing", status: "Pending", amt: -71380 },
  { date: "Oct 22, 2023", name: "Stripe Payout", cat: "Revenue", status: "Completed", amt: 1178600 },
  { date: "Oct 20, 2023", name: "Adobe Creative Cloud", cat: "Software", status: "Failed", amt: -4564 },
  { date: "Oct 18, 2023", name: "Gusto Payroll", cat: "Payroll", status: "Completed", amt: -701350 },
  { date: "Oct 15, 2023", name: "Spotify Premium", cat: "Subscription", status: "Completed", amt: -829 },
  { date: "Oct 12, 2023", name: "Whole Foods", cat: "Groceries", status: "Completed", amt: -5594 },
  { date: "Oct 10, 2023", name: "Client Invoice #204", cat: "Revenue", status: "Completed", amt: 564400 }
];
function TransactionsPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "In", "Out"];
  return <div>
      <Header title="Transactions Directory">
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: C.purple, border: "none", borderRadius: 10, color: "#fff", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
          {Icon.plus} New Transaction
        </button>
      </Header>

      {
    /* Filters */
  }
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMid, fontSize: "0.78rem", cursor: "pointer" }}>Last 30 Days ▾</button>
        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMid, fontSize: "0.78rem", cursor: "pointer" }}>All Categories ▾</button>
        <div style={{ display: "flex", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
          {filters.map((f) => <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 12px", background: filter === f ? C.purpleDim : "transparent", color: filter === f ? C.purpleL : C.textDim, border: "none", fontSize: "0.78rem", fontWeight: filter === f ? 600 : 400, cursor: "pointer" }}>{f}</button>)}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button style={{ padding: "6px 12px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMid, fontSize: "0.78rem", cursor: "pointer" }}>↑ Export</button>
        </div>
      </div>

      {
    /* Table */
  }
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Date \u2191", "Description", "Category", "Status", "Amount"].map((h) => <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: "0.7rem", color: C.textDim, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {ALL_TX.filter((tx) => filter === "All" || (filter === "In" ? tx.amt > 0 : tx.amt < 0)).map((tx, i) => <tr
    key={i}
    style={{ borderBottom: `1px solid ${C.border}` }}
    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
  >
                <td style={{ padding: "13px 18px", fontSize: "0.82rem", color: C.textMid }}>{tx.date}</td>
                <td style={{ padding: "13px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: tx.amt > 0 ? C.greenDim : C.purpleDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 700, color: tx.amt > 0 ? C.green : C.purple, flexShrink: 0 }}>
                      {tx.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{ fontSize: "0.82rem", color: C.text, fontWeight: 500 }}>{tx.name}</span>
                  </div>
                </td>
                <td style={{ padding: "13px 18px", fontSize: "0.8rem", color: C.textMid }}>{tx.cat}</td>
                <td style={{ padding: "13px 18px" }}><Badge status={tx.status} /></td>
                <td style={{ padding: "13px 18px", fontSize: "0.875rem", fontWeight: 700, color: tx.amt > 0 ? C.green : C.text, textAlign: "right" }}>
                  {tx.amt > 0 ? "+" : ""}{tx.amt.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                </td>
              </tr>)}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.75rem", color: C.textDim }}>Showing 1 to 8 of 124 results</span>
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, "\u2026"].map((p, i) => <button key={i} style={{ width: 28, height: 28, borderRadius: 7, background: p === 1 ? C.purpleDim : "transparent", border: p === 1 ? `1px solid rgba(124,106,247,0.4)` : `1px solid ${C.border}`, color: p === 1 ? C.purpleL : C.textDim, fontSize: "0.75rem", cursor: "pointer" }}>{p}</button>)}
          </div>
        </div>
      </Card>
    </div>;
}
const ALLOCATIONS = [
  { name: "Housing & Rent", type: "Fixed Expense", icon: "🏠", budget: 290500, spent: 265600, color: C.purple },
  { name: "Dining & Food", type: "Variable Expense", icon: "🍽", budget: 124500, spent: 70550, color: C.green },
  { name: "Transportation", type: "Variable Expense", icon: "🚗", budget: 66400, spent: 19920, color: C.orange },
  { name: "Entertainment", type: "Discretionary", icon: "🎮", budget: 41500, spent: 51460, color: C.pink }
];
function BudgetsPage() {
  const totalBudget = 15e3 * 83;
  const totalSpent = 12450 * 83;
  const pct = Math.round(totalSpent / totalBudget * 100);
  return <div>
      <Header title="Budget Management">
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: C.purple, border: "none", borderRadius: 10, color: "#fff", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
          {Icon.plus} Create New Budget
        </button>
      </Header>

      {
    /* Summary */
  }
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
        <Card style={{ padding: "20px 22px" }}>
          <div style={{ fontSize: "0.68rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Total Monthly Budget</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: "2rem", fontWeight: 700, color: C.text, fontFamily: "'DM Serif Display', serif" }}>₹{totalSpent.toLocaleString("en-IN")}.00</span>
            <span style={{ fontSize: "0.9rem", color: C.textDim }}>/ ₹{totalBudget.toLocaleString("en-IN")}.00</span>
          </div>
          <ProgressBar pct={pct} warn />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: "0.72rem", color: C.textDim }}>{pct}% Used</span>
            <span style={{ fontSize: "0.72rem", color: C.green }}>₹{(totalBudget - totalSpent).toLocaleString("en-IN")} Remaining</span>
          </div>
        </Card>
        <Card style={{ padding: "20px 22px" }}>
          <div style={{ fontSize: "0.68rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Over Budget</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: C.red }}>2 Categories</div>
          <div style={{ fontSize: "0.72rem", color: C.textDim, marginTop: 4 }}>Entertainment exceeded limit</div>
        </Card>
        <Card style={{ padding: "20px 22px" }}>
          <div style={{ fontSize: "0.68rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Savings Rate</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: C.green }}>17.5%</div>
          <div style={{ fontSize: "0.72rem", color: C.textDim, marginTop: 4 }}>+2.1% from last month</div>
        </Card>
      </div>

      {
    /* Allocations */
  }
      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: C.text, marginBottom: 14 }}>Active Allocations</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {ALLOCATIONS.map((a) => {
    const p = Math.round(a.spent / a.budget * 100);
    const over = p > 100;
    return <Card key={a.name} style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>{a.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: C.text }}>{a.name}</div>
                    <div style={{ fontSize: "0.68rem", color: C.textDim }}>{a.type}</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: over ? C.red : C.text, marginBottom: 8 }}>
                ₹{a.spent.toLocaleString("en-IN")}
                <span style={{ fontSize: "0.75rem", color: C.textDim, fontWeight: 400 }}> of ₹{a.budget.toLocaleString("en-IN")}</span>
              </div>
              <ProgressBar pct={p} color={a.color} warn />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: "0.68rem", color: over ? C.red : C.textDim }}>{p}% {over ? "\u2014 Exceeded" : "Used"}</span>
                <span style={{ fontSize: "0.68rem", color: over ? C.red : C.green }}>
                  {over ? `-₹${(a.spent - a.budget).toLocaleString("en-IN")} Over` : `₹${(a.budget - a.spent).toLocaleString("en-IN")} Remaining`}
                </span>
              </div>
            </Card>;
  })}
        {
    /* Add card */
  }
        <Card style={{ padding: "18px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", minHeight: 140, opacity: 0.6 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px dashed ${C.textDim}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim }}>{Icon.plus}</div>
          <span style={{ fontSize: "0.8rem", color: C.textDim }}>Create Allocation</span>
        </Card>
      </div>
    </div>;
}
const netWorthData = [
  { m: "Feb", v: 28e4 * 83 },
  { m: "Mar", v: 31e4 * 83 },
  { m: "Apr", v: 42e4 * 83 },
  { m: "May", v: 39e4 * 83 },
  { m: "Jun", v: 48e4 * 83 },
  { m: "Jul", v: 56e4 * 83 },
  { m: "Aug", v: 62e4 * 83 },
  { m: "Sep", v: 74e4 * 83 },
  { m: "Oct", v: 82e4 * 83 },
  { m: "Nov", v: 98e4 * 83 },
  { m: "Dec", v: 1245890 * 83 }
];
const barData = [
  { m: "Jan", income: 431600, expenses: 315400 },
  { m: "Feb", income: 398400, expenses: 340300 },
  { m: "Mar", income: 514600, expenses: 298800 },
  { m: "Apr", income: 481400, expenses: 348600 },
  { m: "May", income: 589300, expenses: 323700 },
  { m: "Jun", income: 539500, expenses: 365200 },
  { m: "Jul", income: 680600, expenses: 340300 },
  { m: "Aug", income: 630800, expenses: 307100 },
  { m: "Sep", income: 738700, expenses: 381800 },
  { m: "Oct", income: 763600, expenses: 348600 },
  { m: "Nov", income: 722100, expenses: 423300 },
  { m: "Dec", income: 780200, expenses: 398400 }
];
const ytdCat = [
  { name: "Housing", value: 38, color: C.purple },
  { name: "Food", value: 22, color: C.green },
  { name: "Transport", value: 18, color: C.orange },
  { name: "Entertainment", value: 14, color: C.pink },
  { name: "Other", value: 8, color: "#60a5fa" }
];
function ReportsPage() {
  const [tab, setTab] = useState("Monthly");
  return <div>
      <Header title="Financial Reports">
        <div style={{ display: "flex", gap: 6 }}>
          {["Monthly", "Quarterly", "Annually"].map((t) => <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: "0.78rem", fontWeight: tab === t ? 600 : 400, background: tab === t ? C.purpleDim : C.card, border: `1px solid ${tab === t ? "rgba(124,106,247,0.35)" : C.border}`, color: tab === t ? C.purpleL : C.textMid, cursor: "pointer" }}>{t}</button>)}
          <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: C.purpleDim, border: `1px solid rgba(124,106,247,0.35)`, borderRadius: 8, color: C.purpleL, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
            {Icon.upload} Export
          </button>
        </div>
      </Header>

      {
    /* Net worth + Donut */
  }
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card style={{ padding: "20px 22px" }}>
          <div style={{ fontSize: "0.75rem", color: C.textDim, marginBottom: 4 }}>Net Worth Over Time</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: C.text, fontFamily: "'DM Serif Display', serif", marginBottom: 16 }}>₹10,34,08,870.00</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={netWorthData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="nwGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c6af7" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="m" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1e5).toFixed(1)}L`} />
              <Tooltip contentStyle={{ background: "#1a1a2e", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: "0.78rem", color: C.text }} />
              <Line type="monotone" dataKey="v" stroke="url(#nwGrad)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ padding: "20px 22px" }}>
          <div style={{ fontSize: "0.75rem", color: C.textDim, marginBottom: 14 }}>YTD Spending by Category</div>
          <div style={{ display: "flex", justifyContent: "center", position: "relative", marginBottom: 14 }}>
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={ytdCat} innerRadius={44} outerRadius={66} dataKey="value" stroke="none">
                  {ytdCat.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {ytdCat.map((d) => <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                <span style={{ fontSize: "0.75rem", color: C.textMid, flex: 1 }}>{d.name}</span>
                <span style={{ fontSize: "0.75rem", color: C.text, fontWeight: 600 }}>{d.value}%</span>
              </div>)}
          </div>
        </Card>
      </div>

      {
    /* Monthly cash flow bar */
  }
      <Card style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: "0.8rem", color: C.textMid }}>Monthly Cash Flow</div>
          <div style={{ display: "flex", gap: 12 }}>
            {[{ label: "Income", color: C.green }, { label: "Expenses", color: C.purple }].map((l) => <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", color: C.textMid }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                {l.label}
              </div>)}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={barData} barGap={3} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="m" tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.textDim, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1e5).toFixed(1)}L`} />
            <Tooltip contentStyle={{ background: "#1a1a2e", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: "0.78rem", color: C.text }} />
            <Bar dataKey="income" fill={C.green} radius={[4, 4, 0, 0]} opacity={0.85} barSize={10} />
            <Bar dataKey="expenses" fill={C.purple} radius={[4, 4, 0, 0]} opacity={0.75} barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>;
}
const SETTING_TABS = [
  { id: "profile", label: "Profile", icon: "\u{1F464}" },
  { id: "security", label: "Security", icon: "\u{1F512}" },
  { id: "notifications", label: "Notifications", icon: "\u{1F514}" },
  { id: "billing", label: "Billing", icon: "\u{1F4B3}" },
  { id: "connected", label: "Connected Accounts", icon: "\u{1F517}" }
];
function SettingsPage() {
  const [stab, setStab] = useState("profile");
  const [fname, setFname] = useState("Elena");
  const [lname, setLname] = useState("Vance");
  const [email, setEmail] = useState("elena.vance@obsidian.io");
  const inp = (val, onChange, placeholder = "") => <input
    value={val}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{ width: "100%", background: "#13131f", border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 13px", color: C.text, fontSize: "0.875rem", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
    onFocus={(e) => e.target.style.borderColor = "rgba(124,106,247,0.55)"}
    onBlur={(e) => e.target.style.borderColor = C.border}
  />;
  return <div>
      <Header title="Settings" />

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 14 }}>
        {
    /* Left tabs */
  }
        <Card style={{ padding: "10px 8px", alignSelf: "start" }}>
          {SETTING_TABS.map((t) => <button key={t.id} onClick={() => setStab(t.id)} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 12px", borderRadius: 9, background: stab === t.id ? C.purpleDim : "transparent", color: stab === t.id ? C.purpleL : C.textMid, border: "none", fontSize: "0.82rem", fontWeight: stab === t.id ? 600 : 400, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", marginBottom: 2 }}>
              <span style={{ fontSize: "0.85rem" }}>{t.icon}</span>{t.label}
            </button>)}
        </Card>

        {
    /* Right content */
  }
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {
    /* Avatar */
  }
          <Card style={{ padding: "22px 24px" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: C.text, marginBottom: 16 }}>Profile Picture</div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #7c6af7, #4ade80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>EV</div>
              <div>
                <div style={{ fontSize: "0.78rem", color: C.textDim, marginBottom: 10 }}>PNG, JPG or GIF up to 1MB. A square image is recommended.</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ padding: "7px 14px", background: C.purple, border: "none", borderRadius: 8, color: "#fff", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>Upload New</button>
                  <button style={{ padding: "7px 14px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMid, fontSize: "0.78rem", cursor: "pointer" }}>Remove</button>
                </div>
              </div>
            </div>
          </Card>

          {
    /* Personal info */
  }
          <Card style={{ padding: "22px 24px" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: C.text, marginBottom: 18 }}>Personal Information</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>First Name</label>
                {inp(fname, setFname, "First name")}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Last Name</label>
                {inp(lname, setLname, "Last name")}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Email Address</label>
              {inp(email, setEmail, "Email")}
              <div style={{ fontSize: "0.7rem", color: C.textDim, marginTop: 5 }}>This email will be used for all account communication.</div>
            </div>
          </Card>

          {
    /* Regional */
  }
          <Card style={{ padding: "22px 24px" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: C.text, marginBottom: 18 }}>Regional Preferences</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[{ label: "Base Currency", val: "INR \u2013 Indian Rupee" }, { label: "Language", val: "English (IN)" }].map((f) => <div key={f.label}>
                  <label style={{ display: "block", fontSize: "0.72rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{f.label}</label>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#13131f", border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 13px", cursor: "pointer" }}>
                    <span style={{ fontSize: "0.875rem", color: C.text }}>{f.val}</span>
                    <span style={{ color: C.textDim, fontSize: "0.8rem" }}>▾</span>
                  </div>
                </div>)}
            </div>
          </Card>

          {
    /* Actions */
  }
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={{ padding: "9px 20px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 9, color: C.textMid, fontSize: "0.85rem", cursor: "pointer" }}>Discard Changes</button>
            <button style={{ padding: "9px 20px", background: C.purple, border: "none", borderRadius: 9, color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Save Preferences</button>
          </div>
        </div>
      </div>
    </div>;
}
const TESTIMONIALS = [
  { quote: "SpendWise completely changed how I manage money. I cut unnecessary subscriptions by 40% in the first month.", name: "Priya Sharma", role: "Product Designer, Notion", tags: ["Personal Finance", "Budgeting"] },
  { quote: "The analytics dashboard gives me a real-time pulse on our startup's burn rate. Indispensable for founders.", name: "Marcus Cole", role: "Co-founder, Raycast", tags: ["Startup Finance", "Cash Flow"] }
];
function MiniChartRight() {
  const points = [40, 65, 50, 80, 60, 90, 75, 95];
  const max = Math.max(...points), min = Math.min(...points);
  const h = 48, w = 160, pad = 4;
  const coords = points.map((p, i) => {
    const x = pad + i / (points.length - 1) * (w - 2 * pad);
    const y = pad + (max - p) / (max - min) * (h - 2 * pad);
    return `${x},${y}`;
  });
  const path = `M ${coords.join(" L ")}`;
  const area = `${path} L ${w - pad},${h - pad} L ${pad},${h - pad} Z`;
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.35" /><stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#cg2)" />
      <path d={path} stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={coords[coords.length - 1].split(",")[0]} cy={coords[coords.length - 1].split(",")[1]} r="4" fill="#4ade80" />
    </svg>;
}
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [tIdx, setTIdx] = useState(0);
  const t = TESTIMONIALS[tIdx];
  const PREVIEW_STATS = [
    { label: "Total Balance", value: "₹40,08,153", delta: "+12.4%" },
    { label: "Monthly Spend", value: "₹3,18,886", delta: "-8.1%" },
    { label: "Investments", value: "₹17,92,800", delta: "+5.7%" }
  ];
  return <div className="min-h-screen flex" style={{ background: "#09090f", fontFamily: "'DM Sans', sans-serif" }}>
      {
    /* LEFT */
  }
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-2.5">
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #7c6af7, #4ade80)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fillOpacity="0.9" /><path d="M8 6L11 7.5V10.5L8 12L5 10.5V7.5L8 6Z" fill="white" /></svg>
            </div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" }}>SpendWise</span>
          </div>
        </div>
        <div className="mb-8">
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 2.75rem)", lineHeight: 1.15, color: "#f0f0fa", marginBottom: "0.75rem", margin: 0 }}>
            {mode === "login" ? "Welcome back!" : "Start tracking\nyour money."}
          </h1>
          <p style={{ color: "#7070a0", fontSize: "0.9375rem", lineHeight: 1.6, marginTop: 12, marginBottom: 0 }}>
            {mode === "login" ? "Sign in to access your financial dashboard and analytics." : "Join thousands managing expenses with clarity and confidence."}
          </p>
        </div>
        <form onSubmit={(e) => {
    e.preventDefault();
    onLogin();
  }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "signup" && <div>
              <label style={{ display: "block", fontSize: "0.8125rem", color: "#9090b8", marginBottom: 6, fontWeight: 500 }}>Full name</label>
              <input
    type="text"
    placeholder="Jane Doe"
    value={name}
    onChange={(e) => setName(e.target.value)}
    style={{ width: "100%", background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#e8e8f0", fontSize: "0.9375rem", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
    onFocus={(e) => e.target.style.borderColor = "rgba(124,106,247,0.6)"}
    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
  />
            </div>}
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", color: "#9090b8", marginBottom: 6, fontWeight: 500 }}>Email</label>
            <input
    type="email"
    placeholder="you@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    style={{ width: "100%", background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#e8e8f0", fontSize: "0.9375rem", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
    onFocus={(e) => e.target.style.borderColor = "rgba(124,106,247,0.6)"}
    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
  />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: "0.8125rem", color: "#9090b8", fontWeight: 500 }}>Password</label>
              {mode === "login" && <button type="button" style={{ fontSize: "0.8125rem", color: C.purple, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Forgot password?</button>}
            </div>
            <input
    type="password"
    placeholder={mode === "login" ? "Enter your password" : "Create a password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{ width: "100%", background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#e8e8f0", fontSize: "0.9375rem", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
    onFocus={(e) => e.target.style.borderColor = "rgba(124,106,247,0.6)"}
    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
  />
          </div>
          <button type="submit" style={{ marginTop: 4, width: "100%", padding: "12px", borderRadius: 10, background: "linear-gradient(135deg, #7c6af7 0%, #5b4de0 100%)", color: "#fff", fontWeight: 600, fontSize: "0.9375rem", border: "none", cursor: "pointer", letterSpacing: "0.01em" }}>
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: "0.8125rem", color: "#5a5a80" }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ icon: Icon.google, label: "Google" }, { icon: Icon.apple, label: "Apple" }].map(({ icon, label }) => <button key={label} type="button" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px", background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#c0c0e0", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer" }}>
              {icon}{label}
            </button>)}
        </div>
        <p style={{ marginTop: 24, textAlign: "center", fontSize: "0.875rem", color: "#5a5a80" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: C.purple, fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>

      {
    /* RIGHT */
  }
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(145deg, #0e0e20 0%, #16103a 40%, #0f1f18 100%)", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
        {
    /* Blobs */
  }
        <div style={{ position: "absolute", top: -80, right: -60, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,106,247,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 80, left: -40, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,222,128,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />

        {
    /* Floating window */
  }
        <div style={{ position: "relative", zIndex: 1, width: "88%", maxWidth: 400, background: "rgba(12,10,24,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)" }}>
          {
    /* Window chrome */
  }
          <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "#3a3a70", letterSpacing: "0.04em" }}>SpendWise Dashboard</span>
          </div>

          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {
    /* Stat cards */
  }
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9 }}>
              {PREVIEW_STATS.map((s) => <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 10, padding: 11 }}>
                  <div style={{ fontSize: "0.6rem", color: "#6060a0", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f0f0fa", marginBottom: 3 }}>{s.value}</div>
                  <span style={{ fontSize: "0.65rem", color: C.green, fontWeight: 600 }}>{s.delta}</span>
                </div>)}
            </div>

            {
    /* Chart card */
  }
            <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 11, padding: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#9090c0" }}>Spending trend</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0f0fa" }}>₹3,18,886 <span style={{ fontSize: "0.72rem", color: C.green }}>↓ 8.1%</span></div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {["1W", "1M", "3M"].map((tb, i) => <button key={tb} style={{ padding: "3px 7px", borderRadius: 5, fontSize: "0.65rem", fontWeight: 500, background: i === 1 ? C.purpleDim : "transparent", color: i === 1 ? C.purpleL : "#5050a0", border: i === 1 ? `1px solid rgba(124,106,247,0.4)` : "1px solid transparent", cursor: "pointer" }}>{tb}</button>)}
                </div>
              </div>
              <MiniChartRight />
              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                {[{ label: "Food & Drink", pct: "32%", color: C.purple }, { label: "Transport", pct: "18%", color: C.green }, { label: "Subscriptions", pct: "14%", color: C.pink }].map((c) => <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", background: "rgba(255,255,255,0.05)", borderRadius: 20 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.color }} />
                    <span style={{ fontSize: "0.65rem", color: "#8080c0" }}>{c.label}</span>
                    <span style={{ fontSize: "0.65rem", color: "#b0b0e0", fontWeight: 600 }}>{c.pct}</span>
                  </div>)}
              </div>
            </div>

            {
    /* Testimonial */
  }
            <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 11, padding: 13 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {t.tags.map((tag) => <span key={tag} style={{ padding: "2px 8px", background: C.purpleDim, border: `1px solid rgba(124,106,247,0.25)`, borderRadius: 20, fontSize: "0.62rem", color: C.purpleL, fontWeight: 500 }}>{tag}</span>)}
              </div>
              <p style={{ fontSize: "0.75rem", color: "#c0c0e8", lineHeight: 1.6, marginBottom: 10 }}>"{t.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#e8e8f8", fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: "0.65rem", color: "#5a5a90" }}>{t.role}</div>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {TESTIMONIALS.map((_, i) => <button key={i} onClick={() => setTIdx(i)} style={{ width: i === tIdx ? 16 : 6, height: 6, borderRadius: 3, background: i === tIdx ? C.purple : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
const PAGES = {
  overview: <OverviewPage />,
  transactions: <TransactionsPage />,
  budgets: <BudgetsPage />,
  reports: <ReportsPage />,
  settings: <SettingsPage />
};
function AppContent() {
  const { T } = useTheme();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState("overview");
  const [appMode, setAppMode] = useState(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const u = JSON.parse(saved);
      return u.role === "student" ? "applicant" : "recruiter";
    }
    if (sessionStorage.getItem("pending_apply_url")) {
      return "portal-auth";
    }
    return "portal";
  });
  const [authInitialMode, setAuthInitialMode] = useState("login");
  const [pendingJob, setPendingJob] = useState(null); // job selected by unauthenticated user
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      API.get("/user/me").then((res) => {
        if (res.data.success && res.data.user) {
          const u = res.data.user;
          localStorage.setItem("user", JSON.stringify(u));
          setUser(u);
          setAppMode(u.role === "student" ? "applicant" : "recruiter");
          const pendingUrl = sessionStorage.getItem("pending_apply_url");
          if (pendingUrl && /^https?:\/\//i.test(pendingUrl)) {
            sessionStorage.removeItem("pending_apply_url");
            setTimeout(() => {
              const opened = window.open(pendingUrl, "_blank", "noopener,noreferrer");
              if (!opened) window.location.href = pendingUrl;
            }, 100);
          }
        }
      }).catch(() => {
      });
    }
  }, []);
  const handleSignOut = async () => {
    try {
      await API.get("/user/logout");
    } catch (err) {
      console.error("Logout error", err);
    }
    localStorage.removeItem("user");
    sessionStorage.removeItem("pending_apply_url");
    setUser(null);
    setAppMode("portal");
  };
  const handleApplyExternalJob = (url, job) => {
    if (!url || !/^https?:\/\//i.test(url)) return;
    const currentUser = user || (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
    if (currentUser) {
      window.open(url, "_blank", "noopener,noreferrer") || (window.location.href = url);
      return;
    }
    try {
      sessionStorage.setItem("pending_apply_url", url);
    } catch (e) {
      console.error("Failed to set pending_apply_url in sessionStorage", e);
    }
    setPendingJob(job || null);
    setAuthInitialMode("login");
    setAppMode("portal-auth");
  };
  const handleAuthSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setAppMode(userData.role === "student" ? "applicant" : "recruiter");
    const pendingUrl = sessionStorage.getItem("pending_apply_url");
    if (pendingUrl && /^https?:\/\//i.test(pendingUrl)) {
      sessionStorage.removeItem("pending_apply_url");
      setTimeout(() => {
        const opened = window.open(pendingUrl, "_blank", "noopener,noreferrer");
        if (!opened) {
          window.location.href = pendingUrl;
        }
      }, 100);
    }
    // pendingJob is preserved and will be picked up by JobPortalApplicantView
  };
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1057421115865-dummyclientid.apps.googleusercontent.com";
  return <GoogleOAuthProvider clientId={googleClientId}>
      <div style={{ background: T.bg, color: T.text, minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", transition: "background-color 0.2s ease, color 0.15s ease" }}>
        <AnimatePresence mode="wait">
          {appMode === "portal" && <motion.div
    key="portal"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.28, ease: "easeInOut" }}
    style={{ width: "100%", minHeight: "100vh" }}
  >
              <JobPortalPublic
    onAuthClick={(mode) => {
      setAuthInitialMode(mode);
      setPendingJob(null);
      sessionStorage.removeItem("pending_apply_url");
      setAppMode("portal-auth");
    }}
    onSignInForJob={(job) => {
      setPendingJob(job);
      setAuthInitialMode("login");
      setAppMode("portal-auth");
    }}
    onApplyExternalJob={handleApplyExternalJob}
  />
            </motion.div>}
          
          {appMode === "portal-auth" && <motion.div
    key="portal-auth"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.28, ease: "easeInOut" }}
    style={{ width: "100%", minHeight: "100vh" }}
  >
              <JobPortalAuth
    initialMode={authInitialMode}
    onSuccess={handleAuthSuccess}
    onBack={() => {
      sessionStorage.removeItem("pending_apply_url");
      setAppMode("portal");
    }}
  />
            </motion.div>}

          {appMode === "applicant" && <motion.div
    key="applicant"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.28, ease: "easeInOut" }}
    style={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}
  >
              <JobPortalApplicantView
    onSignOut={handleSignOut}
    initialJobId={pendingJob?._id || null}
    onJobConsumed={() => setPendingJob(null)}
  />
            </motion.div>}

          {appMode === "recruiter" && <motion.div
    key="recruiter"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.28, ease: "easeInOut" }}
    style={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}
  >
              <JobPortalRecruiterView onSignOut={handleSignOut} />
            </motion.div>}

          {appMode === "tracker" && <motion.div
    key="tracker"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.28, ease: "easeInOut" }}
    style={{ width: "100%", minHeight: "100vh", display: "flex" }}
  >
              {!authed ? <AuthPage onLogin={() => setAuthed(true)} /> : <div style={{ display: "flex", flex: 1, height: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
                  <Sidebar page={page} setPage={setPage} onSignOut={() => {
    setAuthed(false);
    setAppMode("portal");
  }} />
                  <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
                    {PAGES[page]}
                  </main>
                </div>}
            </motion.div>}
        </AnimatePresence>
      </div>
    </GoogleOAuthProvider>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
