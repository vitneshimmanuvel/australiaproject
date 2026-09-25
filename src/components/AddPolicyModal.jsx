import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Lock, 
  Activity, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AddPolicyModal({
  isOpen,
  onClose,
  hierarchy,
  onAddPolicy,
}) {
  if (!isOpen) return null;

  // Form state
  const [selectedDomainId, setSelectedDomainId] = useState(
    hierarchy[0]?.id || 'prudential-standards'
  );
  const [selectedGroupId, setSelectedGroupId] = useState(
    hierarchy[0]?.children?.[0]?.id || 'cps-234-group'
  );
  
  // Custom domain/group creation flags
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [customDomainName, setCustomDomainName] = useState('');
  const [isCustomGroup, setIsCustomGroup] = useState(false);
  const [customGroupName, setCustomGroupName] = useState('');

  // Policy metadata
  const [title, setTitle] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [ownedBy, setOwnedBy] = useState('Regulatory Compliance & SecOps');
  const [complianceLevel, setComplianceLevel] = useState('APRA CPS 234 / ISO 27001');
  const [visionStatement, setVisionStatement] = useState('');

  // Clause 1
  const [clauseId, setClauseId] = useState('CPS234-NEW-01');
  const [clauseTitle, setClauseTitle] = useState('Mandatory Implementation & Controls');
  const [clauseContent, setClauseContent] = useState('');

  // Metrics (3 key metrics)
  const [metric1Name, setMetric1Name] = useState('Latency Overhead (P99)');
  const [metric1Target, setMetric1Target] = useState('< 15ms');
  const [metric1Actual, setMetric1Actual] = useState('8.4ms');

  const [metric2Name, setMetric2Name] = useState('Compliance Verification');
  const [metric2Target, setMetric2Target] = useState('100%');
  const [metric2Actual, setMetric2Actual] = useState('100.0%');

  const [metric3Name, setMetric3Name] = useState('Audit Failure Rate');
  const [metric3Target, setMetric3Target] = useState('< 0.05%');
  const [metric3Actual, setMetric3Actual] = useState('0.00%');

  // Default Bank Addenda
  const [defaultSessionTimeout, setDefaultSessionTimeout] = useState('15 Minutes Inactivity / 8h Absolute');
  const [defaultMfaRule, setDefaultMfaRule] = useState('Step-up for transactions > $5,000 AUD or novel device');
  const [defaultBankClause, setDefaultBankClause] = useState('Institutional operational addenda baseline applied.');

  const [formError, setFormError] = useState('');

  // Auto-generate policyId when title changes if policyId is empty or matches slug of old title
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!policyId || policyId === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      const generated = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setPolicyId(generated);
    }
  };

  // Find current domain's child groups
  const currentDomain = hierarchy.find(d => d.id === selectedDomainId) || hierarchy[0];
  const availableGroups = currentDomain?.children || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a valid Policy Title.');
      return;
    }
    if (!policyId.trim()) {
      setFormError('Please specify a unique Policy ID slug.');
      return;
    }
    if (!visionStatement.trim()) {
      setFormError('Please provide the Regulatory Intent / Vision Statement.');
      return;
    }
    if (!clauseContent.trim()) {
      setFormError('Please provide the statutory clause content.');
      return;
    }

    // Determine domain & group details
    const domainId = isCustomDomain 
      ? customDomainName.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
      : selectedDomainId;
    const domainLabel = isCustomDomain 
      ? customDomainName.toUpperCase() 
      : currentDomain?.label || 'BANKING STANDARDS';

    const group = availableGroups.find(g => g.id === selectedGroupId);
    const groupId = isCustomGroup 
      ? customGroupName.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
      : (group?.id || availableGroups[0]?.id || 'general-group');
    const groupLabel = isCustomGroup 
      ? customGroupName 
      : (group?.label || 'General Frameworks');

    // Build the new policy object
    const newPolicy = {
      id: policyId.trim(),
      title: title.trim(),
      breadcrumb: `${domainLabel} / ${groupLabel} • Active Master`,
      latestVersion: version.trim() || 'v1.0.0',
      lastUpdated: 'Today',
      ownedBy: ownedBy.trim() || 'Regulatory Authority Squad',
      complianceLevel: complianceLevel.trim() || 'APRA CPS 234',
      visionStatement: visionStatement.trim(),
      dependencies: [
        { name: 'National Banking Gateway', status: 'Healthy' },
        { name: 'APRA Compliance Validator', status: 'Active' },
        { name: 'Hardware Security Module (HSM)', status: 'Verified' },
      ],
      coreFrameworkClauses: [
        {
          clauseId: clauseId.trim() || 'CPS234-01',
          title: clauseTitle.trim() || 'Statutory Master Baseline',
          content: clauseContent.trim(),
        },
        {
          clauseId: `${clauseId.split('-')[0] || 'STD'}-LOG-02`,
          title: 'Immutable Ledger Audit Trail',
          content: 'All policy validations, tenant configuration updates, and override events must be logged with SHA-256 signatures to the central immutable compliance ledger.',
        },
      ],
      bankCustomAddenda: {
        cba: {
          sessionTimeout: defaultSessionTimeout,
          mfaRule: defaultMfaRule,
          customClause: `CBA Operational Policy: ${defaultBankClause}`,
          lastModifiedBy: 'Sarah Jenkins (Master Admin Provisioned)',
        },
        nab: {
          sessionTimeout: defaultSessionTimeout,
          mfaRule: defaultMfaRule,
          customClause: `NAB Operational Policy: ${defaultBankClause}`,
          lastModifiedBy: 'Sarah Jenkins (Master Admin Provisioned)',
        },
        wbc: {
          sessionTimeout: defaultSessionTimeout,
          mfaRule: defaultMfaRule,
          customClause: `Westpac Operational Policy: ${defaultBankClause}`,
          lastModifiedBy: 'Sarah Jenkins (Master Admin Provisioned)',
        },
        anz: {
          sessionTimeout: defaultSessionTimeout,
          mfaRule: defaultMfaRule,
          customClause: `ANZ Operational Policy: ${defaultBankClause}`,
          lastModifiedBy: 'Sarah Jenkins (Master Admin Provisioned)',
        },
      },
      artifacts: [
        {
          id: `art-${Date.now()}-1`,
          type: 'Training',
          tag: 'Training Note',
          location: 'Master Library',
          title: `${title} Standard Operating Handbook`,
          content: `Initial training module and compliance checklist published for ${title}. All institutional members must integrate requirements within 60 days.`,
        },
        {
          id: `art-${Date.now()}-2`,
          type: 'Minutes',
          tag: 'Statutory Gazettal',
          location: 'Master Library',
          title: 'APRA Regulatory Working Group Gazettal',
          content: `Approved and published under master reference framework ${complianceLevel}.`,
        },
      ],
      metricsTable: [
        { metric: metric1Name, target: metric1Target, actual: metric1Actual, status: 'Optimal' },
        { metric: metric2Name, target: metric2Target, actual: metric2Actual, status: 'Optimal' },
        { metric: metric3Name, target: metric3Target, actual: metric3Actual, status: 'Optimal' },
      ],
      comments: [
        {
          id: `comm-${Date.now()}`,
          author: 'Sarah Jenkins',
          avatar: 'SJ',
          time: 'Just now',
          category: 'Review',
          badge: 'Master Admin',
          content: `Published new statutory standard ${title} (${version}) to the central reference library.`,
        },
      ],
    };

    onAddPolicy({
      domainId,
      domainLabel,
      isCustomDomain,
      groupId,
      groupLabel,
      isCustomGroup,
      policy: newPolicy,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 shadow-2xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Add New Master Policy Framework
                </h3>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                  Master Authority
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500">
                Author and publish a new government-approved statutory standard into the hierarchy tree.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-5">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Placement in Banking Hierarchy */}
          <div className="space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>1. Hierarchy Placement & Submenu Group</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Domain Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Regulatory Domain (Pillar)
                </label>
                {!isCustomDomain ? (
                  <select
                    value={selectedDomainId}
                    onChange={(e) => {
                      if (e.target.value === '__NEW__') {
                        setIsCustomDomain(true);
                      } else {
                        setSelectedDomainId(e.target.value);
                        const dom = hierarchy.find(d => d.id === e.target.value);
                        if (dom?.children?.length) {
                          setSelectedGroupId(dom.children[0].id);
                        }
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 outline-none"
                  >
                    {hierarchy.map(dom => (
                      <option key={dom.id} value={dom.id}>{dom.label}</option>
                    ))}
                    <option value="__NEW__">+ Create New Regulatory Pillar...</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customDomainName}
                      onChange={(e) => setCustomDomainName(e.target.value)}
                      placeholder="e.g. AI & ALGORITHMIC GOVERNANCE"
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomDomain(false)}
                      className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Sub-Category / Group Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Sub-Category / Directive Group
                </label>
                {!isCustomGroup && !isCustomDomain ? (
                  <select
                    value={selectedGroupId}
                    onChange={(e) => {
                      if (e.target.value === '__NEW_GROUP__') {
                        setIsCustomGroup(true);
                      } else {
                        setSelectedGroupId(e.target.value);
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 outline-none"
                  >
                    {availableGroups.map(grp => (
                      <option key={grp.id} value={grp.id}>{grp.label}</option>
                    ))}
                    <option value="__NEW_GROUP__">+ Create New Sub-Category...</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customGroupName}
                      onChange={(e) => setCustomGroupName(e.target.value)}
                      placeholder="e.g. Model Risk & LLM Deployment"
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none"
                    />
                    {!isCustomDomain && (
                      <button
                        type="button"
                        onClick={() => setIsCustomGroup(false)}
                        className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Policy Metadata */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>2. Policy Specifications & Statutory Metadata</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Policy Framework Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Post-Quantum Cryptography Transition Standard"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Policy ID (Slug) *
                </label>
                <input
                  type="text"
                  value={policyId}
                  onChange={(e) => setPolicyId(e.target.value)}
                  placeholder="e.g. pqc-cryptography-transition"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="v1.0.0"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Custodian Squad / Owner
                </label>
                <input
                  type="text"
                  value={ownedBy}
                  onChange={(e) => setOwnedBy(e.target.value)}
                  placeholder="e.g. Cryptography Taskforce"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Compliance Standard
                </label>
                <input
                  type="text"
                  value={complianceLevel}
                  onChange={(e) => setComplianceLevel(e.target.value)}
                  placeholder="e.g. APRA CPS 234 / NIST PQC"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Regulatory Vision & In-Spirit Intent Statement *
              </label>
              <textarea
                rows={2}
                value={visionStatement}
                onChange={(e) => setVisionStatement(e.target.value)}
                placeholder="Explain the statutory intent, prudential scope, and risk mitigation objectives..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>

          {/* Section 3: Statutory Master Clause */}
          <div className="space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>3. Master Statutory Clause (90% Core Baseline)</span>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                Mandatory for All Banks
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Clause ID</label>
                <input
                  type="text"
                  value={clauseId}
                  onChange={(e) => setClauseId(e.target.value)}
                  placeholder="CPS234-PQC-01"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Clause Title</label>
                <input
                  type="text"
                  value={clauseTitle}
                  onChange={(e) => setClauseTitle(e.target.value)}
                  placeholder="Mandatory Cryptographic Migration Baseline"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Clause Text *</label>
              <textarea
                rows={2}
                value={clauseContent}
                onChange={(e) => setClauseContent(e.target.value)}
                placeholder="Statutory clause content mandated across all financial institutions..."
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Section 4: Operational Metrics & Telemetry */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <Activity className="w-4 h-4 text-cyan-600" />
              <span>4. Key Telemetry & Performance Metrics</span>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-3 text-[11px] font-bold text-slate-500 px-1">
                <span>Metric Name</span>
                <span>Target SLA / Threshold</span>
                <span>Current Baseline Value</span>
              </div>

              {/* Metric Row 1 */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={metric1Name}
                  onChange={(e) => setMetric1Name(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none"
                />
                <input
                  type="text"
                  value={metric1Target}
                  onChange={(e) => setMetric1Target(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-700 outline-none"
                />
                <input
                  type="text"
                  value={metric1Actual}
                  onChange={(e) => setMetric1Actual(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              {/* Metric Row 2 */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={metric2Name}
                  onChange={(e) => setMetric2Name(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none"
                />
                <input
                  type="text"
                  value={metric2Target}
                  onChange={(e) => setMetric2Target(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-700 outline-none"
                />
                <input
                  type="text"
                  value={metric2Actual}
                  onChange={(e) => setMetric2Actual(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              {/* Metric Row 3 */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={metric3Name}
                  onChange={(e) => setMetric3Name(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none"
                />
                <input
                  type="text"
                  value={metric3Target}
                  onChange={(e) => setMetric3Target(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-700 outline-none"
                />
                <input
                  type="text"
                  value={metric3Actual}
                  onChange={(e) => setMetric3Actual(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Default Bank Addenda Configuration */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>5. Default Member Bank Operational Addenda Baseline</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Default Session / Execution Timeout
                </label>
                <input
                  type="text"
                  value={defaultSessionTimeout}
                  onChange={(e) => setDefaultSessionTimeout(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Default MFA / Approval Trigger
                </label>
                <input
                  type="text"
                  value={defaultMfaRule}
                  onChange={(e) => setDefaultMfaRule(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Default Bank Custom Policy Clause
              </label>
              <input
                type="text"
                value={defaultBankClause}
                onChange={(e) => setDefaultBankClause(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Master Policy to Library</span>
          </button>
        </div>
      </div>
    </div>
  );
}
