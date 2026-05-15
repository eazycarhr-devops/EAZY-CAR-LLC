import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function App() {
  const [activeTab, setActiveTab] = useState('identity')

  const tabs = [
    { id: 'identity', label: 'Identity', icon: '🪪' },
    { id: 'design', label: 'Design DNA', icon: '🎨' },
    { id: 'ops', label: 'Operations', icon: '📊' },
    { id: 'tech', label: 'Tech Stack', icon: '⚡' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#010204] text-white flex items-center justify-center font-bold text-xl rounded shadow-md">EZ</div>
              <div>
                <h1 className="font-heading font-bold text-xl tracking-tight text-[#010204] uppercase italic">Eazy Car LLC</h1>
                <p className="font-mono text-xs text-[#2563EB] uppercase tracking-widest">Brand Architecture & Blueprint</p>
              </div>
            </div>
            <nav className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-bold font-mono uppercase rounded transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'identity' && <IdentitySection />}
        {activeTab === 'design' && <DesignSection />}
        {activeTab === 'ops' && <OpsSection />}
        {activeTab === 'tech' && <TechSection />}
      </main>
    </div>
  )
}

function IdentitySection() {
  return (
    <section className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-heading font-bold text-[#010204] mb-2 italic">Executive Summary & Positioning</h2>
        <p className="text-gray-600 leading-relaxed">This section outlines the foundational identity of EAZY CAR LLC. Premium, futuristic mobility-as-a-service (MaaS) provider.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-2xl shadow-xl">
          <div className="text-[#2563EB] font-mono text-xs uppercase tracking-widest mb-4">Brand Voice</div>
          <h3 className="font-heading font-bold text-4xl italic uppercase leading-none mb-6">Authoritative.<br/>Tech-Forward.<br/>Clandestine.</h3>
          <p className="text-gray-400 font-mono text-sm leading-relaxed border-l-2 border-[#2563EB] pl-4">We treat vehicle access as "asset deployment" rather than a simple rental.</p>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🚗</span>
              <h4 className="font-heading font-bold text-lg">Target Audience</h4>
            </div>
            <p className="text-gray-600 text-sm">High-net-worth individuals and corporate enterprise clients demanding seamless, high-performance transport solutions.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🚁</span>
              <h4 className="font-heading font-bold text-lg">Fleet Strategy</h4>
            </div>
            <p className="text-gray-600 text-sm">High-performance electric and tactical vehicles utilizing a Cyberpunk-Industrial aesthetic.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function DesignSection() {
  return (
    <section className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-heading font-bold text-[#010204] mb-2 italic">Visual & Aesthetic Parameters</h2>
        <p className="text-gray-600 leading-relaxed">Strict design tokens for absolute brand consistency.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-xl uppercase tracking-tight border-b border-gray-200 pb-2">Color Palette</h3>
          {[
            { color: '#010204', name: 'Deep Space Black' },
            { color: '#2563EB', name: 'Electric Blue' },
            { color: '#22C55E', name: 'Tactical Green' },
            { color: '#6B7280', name: 'Muted Gray' },
          ].map(c => (
            <div key={c.color} className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded" style={{ background: c.color }}></div>
              <div>
                <div className="font-bold text-sm">{c.name}</div>
                <div className="font-mono text-xs text-gray-500">{c.color}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2">
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB] rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none"></div>
            <div className="relative z-10 space-y-6">
              <h1 className="font-heading font-bold text-4xl italic text-white uppercase tracking-tighter">Space Grotesk Heading</h1>
              <p className="font-mono text-sm text-gray-400">Used for headings. Always italicized for forward motion.</p>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs text-[#22C55E] uppercase tracking-widest">✓ Node Status: Online</span>
                  <span className="font-mono text-xs text-white">JetBrains Mono</span>
                </div>
                <p className="font-mono text-sm text-gray-300">Monospaced fonts reinforce the terminal and coding aesthetic.</p>
              </div>
              <button className="bg-[#2563EB] hover:bg-blue-700 text-white font-mono font-bold uppercase tracking-widest text-xs px-6 py-3 rounded shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all active:scale-95">
                Deploy Asset →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OpsSection() {
  return (
    <section className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-heading font-bold text-[#010204] mb-2 italic">Operations & Architectural Analytics</h2>
        <p className="text-gray-600 leading-relaxed">Quantitative visualizations of business operations parameters.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-heading font-bold text-xl uppercase tracking-tight mb-2">Tiered Access Distribution</h3>
          <p className="text-sm text-gray-500 mb-4">Customer base across access tiers.</p>
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold font-mono text-[#6B7280]">50%</div>
                <div className="text-xs font-bold uppercase text-gray-500">Standard</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-mono text-[#2563EB]">35%</div>
                <div className="text-xs font-bold uppercase text-[#2563EB]">Tactical</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-mono text-[#22C55E]">15%</div>
                <div className="text-xs font-bold uppercase text-[#22C55E]">Enterprise</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-heading font-bold text-xl uppercase tracking-tight mb-2">Dynamic Pricing Matrix</h3>
          <p className="text-sm text-gray-500 mb-4">Price multipliers corresponding to network node load.</p>
          <div className="space-y-2 py-4">
            {[
              { load: '10-50%', mult: '1.0x' },
              { load: '70%', mult: '1.2x' },
              { load: '85%', mult: '1.8x' },
              { load: '95%', mult: '2.5x' },
              { load: '100%', mult: '3.0x' },
            ].map(item => (
              <div key={item.load} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="font-mono text-xs text-gray-600">{item.load}</span>
                <span className="font-mono text-sm font-bold text-[#2563EB]">{item.mult}</span>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4">
            <p className="text-xs font-mono text-gray-600">
              <span className="font-bold text-[#010204] uppercase">Logic:</span> As grid demand exceeds 70% capacity, multiplier applies to regulate node availability.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function TechSection() {
  const [selected, setSelected] = useState(null)
  const techs = [
    { name: 'Frontend Framework', tag: 'React/Next', border: 'border-[#2563EB]', desc: 'React.js or Next.js selected for extreme rendering speed, component reusability, and optimal SEO capabilities.' },
    { name: 'Styling Engine', tag: 'Tailwind CSS', border: 'border-gray-300', desc: 'Tailwind CSS utilized exclusively via utility classes for rapid development of the glassmorphic UI.' },
    { name: 'Iconography', tag: 'Lucide', border: 'border-gray-300', desc: 'Lucide-React provides clean, minimalist vector icons aligning with the cyber-industrial aesthetic.' },
    { name: 'Motion Library', tag: 'Framer Motion', border: 'border-gray-300', desc: 'Framer Motion handles physics-based animations, smooth slide-ins, and zoom effects.' },
    { name: 'Database / Backend', tag: 'Firestore', border: 'border-[#22C55E]', desc: 'Firebase Firestore (Free Tier) to manage real-time updates for Node Status, inventory, and biometric auth.' },
  ]

  return (
    <section className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-heading font-bold text-[#010204] mb-2 italic">Technical Stack & Deployment Strategy</h2>
        <p className="text-gray-600 leading-relaxed">Exact tools and deployment pathways for the platform.</p>
      </div>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-heading font-bold text-lg uppercase mb-4">Core Architecture</h3>
          {techs.map(tech => (
            <div
              key={tech.name}
              onClick={() => setSelected(tech)}
              className={`bg-white p-4 rounded-xl ${tech.border} border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="font-bold text-[#010204] flex justify-between items-center">
                {tech.name}
                <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">{tech.tag}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-gray-900 text-gray-300 p-6 rounded-2xl shadow-inner font-mono text-sm min-h-[120px] flex items-center">
            <p><span className="text-[#2563EB] font-bold">System output:</span> {selected ? selected.desc : 'Select an architectural component to view its technical justification.'}</p>
          </div>
          <h3 className="font-heading font-bold text-lg uppercase pt-4">Zero-Cost Deployment Pathways</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 p-5 rounded-xl text-center hover:border-[#2563EB] transition-colors">
              <div className="text-2xl mb-2">▲</div>
              <h4 className="font-bold text-sm mb-2">Option A: Vercel</h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Best for Next.js</p>
              <ul className="text-xs text-left space-y-2 text-gray-600">
                <li>1. Push to GitHub repo</li>
                <li>2. Connect Vercel account</li>
                <li>3. Auto SSL & CDN active</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 p-5 rounded-xl text-center hover:border-[#2563EB] transition-colors">
              <div className="text-2xl mb-2">🚀</div>
              <h4 className="font-bold text-sm mb-2">Option B: GitHub</h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Best for Static SPA</p>
              <ul className="text-xs text-left space-y-2 text-gray-600">
                <li>1. Navigate to Repo Settings</li>
                <li>2. Activate GitHub Pages</li>
                <li>3. Select main branch root</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 p-5 rounded-xl text-center hover:border-[#2563EB] transition-colors">
              <div className="text-2xl mb-2">🔥</div>
              <h4 className="font-bold text-sm mb-2">Option C: Firebase</h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Best for DB Sync</p>
              <ul className="text-xs text-left space-y-2 text-gray-600">
                <li className="font-mono bg-gray-100 p-1 rounded">npm i -g firebase-tools</li>
                <li className="font-mono bg-gray-100 p-1 rounded">firebase init hosting</li>
                <li className="font-mono bg-gray-100 p-1 rounded">firebase deploy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
