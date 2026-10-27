import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  AlertTriangle, 
  Search, 
  ExternalLink,
  Filter,
  Copy,
  Check
} from 'lucide-react';

export default function NotificationsModal({ isOpen, onClose, onOpenPolicy }) {
  const [filterType, setFilterType] = useState('all');
  const [searchCode, setSearchCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      code: 'APRA-CPS234-2026-P1',
      category: 'regulatory',
      severity: 'high',
      title: 'APRA CPS 234 Mandatory Security Benchmark Refresh',
      description: 'Annual APRA information security compliance directive: All MFA protocols and session timeouts must be audited and verified across Tier 1 digital channels.',
      timestamp: 'Today, 10:45 AM',
      policyId: 'remote-access-security-policy',
      status: 'Action Required',
      details: 'Dual sign-off mandatory before end of quarter.'
    },
    {
      id: 'notif-2',
      code: 'MC-AMEND-REQ-882',
      category: 'maker_checker',
      severity: 'medium',
      title: 'Maker Change Proposal: Retail Credit Card SLA Adjustment',
      description: 'Sarah Jenkins submitted amendment to lower automated Tier-1 card verification turnaround SLA from 24h to 4h based on Document Verification Service (DVS).',
      timestamp: 'Today, 11:15 AM',
      policyId: 'credit-card-limits-policy',
      status: 'Pending Review',
      details: 'Awaiting Department Manager (Marcus Vance) sign-off.'
    },
    {
      id: 'notif-3',
      code: 'AUSTRAC-AML-CDD-04',
      category: 'regulatory',
      severity: 'high',
      title: 'AUSTRAC Customer Due Diligence (CDD) Circular',
      description: 'Updated guidelines for high-net-worth individual identity verification: Mandatory 100-point physical or biometric DVS cross-referencing.',
      timestamp: 'Yesterday, 3:20 PM',
      policyId: 'customer-onboarding-sop',
      status: 'Acknowledged',
      details: 'Implemented in v1.0 baseline.'
    },
    {
      id: 'notif-4',
      code: 'SEC-RBAC-MASK-91',
      category: 'security',
      severity: 'info',
      title: 'Policy Access Clearance Updated',
      description: 'Confidential policy "VIP & High-Net-Worth Lending Escalation Procedure" access clearance was configured.',
      timestamp: '24 Oct 2026, 9:00 AM',
      policyId: 'vip-executive-escalation-sop',
      status: 'Restricted',
      details: 'Staff without direct clearance cannot view this policy.'
    },
    {
      id: 'notif-5',
      code: 'CBA-GOV-AUDIT-2026',
      category: 'compliance',
      severity: 'info',
      title: 'Central Banking Audit Log Snapshot',
      description: 'Central change log synchronized with banking database. 14 operational parameters recorded with SHA-256 integrity hash.',
      timestamp: '24 Oct 2026, 8:16 AM',
      policyId: null,
      status: 'Synchronized',
      details: 'Connection: TLS 1.3 Active.'
    }
  ];

  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const filtered = notifications.filter(n => {
    const matchesFilter = filterType === 'all' || n.category === filterType;
    const matchesSearch = n.code.toLowerCase().includes(searchCode.toLowerCase()) ||
                          n.title.toLowerCase().includes(searchCode.toLowerCase()) ||
                          n.description.toLowerCase().includes(searchCode.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                System Notifications & Regulatory Compliance Codes
              </h2>
              <p className="text-[12px] text-slate-500">
                Official APRA, AUSTRAC, and Internal Maker-Checker Action Codes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 border-b border-slate-200 bg-white flex flex-col sm:flex-row gap-2 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#0057B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Search by code (e.g. APRA-CPS234)..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border-2 border-[#0057B8]/40 hover:border-[#0057B8] bg-white focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/20 transition shadow-2xs font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#0057B8] text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilterType('regulatory')}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition cursor-pointer ${
                filterType === 'regulatory'
                  ? 'bg-[#0057B8] text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Regulatory
            </button>
            <button
              onClick={() => setFilterType('maker_checker')}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition cursor-pointer ${
                filterType === 'maker_checker'
                  ? 'bg-[#0057B8] text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Maker-Checker
            </button>
            <button
              onClick={() => setFilterType('security')}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition cursor-pointer ${
                filterType === 'security'
                  ? 'bg-[#0057B8] text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/50">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No matching notification codes found.
            </div>
          ) : (
            filtered.map((notif) => (
              <div 
                key={notif.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 hover:border-slate-300 transition"
              >
                {/* Code badge, Timestamp & Category */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800 flex items-center gap-1">
                      {notif.code}
                      <button 
                        onClick={(e) => handleCopyCode(notif.code, e)}
                        title="Copy Code"
                        className="hover:text-white p-0.5"
                      >
                        {copiedCode === notif.code ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </span>

                    <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded ${
                      notif.severity === 'high' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : notif.severity === 'medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {notif.status}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {notif.timestamp}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-[13px] font-bold text-slate-900">
                    {notif.title}
                  </h4>
                  <p className="text-[12px] text-slate-600 mt-0.5 leading-relaxed">
                    {notif.description}
                  </p>
                </div>

                {/* Details bar & Action button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate">{notif.details}</span>

                  {notif.policyId && (
                    <button
                      onClick={() => {
                        if (onOpenPolicy) onOpenPolicy(notif.policyId);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-slate-800 hover:text-slate-950 underline flex-shrink-0 ml-2 cursor-pointer"
                    >
                      <span>Open Policy</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>All regulatory compliance events cryptographically logged in banking repository.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#0057B8] hover:bg-[#004EA6] text-white transition cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
