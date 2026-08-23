import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileText, CheckCircle2, Zap, AlertTriangle, TrendingUp, Search } from 'lucide-react'
import { Button, GlassCard } from './JobPortal'
import API from './services/api'

const T = {
  bg: '#09090f',
  surface: 'rgba(255,255,255,0.04)',
  surfaceHov: 'rgba(255,255,255,0.07)',
  border: 'rgba(255,255,255,0.08)',
  purple: '#7c6af7',
  purpleDim: 'rgba(124,106,247,0.15)',
  green: '#4ade80',
  greenDim: 'rgba(74,222,128,0.12)',
  red: '#ef4444',
  text: '#f0f0fa',
  textMid: '#9090b8',
  textDim: '#5a5a80',
  font: "'DM Sans', sans-serif",
  serif: "'DM Serif Display', serif",
}

export function ResumeAnalyzerView() {
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResults(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setResults(null)
    }
  }

  const [errorMsg, setErrorMsg] = useState('')

  const analyzeResume = async () => {
    if (!file) return
    setAnalyzing(true)
    setErrorMsg('')
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const res = await API.post('/user/analyze-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.data.success) {
        setResults(res.data.analysis)
      } else {
        throw new Error(res.data.message || 'Analysis failed')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.response?.data?.message || err.message || 'An error occurred during analysis.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div style={{ flex: 1, padding: '40px 32px', maxWidth: 1000, margin: '0 auto', width: '100%', fontFamily: T.font }}>
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: T.serif, color: T.text, margin: '0 0 12px' }}>AI Resume Analyzer</h1>
        <p style={{ fontSize: '1.1rem', color: T.textMid, margin: 0 }}>Upload your resume to get instant feedback and improve your ATS score.</p>
      </div>

      {!results && !analyzing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: T.surface,
            border: `2px dashed ${T.border}`,
            borderRadius: 24,
            padding: '60px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          whileHover={{ borderColor: T.purple, backgroundColor: T.surfaceHov }}
        >
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: T.purpleDim, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <UploadCloud size={40} color={T.purple} />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: T.text, margin: '0 0 12px' }}>Upload your resume (PDF, DOCX)</h3>
          <p style={{ color: T.textDim, marginBottom: 24 }}>Drag and drop your file here, or click to browse.</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx" 
            style={{ display: 'none' }}
          />
          {file && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.4)', padding: '12px 24px', borderRadius: 12, marginBottom: 24 }}>
              <FileText size={20} color={T.green} />
              <span style={{ color: T.text }}>{file.name}</span>
            </div>
          )}
          {errorMsg && (
            <div style={{ color: T.red, fontSize: '0.85rem', marginBottom: 16 }}>
              {errorMsg}
            </div>
          )}
          <Button 
            variant="primary" 
            size="lg" 
            icon={<Zap size={18} />} 
            onClick={(e) => { e.stopPropagation(); analyzeResume(); }}
            disabled={!file}
          >
            Analyze Resume
          </Button>
        </motion.div>
      )}

      {analyzing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}
        >
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            style={{ width: 64, height: 64, borderRadius: '50%', border: `4px solid ${T.surface}`, borderTopColor: T.purple, marginBottom: 24 }}
          />
          <h3 style={{ fontSize: '1.5rem', color: T.text, margin: '0 0 12px' }}>Our AI is analyzing your resume...</h3>
          <p style={{ color: T.textMid }}>Checking formatting, keywords, and ATS compatibility.</p>
        </motion.div>
      )}

      <AnimatePresence>
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            <div style={{ display: 'flex', gap: 24 }}>
              <GlassCard style={{ flex: '1 1 30%', textAlign: 'center', padding: 32 }}>
                <div style={{ fontSize: '1.1rem', color: T.textMid, marginBottom: 16 }}>Overall Score</div>
                <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="70" cy="70" r="60" fill="none" stroke={T.surface} strokeWidth="12" />
                    <motion.circle 
                      cx="70" cy="70" r="60" fill="none" stroke={T.purple} strokeWidth="12" 
                      strokeDasharray="377" 
                      initial={{ strokeDashoffset: 377 }}
                      animate={{ strokeDashoffset: 377 - (377 * results.score) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div style={{ position: 'absolute', fontSize: '3rem', fontWeight: 700, color: T.text, fontFamily: T.serif }}>
                    {results.score}
                  </div>
                </div>
                <div style={{ marginTop: 24, color: T.textDim, fontSize: '0.9rem' }}>
                  Based on industry standard ATS criteria.
                </div>
              </GlassCard>

              <div style={{ flex: '1 1 70%', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <GlassCard style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <CheckCircle2 size={24} color={T.green} />
                    <h3 style={{ fontSize: '1.2rem', color: T.text, margin: 0 }}>Strengths</h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 24, color: T.textMid, lineHeight: 1.6 }}>
                    {results.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </GlassCard>

                <GlassCard style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <AlertTriangle size={24} color={T.red} />
                    <h3 style={{ fontSize: '1.2rem', color: T.text, margin: 0 }}>Areas for Improvement</h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 24, color: T.textMid, lineHeight: 1.6 }}>
                    {results.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
                  </ul>
                </GlassCard>
              </div>
            </div>

            <GlassCard style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Search size={24} color={T.purple} />
                <h3 style={{ fontSize: '1.4rem', color: T.text, margin: 0 }}>Keyword Analysis</h3>
              </div>
              <div style={{ display: 'flex', gap: 40 }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: T.green, margin: '0 0 16px', fontSize: '1rem' }}>Found Keywords</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {results.keywords.found.map((k: string) => (
                      <span key={k} style={{ background: T.greenDim, color: T.green, padding: '6px 12px', borderRadius: 16, fontSize: '0.85rem' }}>{k}</span>
                    ))}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: T.red, margin: '0 0 16px', fontSize: '1rem' }}>Missing Key Terms</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {results.keywords.missing.map((k: string) => (
                      <span key={k} style={{ background: 'rgba(239,68,68,0.1)', color: T.red, padding: '6px 12px', borderRadius: 16, fontSize: '0.85rem' }}>{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
               <Button variant="outline" onClick={() => { setFile(null); setResults(null); }} icon={<UploadCloud size={16}/>}>Upload Another Resume</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
