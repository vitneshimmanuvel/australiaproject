import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Search, 
  Edit, 
  FileText, 
  Lock, 
  History, 
  Crown,
  Download
} from 'lucide-react';
import { auditHistoryLogs } from '../data/mockData';

export default function AdminDashboard({ 
  banks, 
  policies, 
  onSelectBank, 
  onOpenEditMasterModal,
  onOpenBankCustomModal,
  onOpenExportModal,
  onSwitchToLibraryView
}) {
  const [bankSearch, setBankSearch] = useState('');
  const [activeTab, setActiveTab] = useState('BANKS'); // 'BANKS' | 'POLICIES' | 'AUDIT'

  const filteredBanks = banks.filter(b => 
    b.name.toLowerCase().includes(bankSearch.toLowerCase()) || 
    b.tier.toLowerCase().includes(bankSearch.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] p-6 sm:p-8 space-y-6 text-xs">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-amber-900 shadow-2xs">
            <Crown className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Library Staff Master Administration Portal
              </h1>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                Master Governance
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Centrally governing master regulatory standards across 4 Subscribed Australian Tier-1 Banks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenEditMasterModal('oauth-sso')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Master Policy Baseline</span>
          </button>

          <button
            onClick={onSwitchToLibraryView}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Open 3-Pane Library View</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('BANKS')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'BANKS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Subscribed Member Banks ({banks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('POLICIES')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'POLICIES'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Master Library Standards</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'AUDIT'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit History & Activity Log</span>
        </button>
      </div>

      {/* TAB 1: Subscribed Banks Table */}
      {activeTab === 'BANKS' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Connected Institutional Tenants & Policy Addenda
              </h3>
              <p className="text-xs text-slate-500">
                Each member bank subscribes to the government master baseline and configures authorized operational addenda.
              </p>
            </div>

            <div className="relative w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                placeholder="Search member banks..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[10.5px] font-bold border-y border-slate-200">
                  <th className="py-3 px-4">Bank Name & Tier</th>
                  <th className="py-3 px-4">Subscription Plan</th>
                  <th className="py-3 px-4">Configured Policy Addenda</th>
                  <th className="py-3 px-4">Compliance Status</th>
                  <th className="py-3 px-4">Last Audit Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBanks.map((bank) => (
                  <tr key={bank.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs">{bank.name}</div>
                      <div className="text-[11px] text-slate-500">{bank.tier} • {bank.contactEmail}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {bank.subscriptionStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-[11px] font-bold text-slate-800">{bank.activeAddendaCount} Active Custom Conditions</div>
                      <div className="text-[10.5px] text-slate-500 truncate">{bank.addendaSummary}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {bank.complianceStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {bank.lastAuditDate}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          onSelectBank(bank);
                          onOpenBankCustomModal('oauth-sso', bank);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold px-3 py-1 rounded text-xs transition cursor-pointer"
                      >
                        Inspect Addenda
                      </button>
                      <button
                        onClick={() => {
                          onSelectBank(bank);
                          onOpenExportModal();
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold px-3 py-1 rounded text-xs transition cursor-pointer"
                      >
                        Audit Cert
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Master Library Standards */}
      {activeTab === 'POLICIES' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Government-Approved Master Regulatory Standards
              </h3>
              <p className="text-xs text-slate-500">
                Standardized frameworks authored by the central authority that all connected institutions subscribe to.
              </p>
            </div>
            <button
              onClick={() => onOpenEditMasterModal('oauth-sso')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer"
            >
              Edit Master Baseline
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(policies).map((pol) => (
              <div
                key={pol.id}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10.5px] font-semibold text-slate-500">{pol.breadcrumb}</span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">{pol.title}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                    {pol.latestVersion}
                  </span>
                </div>

                <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded border border-slate-200">
                  "{pol.visionStatement}"
                </p>

                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Locked Regulatory Clauses:</span>
                  </div>
                  {pol.coreFrameworkClauses?.map((c, idx) => (
                    <div key={idx} className="text-[11px] text-slate-600 pl-4 border-l border-slate-200">
                      <strong>{c.clauseId}:</strong> {c.title}
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-emerald-700 font-bold">{pol.complianceLevel}</span>
                  <button
                    onClick={() => onOpenEditMasterModal(pol.id)}
                    className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Master Spec
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Audit Trail */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Regulatory Audit History & Addenda Modifications
            </h3>
            <p className="text-xs text-slate-500">
              Immutable logging of master policy publications and bank-specific addenda revisions.
            </p>
          </div>

          <div className="space-y-3">
            {auditHistoryLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-blue-600 shadow-2xs">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-[11px] font-mono text-slate-500">on {log.target}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      By <strong className="text-slate-700">{log.actor}</strong> • {log.timestamp}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-medium">
                  {log.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
