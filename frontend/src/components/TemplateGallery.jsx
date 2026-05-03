import { useState } from 'react'
import { darkTokens as D, C } from '../theme'

const TEMPLATE_URL = 'https://docs.google.com/document/u/0/?ftv=1&tgif=d'

const categories = ['All', 'Freshers', 'Experienced', 'NBFC / Finance', 'IT / Tech', 'Non-IT', 'Healthcare', 'Creative']

const templates = [
  // Freshers
  { id: 1,  name: 'Clean Graduate',       category: 'Freshers',       desc: 'Minimal, ATS-friendly layout for fresh graduates' },
  { id: 2,  name: 'Tech Fresher',         category: 'Freshers',       desc: 'Perfect for CS / IT fresh graduates' },
  { id: 3,  name: 'Business Graduate',    category: 'Freshers',       desc: 'Commerce / MBA fresher with internship experience' },
  { id: 4,  name: 'Campus Placement',     category: 'Freshers',       desc: 'One-page template built for campus drives' },

  // Experienced
  { id: 5,  name: 'Professional Classic', category: 'Experienced',    desc: '3–8 years experience, timeless clean layout' },
  { id: 6,  name: 'Senior Manager',       category: 'Experienced',    desc: 'Leadership-focused, highlights team impact' },
  { id: 7,  name: 'Executive Resume',     category: 'Experienced',    desc: 'C-suite and director level, boardroom-ready' },
  { id: 8,  name: 'Career Change',        category: 'Experienced',    desc: 'Highlight transferable skills across domains' },

  // NBFC / Finance
  { id: 9,  name: 'Banking Professional', category: 'NBFC / Finance', desc: 'Retail banking, relationship manager, branch ops' },
  { id: 10, name: 'Financial Analyst',    category: 'NBFC / Finance', desc: 'CFA, equity research, investment banking' },
  { id: 11, name: 'Credit Manager',       category: 'NBFC / Finance', desc: 'Credit risk, loan processing, NBFC / HFC' },
  { id: 12, name: 'Wealth Manager',       category: 'NBFC / Finance', desc: 'HNI advisory, portfolio management, private banking' },

  // IT / Tech
  { id: 13, name: 'Software Engineer',    category: 'IT / Tech',      desc: 'SDE / backend / frontend developer template' },
  { id: 14, name: 'Full Stack Developer', category: 'IT / Tech',      desc: 'MERN, Java, Python full-stack developers' },
  { id: 15, name: 'Data Scientist',       category: 'IT / Tech',      desc: 'ML / AI / analytics — projects-forward layout' },
  { id: 16, name: 'DevOps / Cloud',       category: 'IT / Tech',      desc: 'AWS, Azure, Kubernetes, CI/CD focused' },

  // Non-IT
  { id: 17, name: 'Marketing Manager',    category: 'Non-IT',         desc: 'Digital marketing, brand manager, growth' },
  { id: 18, name: 'HR Manager',           category: 'Non-IT',         desc: 'Human resources, talent acquisition, L&D' },
  { id: 19, name: 'Operations Manager',   category: 'Non-IT',         desc: 'Supply chain, logistics, process optimization' },
  { id: 20, name: 'Sales Executive',      category: 'Non-IT',         desc: 'B2B / B2C sales, account management, targets' },

  // Healthcare
  { id: 21, name: 'Medical Professional', category: 'Healthcare',     desc: 'Doctor, specialist, clinician — clinical layout' },
  { id: 22, name: 'Nursing Resume',       category: 'Healthcare',     desc: 'RN, staff nurse, ICU — skills-first format' },
  { id: 23, name: 'Pharma / Research',    category: 'Healthcare',     desc: 'Pharmaceutical, biotech, clinical research' },

  // Creative
  { id: 24, name: 'Designer Portfolio',   category: 'Creative',       desc: 'UI/UX, graphic design — visual-forward layout' },
  { id: 25, name: 'Content Strategist',   category: 'Creative',       desc: 'Writers, editors, social media, content strategy' },
]

export default function TemplateGallery() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? templates : templates.filter(t => t.category === active)

  return (
    <div style={styles.wrap}>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Resume Templates</h2>
        <p style={styles.pageSubtitle}>
          Download a free template, fill it in, then upload here for an instant AI score.
        </p>
      </div>

      {/* Category pills */}
      <div className="category-pills">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            style={{ ...styles.pill, ...(active === cat ? styles.pillActive : {}) }}
          >
            {cat}
          </button>
        ))}
      </div>

      <p style={styles.count}>{filtered.length} template{filtered.length !== 1 ? 's' : ''}</p>

      {/* Grid */}
      <div className="template-grid">
        {filtered.map(t => <TemplateCard key={t.id} template={t} />)}
      </div>
    </div>
  )
}

function TemplateCard({ template: t }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Preview area */}
      <div style={styles.preview}>
        <div style={styles.previewDoc}>
          <div style={styles.docLine1} />
          <div style={styles.docLine2} />
          <div style={{ height: '10px' }} />
          <div style={styles.docLineShort} />
          <div style={styles.docLineFull} />
          <div style={styles.docLineMed} />
          <div style={styles.docLineFull} />
        </div>
        <div style={styles.catBadge}>{t.category}</div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <h3 style={styles.name}>{t.name}</h3>
        <p style={styles.desc}>{t.desc}</p>
        <a
          href={TEMPLATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...styles.btn,
            background: hovered ? C.gradient : 'transparent',
            color: hovered ? '#fff' : C.accent,
          }}
        >
          Use Template
        </a>
      </div>
    </div>
  )
}

const styles = {
  wrap:        { width: '100%', animation: 'fadeIn 0.3s ease' },
  pageHeader:  { marginBottom: '24px' },
  pageTitle:   { fontSize: '28px', fontWeight: '800', color: D.text, marginBottom: '8px', letterSpacing: '-0.5px' },
  pageSubtitle:{ color: D.textMuted, fontSize: '15px', lineHeight: '1.6' },
  count:       { color: D.textMuted, fontSize: '13px', marginBottom: '16px' },

  pill:        { padding: '8px 18px', borderRadius: '999px', border: `1px solid ${D.border}`, background: 'transparent', color: D.textMuted, cursor: 'pointer', fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 },
  pillActive:  { background: D.gradient, color: '#fff', border: '1px solid transparent', fontWeight: '700' },

  card:        { background: C.card_light, border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden', transition: 'all 0.25s' },
  cardHover:   { transform: 'translateY(-4px)', boxShadow: `0 12px 32px ${C.accent}30`, borderColor: '#a5b4fc' },

  preview:     { background: D.card, padding: '28px 24px 20px', position: 'relative', display: 'flex', justifyContent: 'center' },
  previewDoc:  { background: '#ffffff', borderRadius: '6px', padding: '16px 14px', width: '140px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '6px' },
  docLine1:    { height: '8px', background: C.accent, borderRadius: '4px', width: '70%' },
  docLine2:    { height: '5px', background: C.border, borderRadius: '4px', width: '50%' },
  docLineShort:{ height: '4px', background: '#e2e8f0', borderRadius: '4px', width: '35%' },
  docLineFull: { height: '4px', background: '#e2e8f0', borderRadius: '4px', width: '100%' },
  docLineMed:  { height: '4px', background: '#e2e8f0', borderRadius: '4px', width: '80%' },

  catBadge:    { position: 'absolute', top: '10px', right: '10px', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '999px', background: `${C.accent}25`, color: '#a5b4fc', border: `1px solid ${C.accent}40`, letterSpacing: '0.3px' },

  body:        { padding: '16px 18px 18px' },
  name:        { fontSize: '15px', fontWeight: '700', color: C.text, marginBottom: '6px' },
  desc:        { fontSize: '12px', color: C.muted, lineHeight: '1.6', marginBottom: '14px' },
  btn:         { display: 'block', textAlign: 'center', padding: '9px 16px', borderRadius: '8px', border: `1.5px solid ${C.accent}`, fontSize: '13px', fontWeight: '600', textDecoration: 'none', transition: 'all 0.2s' },
}
