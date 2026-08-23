import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGoogleLogin } from '@react-oauth/google'
import {
  Search, MapPin, Briefcase, Building2, BookmarkPlus,
  Clock, DollarSign, ArrowRight, Zap, Bell, CheckCircle2,
  ChevronLeft, SlidersHorizontal, Filter, Bookmark, Link as LinkIcon, Share2, UploadCloud, Star
} from 'lucide-react'
import { Button, Input, GlassCard, getRelativeTime } from './JobPortal'
import { ResumeAnalyzerView } from './JobPortalResumeAnalyzer'
import API from './services/api'

// ─── Design Tokens (mirrored) ───────────────────────────────────────────────
const T = {
  bg: '#09090f',
  surface: 'rgba(255,255,255,0.04)',
  surfaceHov: 'rgba(255,255,255,0.07)',
  border: 'rgba(255,255,255,0.08)',
  borderHov: 'rgba(124,106,247,0.4)',
  purple: '#7c6af7',
  purpleL: '#a090ff',
  purpleDim: 'rgba(124,106,247,0.15)',
  green: '#4ade80',
  greenDim: 'rgba(74,222,128,0.12)',
  pink: '#f472b6',
  orange: '#fb923c',
  yellow: '#facc15',
  red: '#ef4444',
  redDim: 'rgba(239,68,68,0.12)',
  text: '#f0f0fa',
  textMid: '#9090b8',
  textDim: '#5a5a80',
  font: "'DM Sans', sans-serif",
  serif: "'DM Serif Display', serif",
}

function Tag({ children, color = T.purpleDim, textColor = T.purpleL }: { children: React.ReactNode; color?: string; textColor?: string }) {
  return (
    <span style={{ padding: '4px 10px', background: color, borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, color: textColor, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}

function ApplicantNavbar({ onSignOut, activeTab, onTabChange, userName = 'Candidate' }: { onSignOut: () => void, activeTab: string, onTabChange: (tab: string) => void, userName?: string }) {
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <nav style={{ background: T.bg, borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 0, zIndex: 100, fontFamily: T.font }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 40 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #7c6af7, #4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={14} color="white" strokeWidth={2.5}/>
          </div>
          <span style={{ fontFamily: T.serif, fontSize: '1.15rem', color: T.text, letterSpacing: '-0.01em' }}>JobSphere</span>
        </div>

        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
          {['Browse Jobs', 'My Applications', 'AI Resume Analyzer', 'Saved', 'My Profile'].map((l) => {
            const isActive = activeTab === l;
            return (
              <button key={l} onClick={() => onTabChange(l)} style={{ padding: '8px 14px', background: isActive ? T.surface : 'transparent', border: 'none', color: isActive ? T.text : T.textMid, fontSize: '0.875rem', fontWeight: isActive ? 500 : 400, cursor: 'pointer', borderRadius: 8, fontFamily: T.font, transition: 'all 0.2s' }}>
                {l}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              style={{ background: 'none', border: 'none', color: isNotifOpen ? T.purpleL : T.textDim, cursor: 'pointer', display: 'flex', position: 'relative', padding: 4 }}
            >
              <Bell size={18}/>
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: T.purple }} />
              )}
            </button>
            
            <AnimatePresence>
              {isNotifOpen && (
                <div style={{ position: 'absolute', top: 32, right: 0, width: 320, background: 'rgba(12,10,24,0.96)', border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.6)', zIndex: 1000, backdropFilter: 'blur(12px)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: `1px solid ${T.border}`, paddingBottom: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: T.text }}>Notifications</span>
                    {unreadCount > 0 && (
                      <span onClick={handleMarkAllRead} style={{ fontSize: '0.72rem', color: T.purpleL, cursor: 'pointer', fontWeight: 500 }}>Mark all read</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 240, overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 10px', borderRadius: 8, background: n.read ? 'transparent' : 'rgba(255,255,255,0.02)', borderLeft: n.read ? 'none' : `3px solid ${T.purple}`, transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: T.text }}>{n.title}</span>
                          <span style={{ fontSize: '0.65rem', color: T.textDim }}>{n.time}</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: T.textMid, lineHeight: 1.4 }}>{n.body}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => onTabChange('My Profile')}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{initials}</div>
          </div>
          <button onClick={onSignOut} style={{ fontSize: '0.8rem', color: T.textDim, background: 'none', border: 'none', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>
    </nav>
  )
}

function ProfileView({
  onUserUpdate,
  externalError = '',
  externalSuccess = '',
  onClearExternal,
}: {
  onUserUpdate: (u: any) => void
  externalError?: string
  externalSuccess?: string
  onClearExternal?: () => void
}) {
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}')
  const [fullname, setFullname] = useState(savedUser.fullname || '')
  const [email, setEmail] = useState(savedUser.email || '')
  const [phoneNumber, setPhoneNumber] = useState(savedUser.phoneNumber || '')
  const [bio, setBio] = useState(savedUser.profile?.bio || '')
  const [skills, setSkills] = useState((savedUser.profile?.skills || []).join(', '))
  // Reactive state for linked accounts so UI updates immediately after connect/disconnect
  const [googleEmail, setGoogleEmail] = useState<string | undefined>(savedUser.profile?.googleEmail)
  const [githubEmail, setGithubEmail] = useState<string | undefined>(savedUser.profile?.githubEmail)
  
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg('')
    setErrorMsg('')
    try {
      const res = await API.post('/user/profile/update', {
        fullname,
        email,
        phoneNumber,
        bio,
        skills
      })
      if (res.data.success) {
        setSuccessMsg('Profile updated successfully!')
        onUserUpdate(res.data.user)
        setTimeout(() => setSuccessMsg(''), 3000)
      } else {
        throw new Error(res.data.message || 'Failed to update profile')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.response?.data?.message || err.message || 'Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  const linkGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
        const res = await API.post('/user/auth/google', {
          token: tokenResponse.access_token,
          action: 'link',
        })
        if (res.data.success) {
          onUserUpdate(res.data.user)
          setGoogleEmail(res.data.user.profile?.googleEmail)
          setSuccessMsg('Google account linked successfully!')
          setTimeout(() => setSuccessMsg(''), 3000)
        } else {
          throw new Error(res.data.message || 'Linking failed')
        }
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || err.message || 'Failed to link Google account')
      } finally {
        setLoading(false)
      }
    },
    onError: () => {
      setErrorMsg('Google linking was cancelled.')
    }
  })

  const handleLinkSocial = (provider: string) => {
    setErrorMsg('')
    setSuccessMsg('')
    if (provider === 'Google') {
      const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientID || clientID.includes("dummy")) {
        setErrorMsg("Google Client credentials are not configured in local environment.");
      } else {
        linkGoogle();
      }
    } else if (provider === 'GitHub') {
      const clientID = import.meta.env.VITE_GITHUB_CLIENT_ID;
      if (!clientID || clientID.includes("dummy")) {
        setErrorMsg("GitHub Client credentials are not configured in local environment.");
      } else {
        const redirectURI = encodeURIComponent("http://localhost:8000/api/v1/user/auth/github/callback");
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=user:email&state=link`;
        window.location.href = githubAuthUrl;
      }
    }
  }

  const handleUnlinkSocial = async (provider: string) => {
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)
    try {
      const res = await API.post('/user/profile/unlink', { provider })
      if (res.data.success) {
        onUserUpdate(res.data.user)
        if (provider === 'google') setGoogleEmail(undefined)
        if (provider === 'github') setGithubEmail(undefined)
        setSuccessMsg(res.data.message || `${provider} account disconnected successfully!`)
        setTimeout(() => setSuccessMsg(''), 3000)
      } else {
        throw new Error(res.data.message || 'Unlinking failed')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.response?.data?.message || err.message || `Failed to unlink ${provider} account`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ flex: 1, maxWidth: 680, width: '100%', margin: '40px auto', padding: '0 24px', fontFamily: T.font }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontFamily: T.serif, color: T.text, margin: '0 0 8px' }}>My Profile</h1>
        <p style={{ color: T.textMid, margin: 0 }}>View and manage your account details and technical skills.</p>
      </div>

      <GlassCard style={{ padding: 32 }}>
        {successMsg && (
          <div style={{ color: T.green, background: T.greenDim, border: `1px solid ${T.green}40`, padding: '12px 16px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 20 }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.20)', padding: '12px 16px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 20 }}>
            {errorMsg}
          </div>
        )}
        {externalError && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ef4444', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.20)', padding: '12px 16px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 20 }}>
            <span>{externalError}</span>
            <button onClick={onClearExternal} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: '0 0 0 12px' }}>✕</button>
          </div>
        )}
        {externalSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: T.green, background: T.greenDim, border: `1px solid ${T.green}40`, padding: '12px 16px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 20 }}>
            <span>{externalSuccess}</span>
            <button onClick={onClearExternal} style={{ background: 'none', border: 'none', color: T.green, cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: '0 0 0 12px' }}>✕</button>
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: T.textMid, marginBottom: 6, fontWeight: 500 }}>Full Name</label>
            <Input placeholder="John Doe" value={fullname} onChange={e => setFullname(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: T.textMid, marginBottom: 6, fontWeight: 500 }}>Email Address</label>
              <Input placeholder="john@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: T.textMid, marginBottom: 6, fontWeight: 500 }}>Phone Number</label>
              <Input placeholder="1234567890" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: T.textMid, marginBottom: 6, fontWeight: 500 }}>Professional Bio</label>
            <textarea 
              placeholder="Tell us about yourself, your background, and your aspirations..."
              value={bio}
              onChange={e => setBio(e.target.value)}
              style={{ width: '100%', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '11px 14px', color: T.text, fontSize: '0.9rem', outline: 'none', fontFamily: T.font, minHeight: 80, boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: T.textMid, marginBottom: 6, fontWeight: 500 }}>Skills (comma separated)</label>
            <Input placeholder="React, Node.js, TypeScript, PostgreSQL" value={skills} onChange={e => setSkills(e.target.value)} />
            <span style={{ fontSize: '0.72rem', color: T.textDim, display: 'block', marginTop: 4 }}>Separating skills with a comma lets us calculate ATS matches for your profile automatically.</span>
          </div>

          <div style={{ marginTop: 10 }}>
            <Button type="submit" variant="primary" style={{ padding: '12px 28px' }} disabled={loading}>
              {loading ? 'Saving Changes...' : 'Save Profile Details'}
            </Button>
          </div>
        </form>
      </GlassCard>

      <GlassCard style={{ padding: 32, marginTop: 24 }}>
        <h3 style={{ fontSize: '1.1rem', color: T.text, margin: '0 0 8px', fontWeight: 600 }}>Linked Accounts</h3>
        <p style={{ color: T.textMid, fontSize: '0.82rem', margin: '0 0 20px' }}>
          Connect your social accounts to log in using either method seamlessly.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91C16.46 14.28 17.64 11.95 17.64 9.2Z" fill="#4285F4"/><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18Z" fill="#34A853"/><path d="M3.96 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33Z" fill="#FBBC05"/><path d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96L3.96 7.3C4.67 5.16 6.66 3.58 9 3.58Z" fill="#EA4335"/></svg>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: T.text }}>Google Account</div>
                <div style={{ fontSize: '0.72rem', color: T.textDim }}>{googleEmail || 'Not connected'}</div>
              </div>
            </div>
            {googleEmail ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '0.75rem', color: T.green, fontWeight: 600 }}>✓ Connected</span>
                <button 
                  onClick={() => handleUnlinkSocial('google')}
                  style={{ fontSize: '0.72rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => handleLinkSocial('Google')}>Connect</Button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: T.text }}>GitHub Account</div>
                <div style={{ fontSize: '0.72rem', color: T.textDim }}>{githubEmail || 'Not connected'}</div>
              </div>
            </div>
            {githubEmail ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '0.75rem', color: T.green, fontWeight: 600 }}>✓ Connected</span>
                <button 
                  onClick={() => handleUnlinkSocial('github')}
                  style={{ fontSize: '0.72rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => handleLinkSocial('GitHub')}>Connect</Button>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export function JobPortalApplicantView({ onSignOut }: { onSignOut: () => void }) {
  const [activeTab, setActiveTab] = useState('Browse Jobs')
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [activeJobId, setActiveJobId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [applyLoading, setApplyLoading] = useState(false)
  const [applySuccess, setApplySuccess] = useState<string | null>(null)
  const [userVer, setUserVer] = useState(0) // version flag to trigger navbar rerender on update
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())

  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 10
  const [linkError, setLinkError] = useState('')   // For OAuth redirect error messages
  const [linkSuccess, setLinkSuccess] = useState('') // For OAuth redirect success messages

  const savedUser = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = savedUser._id || ''
  const userName = savedUser.fullname || 'Candidate'

  // Parse user skills to calculate Match Score
  const userSkills = (savedUser.profile?.skills || [])
    .map((s: string) => s.toLowerCase().trim())
    .filter((s: string) => s.length > 0)

  // Fetch jobs
  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await API.get('/job/get')
      if (res.data.success) {
        setJobs(res.data.jobs)
        if (res.data.jobs.length > 0) {
          setActiveJobId(res.data.jobs[0]._id)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const res = await API.get('/application/get')
      if (res.data.success) {
        setApplications(res.data.application || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeTab, selectedFilters])

  useEffect(() => {
    fetchJobs()
    fetchApplications()
    // Load saved job IDs from localStorage
    const saved = localStorage.getItem(`saved_jobs_${userId}`)
    if (saved) {
      setSavedIds(new Set(JSON.parse(saved)))
    }

    // Check url search query for linking parameters
    const params = new URLSearchParams(window.location.search)
    const linkStatus = params.get('link')
    const errorStatus = params.get('error')
    if (linkStatus === 'github_success') {
      window.history.replaceState({}, document.title, window.location.pathname)
      const updateMe = async () => {
        try {
          const res = await API.get('/user/me')
          if (res.data.success) {
            localStorage.setItem('user', JSON.stringify(res.data.user))
            setUserVer(v => v + 1)
            setActiveTab('My Profile')
          }
        } catch (err) {
          console.error(err)
        }
      }
      updateMe()
    } else if (errorStatus === 'github_already_linked') {
      window.history.replaceState({}, document.title, window.location.pathname)
      setActiveTab('My Profile')
      setLinkError('This GitHub account is already connected to another user profile.')
    }
  }, [userId])

  // Apply to job
  const handleApply = async (jobId: string) => {
    setApplyLoading(true)
    setApplySuccess(null)
    try {
      const res = await API.get(`/application/apply/${jobId}`)
      if (res.data.success) {
        setApplySuccess('Successfully applied to this position!')
        fetchApplications() // Refresh applied list
      }
    } catch (err: any) {
      console.error(err)
      setApplySuccess(err.response?.data?.message || 'Failed to submit application.')
    } finally {
      setApplyLoading(false)
    }
  }

  // Save/unsave job posting
  const handleToggleSave = (jobId: string) => {
    const nextSaved = new Set(savedIds)
    if (nextSaved.has(jobId)) {
      nextSaved.delete(jobId)
    } else {
      nextSaved.add(jobId)
    }
    setSavedIds(nextSaved)
    localStorage.setItem(`saved_jobs_${userId}`, JSON.stringify(Array.from(nextSaved)))
  }

  // Toggle filter chips
  const handleToggleFilter = (filter: string) => {
    const nextFilters = new Set(selectedFilters)
    if (nextFilters.has(filter)) {
      nextFilters.delete(filter)
    } else {
      nextFilters.add(filter)
    }
    setSelectedFilters(nextFilters)
  }

  // Filter jobs based on search query, saved status, and interactive filter chips
  const displayedJobs = jobs.filter((job) => {
    const matchSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (job.company?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchSearch) return false

    if (selectedFilters.size > 0) {
      let matchesFilter = true
      selectedFilters.forEach(f => {
        if (f === 'Remote' && !job.location.toLowerCase().includes('remote')) matchesFilter = false
        if (f === 'Engineering' && !job.title.toLowerCase().includes('engineer') && !job.title.toLowerCase().includes('developer') && !job.title.toLowerCase().includes('frontend') && !job.title.toLowerCase().includes('backend')) matchesFilter = false
        if (f === 'Full-time' && job.jobType !== 'Full-time') matchesFilter = false
      })
      if (!matchesFilter) return false
    }
    
    if (activeTab === 'Saved') {
      return savedIds.has(job._id)
    }
    return true
  })

  const totalPages = Math.ceil(displayedJobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const paginatedJobs = displayedJobs.slice(startIndex, startIndex + jobsPerPage)

  // Format salary helper
  const formatSal = (sal: any) => {
    return typeof sal === 'number' ? `$${Math.round(sal / 1000)}k` : sal || 'N/A'
  }

  // Calculate Match Score formula
  const getMatchScore = (jobId: string, jobReqs: string[]) => {
    if (!jobReqs || jobReqs.length === 0) return 0
    if (userSkills.length === 0) return 0
    const cleanReqs = jobReqs.map(r => r.toLowerCase().trim())
    const matchCount = cleanReqs.filter(req => 
      userSkills.some((skill: string) => skill.toLowerCase().trim().includes(req) || req.includes(skill.toLowerCase().trim()))
    ).length
    return Math.round((matchCount / cleanReqs.length) * 100)
  }

  // Calculate Match Details helper
  const getMatchDetails = (jobReqs: string[]) => {
    if (!jobReqs || jobReqs.length === 0) return { matched: [], missing: [] }
    const cleanReqs = jobReqs.map(r => r.trim())
    const matched: string[] = []
    const missing: string[] = []
    
    cleanReqs.forEach(req => {
      const isMatch = userSkills.some((skill: string) => 
        skill.includes(req.toLowerCase()) || req.toLowerCase().includes(skill)
      )
      if (isMatch) {
        matched.push(req)
      } else {
        missing.push(req)
      }
    })
    return { matched, missing }
  }

  const activeJob = jobs.find(j => j._id === activeJobId)
  const hasAppliedToActiveJob = activeJob && applications.some(app => app.job?._id === activeJob._id || app.job === activeJob._id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: T.bg, color: T.text }}>
      <ApplicantNavbar 
        onSignOut={onSignOut} 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab)
          if (tab === 'My Applications') {
            fetchApplications()
          } else if (tab === 'Saved') {
            const savedArr = Array.from(savedIds)
            if (savedArr.length > 0) {
              setActiveJobId(savedArr[0])
            }
          } else if (tab === 'Browse Jobs') {
            if (jobs.length > 0) {
              setActiveJobId(jobs[0]._id)
            }
          }
        }} 
        userName={userName} 
        key={userVer}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          {activeTab === 'AI Resume Analyzer' ? (
            <ResumeAnalyzerView />
          ) : activeTab === 'My Profile' ? (
            <ProfileView
              onUserUpdate={(updatedUser) => {
                localStorage.setItem('user', JSON.stringify(updatedUser))
                setUserVer(v => v + 1) // Force navbar rerender
              }}
              externalError={linkError}
              externalSuccess={linkSuccess}
              onClearExternal={() => { setLinkError(''); setLinkSuccess('') }}
            />
          ) : activeTab === 'My Applications' ? (
            // ─── My Applications Screen ──────────────────────────────────────────
            <div style={{ flex: 1, maxWidth: 1000, width: '100%', margin: '40px auto', padding: '0 24px', fontFamily: T.font }}>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '2rem', fontFamily: T.serif, color: T.text, margin: '0 0 8px' }}>My Applications</h1>
                <p style={{ color: T.textMid, margin: 0 }}>Track the status of roles you've applied for.</p>
              </div>

              {applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: T.textDim, background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>💼</div>
                  <h3 style={{ fontSize: '1.2rem', color: T.text, margin: '0 0 8px' }}>No applications yet</h3>
                  <p style={{ color: T.textMid, marginBottom: 20 }}>Explore available roles and submit your application.</p>
                  <Button variant="primary" onClick={() => setActiveTab('Browse Jobs')}>Find Jobs</Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {applications.map((app) => {
                    const statusColors: Record<string, [string, string]> = {
                      pending: ['rgba(250,204,21,0.15)', '#facc15'],
                      accepted: ['rgba(74,222,128,0.15)', '#4ade80'],
                      rejected: ['rgba(248,113,113,0.15)', '#f87171'],
                    }
                    const [statusBg, statusColor] = statusColors[app.status?.toLowerCase()] || ['rgba(255,255,255,0.08)', T.textMid]
                    const compName = app.job?.company?.name || 'Company'
                    const initials = compName.slice(0, 2).toUpperCase()

                    return (
                      <GlassCard key={app._id} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#5b6af7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                              {app.job?.logo ? (
                                <img src={app.job.logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>{initials}</span>
                              )}
                            </div>
                            <div>
                              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: T.text, margin: '0 0 4px' }}>{app.job?.title || 'Unknown Title'}</h3>
                              <p style={{ fontSize: '0.85rem', color: T.textMid, margin: 0 }}>{compName} · {app.job?.location || 'Remote'}</p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.75rem', color: T.textDim, marginBottom: 4 }}>Applied on</div>
                              <div style={{ fontSize: '0.8rem', color: T.textMid }}>{new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            </div>
                            <span style={{ padding: '6px 14px', background: statusBg, color: statusColor, borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, textTransform: 'capitalize' }}>
                              {app.status}
                            </span>
                          </div>
                        </div>

                        {/* Visual Timeline Stepper */}
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 500, margin: '8px 0 0 60px', borderTop: `1px dashed ${T.border}`, paddingTop: 16 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: T.greenDim, border: `2px solid ${T.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.green, fontSize: '0.65rem', fontWeight: 800 }}>✓</div>
                            <span style={{ fontSize: '0.68rem', color: T.text, marginTop: 4, fontWeight: 500 }}>Applied</span>
                            <span style={{ fontSize: '0.6rem', color: T.textDim, marginTop: 2 }}>{new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            
                            <div style={{ position: 'absolute', top: 11, left: 'calc(50% + 11px)', right: '-50%', height: 2, background: app.status?.toLowerCase() !== 'pending' ? T.green : 'rgba(255,255,255,0.08)', zIndex: 1 }} />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                            <div style={{ 
                              width: 22, height: 22, borderRadius: '50%', 
                              background: app.status?.toLowerCase() !== 'pending' ? T.greenDim : T.purpleDim, 
                              border: `2px solid ${app.status?.toLowerCase() !== 'pending' ? T.green : T.purple}`, 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', 
                              color: app.status?.toLowerCase() !== 'pending' ? T.green : T.purpleL, 
                              fontSize: '0.65rem', fontWeight: 800 
                            }}>
                              {app.status?.toLowerCase() !== 'pending' ? '✓' : '•'}
                            </div>
                            <span style={{ fontSize: '0.68rem', color: T.text, marginTop: 4, fontWeight: 500 }}>Screening</span>
                            <span style={{ fontSize: '0.6rem', color: T.textDim, marginTop: 2 }}>{app.status?.toLowerCase() !== 'pending' ? 'Completed' : 'Under Review'}</span>

                            <div style={{ position: 'absolute', top: 11, left: 'calc(50% + 11px)', right: '-50%', height: 2, background: app.status?.toLowerCase() === 'accepted' ? T.green : app.status?.toLowerCase() === 'rejected' ? T.red : 'rgba(255,255,255,0.08)', zIndex: 1 }} />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                            <div style={{ 
                              width: 22, height: 22, borderRadius: '50%', 
                              background: app.status?.toLowerCase() === 'accepted' ? T.greenDim : app.status?.toLowerCase() === 'rejected' ? T.redDim : 'rgba(255,255,255,0.05)', 
                              border: `2px solid ${app.status?.toLowerCase() === 'accepted' ? T.green : app.status?.toLowerCase() === 'rejected' ? T.red : T.border}`, 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', 
                              color: app.status?.toLowerCase() === 'accepted' ? T.green : app.status?.toLowerCase() === 'rejected' ? T.red : T.textDim, 
                              fontSize: '0.65rem', fontWeight: 800 
                            }}>
                              {app.status?.toLowerCase() === 'accepted' ? '✓' : app.status?.toLowerCase() === 'rejected' ? '✕' : '•'}
                            </div>
                            <span style={{ fontSize: '0.68rem', color: T.text, marginTop: 4, fontWeight: 500 }}>Decision</span>
                            <span style={{ fontSize: '0.6rem', color: T.textDim, marginTop: 2 }}>
                              {app.status?.toLowerCase() === 'accepted' ? 'Shortlisted' : app.status?.toLowerCase() === 'rejected' ? 'Rejected' : 'Awaiting'}
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            // ─── Browse Jobs & Saved Screen ──────────────────────────────────────
            <div style={{ display: 'flex', flex: 1, maxWidth: 1440, width: '100%', margin: '0 auto', overflow: 'hidden' }}>
              
              {/* Left Column: Search & Job List */}
              <div style={{ flex: '0 0 40%', minWidth: 380, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${T.border}`, background: 'rgba(9,9,15,0.6)' }}>
                <div style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${T.border}`, background: T.bg }}>
                  <h1 style={{ fontSize: '1.4rem', fontFamily: T.serif, color: T.text, margin: '0 0 16px' }}>
                    {activeTab === 'Saved' ? 'Your Saved Jobs' : 'Recommended for you'}
                  </h1>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <Input 
                      icon={<Search size={15}/>} 
                      placeholder="Search jobs..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      wrapStyle={{ flex: 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                    {['Remote', 'Engineering', 'Full-time'].map(f => {
                      const isSel = selectedFilters.has(f)
                      return (
                        <button 
                          key={f} 
                          onClick={() => handleToggleFilter(f)}
                          style={{ 
                            padding: '6px 14px', 
                            background: isSel ? 'linear-gradient(135deg, #7c6af7, #5b4de0)' : T.surface, 
                            border: `1px solid ${isSel ? T.purpleL : T.border}`, 
                            borderRadius: 20, 
                            fontSize: '0.75rem', 
                            color: isSel ? '#fff' : T.textMid, 
                            whiteSpace: 'nowrap', 
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontWeight: isSel ? 600 : 400
                          }}
                        >
                          {f}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Job List */}
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: T.textDim }}>Loading...</div>
                ) : activeTab === 'Saved' && savedIds.size === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 24px', color: T.textDim }}>
                    <span style={{ fontSize: '2.5rem' }}>🔖</span>
                    <h3 style={{ fontSize: '1.1rem', color: T.text, marginTop: 14, marginBottom: 8, fontWeight: 600 }}>Save some jobs first</h3>
                    <p style={{ fontSize: '0.82rem', color: T.textMid, marginBottom: 20 }}>Tap the bookmark icon on any job to save it here.</p>
                    <Button variant="primary" size="sm" onClick={() => setActiveTab('Browse Jobs')}>Browse Jobs</Button>
                  </div>
                ) : displayedJobs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 24px', color: T.textDim }}>
                    <span style={{ fontSize: '2rem' }}>🔍</span>
                    <p style={{ marginTop: 10 }}>No jobs found.</p>
                  </div>
                ) : (
                  <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {paginatedJobs.map((job) => {
                      const active = job._id === activeJobId
                      const compName = job.company?.name || 'Company'
                      const initials = compName.slice(0, 2).toUpperCase()
                      const isSaved = savedIds.has(job._id)
                      const matchScore = getMatchScore(job._id, job.requirements)

                      return (
                        <div 
                          key={job._id} 
                          onClick={() => setActiveJobId(job._id)}
                          style={{
                            background: active ? T.purpleDim : T.surface,
                            border: `1px solid ${active ? T.purpleL + '55' : T.border}`,
                            borderRadius: 12, padding: '16px 18px', cursor: 'pointer',
                            transition: 'all 0.2s', position: 'relative'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#5b6af7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                {job.logo ? (
                                  <img src={job.logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff' }}>{initials}</span>
                                )}
                              </div>
                              <div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: T.text, marginBottom: 2 }}>{job.title}</div>
                                <div style={{ fontSize: '0.78rem', color: T.textDim }}>{compName}</div>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleToggleSave(job._id) }}
                              style={{ background: 'none', border: 'none', color: isSaved ? T.purple : T.textDim, cursor: 'pointer' }}
                            >
                              <Bookmark size={16} fill={isSaved ? T.purple : 'none'}/>
                            </button>
                          </div>
                          
                          <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem', color: T.textMid, marginBottom: 12 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12}/>{job.location}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={12}/>{formatSal(job.salary)}</span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <Tag color="rgba(255,255,255,0.06)" textColor={T.textMid}>{job.jobType || 'Full-time'}</Tag>
                              <Tag color="rgba(255,255,255,0.06)" textColor={T.textMid}>{getRelativeTime(job.createdAt)}</Tag>
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: matchScore >= 80 ? T.green : T.orange, background: matchScore >= 80 ? T.greenDim : T.orange + '20', padding: '3px 8px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              ✨ {matchScore}% Match
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{ 
                    padding: '16px 24px', 
                    borderTop: `1px solid ${T.border}`, 
                    background: T.bg, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    fontFamily: T.font
                  }}>
                    <button 
                      onClick={() => {
                        const prevPage = currentPage - 1;
                        setCurrentPage(prevPage);
                        const pageFirstJob = displayedJobs[(prevPage - 1) * jobsPerPage];
                        if (pageFirstJob) setActiveJobId(pageFirstJob._id);
                      }}
                      disabled={currentPage === 1}
                      style={{
                        padding: '6px 12px',
                        background: T.surface,
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        color: currentPage === 1 ? T.textDim : T.textMid,
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.18s'
                      }}
                    >
                      Previous
                    </button>

                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isActive = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              setCurrentPage(pageNum);
                              const pageFirstJob = displayedJobs[(pageNum - 1) * jobsPerPage];
                              if (pageFirstJob) setActiveJobId(pageFirstJob._id);
                            }}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              background: isActive ? T.purpleDim : 'transparent',
                              border: `1px solid ${isActive ? T.purpleL + '55' : 'transparent'}`,
                              color: isActive ? T.purpleL : T.textMid,
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.18s'
                            }}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => {
                        const nextPage = currentPage + 1;
                        setCurrentPage(nextPage);
                        const pageFirstJob = displayedJobs[(nextPage - 1) * jobsPerPage];
                        if (pageFirstJob) setActiveJobId(pageFirstJob._id);
                      }}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: '6px 12px',
                        background: T.surface,
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        color: currentPage === totalPages ? T.textDim : T.textMid,
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        transition: 'all 0.18s'
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Job Description / Detail Empty State */}
              {activeTab === 'Saved' && savedIds.size === 0 ? (
                <div style={{ flex: '1 1 60%', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: T.textDim, padding: 32, textAlign: 'center' }}>
                  <span style={{ fontSize: '3.5rem', marginBottom: 16 }}>🔖</span>
                  <h2 style={{ fontSize: '1.4rem', fontFamily: T.serif, color: T.text, margin: '0 0 8px' }}>Your Saved Queue is Empty</h2>
                  <p style={{ color: T.textMid, fontSize: '0.9rem', maxWidth: 360, margin: '0 0 24px', lineHeight: 1.6 }}>Save job postings that interest you, so you can review and apply to them later.</p>
                  <Button variant="primary" onClick={() => setActiveTab('Browse Jobs')}>Find Jobs Now</Button>
                </div>
              ) : activeJob && (activeTab !== 'Saved' || savedIds.has(activeJob._id)) ? (
                <div style={{ flex: '1 1 60%', background: T.bg, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
                  <div style={{ position: 'relative', height: 160, background: `linear-gradient(to bottom, #5b6af722, transparent)`, borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ position: 'absolute', bottom: -28, left: 32, width: 72, height: 72, borderRadius: 16, background: '#5b6af7', border: `4px solid ${T.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {activeJob.logo ? (
                        <img src={activeJob.logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{(activeJob.company?.name || 'Company').slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div style={{ position: 'absolute', top: 24, right: 32, display: 'flex', gap: 8 }}>
                      <Button variant="ghost" size="sm" icon={<Share2 size={14}/>}>Share</Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<BookmarkPlus size={14}/>} 
                        onClick={() => handleToggleSave(activeJob._id)}
                        style={{ color: savedIds.has(activeJob._id) ? T.purpleL : T.textMid }}
                      >
                        {savedIds.has(activeJob._id) ? 'Saved' : 'Save'}
                      </Button>
                    </div>
                  </div>

                  <div style={{ padding: '44px 32px 32px', flex: 1 }}>
                    <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h1 style={{ fontSize: '1.8rem', fontFamily: T.serif, color: T.text, margin: '0 0 8px' }}>{activeJob.title}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.9rem', color: T.textMid }}>
                          <span style={{ fontWeight: 500, color: T.text }}>{activeJob.company?.name || 'Company'}</span>
                          <span>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14}/>{activeJob.location}</span>
                          <span>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14}/>Posted {getRelativeTime(activeJob.createdAt)}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: getMatchScore(activeJob._id, activeJob.requirements) >= 80 ? T.green : T.orange, background: getMatchScore(activeJob._id, activeJob.requirements) >= 80 ? T.greenDim : T.orange + '20', padding: '6px 14px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 6, border: `1px solid ${getMatchScore(activeJob._id, activeJob.requirements) >= 80 ? T.green + '40' : T.orange + '40'}` }}>
                        ✨ {getMatchScore(activeJob._id, activeJob.requirements)}% Match Score
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
                      <Tag color={T.greenDim} textColor={T.green}>{activeJob.jobType || 'Full-time'}</Tag>
                      <Tag color="rgba(255,255,255,0.06)" textColor={T.textMid}>{formatSal(activeJob.salary)}</Tag>
                      {(activeJob.requirements || []).map((t: string) => <Tag key={t} color="rgba(255,255,255,0.06)" textColor={T.textMid}>{t}</Tag>)}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                      <Button 
                        variant="primary" 
                        size="lg" 
                        iconRight={!applyLoading && <ArrowRight size={16}/>} 
                        style={{ padding: '12px 32px' }}
                        onClick={() => handleApply(activeJob._id)}
                        disabled={applyLoading || hasAppliedToActiveJob}
                      >
                        {applyLoading ? 'Applying...' : hasAppliedToActiveJob ? 'Already Applied' : 'Easy Apply'}
                      </Button>
                      
                      {applySuccess && (
                        <span style={{ fontSize: '0.9rem', color: applySuccess.includes('Successfully') ? T.green : '#ef4444', fontWeight: 600 }}>
                          {applySuccess}
                        </span>
                      )}
                    </div>

                    {/* ATS Skills Match Analysis */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, marginBottom: 32 }}>
                      <h3 style={{ fontSize: '0.9rem', color: T.text, margin: '0 0 12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        📊 ATS Skills Match Analysis
                      </h3>
                      
                      {userSkills.length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: T.textDim, margin: 0 }}>
                          Add skills in <span style={{ color: T.purpleL, cursor: 'pointer', fontWeight: 500 }} onClick={() => setActiveTab('My Profile')}>My Profile</span> to see a customized analysis.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {getMatchDetails(activeJob.requirements).matched.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                              <span style={{ fontSize: '0.78rem', color: T.green, fontWeight: 500, minWidth: 100 }}>Matched Skills:</span>
                              {getMatchDetails(activeJob.requirements).matched.map(s => (
                                <span key={s} style={{ fontSize: '0.72rem', background: T.greenDim, color: T.green, padding: '3px 8px', borderRadius: 8 }}>✓ {s}</span>
                              ))}
                            </div>
                          )}
                          
                          {getMatchDetails(activeJob.requirements).missing.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                              <span style={{ fontSize: '0.78rem', color: T.orange, fontWeight: 500, minWidth: 100 }}>Missing Skills:</span>
                              {getMatchDetails(activeJob.requirements).missing.map(s => (
                                <span key={s} style={{ fontSize: '0.72rem', background: T.orange + '15', color: T.orange, padding: '3px 8px', borderRadius: 8 }}>+ {s}</span>
                              ))}
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.78rem', color: T.green, fontWeight: 600 }}>
                              ✨ You have all the matching skills for this position!
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div style={{ height: 1, background: T.border, marginBottom: 32 }} />

                    <div style={{ color: T.textMid, fontSize: '0.95rem', lineHeight: 1.7 }}>
                      <h3 style={{ fontSize: '1.1rem', color: T.text, fontWeight: 600, margin: '0 0 16px' }}>About the role</h3>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{activeJob.description}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ flex: '1 1 60%', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textDim }}>
                  Select a job to view details
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
