import React, { useState } from 'react';
import { X, Lock, Unlock, Save, Building2 } from 'lucide-react';

export default function EditSpecModal({ 
  isOpen, 
  onClose, 
  policy, 
  selectedBank, 
  onSaveCustomization 
}) {
  if (!isOpen || !policy) return null;

  const currentAddenda = policy.bankCustomAddenda?.[selectedBank.id] || {
    sessionTimeout: '15 Minutes Inactivity',
    mfaRule: 'Transfers > $5,000 AUD',
    customClause: 'Standard institutional operational conditions applied.',
    lastModifiedBy: 'Bank Compliance Team',
  };

  const [timeout, setTimeoutVal] = useState(currentAddenda.sessionTimeout);
  const [mfa, setMfa] = useState(currentAddenda.mfaRule);
  const [clause, setClause] = useState(currentAddenda.customClause);
  const [officerName, setOfficerName] = useState(currentAddenda.lastModifiedBy);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveCustomization(policy.id, selectedBank.id, {
      sessionTimeout: timeout,
      mfaRule: mfa,
      customClause: clause,
      lastModifiedBy: officerName,
    });
    alert(`Bank policy addenda updated for ${selectedBank.name}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-xs animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Configure Bank Policy Addenda</h3>
              <p className="text-[11px] text-slate-500">Institution: <strong className="text-slate-800">{selectedBank.name}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto custom-scrollbar space-y-4">
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-950">
            <Lock className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Government Baseline Locked:</strong> APRA CPS 234 & Privacy Act statutory core clauses cannot be altered. You are configuring your bank's operational addenda and thresholds.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-800 font-bold mb-1 text-[11px]">
                Session Inactivity Timeout Window
              </label>
              <input
                type="text"
                value={timeout}
                onChange={(e) => setTimeoutVal(e.target.value)}
                placeholder="e.g. 15 Minutes Inactivity / 8h Absolute"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1 text-[11px]">
                Step-Up Authentication Trigger
              </label>
              <input
                type="text"
                value={mfa}
                onChange={(e) => setMfa(e.target.value)}
                placeholder="e.g. Transfers > $5,000 AUD"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1 text-[11px]">
              Bank Specific Policy Addendum Clause
            </label>
            <textarea
              value={clause}
              onChange={(e) => setClause(e.target.value)}
              rows="3"
              placeholder="Enter institutional operational conditions..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 outline-none resize-none font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1 text-[11px]">
              Authorizing Compliance Officer / Architect
            </label>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Bank Addenda</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
