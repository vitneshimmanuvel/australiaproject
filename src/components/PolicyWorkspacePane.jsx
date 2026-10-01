import React, { useState } from 'react';
import { 
  FileEdit, 
  Share2, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle2,
  Lock,
  Unlock,
  ShieldCheck,
  Clock,
  Layers,
  FileText,
  AlertCircle,
  Power,
  ToggleLeft,
  ToggleRight,
  ShieldAlert
} from 'lucide-react';

export default function PolicyWorkspacePane({ 
  policy, 
  selectedBank, 
  onOpenEditModal, 
  onOpenExportModal,
  onTogglePolicyActive
}) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [timeRange, setTimeRange] = useState('24h');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!policy) {
    return (
      <main className="flex-1 flex items-center justify-center p-8 text-slate-500 text-xs">
        Select a banking regulatory policy from the left hierarchy tree.
      </main>
    );
  }

  const bankAddendaRaw = policy.bankCustomAddenda?.[selectedBank.id];
  const isPolicyActive = Boolean(bankAddendaRaw && bankAddendaRaw.status !== 'INACTIVE');

  const bankAddenda = bankAddendaRaw || {
    sessionTimeout: '15 Minutes Inactivity / 8h Absolute',
    mfaRule: 'Transfers > $5,000 AUD or Novel IP',
    customClause: 'Standard institutional operational conditions applied.',
    lastModifiedBy: 'Bank Compliance Team',
  };

  const filteredArtifacts = activeTab === 'ALL'
    ? (policy.artifacts || [])
    : (policy.artifacts || []).filter(a => a.type?.toUpperCase() === activeTab.toUpperCase());

  // Dynamic telemetry configuration for each policy domain
  const getTelemetryConfig = () => {
    const id = policy.id || '';
    const breadcrumb = (policy.breadcrumb || '').toLowerCase();

    if (breadcrumb.includes('cps 230') || id.includes('continuity') || id.includes('third-party')) {
      return {
        title: 'Operational Resilience & Service Continuity',
        subtitle: 'Core Availability SLA (%) vs RTO Recovery Failover (min)',
        line1Name: 'Recovery RTO (min)',
        line2Name: 'Core SLA Uptime (%)',
        points: [
          { time: '00:00', val1: '1.2m', val2: '99.99%', x: 0, y1: 95, y2: 25 },
          { time: '06:00', val1: '0.8m', val2: '99.99%', x: 100, y1: 102, y2: 22 },
          { time: '12:00', val1: '2.1m', val2: '99.98%', x: 200, y1: 80, y2: 30 },
          { time: '18:00', val1: '1.4m', val2: '99.99%', x: 300, y1: 92, y2: 24 },
          { time: '21:00', val1: '0.9m', val2: '100.0%', x: 400, y1: 100, y2: 20 },
        ],
        pathD: "M 0 95 Q 50 102, 100 102 T 200 80 T 300 92 T 400 100",
        pathD2: "M 0 25 Q 50 22, 100 22 T 200 30 T 300 24 T 400 20",
      };
    }

    if (breadcrumb.includes('privacy') || id.includes('privacy') || id.includes('cdr')) {
      return {
        title: 'Customer Data Governance & CDR Consent',
        subtitle: 'PII Tokenization (P99 ms) vs Open Banking CDR Grant Verification',
        line1Name: 'Tokenization (ms)',
        line2Name: 'CDR Throughput',
        points: [
          { time: '00:00', val1: '6.4ms', val2: '280 req/s', x: 0, y1: 90, y2: 70 },
          { time: '06:00', val1: '7.8ms', val2: '840 req/s', x: 100, y1: 82, y2: 45 },
          { time: '12:00', val1: '11.2ms', val2: '1,920 req/s', x: 200, y1: 65, y2: 25 },
          { time: '18:00', val1: '9.1ms', val2: '1,450 req/s', x: 300, y1: 75, y2: 35 },
          { time: '21:00', val1: '6.8ms', val2: '610 req/s', x: 400, y1: 88, y2: 60 },
        ],
        pathD: "M 0 90 Q 50 82, 100 82 T 200 65 T 300 75 T 400 88",
        pathD2: "M 0 70 Q 50 45, 100 45 T 200 25 T 300 35 T 400 60",
      };
    }

    if (breadcrumb.includes('financial crime') || breadcrumb.includes('aml') || id.includes('aml') || id.includes('sanctions')) {
      return {
        title: 'AUSTRAC Financial Crime & Sanctions Pipeline',
        subtitle: 'Sanctions Matching (ms) vs AUSTRAC TTR Processing Queue',
        line1Name: 'Sanctions Latency (ms)',
        line2Name: 'TTR Queue Depth',
        points: [
          { time: '00:00', val1: '24.1ms', val2: '12 items', x: 0, y1: 85, y2: 95 },
          { time: '06:00', val1: '26.8ms', val2: '45 items', x: 100, y1: 78, y2: 80 },
          { time: '12:00', val1: '32.4ms', val2: '210 items', x: 200, y1: 60, y2: 40 },
          { time: '18:00', val1: '29.0ms', val2: '140 items', x: 300, y1: 70, y2: 55 },
          { time: '21:00', val1: '25.3ms', val2: '30 items', x: 400, y1: 82, y2: 90 },
        ],
        pathD: "M 0 85 Q 50 78, 100 78 T 200 60 T 300 70 T 400 82",
        pathD2: "M 0 95 Q 50 80, 100 80 T 200 40 T 300 55 T 400 90",
      };
    }

    if (breadcrumb.includes('payment') || id.includes('npp') || id.includes('rate-limiting')) {
      return {
        title: 'NPP Rails Fast Settlement & Gateway Throughput',
        subtitle: 'Fast Settlement Velocity (s) vs Gateway Traffic (Tx/min)',
        line1Name: 'Settlement Time (s)',
        line2Name: 'NPP Throughput',
        points: [
          { time: '00:00', val1: '1.2s', val2: '450 Tx/m', x: 0, y1: 95, y2: 85 },
          { time: '06:00', val1: '1.3s', val2: '1,200 Tx/m', x: 100, y1: 90, y2: 60 },
          { time: '12:00', val1: '1.8s', val2: '4,850 Tx/m', x: 200, y1: 70, y2: 25 },
          { time: '18:00', val1: '1.5s', val2: '3,100 Tx/m', x: 300, y1: 80, y2: 45 },
          { time: '21:00', val1: '1.3s', val2: '890 Tx/m', x: 400, y1: 92, y2: 75 },
        ],
        pathD: "M 0 95 Q 50 90, 100 90 T 200 70 T 300 80 T 400 92",
        pathD2: "M 0 85 Q 50 60, 100 60 T 200 25 T 300 45 T 400 75",
      };
    }

    if (breadcrumb.includes('aps 220') || id.includes('lending') || id.includes('credit-risk')) {
      return {
        title: 'Retail Lending Risk & Serviceability Telemetry',
        subtitle: 'CCR Bureau Ingestion (s) vs Automated Decisioning Volume (Loans/hr)',
        line1Name: 'Bureau Latency (s)',
        line2Name: 'Decisioning Vol',
        points: [
          { time: '00:00', val1: '0.6s', val2: '45 loans/h', x: 0, y1: 95, y2: 80 },
          { time: '06:00', val1: '0.8s', val2: '120 loans/h', x: 100, y1: 85, y2: 55 },
          { time: '12:00', val1: '1.1s', val2: '480 loans/h', x: 200, y1: 72, y2: 25 },
          { time: '18:00', val1: '0.9s', val2: '320 loans/h', x: 300, y1: 80, y2: 40 },
          { time: '21:00', val1: '0.7s', val2: '95 loans/h', x: 400, y1: 90, y2: 70 },
        ],
        pathD: "M 0 95 Q 50 85, 100 85 T 200 72 T 300 80 T 400 90",
        pathD2: "M 0 80 Q 50 55, 100 55 T 200 25 T 300 40 T 400 70",
      };
    }

    // Default APRA CPS 234 / Authentication Security
    return {
      title: 'APRA CPS 234 Cryptographic Verification Telemetry',
      subtitle: 'Token Issue & Revocation Latency (ms) vs Active Multi-Bank Sessions',
      line1Name: 'Token Latency (ms)',
      line2Name: 'Active Sessions',
      points: [
        { time: '00:00', val1: '12.1ms', val2: '1.2k sess', x: 0, y1: 92, y2: 80 },
        { time: '06:00', val1: '13.5ms', val2: '3.4k sess', x: 100, y1: 88, y2: 55 },
        { time: '12:00', val1: '16.8ms', val2: '8.9k sess', x: 200, y1: 72, y2: 25 },
        { time: '18:00', val1: '14.9ms', val2: '6.1k sess', x: 300, y1: 82, y2: 40 },
        { time: '21:00', val1: '12.8ms', val2: '2.5k sess', x: 400, y1: 90, y2: 70 },
      ],
      pathD: "M 0 92 Q 50 88, 100 88 T 200 72 T 300 82 T 400 90",
      pathD2: "M 0 80 Q 50 55, 100 55 T 200 25 T 300 40 T 400 70",
    };
  };

  const isLending = policy.id?.includes('aps-220') || policy.id?.includes('credit') || policy.id?.includes('lending');
  const isAuth = policy.id?.includes('oauth') || policy.id?.includes('mfa') || policy.id?.includes('privileged-access');
  const isPrivacy = policy.id?.includes('privacy') || policy.id?.includes('cdr');
  const isAml = policy.id?.includes('aml') || policy.id?.includes('sanctions');

  const getWorkspaceCardLabels = () => {
    if (isLending) {
      return {
        label1: 'CONFIGURED LOAN LIMIT',
        label2: 'INCOME & SERVICEABILITY VERIFICATION STREAM',
        label3: 'INSTITUTION LENDING POLICY CLAUSE',
      };
    }
    if (isAuth) {
      return {
        label1: 'CONFIGURED OPERATIONAL TIMEOUT',
        label2: 'STEP-UP / RISK THRESHOLD TRIGGER',
        label3: 'INSTITUTION SECURITY CLAUSE',
      };
    }
    if (isPrivacy) {
      return {
        label1: 'STATUTORY RETENTION & PURGE SCHEDULE',
        label2: 'DATA ACCESS & EXPORT CLEARANCE LEVEL',
        label3: 'INSTITUTION PRIVACY CLAUSE',
      };
    }
    if (isAml) {
      return {
        label1: 'AUSTRAC BATCH TRANSMISSION FREQUENCY',
        label2: 'SANCTIONS CLEARANCE & OVERRIDE AUTHORIZATION',
        label3: 'INSTITUTION AML CLAUSE',
      };
    }
    return {
      label1: 'CONFIGURED OPERATIONAL PARAMETER',
      label2: 'RISK THRESHOLD / VERIFICATION TRIGGER',
      label3: 'INSTITUTIONAL POLICY CLAUSE',
    };
  };

  const cardLabels = getWorkspaceCardLabels();
  const telemetry = getTelemetryConfig();

  return (
    <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar bg-[#dcecfe] text-slate-900 p-5 sm:p-7 space-y-6">
      {/* 1. Header: Clean Title & Action Buttons + Active / Inactive Status Switcher */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold text-slate-700">{policy.breadcrumb}</span>
            <span className="text-[10.5px] font-mono font-bold bg-slate-100 text-slate-900 px-2 py-0.5 rounded border border-slate-300">
              {policy.latestVersion}
            </span>
            <span className="text-[10.5px] font-bold bg-slate-100 text-slate-900 px-2 py-0.5 rounded border border-slate-300">
              {policy.complianceLevel}
            </span>
          </div>

          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {policy.title}
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
            <span>Owner: <strong className="text-slate-900 font-bold">{policy.ownedBy}</strong></span>
            <span>•</span>
            <span>Last Updated: <strong className="text-slate-900 font-bold">{policy.lastUpdated}</strong></span>
          </div>
        </div>

        {/* Action Buttons + Active / Inactive Button */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          {/* Active / Inactive Toggle Button for Selected Bank */}
          {onTogglePolicyActive && (
            <button
              onClick={() => onTogglePolicyActive(policy.id, selectedBank.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer border shadow-2xs ${
                isPolicyActive
                  ? 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
              title={isPolicyActive ? "Click to set this policy to Inactive for this bank" : "Click to Activate this policy for this bank"}
            >
              <Power className="w-3.5 h-3.5 text-slate-700" />
              {isPolicyActive ? (
                <span>🟢 Active</span>
              ) : (
                <span>⚡ Activate</span>
              )}
            </button>
          )}

          <button
            onClick={onOpenEditModal}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Configure</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 px-3.5 py-2 rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-700" />
            <span>Export Cert</span>
          </button>
        </div>
      </div>

      {/* 2. Executive Summary / Basic Understanding Callout */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 flex gap-3 items-start shadow-sm">
        <Lightbulb className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-900">
            REGULATORY INTENT & PURPOSE (PLAIN ENGLISH)
          </div>
          <p className="text-xs text-slate-900 leading-relaxed font-medium">
            "{policy.visionStatement}"
          </p>
        </div>
      </div>

      {/* 3. Core Comparison: Master Statutory Framework vs Bank Institutional Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* Left Card: Master Standard (Locked) */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <Lock className="w-3.5 h-3.5 text-slate-800" />
              <span>Master Statutory Framework (Locked)</span>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-900 px-2 py-0.5 rounded border border-slate-300">
              Mandatory APRA Standard
            </span>
          </div>

          <div className="space-y-2">
            {(policy.coreFrameworkClauses || []).slice(0, 2).map((c, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs">
                  {c.clauseId}: {c.title}
                </div>
                <p className="text-slate-800 text-[11.5px] leading-relaxed">
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Bank Institutional Rules */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-3 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <Unlock className="w-3.5 h-3.5 text-slate-800" />
                <span>{selectedBank.name} Institutional Policy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  isPolicyActive 
                    ? 'bg-slate-100 text-slate-900 border-slate-300' 
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {isPolicyActive ? '🟢 Active' : '⚪ Inactive'}
                </span>
                <button
                  onClick={onOpenEditModal}
                  className="text-[11px] font-bold text-slate-900 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  Configure
                </button>
              </div>
            </div>

            {isPolicyActive ? (
              <div className="space-y-2.5 mt-3">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-slate-900">{cardLabels.label1}</div>
                  <div className="font-mono text-slate-900 font-bold text-xs mt-0.5">
                    {bankAddenda.sessionTimeout || (isLending ? 'Max $50,000 Unsecured Personal Loan Limit' : '15 Minutes Inactivity / 8h Absolute')}
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-slate-900">{cardLabels.label2}</div>
                  <div className="text-slate-900 font-semibold text-xs mt-0.5">
                    {bankAddenda.mfaRule || (isLending ? 'Income verification via automated CDR Open Banking stream' : 'Transfers > $5,000 AUD or Novel IP Geolocation')}
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-slate-900">{cardLabels.label3}</div>
                  <p className="text-slate-900 text-xs mt-0.5 italic font-medium">
                    "{bankAddenda.customClause || 'Institutional operational rules active.'}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 my-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center space-y-2">
                <ShieldAlert className="w-5 h-5 text-slate-600 mx-auto" />
                <div className="font-bold text-slate-900 text-xs">
                  This policy is currently Inactive for {selectedBank.name}
                </div>
                <p className="text-[11.5px] text-slate-700">
                  Default baseline rules apply. Activate this policy to enforce custom institutional parameters and risk conditions.
                </p>
                {onTogglePolicyActive && (
                  <button
                    onClick={() => onTogglePolicyActive(policy.id, selectedBank.id)}
                    className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition shadow-2xs"
                  >
                    <span>⚡ Activate for {selectedBank.name}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="pt-2 text-[10.5px] text-slate-500 font-medium text-right">
            Modified by: <strong className="text-slate-800">{bankAddenda.lastModifiedBy || 'Authorized Officer'}</strong>
          </div>
        </div>
      </div>

      {/* 4. Operational Telemetry & KPI Cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>{telemetry.title}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {telemetry.subtitle}
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10.5px]">
            {['1h', '24h', '7d', '30d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                  timeRange === range
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Waveform Chart (7 cols) */}
          <div className="lg:col-span-7 h-36 w-full relative pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120">
              <defs>
                <linearGradient id="streamlineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />

              {/* Shaded Area */}
              <path
                d={`${telemetry.pathD} L 400 115 L 0 115 Z`}
                fill="url(#streamlineGrad)"
              />

              {/* Primary Line */}
              <path
                d={telemetry.pathD}
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.2"
              />

              {/* Secondary Line */}
              <path
                d={telemetry.pathD2}
                fill="none"
                stroke="#059669"
                strokeWidth="1.6"
                strokeDasharray="4 3"
              />

              {/* Interactive Points */}
              {telemetry.points.map((pt, idx) => (
                <g 
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <circle 
                    cx={pt.x} 
                    cy={pt.y1} 
                    r={hoveredPoint?.time === pt.time ? 5 : 3.5} 
                    fill="#0284c7" 
                    stroke="#ffffff" 
                    strokeWidth="1.5" 
                  />
                </g>
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div 
                style={{ left: `${Math.min(Math.max((hoveredPoint.x / 400) * 100, 10), 85)}%` }}
                className="absolute top-2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg pointer-events-none z-10 space-y-0.5"
              >
                <div className="font-bold text-slate-300">{hoveredPoint.time} ({timeRange.toUpperCase()})</div>
                <div className="text-sky-300">{telemetry.line1Name}: {hoveredPoint.val1}</div>
                <div className="text-emerald-300">{telemetry.line2Name}: {hoveredPoint.val2}</div>
              </div>
            )}

            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1 px-1">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>21:00</span>
            </div>
          </div>

          {/* 3 KPI Cards (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
            {(policy.metricsTable || []).slice(0, 3).map((row, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-700 text-[11px] truncate max-w-[160px]">{row.metric}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Target: {row.target}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900 text-xs">{row.actual}</div>
                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Logged Notes & Artifacts (Clean & Simple) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Compliance Notes & Operational Artifacts
          </div>

          <div className="flex items-center gap-1 text-xs">
            {['ALL', 'TRAINING', 'ISSUES', 'MINUTES'].map((tab) => (
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
                {tab === 'ISSUES' && '⚠️ Issues'}
                {tab === 'MINUTES' && '📝 Minutes'}
                {tab === 'ALL' && 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredArtifacts.map((art) => (
            <div
              key={art.id}
              className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 shadow-2xs text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-1.5 py-0.2 rounded border border-slate-200">
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
          ))}
        </div>
      </div>
    </main>
  );
}
