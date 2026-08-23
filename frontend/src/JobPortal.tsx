/**
 * Job Portal — Phase 1: Public Landing Page
 * Design system: identical to Obsidian Analytics / SpendWise Expense Tracker
 */
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, Briefcase, Building2, Users, TrendingUp,
  Code2, Palette, BarChart3, Megaphone, ShieldCheck, Stethoscope,
  GraduationCap, Wrench, ChevronLeft, ChevronRight, BookmarkPlus,
  Globe, Clock, DollarSign, ArrowRight, Zap, Star, Bell, Menu, X,
} from 'lucide-react'
import API from './services/api'

// Relative time helper
export const getRelativeTime = (dateStr: string) => {
  if (!dateStr) return '1d ago'
  const now = new Date()
  const postedDate = new Date(dateStr)
  const diffMs = now.getTime() - postedDate.getTime()
  if (isNaN(diffMs)) return '1d ago'
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHrs < 1) return 'Just now'
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  return `${diffDays}d ago`
}

// ─── Design Tokens (mirrored from Expense Tracker) ───────────────────────────
const T = {
  bg: '#09090f',
  surface: 'rgba(255,255,255,0.04)',
  surfaceHov: 'rgba(255,255,255,0.07)',
  border: 'rgba(255,255,255,0.08)',
  borderHov: 'rgba(124,106,247,0.4)',
  purple: '#7c6af7',
  purpleL: '#a090ff',
  purpleDim: 'rgba(124,106,247,0.15)',
  purpleGlow: 'rgba(124,106,247,0.25)',
  green: '#4ade80',
  greenDim: 'rgba(74,222,128,0.12)',
  pink: '#f472b6',
  orange: '#fb923c',
  yellow: '#facc15',
  text: '#f0f0fa',
  textMid: '#9090b8',
  textDim: '#5a5a80',
  font: "'DM Sans', sans-serif",
  serif: "'DM Serif Display', serif",
}

// ─── Base Components ──────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'green'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

export function Button({
  variant = 'primary', size = 'md', icon, iconRight, children, style, ...props
}: ButtonProps) {
  const sizes = { sm: '6px 12px', md: '9px 18px', lg: '12px 26px' }
  const fontSizes = { sm: '0.78rem', md: '0.875rem', lg: '0.9375rem' }

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'linear-gradient(135deg, #7c6af7 0%, #5b4de0 100%)', color: '#fff', border: 'none' },
    outline: { background: 'transparent', color: T.purpleL, border: `1px solid ${T.borderHov}` },
    ghost: { background: 'transparent', color: T.textMid, border: `1px solid ${T.border}` },
    green: { background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', color: '#09090f', border: 'none' },
  }

  return (
    <button
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: sizes[size], borderRadius: 10,
        fontFamily: T.font, fontWeight: 600, fontSize: fontSizes[size],
        cursor: 'pointer', transition: 'all 0.18s', letterSpacing: '0.01em',
        whiteSpace: 'nowrap', ...variants[variant], ...style,
      }}
      onMouseEnter={(e) => { Object.assign((e.currentTarget as HTMLElement).style, { opacity: '0.88', transform: 'translateY(-1px)' }) }}
      onMouseLeave={(e) => { Object.assign((e.currentTarget as HTMLElement).style, { opacity: '1', transform: 'translateY(0)' }) }}
      {...props}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
      {iconRight && <span style={{ display: 'flex', alignItems: 'center' }}>{iconRight}</span>}
    </button>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  wrapStyle?: React.CSSProperties
}

export function Input({ icon, wrapStyle, style, ...props }: InputProps) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', ...wrapStyle }}>
      {icon && (
        <span style={{ position: 'absolute', left: 13, color: focused ? T.purpleL : T.textDim, display: 'flex', transition: 'color 0.2s', pointerEvents: 'none' }}>
          {icon}
        </span>
      )}
      <input
        onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
        style={{
          width: '100%', background: T.surface,
          border: `1px solid ${focused ? T.borderHov : T.border}`,
          borderRadius: 10, padding: icon ? '11px 14px 11px 40px' : '11px 14px',
          color: T.text, fontSize: '0.9rem', outline: 'none',
          fontFamily: T.font, transition: 'border-color 0.2s',
          ...style,
        }}
        {...props}
      />
    </div>
  )
}

function Tag({ children, color = T.purpleDim, textColor = T.purpleL }: { children: React.ReactNode; color?: string; textColor?: string }) {
  return (
    <span style={{ padding: '3px 10px', background: color, borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, color: textColor, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}

export function GlassCard({ children, style = {}, hover = true, onClick }: { children: React.ReactNode; style?: React.CSSProperties; hover?: boolean; onClick?: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && hover ? T.surfaceHov : T.surface,
        border: `1px solid ${hov && hover ? 'rgba(124,106,247,0.2)' : T.border}`,
        borderRadius: 14, transition: 'all 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: hov && hover ? '0 8px 32px rgba(0,0,0,0.3)' : 'none',
        transform: hov && hover ? 'translateY(-2px)' : 'translateY(0)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

type Section = 'find-jobs' | 'companies' | 'salaries'

const NAV_LINKS: { label: string; section: Section }[] = [
  { label: 'Find Jobs', section: 'find-jobs' },
  { label: 'Companies', section: 'companies' },
  { label: 'Salaries', section: 'salaries' },
]

function JobNavbar({
  onAuthClick,
  activeSection,
  onSectionChange,
}: {
  onAuthClick: (mode: 'login' | 'signup') => void
  activeSection: Section
  onSectionChange: (s: Section) => void
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  if (typeof window !== 'undefined') {
    window.onscroll = () => setScrolled(window.scrollY > 10)
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(9,9,15,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: `1px solid ${scrolled ? T.border : 'transparent'}`,
      transition: 'all 0.3s', fontFamily: T.font,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', height: 64 }}>
        {/* Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 48, flexShrink: 0, cursor: 'pointer' }}
          onClick={() => onSectionChange('find-jobs')}
        >
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #7c6af7, #4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Briefcase size={16} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: T.serif, fontSize: '1.25rem', color: T.text, letterSpacing: '-0.01em' }}>JobSphere</span>
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex" style={{ gap: 2, flex: 1 }}>
          {NAV_LINKS.map(({ label, section }) => {
            const active = activeSection === section
            return (
              <button
                key={section}
                onClick={() => onSectionChange(section)}
                style={{
                  padding: '8px 14px', background: active ? T.purpleDim : 'transparent',
                  border: active ? `1px solid rgba(124,106,247,0.25)` : '1px solid transparent',
                  color: active ? T.purpleL : T.textMid,
                  fontSize: '0.875rem', fontWeight: active ? 600 : 400,
                  cursor: 'pointer', borderRadius: 8, fontFamily: T.font, transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { if (!active) (e.target as HTMLElement).style.color = T.text }}
                onMouseLeave={(e) => { if (!active) (e.target as HTMLElement).style.color = T.textMid }}
              >{label}</button>
            )
          })}
        </div>

        {/* Right actions */}
        <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 10 }}>
          <button style={{ padding: '7px 10px', background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', display: 'flex', borderRadius: 8 }}>
            <Bell size={16} />
          </button>
          <Button variant="ghost" size="sm" onClick={() => onAuthClick('login')}>Log in</Button>
          <Button variant="primary" size="sm" icon={<Zap size={13} />} onClick={() => onAuthClick('signup')}>Post a Job</Button>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: T.textMid, cursor: 'pointer', display: 'flex' }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ background: 'rgba(9,9,15,0.97)', borderBottom: `1px solid ${T.border}`, padding: '16px 24px 20px' }}>
            {NAV_LINKS.map(({ label, section }) => (
              <div
                key={section}
                onClick={() => { onSectionChange(section); setMobileOpen(false) }}
                style={{ padding: '10px 0', color: activeSection === section ? T.purpleL : T.textMid, fontSize: '0.9rem', borderBottom: `1px solid ${T.border}`, cursor: 'pointer', fontWeight: activeSection === section ? 600 : 400 }}
              >{label}</div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <Button variant="ghost" size="sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onAuthClick('login')}>Log in</Button>
              <Button variant="primary" size="sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onAuthClick('signup')}>Post a Job</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

const POPULAR = ['Frontend Developer', 'Product Designer', 'Data Scientist', 'DevOps Engineer', 'UX Researcher']

const HERO_STATS = [
  { icon: <Briefcase size={18} />, value: '15,400+', label: 'Active Jobs' },
  { icon: <Building2 size={18} />, value: '4,200+', label: 'Companies' },
  { icon: <Users size={18} />, value: '89,000+', label: 'Candidates' },
]

function HeroSection({ onSearch }: { onSearch?: (query: string) => void }) {
  const [jobQuery, setJobQuery] = useState('')
  const [location, setLocation] = useState('')

  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 32px 96px', fontFamily: T.font }}>
      <div style={{ position: 'absolute', top: -120, left: '30%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,106,247,0.13) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, right: '10%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.09) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at center, rgba(157,200,255,0.06) 1px, transparent 1.2px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', background: T.purpleDim, border: `1px solid rgba(124,106,247,0.3)`, borderRadius: 20, marginBottom: 24 }}>
          <TrendingUp size={13} color={T.purpleL} />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: T.purpleL }}>2,400 new jobs posted this week</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
          style={{ fontFamily: T.serif, fontSize: 'clamp(2.6rem, 6vw, 4rem)', color: T.text, lineHeight: 1.12, margin: '0 0 20px' }}>
          Find Your Dream Job.<br />
          <span style={{ background: 'linear-gradient(90deg, #7c6af7, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Land It Faster.
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15 }}
          style={{ fontSize: '1.05rem', color: T.textMid, lineHeight: 1.7, marginBottom: 40, maxWidth: 580, marginLeft: 'auto', marginRight: 'auto' }}>
          Connect with top employers across every industry. Browse thousands of curated opportunities tailored to your skills.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}>
          <GlassCard hover={false} style={{ display: 'flex', alignItems: 'center', gap: 0, padding: 8, borderRadius: 14, maxWidth: 720, margin: '0 auto 20px', flexWrap: 'wrap' }}>
            <Input
              icon={<Search size={15} />}
              placeholder="Job title, keywords, or company…"
              value={jobQuery}
              onChange={(e) => setJobQuery(e.target.value)}
              wrapStyle={{ flex: 1, minWidth: 200 }}
              style={{ background: 'transparent', border: 'none', borderRadius: 8, padding: '10px 14px 10px 38px' }}
            />
            <div style={{ width: 1, height: 28, background: T.border, margin: '0 4px', flexShrink: 0 }} className="hidden sm:block" />
            <Input
              icon={<MapPin size={15} />}
              placeholder="City, state, or remote…"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              wrapStyle={{ flex: 1, minWidth: 160 }}
              style={{ background: 'transparent', border: 'none', borderRadius: 8, padding: '10px 14px 10px 38px' }}
            />
            <Button
              variant="primary" size="lg" icon={<Search size={15} />}
              style={{ borderRadius: 10, flexShrink: 0 }}
              onClick={() => { onSearch?.(jobQuery); document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              Search Jobs
            </Button>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: T.textDim }}>Popular:</span>
          {POPULAR.map((p) => (
            <button key={p} onClick={() => { setJobQuery(p); onSearch?.(p); document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{ padding: '4px 11px', background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 20, color: T.textMid, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.18s', fontFamily: T.font }}
              onMouseEnter={(e) => { Object.assign((e.currentTarget as HTMLElement).style, { borderColor: 'rgba(124,106,247,0.4)', color: T.purpleL }) }}
              onMouseLeave={(e) => { Object.assign((e.currentTarget as HTMLElement).style, { borderColor: T.border, color: T.textMid }) }}
            >{p}</button>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 0, marginTop: 56, flexWrap: 'wrap' }}>
          {HERO_STATS.map((s, i) => (
            <div key={s.label} style={{ padding: '0 32px', borderRight: i < HERO_STATS.length - 1 ? `1px solid ${T.border}` : 'none', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, color: T.purple, marginBottom: 4 }}>
                {s.icon}
                <span style={{ fontFamily: T.serif, fontSize: '1.75rem', color: T.text }}>{s.value}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: T.textDim, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Category Carousel ────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Engineering', icon: <Code2 size={22} />, count: 4280, color: T.purple, bg: T.purpleDim },
  { label: 'Design', icon: <Palette size={22} />, count: 1740, color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
  { label: 'Finance', icon: <BarChart3 size={22} />, count: 2150, color: T.green, bg: T.greenDim },
  { label: 'Marketing', icon: <Megaphone size={22} />, count: 980, color: T.orange, bg: 'rgba(251,146,60,0.12)' },
  { label: 'Healthcare', icon: <Stethoscope size={22} />, count: 3310, color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  { label: 'Security', icon: <ShieldCheck size={22} />, count: 870, color: T.yellow, bg: 'rgba(250,204,21,0.12)' },
  { label: 'Education', icon: <GraduationCap size={22} />, count: 1290, color: '#c084fc', bg: 'rgba(192,132,252,0.12)' },
  { label: 'Engineering Ops', icon: <Wrench size={22} />, count: 640, color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
]

function CategoryCarousel({
  onCategoryClick,
  activeCategory,
}: {
  onCategoryClick: (label: string) => void
  activeCategory: string | null
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'l' | 'r') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'r' ? 300 : -300, behavior: 'smooth' })
  }

  return (
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 72px', fontFamily: T.font }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Browse by category</div>
          <h2 style={{ fontFamily: T.serif, fontSize: '1.75rem', color: T.text, margin: 0 }}>Explore Job Categories</h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {([<ChevronLeft size={16} />, <ChevronRight size={16} />] as React.ReactNode[]).map((ic, i) => (
            <button key={i} onClick={() => scroll(i === 0 ? 'l' : 'r')}
              style={{ width: 36, height: 36, borderRadius: 10, background: T.surface, border: `1px solid ${T.border}`, color: T.textMid, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s' }}
              onMouseEnter={(e) => { Object.assign((e.currentTarget as HTMLElement).style, { borderColor: 'rgba(124,106,247,0.4)', color: T.purpleL }) }}
              onMouseLeave={(e) => { Object.assign((e.currentTarget as HTMLElement).style, { borderColor: T.border, color: T.textMid }) }}
            >{ic}</button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} style={{ display: 'flex', gap: 14, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.label
          return (
            <motion.div key={cat.label} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <div
                onClick={() => {
                  onCategoryClick(isActive ? '' : cat.label)
                  setTimeout(() => document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' }), 80)
                }}
                style={{
                  flexShrink: 0, width: 160, padding: '20px 18px', borderRadius: 14, cursor: 'pointer',
                  background: isActive ? cat.bg : T.surface,
                  border: `1px solid ${isActive ? cat.color + '88' : T.border}`,
                  boxShadow: isActive ? `0 0 20px ${cat.color}22` : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color, marginBottom: 14 }}>
                  {cat.icon}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: isActive ? cat.color : T.text, marginBottom: 6 }}>{cat.label}</div>
                <div style={{ fontSize: '0.75rem', color: T.textDim }}>{cat.count.toLocaleString()} open roles</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Latest Jobs Grid ─────────────────────────────────────────────────────────

const JOBS = [
  // Engineering
  { id: 1, category: 'Engineering', title: 'Senior Frontend Engineer', company: 'Vercel', location: 'Remote', type: 'Full-time', salary: '$140k – $180k', posted: '2h ago', logo: 'VR', logoColor: '#fff', logoBg: '#000', tags: ['React', 'TypeScript', 'Next.js'], featured: true },
  { id: 4, category: 'Engineering', title: 'DevOps Engineer', company: 'PlanetScale', location: 'Remote', type: 'Full-time', salary: '$130k – $170k', posted: '2d ago', logo: 'PS', logoColor: '#fff', logoBg: '#f97316', tags: ['Kubernetes', 'AWS', 'Terraform'], featured: false },
  { id: 5, category: 'Engineering', title: 'Backend Engineer (Go)', company: 'Supabase', location: 'Remote', type: 'Full-time', salary: '$120k – $160k', posted: '3d ago', logo: 'SB', logoColor: '#fff', logoBg: '#3ecf8e', tags: ['Go', 'PostgreSQL', 'Docker'], featured: false },
  { id: 21, category: 'Engineering', title: 'iOS Engineer', company: 'Airbnb', location: 'San Francisco, CA', type: 'Hybrid', salary: '$160k – $210k', posted: '1d ago', logo: 'AB', logoColor: '#fff', logoBg: '#FF5A5F', tags: ['Swift', 'UIKit', 'Combine'], featured: false },
  // Design
  { id: 2, category: 'Design', title: 'Product Designer', company: 'Linear', location: 'San Francisco, CA', type: 'Full-time', salary: '$120k – $155k', posted: '5h ago', logo: 'LN', logoColor: '#fff', logoBg: '#5b6af7', tags: ['Figma', 'Systems Design', 'Motion'], featured: false },
  { id: 7, category: 'Design', title: 'UI/UX Designer', company: 'Notion', location: 'Remote', type: 'Full-time', salary: '$110k – $140k', posted: '4h ago', logo: 'NT', logoColor: '#fff', logoBg: '#191919', tags: ['Figma', 'Prototyping', 'User Research'], featured: false },
  { id: 8, category: 'Design', title: 'Brand Designer', company: 'Spotify', location: 'New York, NY', type: 'Full-time', salary: '$105k – $135k', posted: '1d ago', logo: 'SP', logoColor: '#fff', logoBg: '#1DB954', tags: ['Illustrator', 'Brand Identity', 'Motion'], featured: false },
  { id: 9, category: 'Design', title: 'Motion Designer', company: 'Airbnb', location: 'San Francisco, CA', type: 'Hybrid', salary: '$115k – $150k', posted: '2d ago', logo: 'AB', logoColor: '#fff', logoBg: '#FF5A5F', tags: ['After Effects', 'Lottie', 'Framer'], featured: false },
  { id: 10, category: 'Design', title: 'Design Systems Lead', company: 'Shopify', location: 'Remote', type: 'Full-time', salary: '$140k – $175k', posted: '3d ago', logo: 'SH', logoColor: '#fff', logoBg: '#5a8a00', tags: ['Figma', 'React', 'Storybook'], featured: false },
  { id: 22, category: 'Design', title: 'Visual Designer', company: 'Figma', location: 'San Francisco, CA', type: 'Full-time', salary: '$125k – $160k', posted: '6h ago', logo: 'FG', logoColor: '#fff', logoBg: '#a259ff', tags: ['Figma', 'Illustration', 'Brand'], featured: false },
  // Finance
  { id: 3, category: 'Finance', title: 'Data Scientist', company: 'Stripe', location: 'New York, NY', type: 'Hybrid', salary: '$150k – $200k', posted: '1d ago', logo: 'ST', logoColor: '#fff', logoBg: '#635bff', tags: ['Python', 'ML', 'SQL'], featured: false },
  { id: 11, category: 'Finance', title: 'Financial Analyst', company: 'Coinbase', location: 'Remote', type: 'Full-time', salary: '$120k – $160k', posted: '1d ago', logo: 'CB', logoColor: '#fff', logoBg: '#0052FF', tags: ['Excel', 'SQL', 'Financial Modeling'], featured: false },
  { id: 12, category: 'Finance', title: 'Risk Manager', company: 'Robinhood', location: 'Menlo Park, CA', type: 'Hybrid', salary: '$130k – $170k', posted: '4d ago', logo: 'RH', logoColor: '#fff', logoBg: '#00C805', tags: ['Risk Analysis', 'Python', 'Bloomberg'], featured: false },
  // Marketing
  { id: 6, category: 'Marketing', title: 'Growth Marketing Lead', company: 'Figma', location: 'Austin, TX', type: 'Hybrid', salary: '$110k – $145k', posted: '3d ago', logo: 'FG', logoColor: '#fff', logoBg: '#a259ff', tags: ['SEO', 'Analytics', 'Paid Ads'], featured: false },
  { id: 13, category: 'Marketing', title: 'Content Strategist', company: 'HubSpot', location: 'Remote', type: 'Full-time', salary: '$90k – $120k', posted: '2d ago', logo: 'HS', logoColor: '#fff', logoBg: '#FF7A59', tags: ['Content', 'SEO', 'HubSpot CMS'], featured: false },
  { id: 23, category: 'Marketing', title: 'Performance Marketing Manager', company: 'Notion', location: 'Remote', type: 'Full-time', salary: '$100k – $135k', posted: '5d ago', logo: 'NT', logoColor: '#fff', logoBg: '#191919', tags: ['Google Ads', 'Meta', 'A/B Testing'], featured: false },
  // Healthcare
  { id: 14, category: 'Healthcare', title: 'Health Data Analyst', company: 'Epic', location: 'Madison, WI', type: 'Full-time', salary: '$95k – $130k', posted: '1d ago', logo: 'EP', logoColor: '#fff', logoBg: '#c0392b', tags: ['HL7', 'SQL', 'Tableau'], featured: false },
  { id: 15, category: 'Healthcare', title: 'Clinical Software Engineer', company: 'Nuna', location: 'Remote', type: 'Full-time', salary: '$130k – $165k', posted: '3d ago', logo: 'NU', logoColor: '#fff', logoBg: '#2980b9', tags: ['Python', 'FHIR', 'Healthcare APIs'], featured: false },
  // Security
  { id: 16, category: 'Security', title: 'Security Engineer', company: 'Cloudflare', location: 'Remote', type: 'Full-time', salary: '$140k – $180k', posted: '2d ago', logo: 'CF', logoColor: '#fff', logoBg: '#F6821F', tags: ['Network Security', 'Rust', 'Zero Trust'], featured: false },
  { id: 17, category: 'Security', title: 'Penetration Tester', company: 'HackerOne', location: 'Remote', type: 'Contract', salary: '$120k – $155k', posted: '5d ago', logo: 'H1', logoColor: '#fff', logoBg: '#494368', tags: ['Bug Bounty', 'OWASP', 'Metasploit'], featured: false },
  // Education
  { id: 18, category: 'Education', title: 'EdTech Product Manager', company: 'Coursera', location: 'Remote', type: 'Full-time', salary: '$120k – $150k', posted: '6d ago', logo: 'CO', logoColor: '#fff', logoBg: '#0056D2', tags: ['Product', 'EdTech', 'Analytics'], featured: false },
  { id: 24, category: 'Education', title: 'Curriculum Designer', company: 'Khan Academy', location: 'Remote', type: 'Full-time', salary: '$85k – $110k', posted: '4d ago', logo: 'KA', logoColor: '#fff', logoBg: '#14BF96', tags: ['Instructional Design', 'SCORM', 'LMS'], featured: false },
  // Engineering Ops
  { id: 19, category: 'Engineering Ops', title: 'Site Reliability Engineer', company: 'Netflix', location: 'Remote', type: 'Full-time', salary: '$180k – $230k', posted: '1d ago', logo: 'NF', logoColor: '#fff', logoBg: '#E50914', tags: ['Chaos Engineering', 'AWS', 'Python'], featured: false },
  { id: 20, category: 'Engineering Ops', title: 'Platform Engineer', company: 'Datadog', location: 'New York, NY', type: 'Hybrid', salary: '$150k – $195k', posted: '4d ago', logo: 'DD', logoColor: '#fff', logoBg: '#632CA6', tags: ['Kubernetes', 'Terraform', 'Go'], featured: false },
]

const TYPE_COLORS: Record<string, [string, string]> = {
  'Full-time': [T.greenDim, T.green],
  'Hybrid': ['rgba(251,146,60,0.12)', T.orange],
  'Part-time': [T.purpleDim, T.purpleL],
  'Contract': ['rgba(250,204,21,0.12)', T.yellow],
}

function JobCard({ job, onSave, onDetails }: { job: any; onSave: (id: string) => void; onDetails?: (job: any) => void }) {
  const [saved, setSaved] = useState(false)
  const jobType = job.jobType || job.type || 'Full-time'
  const [typeBg, typeColor] = TYPE_COLORS[jobType] ?? [T.purpleDim, T.purpleL]
  const companyName = job.company?.name || job.company || 'Company'
  const logoText = companyName.slice(0, 2).toUpperCase()

  const formattedSalary = typeof job.salary === 'number'
    ? `$${Math.round(job.salary / 1000)}k`
    : job.salary || 'N/A'

  const relativeTime = getRelativeTime(job.createdAt) || job.posted || '1d ago'

  return (
    <GlassCard style={{ padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
      {job.featured && (
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <div style={{ background: 'linear-gradient(135deg, #7c6af7, #4ade80)', color: '#fff', fontSize: '0.62rem', fontWeight: 700, padding: '4px 12px 4px 20px', clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 0 100%)', letterSpacing: '0.05em' }}>
            FEATURED
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: job.logoBg || '#5b6af7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
            {job.logo ? (
              <img src={job.logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: job.logoColor || '#fff', letterSpacing: '-0.02em' }}>{logoText}</span>
            )}
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: T.textDim, marginBottom: 2 }}>{companyName}</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: T.text, lineHeight: 1.25 }}>{job.title}</div>
          </div>
        </div>
        <button
          onClick={() => { setSaved(!saved); onSave(job._id || job.id) }}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: saved ? T.purple : T.textDim, transition: 'color 0.2s, transform 0.15s', display: 'flex', transform: saved ? 'scale(1.1)' : 'scale(1)', flexShrink: 0 }}
        >
          <BookmarkPlus size={18} fill={saved ? T.purple : 'none'} />
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: T.textMid }}><MapPin size={12} />{job.location}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: T.textMid }}><DollarSign size={12} />{formattedSalary}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: T.textMid }}><Clock size={12} />{relativeTime}</span>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        <Tag color={typeBg} textColor={typeColor}>{jobType}</Tag>
        {(job.requirements || job.tags || []).slice(0, 3).map((tg: string) => (
          <Tag key={tg} color="rgba(255,255,255,0.06)" textColor={T.textMid}>{tg}</Tag>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary" size="sm" style={{ flex: 1, justifyContent: 'center' }} iconRight={<ArrowRight size={13} />}>
          Apply Now
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDetails && onDetails(job)}>Details</Button>
      </div>
    </GlassCard>
  )
}

function LatestJobs({
  categoryFilter,
  onClearFilter,
  jobs = [],
  onDetailsClick
}: {
  categoryFilter: string | null
  onClearFilter: () => void
  jobs: any[]
  onDetailsClick?: (job: any) => void
}) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [typeFilter, setTypeFilter] = useState('All')
  const typeFilters = ['All', 'Full-time', 'Hybrid', 'Remote']

  const catLabel = categoryFilter
    ? CATEGORIES.find((c) => c.label === categoryFilter)
    : null

  const filtered = jobs.filter((j: any) => {
    const jobCategory = j.category || 'Engineering'
    const passCategory = !categoryFilter || jobCategory.toLowerCase() === categoryFilter.toLowerCase()

    const jobType = j.jobType || j.type || 'Full-time'
    const passType =
      typeFilter === 'Remote' ? j.location?.toLowerCase() === 'remote'
        : typeFilter === 'All' ? true
          : jobType.toLowerCase() === typeFilter.toLowerCase()
    return passCategory && passType
  })

  return (
    <section id="jobs-section" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 80px', fontFamily: T.font }}>
      {/* Category filter banner */}
      <AnimatePresence>
        {categoryFilter && catLabel && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 18px', borderRadius: 12, marginBottom: 20,
              background: catLabel.bg,
              border: `1px solid ${catLabel.color}44`,
            }}
          >
            <span style={{ color: catLabel.color, display: 'flex' }}>{catLabel.icon}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: catLabel.color }}>
              Showing {filtered.length} {categoryFilter} jobs
            </span>
            <button
              onClick={() => { onClearFilter(); setTypeFilter('All') }}
              style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 20, color: T.textMid, fontSize: '0.72rem', cursor: 'pointer', fontFamily: T.font }}
            >
              <X size={11} /> Clear filter
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            {categoryFilter ? `${categoryFilter} roles` : 'Fresh opportunities'}
          </div>
          <h2 style={{ fontFamily: T.serif, fontSize: '1.75rem', color: T.text, margin: 0 }}>
            {categoryFilter ? `${categoryFilter} Job Openings` : 'Latest Job Openings'}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 6, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 4 }}>
          {typeFilters.map((f) => (
            <button key={f} onClick={() => setTypeFilter(f)}
              style={{ padding: '5px 13px', borderRadius: 7, fontSize: '0.78rem', fontWeight: f === typeFilter ? 600 : 400, background: f === typeFilter ? T.purpleDim : 'transparent', color: f === typeFilter ? T.purpleL : T.textMid, border: f === typeFilter ? `1px solid rgba(124,106,247,0.3)` : '1px solid transparent', cursor: 'pointer', transition: 'all 0.18s', fontFamily: T.font }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: T.textDim }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: '1rem', color: T.textMid, marginBottom: 8 }}>No jobs match your current filters</div>
          <Button variant="ghost" size="sm" onClick={() => { onClearFilter(); setTypeFilter('All') }}>Clear all filters</Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          <AnimatePresence>
            {filtered.map((job) => (
              <motion.div key={job._id || job.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.22 }}>
                <JobCard 
                  job={job} 
                  onSave={(id) => setSavedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })} 
                  onDetails={() => onDetailsClick && onDetailsClick(job)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 44 }}>
        <Button variant="outline" size="lg" iconRight={<ArrowRight size={16} />}>
          Browse All {filtered.length * 40}+ Jobs
        </Button>
      </div>
    </section>
  )
}

// ─── Companies Section ────────────────────────────────────────────────────────

function CompaniesSection() {
  const [companies, setCompanies] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('All')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      try {
        const res = await API.get('/company/get')
        if (res.data.success) {
          setCompanies(res.data.companies || [])
        }
      } catch (err) {
        console.error('Failed to fetch companies', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCompanies()
  }, [])

  const industries = ['All', 'Fintech', 'Developer Tools', 'Design Tools', 'Security & CDN', 'eCommerce', 'Entertainment']
  const filtered = companies.filter((c) => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || (c.industry || '').toLowerCase().includes(search.toLowerCase())
    const matchIndustry = industry === 'All' || c.industry === industry
    return matchSearch && matchIndustry
  })

  return (
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px', fontFamily: T.font }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: '0.72rem', color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Top Employers</div>
        <h2 style={{ fontFamily: T.serif, fontSize: '2rem', color: T.text, margin: '0 0 8px' }}>Browse Companies</h2>
        <p style={{ color: T.textMid, fontSize: '0.9rem', margin: 0 }}>Discover {companies.length} top companies actively hiring right now.</p>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <Input
          icon={<Search size={15} />}
          placeholder="Search companies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          wrapStyle={{ flex: 1, minWidth: 220 }}
        />
        <div style={{ display: 'flex', gap: 6, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 4, flexWrap: 'wrap' }}>
          {industries.map((ind) => (
            <button key={ind} onClick={() => setIndustry(ind)}
              style={{ padding: '5px 12px', borderRadius: 7, fontSize: '0.78rem', fontWeight: ind === industry ? 600 : 400, background: ind === industry ? T.purpleDim : 'transparent', color: ind === industry ? T.purpleL : T.textMid, border: ind === industry ? `1px solid rgba(124,106,247,0.3)` : '1px solid transparent', cursor: 'pointer', fontFamily: T.font }}>
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        <AnimatePresence>
          {filtered.map((co) => (
            <motion.div key={co._id || co.name} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
              <GlassCard style={{ padding: '20px 22px' }}>
                {/* Logo + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: co.logoBg || T.purpleDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                    {co.logo ? (co.logo.startsWith('http') ? <img src={co.logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }}/> : co.logo) : (co.name || 'C').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: T.text }}>{co.name}</div>
                    <div style={{ fontSize: '0.72rem', color: T.textDim }}>{co.industry || 'Technology'}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Star size={12} fill={T.yellow} color={T.yellow} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: T.yellow }}>{co.rating || '4.5'}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: T.textMid, lineHeight: 1.6, margin: '0 0 14px' }}>{co.description || co.desc || 'A great place to work.'}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: T.textDim }}>
                    <Globe size={11} />{co.location || 'Remote'}
                  </span>
                  <span style={{ padding: '2px 8px', background: T.greenDim, borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, color: T.green }}>
                    {co.openRoles || 'Multiple'} open roles
                  </span>
                </div>

                <Button variant="outline" size="sm" style={{ width: '100%', justifyContent: 'center' }} iconRight={<ArrowRight size={12} />}>
                  View Jobs
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ─── Salaries Section ─────────────────────────────────────────────────────────

const SALARY_ROWS = [
  { role: 'Senior Frontend Engineer', category: 'Engineering', entry: '$85k', mid: '$130k', senior: '$170k', lead: '$210k', trend: '+8.2%' },
  { role: 'Product Designer', category: 'Design', entry: '$75k', mid: '$110k', senior: '$150k', lead: '$190k', trend: '+6.5%' },
  { role: 'Data Scientist', category: 'Finance', entry: '$90k', mid: '$135k', senior: '$180k', lead: '$225k', trend: '+11.3%' },
  { role: 'DevOps / SRE', category: 'Engineering Ops', entry: '$95k', mid: '$140k', senior: '$185k', lead: '$235k', trend: '+9.7%' },
  { role: 'Security Engineer', category: 'Security', entry: '$100k', mid: '$145k', senior: '$190k', lead: '$240k', trend: '+13.1%' },
  { role: 'Marketing Manager', category: 'Marketing', entry: '$60k', mid: '$90k', senior: '$125k', lead: '$165k', trend: '+4.2%' },
  { role: 'UX Researcher', category: 'Design', entry: '$72k', mid: '$105k', senior: '$140k', lead: '$178k', trend: '+5.8%' },
  { role: 'Clinical Software Engineer', category: 'Healthcare', entry: '$90k', mid: '$130k', senior: '$170k', lead: '$210k', trend: '+7.4%' },
  { role: 'Backend Engineer (Go)', category: 'Engineering', entry: '$88k', mid: '$125k', senior: '$165k', lead: '$205k', trend: '+8.9%' },
  { role: 'EdTech Product Manager', category: 'Education', entry: '$80k', mid: '$115k', senior: '$148k', lead: '$180k', trend: '+3.6%' },
]

const CAT_COLORS: Record<string, string> = {
  Engineering: T.purple,
  Design: '#f472b6',
  Finance: T.green,
  Marketing: T.orange,
  Healthcare: '#60a5fa',
  Security: T.yellow,
  Education: '#c084fc',
  'Engineering Ops': '#34d399',
}

function SalariesSection() {
  const [sortBy, setSortBy] = useState<'role' | 'senior' | 'trend'>('senior')
  const [filterCat, setFilterCat] = useState('All')

  const cats = ['All', 'Engineering', 'Design', 'Finance', 'Marketing', 'Healthcare', 'Security']

  const sorted = [...SALARY_ROWS]
    .filter((r) => filterCat === 'All' || r.category === filterCat)
    .sort((a, b) => {
      if (sortBy === 'role') return a.role.localeCompare(b.role)
      if (sortBy === 'senior') return parseInt(b.senior.replace(/\D/g, '')) - parseInt(a.senior.replace(/\D/g, ''))
      return parseFloat(b.trend) - parseFloat(a.trend)
    })

  return (
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px', fontFamily: T.font }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: '0.72rem', color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Compensation insights</div>
        <h2 style={{ fontFamily: T.serif, fontSize: '2rem', color: T.text, margin: '0 0 8px' }}>Salary Ranges by Role</h2>
        <p style={{ color: T.textMid, fontSize: '0.9rem', margin: 0 }}>Median compensation data across seniority levels. Updated monthly.</p>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 32 }}>
        {[
          { label: 'Avg. Senior Engineer', value: '$172k', delta: '+8.9% YoY', color: T.purple },
          { label: 'Avg. Senior Designer', value: '$145k', delta: '+6.5% YoY', color: '#f472b6' },
          { label: 'Avg. Data Scientist', value: '$180k', delta: '+11.3% YoY', color: T.green },
          { label: 'Highest Growth Role', value: 'Security Eng.', delta: '+13.1% YoY', color: T.yellow },
        ].map((stat) => (
          <GlassCard key={stat.label} hover={false} style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: '0.68rem', color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: '0.72rem', color: T.green }}>{stat.delta}</div>
          </GlassCard>
        ))}
      </div>

      {/* Category filter + sort */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 4, flexWrap: 'wrap' }}>
          {cats.map((c) => (
            <button key={c} onClick={() => setFilterCat(c)}
              style={{ padding: '5px 12px', borderRadius: 7, fontSize: '0.78rem', fontWeight: c === filterCat ? 600 : 400, background: c === filterCat ? T.purpleDim : 'transparent', color: c === filterCat ? T.purpleL : T.textMid, border: c === filterCat ? `1px solid rgba(124,106,247,0.3)` : '1px solid transparent', cursor: 'pointer', fontFamily: T.font }}>
              {c}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: T.textDim }}>Sort by:</span>
          {(['senior', 'trend', 'role'] as const).map((s) => (
            <button key={s} onClick={() => setSortBy(s)}
              style={{ padding: '5px 12px', borderRadius: 7, fontSize: '0.78rem', fontWeight: sortBy === s ? 600 : 400, background: sortBy === s ? T.purpleDim : T.surface, color: sortBy === s ? T.purpleL : T.textMid, border: `1px solid ${sortBy === s ? 'rgba(124,106,247,0.3)' : T.border}`, cursor: 'pointer', fontFamily: T.font, textTransform: 'capitalize' }}>
              {s === 'senior' ? 'Senior Pay' : s === 'trend' ? 'YoY Growth' : 'Role Name'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <GlassCard hover={false}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Role', 'Category', 'Entry Level', 'Mid-Level', 'Senior', 'Lead / Staff', 'YoY Growth'].map((h) => (
                  <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: '0.68rem', color: T.textDim, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: `1px solid ${T.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => (
                <tr key={row.role}
                  style={{ borderBottom: i < sorted.length - 1 ? `1px solid ${T.border}` : 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 18px', fontSize: '0.85rem', fontWeight: 600, color: T.text, whiteSpace: 'nowrap' }}>{row.role}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, background: `${CAT_COLORS[row.category] ?? T.purple}18`, color: CAT_COLORS[row.category] ?? T.purple }}>
                      {row.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.82rem', color: T.textMid }}>{row.entry}</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.82rem', color: T.textMid }}>{row.mid}</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.875rem', fontWeight: 700, color: T.text }}>{row.senior}</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.875rem', fontWeight: 700, color: T.purpleL }}>{row.lead}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: T.green }}>↑ {row.trend}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </section>
  )
}


// ─── Footer strip ─────────────────────────────────────────────────────────────

function FooterStrip({ onSectionChange }: { onSectionChange: (s: Section) => void }) {
  return (
    <div style={{ borderTop: `1px solid ${T.border}`, padding: '20px 32px', fontFamily: T.font }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #7c6af7, #4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={11} color="white" />
          </div>
          <span style={{ fontSize: '0.82rem', color: T.textDim }}>© 2025 JobSphere · Matching talent with opportunity</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {NAV_LINKS.map(({ label, section }) => (
            <button key={section} onClick={() => onSectionChange(section)} style={{ padding: '4px 10px', background: 'transparent', border: 'none', color: T.textDim, fontSize: '0.78rem', cursor: 'pointer', fontFamily: T.font }}>
              {label}
            </button>
          ))}
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <button key={l} style={{ padding: '4px 10px', background: 'transparent', border: 'none', color: T.textDim, fontSize: '0.78rem', cursor: 'pointer', fontFamily: T.font }}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Public Landing Page (assembles all sections) ─────────────────────────────

export function JobPortalPublic({ onAuthClick }: { onAuthClick: (mode: 'login' | 'signup') => void }) {
  const [section, setSection] = useState<Section>('find-jobs')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [jobDetails, setJobDetails] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const fetchJobs = async (query = '') => {
    setLoading(true)
    try {
      const res = await API.get(`/job/get?keyword=${query}`)
      if (res.data.success) {
        setJobs(res.data.jobs)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleSectionChange = (s: Section) => {
    setSection(s)
    if (s !== 'find-jobs') setCategoryFilter(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryClick = (label: string) => {
    setCategoryFilter(label || null)
  }

  const handleDetailsClick = async (job: any) => {
    setSelectedJob(job)
    if (!job._id) {
      setJobDetails(job)
      return
    }
    setLoadingDetails(true)
    try {
      const res = await API.get(`/job/get/${job._id}`)
      if (res.data.success) {
        setJobDetails(res.data.job)
      } else {
        setJobDetails(job)
      }
    } catch (err) {
      console.error(err)
      setJobDetails(job)
    } finally {
      setLoadingDetails(false)
    }
  }

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: T.font }}>
      <JobNavbar onAuthClick={onAuthClick} activeSection={section} onSectionChange={handleSectionChange} />

      <AnimatePresence mode="wait">
        {section === 'find-jobs' && (
          <motion.div key="find-jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
            <HeroSection onSearch={(query) => fetchJobs(query)} />
            <CategoryCarousel onCategoryClick={handleCategoryClick} activeCategory={categoryFilter} />
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: T.textDim }}>
                <div style={{ fontSize: '1.2rem', color: T.textMid }}>Loading jobs...</div>
              </div>
            ) : (
              <LatestJobs categoryFilter={categoryFilter} onClearFilter={() => setCategoryFilter(null)} jobs={jobs} onDetailsClick={handleDetailsClick} />
            )}
          </motion.div>
        )}
        {section === 'companies' && (
          <motion.div key="companies" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
            <CompaniesSection />
          </motion.div>
        )}
        {section === 'salaries' && (
          <motion.div key="salaries" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
            <SalariesSection />
          </motion.div>
        )}

      </AnimatePresence>

      <AnimatePresence>
        {selectedJob && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={() => { setSelectedJob(null); setJobDetails(null) }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32, width: '100%', maxWidth: 600, maxHeight: '85vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              {loadingDetails ? (
                <div style={{ textAlign: 'center', color: T.textMid, padding: 40 }}>Loading job details...</div>
              ) : jobDetails ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{ width: 60, height: 60, borderRadius: 12, background: jobDetails.logoBg || T.purpleDim, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>
                        {jobDetails.logo ? (jobDetails.logo.startsWith('http') ? <img src={jobDetails.logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} /> : jobDetails.logo) : (jobDetails.company?.name || jobDetails.company || 'C').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h2 style={{ margin: '0 0 4px', color: T.text, fontSize: '1.4rem' }}>{jobDetails.title}</h2>
                        <div style={{ color: T.textDim, fontSize: '0.9rem' }}>{jobDetails.company?.name || jobDetails.company} • {jobDetails.location}</div>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedJob(null); setJobDetails(null) }} style={{ background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                    <span style={{ padding: '4px 12px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, fontSize: '0.8rem', color: T.textMid }}>💰 {typeof jobDetails.salary === 'number' ? `$${Math.round(jobDetails.salary/1000)}k/yr` : jobDetails.salary || 'Competitive'}</span>
                    <span style={{ padding: '4px 12px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, fontSize: '0.8rem', color: T.textMid }}>🕒 {jobDetails.jobType || jobDetails.type || 'Full-time'}</span>
                    <span style={{ padding: '4px 12px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, fontSize: '0.8rem', color: T.textMid }}>🎓 {jobDetails.experiencelevel || jobDetails.experienceLevel || 0} Yrs Exp</span>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ margin: '0 0 8px', color: T.text, fontSize: '1rem' }}>Description</h3>
                    <p style={{ color: T.textMid, lineHeight: 1.6, fontSize: '0.9rem' }}>{jobDetails.description || 'No detailed description provided.'}</p>
                  </div>
                  {(jobDetails.requirements || jobDetails.tags || []).length > 0 && (
                    <div style={{ marginBottom: 32 }}>
                      <h3 style={{ margin: '0 0 12px', color: T.text, fontSize: '1rem' }}>Requirements</h3>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {(jobDetails.requirements || jobDetails.tags).map((r: string) => (
                          <span key={r} style={{ padding: '6px 12px', background: T.purpleDim, color: T.purpleL, borderRadius: 8, fontSize: '0.85rem' }}>{r}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button variant="primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }} onClick={() => { onAuthClick('login'); setSelectedJob(null); setJobDetails(null); }}>
                    Sign in to Apply
                  </Button>
                </>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterStrip onSectionChange={handleSectionChange} />
    </div>
  )
}
