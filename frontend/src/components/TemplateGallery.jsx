import { useState } from 'react'

const C = {
  text:    '#fef3e2',
  sub:     '#78350f',
  muted:   '#a16207',
  border:  '#f0d070',
  accent:  '#f59e0b',
  grad:    'linear-gradient(135deg, #f59e0b, #ea580c)',
}

const categories = ['All', 'Freshers', 'Experienced', 'NBFC / Finance', 'IT / Tech', 'Non-IT', 'Healthcare', 'Creative']

const templates = [
  // Freshers
  { id: 1,  name: 'Clean Graduate',      category: 'Freshers',      desc: 'Minimal, ATS-friendly layout for fresh graduates',          preview: '#fef3c7', accent: '#f59e0b', icon: '🎓' },
  { id: 2,  name: 'Tech Fresher',        category: 'Freshers',      desc: 'Perfect for CS / IT fresh graduates',                       preview: '#dbeafe', accent: '#2563eb', icon: '💻' },
  { id: 3,  name: 'Business Graduate',   category: 'Freshers',      desc: 'Commerce / MBA fresher with internship experience',         preview: '#dcfce7', accent: '#16a34a', icon: '📊' },
  { id: 4,  name: 'Campus Placement',    category: 'Freshers',      desc: 'One-page template built for campus drives',                 preview: '#fce7f3', accent: '#db2777', icon: '🏫' },

  // Experienced
  { id: 5,  name: 'Professional Classic',category: 'Experienced',   desc: '3–8 years experience, timeless clean layout',              preview: '#ede9fe', accent: '#7c3aed', icon: '💼' },
  { id: 6,  name: 'Senior Manager',      category: 'Experienced',   desc: 'Leadership-focused, highlights team impact',               preview: '#fff7ed', accent: '#ea580c', icon: '👔' },
  { id: 7,  name: 'Executive Resume',    category: 'Experienced',   desc: 'C-suite and director level, boardroom-ready',              preview: '#f1f5f9', accent: '#334155', icon: '🏛️' },
  { id: 8,  name: 'Career Change',       category: 'Experienced',   desc: 'Highlight transferable skills across domains',             preview: '#ecfdf5', accent: '#059669', icon: '🔄' },

  // NBFC / Finance
  { id: 9,  name: 'Banking Professional',category: 'NBFC / Finance', desc: 'Retail banking, relationship manager, branch ops',         preview: '#fef3c7', accent: '#d97706', icon: '🏦' },
  { id: 10, name: 'Financial Analyst',   category: 'NBFC / Finance', desc: 'CFA, equity research, investment banking',                 preview: '#ecfdf5', accent: '#059669', icon: '📈' },
  { id: 11, name: 'Credit Manager',      category: 'NBFC / Finance', desc: 'Credit risk, loan processing, NBFC / HFC',                preview: '#fff7ed', accent: '#ea580c', icon: '💳' },
  { id: 12, name: 'Wealth Manager',      category: 'NBFC / Finance', desc: 'HNI advisory, portfolio management, private banking',      preview: '#faf5ff', accent: '#7c3aed', icon: '💰' },

  // IT / Tech
  { id: 13, name: 'Software Engineer',   category: 'IT / Tech',     desc: 'SDE / backend / frontend developer template',             preview: '#eff6ff', accent: '#2563eb', icon: '⚙️' },
  { id: 14, name: 'Full Stack Dev',      category: 'IT / Tech',     desc: 'MERN, Java, Python full-stack developers',                 preview: '#f0fdf4', accent: '#16a34a', icon: '🖥️' },
  { id: 15, name: 'Data Scientist',      category: 'IT / Tech',     desc: 'ML / AI / analytics — projects-forward layout',           preview: '#faf5ff', accent: '#7c3aed', icon: '🤖' },
  { id: 16, name: 'DevOps / Cloud',      category: 'IT / Tech',     desc: 'AWS, Azure, Kubernetes, CI/CD focused',                   preview: '#fff7ed', accent: '#ea580c', icon: '☁️' },

  // Non-IT
  { id: 17, name: 'Marketing Pro',       category: 'Non-IT',        desc: 'Digital marketing, brand manager, growth hacker',         preview: '#fff1f2', accent: '#e11d48', icon: '📣' },
  { id: 18, name: 'HR Manager',          category: 'Non-IT',        desc: 'Human resources, talent acquisition, L&D',               preview: '#fef3c7', accent: '#d97706', icon: '🤝' },
  { id: 19, name: 'Operations Manager',  category: 'Non-IT',        desc: 'Supply chain, logistics, process optimization',           preview: '#f0f9ff', accent: '#0284c7', icon: '🏭' },
  { id: 20, name: 'Sales Executive',     category: 'Non-IT',        desc: 'B2B / B2C sales, account management, targets',           preview: '#f0fdf4', accent: '#16a34a', icon: '🎯' },

  // Healthcare
  { id: 21, name: 'Medical Professional',category: 'Healthcare',    desc: 'Doctor, specialist, clinician — clean clinical layout',   preview: '#ecfdf5', accent: '#059669', icon: '🩺' },
  { id: 22, name: 'Nursing Resume',      category: 'Healthcare',    desc: 'RN, staff nurse, ICU — skills-first format',              preview: '#fff0f3', accent: '#f43f5e', icon: '💊' },
  { id: 23, name: 'Pharma / Research',   category: 'Healthcare',    desc: 'Pharmaceutical, biotech, clinical research',              preview: '#eff6ff', accent: '#2563eb', icon: '🔬' },

  // Creative
  { id: 24, name: 'Designer Portfolio',  category: 'Creative',      desc: 'UI/UX, graphic design — visual-forward layout',          preview: '#fdf4ff', accent: '#a21caf', icon: '🎨' },
  { id: 25, name: 'Content Creator',     category: 'Creative',      desc: 'Writers, editors, social media, content strategy',       preview: '#fff7ed', accent: '#ea580c', icon: '✍️' },
]

export default function TemplateGallery() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? templates : templates.filter(t => t.category === active)

  return (
    <div style={styles.wrap}>
      {/* Header */}
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
            style={{
              ...styles.pill,
              ...(active === cat ? styles.pillActive : {}),
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p style={styles.count}>{filtered.length} template{filtered.length !== 1 ? 's' : ''}</p>

      {/* Grid */}
      <div className="template-grid">
        {filtered.map(t => (
          <TemplateCard key={t.id} template={t} />
        ))}
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
      <div style={{ ...styles.preview, background: t.preview }}>
        <span style={styles.previewIcon}>{t.icon}</span>
        {/* Fake lines to simulate a resume */}
        <div style={styles.fakeLines}>
          <div style={{ ...styles.fakeLine, width: '70%', background: t.accent, opacity: 0.7, height: '6px' }} />
          <div style={{ ...styles.fakeLine, width: '45%', background: t.accent, opacity: 0.4 }} />
          <div style={{ height: '8px' }} />
          <div style={{ ...styles.fakeLine, width: '90%', opacity: 0.25 }} />
          <div style={{ ...styles.fakeLine, width: '80%', opacity: 0.2 }} />
          <div style={{ ...styles.fakeLine, width: '85%', opacity: 0.2 }} />
        </div>
        {/* Category badge */}
        <div style={{ ...styles.catBadge, background: t.accent + '22', color: t.accent, border: `1px solid ${t.accent}44` }}>
          {t.category}
        </div>
      </div>

      {/* Card body */}
      <div style={styles.body}>
        <h3 style={styles.name}>{t.name}</h3>
        <p style={styles.desc}>{t.desc}</p>
        <a
          href="https://docs.google.com/document/u/0/?ftv=1&tgif=d"
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...styles.downloadBtn, background: hovered ? t.accent : 'transparent', color: hovered ? '#fff' : t.accent, borderColor: t.accent }}
        >
          ↓ Use Template
        </a>
      </div>
    </div>
  )
}

const styles = {
  wrap:        { width: '100%', animation: 'fadeIn 0.3s ease' },
  pageHeader:  { marginBottom: '24px' },
  pageTitle:   { fontSize: '28px', fontWeight: '800', color: '#fef3e2', marginBottom: '8px', letterSpacing: '-0.5px' },
  pageSubtitle:{ color: '#8a5a5a', fontSize: '15px', lineHeight: '1.6' },
  count:       { color: '#8a5a5a', fontSize: '13px', marginBottom: '16px' },

  pill:        { padding: '8px 18px', borderRadius: '999px', border: '1px solid #2d0808', background: 'transparent', color: '#8a5a5a', cursor: 'pointer', fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 },
  pillActive:  { background: 'linear-gradient(135deg, #f59e0b, #ea580c)', color: '#fff', border: '1px solid transparent', fontWeight: '700' },

  card:        { background: 'linear-gradient(145deg, #fffef8, #fef9c3)', border: '1px solid #f0d070', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.25s', cursor: 'default' },
  cardHover:   { transform: 'translateY(-4px)', boxShadow: '0 12px 32px rgba(245,158,11,0.20)', borderColor: '#e0b030' },

  preview:     { padding: '24px 20px 16px', position: 'relative', minHeight: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  previewIcon: { fontSize: '32px', lineHeight: 1 },
  fakeLines:   { width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' },
  fakeLine:    { height: '4px', background: '#78350f', borderRadius: '999px' },
  catBadge:    { position: 'absolute', top: '10px', right: '10px', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '999px', letterSpacing: '0.3px' },

  body:        { padding: '16px 18px 18px' },
  name:        { fontSize: '15px', fontWeight: '700', color: '#1c1917', marginBottom: '6px' },
  desc:        { fontSize: '12px', color: '#78350f', lineHeight: '1.6', marginBottom: '14px' },
  downloadBtn: { display: 'block', textAlign: 'center', padding: '9px 16px', borderRadius: '8px', border: '1.5px solid', fontSize: '13px', fontWeight: '700', textDecoration: 'none', transition: 'all 0.2s' },
}
