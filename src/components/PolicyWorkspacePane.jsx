import React, { useState } from 'react';
import { 
  FileEdit, 
  Share2, 
  Lightbulb, 
  GraduationCap, 
  AlertTriangle, 
  FileSpreadsheet, 
  TrendingUp, 
  CheckCircle2,
  Lock,
  Unlock,
  ShieldCheck
} from 'lucide-react';

export default function PolicyWorkspacePane({ 
  policy, 
  selectedBank, 
  onOpenEditModal, 
  onOpenExportModal 
}) {
  const [activeTab, setActiveTab] = useState('ALL');

  if (!policy) {
    return (
      <main className="flex-1 flex items-center justify-center p-8 text-slate-500 text-xs">
        Select a banking regulatory policy from the left hierarchy tree.
      </main>
    );
  }

  const bankAddenda = policy.bankCustomAddenda?.[selectedBank.id] || {
    sessionTimeout: '15 Minutes Inactivity',
    mfaRule: 'Transfers > $5,000 AUD',
    customClause: 'Standard institutional operational conditions applied.',
    lastModifiedBy: 'Bank Compliance Team',
  };

  const filteredArtifacts = activeTab === 'ALL'
    ? policy.artifacts || []
    : (policy.artifacts || []).filter(a => a.type.toUpperCase() === activeTab.toUpperCase());

  return (
    <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar bg-[#f8fafc] text-slate-900 p-6 space-y-5">
      {/* 1. Header: Breadcrumb & Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="text-[11px] text-slate-500 font-medium mb-1 flex items-center gap-1.5">
            <span>{policy.breadcrumb}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {policy.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenEditModal}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Edit Bank Addenda</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Spec</span>
          </button>
        </div>
      </div>

      {/* 2. Metadata 4-Box Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-xl p-3.5 text-xs shadow-2xs">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Latest Version</div>
          <div className="font-mono text-slate-900 font-bold text-xs mt-0.5">{policy.latestVersion}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Last Updated</div>
          <div className="text-slate-800 font-medium text-xs mt-0.5">{policy.lastUpdated}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Custodian Squad</div>
          <div className="text-slate-800 font-medium text-xs mt-0.5">{policy.ownedBy}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Compliance Standard</div>
          <div className="text-emerald-700 font-bold text-xs mt-0.5 truncate">
            {policy.complianceLevel}
          </div>
        </div>
      </div>

      {/* 3. In-Spirit Vision Statement Box */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 flex gap-3 items-start">
        <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
            REGULATORY INTENT & VISION STATEMENT
          </div>
          <p className="text-xs text-slate-800 leading-relaxed">
            "{policy.visionStatement}"
          </p>
        </div>
      </div>

      {/* 4. Dependencies & System Interlinks */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            System Dependencies & Interlinks
          </span>
          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
            {policy.dependencies?.length || 0} ACTIVE
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {policy.dependencies?.map((dep, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs"
            >
              <span className={`w-2 h-2 rounded-full ${dep.status === 'Deprecating' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              <span className="text-slate-900 font-medium">{dep.name}</span>
              <span className="text-slate-500 text-[11px] font-mono">({dep.status})</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Master Baseline vs Bank Policy Addenda */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* Master Standard */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Master Statutory Framework (Locked)</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.2 rounded border border-emerald-200">
              Mandatory APRA Standard
            </span>
          </div>

          <div className="space-y-2">
            {policy.coreFrameworkClauses?.map((c, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs flex justify-between">
                  <span>{c.clauseId}: {c.title}</span>
                </div>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Custom Addenda */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Unlock className="w-3.5 h-3.5 text-blue-600" />
              <span>Active Bank Addenda ({selectedBank.name.split(' ')[0]})</span>
            </div>
            <button
              onClick={onOpenEditModal}
              className="text-xs text-blue-700 font-bold hover:underline cursor-pointer"
            >
              Modify Terms
            </button>
          </div>

          <div className="space-y-2">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10.5px] uppercase font-bold text-slate-500 block mb-0.5">
                Session Inactivity Timeout
              </span>
              <p className="text-xs font-bold text-slate-900">{bankAddenda.sessionTimeout}</p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10.5px] uppercase font-bold text-slate-500 block mb-0.5">
                Step-Up Authentication Trigger
              </span>
              <p className="text-xs font-bold text-slate-900">{bankAddenda.mfaRule}</p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10.5px] uppercase font-bold text-slate-500 block">
                Institution Addendum Clause
              </span>
              <p className="text-xs font-mono text-slate-900 bg-white p-2 rounded border border-slate-200 leading-relaxed">
                "{bankAddenda.customClause}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Module Details & Logged Artifacts */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Module Details & Logged Artifacts
          </div>

          <div className="flex items-center gap-1 text-xs">
            {['ALL', 'TRAINING', 'REVIEW', 'ISSUES', 'MINUTES'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab === 'TRAINING' && '🎓 Training'}
                {tab === 'REVIEW' && '💬 Review'}
                {tab === 'ISSUES' && '⚠️ Issues'}
                {tab === 'MINUTES' && '📝 Minutes'}
                {tab === 'ALL' && 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Artifact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredArtifacts.map((art) => {
            const isTraining = art.type === 'Training';
            const isIssue = art.type === 'Issues';
            return (
              <div
                key={art.id}
                className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                    isTraining
                      ? 'bg-sky-50 text-sky-800 border-sky-200'
                      : isIssue
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    {art.tag}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{art.location}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  {art.title}
                </h4>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  {art.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Metrics & Telemetry */}
      {policy.metricsTable && (
        <div className="space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
            <span>Metrics & Settlement Latency Telemetry</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Waveform Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 text-[11px]">Settlement Requests (K/min) vs Latency (ms)</span>
                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1 text-cyan-700">
                    <span className="w-2.5 h-0.5 bg-cyan-600"></span> Latency (ms)
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700">
                    <span className="w-2.5 h-0.5 bg-emerald-600"></span> Throughput
                  </span>
                </div>
              </div>

              <div className="h-36 w-full relative pt-1">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120">
                  <defs>
                    <linearGradient id="chartFill2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />

                  <path
                    d="M 0 100 Q 50 105, 100 70 T 200 25 T 300 55 T 400 85 L 400 115 L 0 115 Z"
                    fill="url(#chartFill2)"
                  />

                  <path
                    d="M 0 100 Q 50 105, 100 70 T 200 25 T 300 55 T 400 85"
                    fill="none"
                    stroke="#0891b2"
                    strokeWidth="2.2"
                  />

                  <path
                    d="M 0 95 Q 60 85, 120 65 T 220 35 T 320 45 T 400 75"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />

                  <circle cx="200" cy="25" r="3.5" fill="#0891b2" stroke="#ffffff" strokeWidth="1.5" />
                </svg>

                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1 px-1">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>21:00</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
              <span className="font-bold text-slate-800 text-[11px] block">Detailed Metrics Breakdown</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase border-b border-slate-200">
                      <th className="pb-1.5 font-bold">Metric</th>
                      <th className="pb-1.5 font-bold">Target</th>
                      <th className="pb-1.5 font-bold">Actual</th>
                      <th className="pb-1.5 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {policy.metricsTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 font-medium text-slate-800">{row.metric}</td>
                        <td className="py-2 font-mono text-slate-500">{row.target}</td>
                        <td className="py-2 font-mono font-bold text-slate-900">{row.actual}</td>
                        <td className="py-2 text-right">
                          <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
