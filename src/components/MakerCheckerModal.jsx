import React, { useState } from 'react';
import { X, CheckCircle, Clock, User, FileText, Check } from 'lucide-react';

export default function MakerCheckerModal({
  isOpen,
  onClose,
  items = [],
  history = [],
  currentUser,
  onAction,
  onCloseItem
}) {
  const [selectedItem, setSelectedItem] = useState(items[0] || null);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history'

  if (!isOpen) return null;

  const currentItem = selectedItem || items[0];

  const handleAction = async (action) => {
    if (!currentItem) return;
    setIsSubmitting(true);
    await onAction(currentItem.id, action, currentUser?.name || 'Department Manager', comments);
    setComments('');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-base">
              ⚖️
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827]">Maker-Checker Governance Workflow</h2>
              <p className="text-[12px] text-slate-500">Review policy change requests, approve version bumps (v1.0 → v1.1), or dismiss action items.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-3 flex gap-4 border-b border-[#e5e7eb] bg-slate-50/60">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-2.5 px-2 text-[13px] font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'border-[#0057B8] text-[#0057B8]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Pending Reviews</span>
            <span className="px-2 py-0.2 rounded-full text-[11px] bg-amber-100 text-amber-900 font-bold">
              {items.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-2 text-[13px] font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#0057B8] text-[#0057B8]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Approval History</span>
            <span className="px-2 py-0.2 rounded-full text-[11px] bg-slate-200 text-slate-700">
              {history.length}
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'pending' ? (
            items.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700 text-base">All clear! No pending review items.</p>
                <p className="text-[12px] mt-1 text-slate-500">Maker submissions will appear here for Department Manager review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* List column */}
                <div className="space-y-2 md:col-span-1 border-r border-slate-100 pr-4">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Action Queue</h3>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        currentItem?.id === item.id
                          ? 'border-[#0057B8] bg-[#0057B8]/5 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {item.department_name || 'Retail Lending'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-[13px] font-bold text-slate-800 line-clamp-1">{item.policy_title}</h4>
                      <p className="text-[12px] text-slate-500 mt-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {item.maker_name}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Details & Decision Column */}
                <div className="md:col-span-2 space-y-4">
                  {currentItem && (
                    <>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Change Request #{currentItem.id}</span>
                            <h3 className="text-base font-bold text-slate-900 mt-0.5">{currentItem.policy_title}</h3>
                          </div>
                          <button
                            onClick={() => onCloseItem(currentItem.id)}
                            title="Toggle close action item"
                            className="px-3 py-1 text-[12px] font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 text-slate-500" />
                            <span>Close Item</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200 text-[12.5px]">
                          <div>
                            <span className="text-slate-500">Submitted By:</span>
                            <p className="font-semibold text-slate-800">{currentItem.maker_name} ({currentItem.maker_role})</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Timestamp:</span>
                            <p className="font-semibold text-slate-800">{new Date(currentItem.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Proposed Changes Preview */}
                      <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Proposed Amendments</h4>
                        {currentItem.proposed_changes ? (
                          <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3.5 text-[12.5px] space-y-2">
                            {currentItem.proposed_changes.title && (
                              <div>
                                <span className="font-bold text-amber-900">Updated Title:</span>{' '}
                                <span className="text-slate-800">{currentItem.proposed_changes.title}</span>
                              </div>
                            )}
                            {currentItem.proposed_changes.content && (
                              <div>
                                <span className="font-bold text-amber-900">Proposed Clauses:</span>
                                <p className="mt-1 text-slate-800 bg-white p-2.5 rounded border border-amber-200 font-mono text-[12px] whitespace-pre-line">
                                  {currentItem.proposed_changes.content}
                                </p>
                              </div>
                            )}
                            {currentItem.proposed_changes.justification && (
                              <div>
                                <span className="font-bold text-amber-900">Justification:</span>
                                <p className="mt-0.5 text-slate-700 italic">"{currentItem.proposed_changes.justification}"</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-400 text-xs">No proposed changes recorded.</p>
                        )}
                      </div>

                      {/* Checker Comments & Sign-off Actions */}
                      <div className="space-y-3 pt-2">
                        <label className="block text-[12px] font-semibold text-slate-700">Approver Sign-off Comments</label>
                        <textarea
                          rows={2}
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder="e.g. Approved operational thresholds as reviewed with Credit Operations Squad."
                          className="w-full p-2.5 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/15"
                        />

                        <div className="flex items-center justify-end gap-2.5 pt-1">
                          <button
                            onClick={() => handleAction('reject')}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-[13px] font-medium transition cursor-pointer"
                          >
                            Reject Proposal
                          </button>
                          <button
                            onClick={() => handleAction('approve')}
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-[#0057B8] hover:bg-[#004EA6] text-white rounded-lg text-[13px] font-semibold shadow-xs transition cursor-pointer"
                          >
                            {isSubmitting ? 'Approving...' : 'Approve & Increment to v1.1'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          ) : (
            /* History Tab */
            <div className="space-y-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Historical Sign-offs</h3>
              {history.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No sign-off history recorded yet.</p>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {history.map((h) => (
                    <div key={h.id} className="p-4 bg-white flex items-start justify-between gap-4 text-[13px]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                            h.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {h.status}
                          </span>
                          <span className="font-bold text-slate-800">{h.policy_title}</span>
                        </div>
                        <p className="text-[12px] text-slate-500">
                          Maker: <strong>{h.maker_name}</strong> • Approver: <strong>{h.checker_name || 'Marcus Vance'}</strong>
                        </p>
                        {h.checker_comments && (
                          <p className="text-[12px] text-slate-600 italic">"{h.checker_comments}"</p>
                        )}
                      </div>
                      <span className="text-[11.5px] text-slate-400 whitespace-nowrap">
                        {new Date(h.reviewed_at || h.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
