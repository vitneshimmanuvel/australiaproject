import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Link,
  X,
  PanelRightClose,
  CheckCircle2,
  XCircle,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  SendHorizontal,
  Sparkles,
  Bot
} from 'lucide-react';
import ShidneyAIChat from './ShidneyAIChat';

export default function ContextualFeedPane({ 
  comments = [], 
  onAddComment,
  onAcceptRequest,
  onRejectRequest,
  currentUser,
  onQuickToggleUserRole,
  activePolicy,
  selectedBank,
  selectedProduct,
  policies = {},
  onSelectPolicy,
  onSelectProduct,
  onOpenEditModal,
  onOpenExportModal,
  activePolicyTitle = 'Active Standard',
  isMobileOpen,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  width = 320
}) {
  // Tabs: 'SHIDNEY' (before Notes) | 'NOTES' | 'REVIEW' | 'ISSUES' | 'MINUTES' | 'ALL'
  const [activeFilter, setActiveFilter] = useState('SHIDNEY');
  const [composerMode, setComposerMode] = useState('NOTE'); // 'NOTE' | 'CHANGE_REQUEST'
  
  // Note form state
  const [newText, setNewText] = useState('');
  const [category, setCategory] = useState('General');

  // Change Request form state
  const [reqTitle, setReqTitle] = useState('');
  const [reqProduct, setReqProduct] = useState('Credit Cards');
  const [reqTimeout, setReqTimeout] = useState('20 Minutes Inactivity / 8h Absolute');
  const [reqMfaRule, setReqMfaRule] = useState('Step-up MFA on transfers > $5,000 AUD');
  const [reqJustification, setReqJustification] = useState('');
  const [reqRecipient, setReqRecipient] = useState('Risk Committee (Manager Approver)');

  // Inline sign-off action state for manager
  const [signingId, setSigningId] = useState(null);
  const [signNote, setSignNote] = useState('Approved under APRA CPS 234 Section 14 waiver.');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Exceeds APRA CPS 234 15-minute maximum session window.');

  const isManager = currentUser?.roleType === 'manager' || currentUser?.type === 'admin';

  // Filter comments according to active category tab
  const filteredComments = activeFilter === 'ALL'
    ? comments
    : comments.filter(c => c.category?.toUpperCase() === activeFilter.toUpperCase());

  // Handle posting simple note
  const handlePostNote = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    onAddComment({
      id: `c-${Date.now()}`,
      type: 'COMMENT',
      author: currentUser?.name || 'Reviewer',
      authorRole: currentUser?.role || 'Compliance Reviewer',
      avatar: currentUser?.avatar || 'RV',
      time: 'Just now',
      category: category,
      badge: category,
      content: newText.trim(),
    });
    setNewText('');
  };

  // Handle submitting structured change request
  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqJustification.trim()) return;

    onAddComment({
      id: `cr-${Date.now()}`,
      type: 'CHANGE_REQUEST',
      category: 'Review',
      badge: 'Policy Variance Request',
      author: currentUser?.name || 'Employee Submitter',
      authorRole: currentUser?.role || 'Security Architect (Employee)',
      avatar: currentUser?.avatar || 'EM',
      recipient: reqRecipient,
      bankId: currentUser?.bankId || 'cba',
      targetProduct: reqProduct,
      time: 'Just now',
      title: reqTitle.trim(),
      content: reqJustification.trim(),
      proposedTimeout: reqTimeout.trim(),
      proposedMfaRule: reqMfaRule.trim(),
      status: 'PENDING',
      reviewerName: null,
      reviewNote: null,
      reviewedAt: null,
    });

    setReqTitle('');
    setReqJustification('');
    setComposerMode('NOTE');
    setActiveFilter('REVIEW');
  };

  if (isCollapsed) return null;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        ></div>
      )}

      <aside 
        style={{ width: `${width}px` }}
        className={`
          fixed inset-y-0 right-0 z-50 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl transition-transform duration-200 select-none text-xs
          lg:relative lg:inset-auto lg:z-auto lg:shadow-none lg:translate-x-0 lg:h-[calc(100vh-3.5rem)]
          ${isMobileOpen ? 'translate-x-0 !w-80' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Feed Header */}
        <div className="h-10 px-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-slate-800 truncate">
            <MessageSquare className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <span className="truncate">Contextual Feed ({comments.length})</span>
          </div>

          <div className="flex items-center gap-1">
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                title="Collapse Contextual Feed"
                className="hidden lg:flex p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <PanelRightClose className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Persona Indicator & Quick Switcher Pill */}
        <div className="px-3 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-bold text-white flex-shrink-0 ${
              isManager ? 'bg-slate-800' : 'bg-slate-700'
            }`}>
              {currentUser?.avatar || 'DM'}
            </div>
            <div className="truncate">
              <div className="font-bold text-slate-900 text-xs truncate flex items-center gap-1.5">
                <span>{currentUser?.name || 'David Miller'}</span>
                <span className="text-[9.5px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-900 border border-slate-300">
                  {isManager ? 'Manager Approver' : 'Employee Submitter'}
                </span>
              </div>
            </div>
          </div>

          {onQuickToggleUserRole && (
            <button
              onClick={onQuickToggleUserRole}
              className="text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-2 py-1 rounded-md transition cursor-pointer flex-shrink-0 shadow-2xs"
              title="Toggle between Submitter and Approver personas"
            >
              Switch Role
            </button>
          )}
        </div>

        {/* 6 Filter Tabs: Shidney AI first (before Notes), then Notes, Review, Issues, Minutes, All */}
        <div className="px-2 py-1.5 border-b border-slate-200 flex items-center gap-1 overflow-x-auto custom-scrollbar bg-white text-[10.5px]">
          {['SHIDNEY', 'NOTES', 'REVIEW', 'ISSUES', 'MINUTES', 'ALL'].map((key) => {
            const isSelected = activeFilter === key;
            const isShidney = key === 'SHIDNEY';

            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  isSelected
                    ? isShidney
                      ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white shadow-2xs ring-1 ring-blue-500/50'
                      : 'bg-slate-900 text-white shadow-2xs'
                    : isShidney
                    ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 font-bold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {key === 'SHIDNEY' && (
                  <>
                    <Sparkles className={`w-3 h-3 ${isSelected ? 'text-amber-300 animate-pulse' : 'text-blue-600'}`} />
                    <span>Shidney</span>
                  </>
                )}
                {key === 'NOTES' && '🎓 Notes'}
                {key === 'REVIEW' && '💬 Review'}
                {key === 'ISSUES' && '⚠️ Issues'}
                {key === 'MINUTES' && '📝 Minutes'}
                {key === 'ALL' && 'All'}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        {activeFilter === 'SHIDNEY' ? (
          /* Shidney AI Copilot Chat Interface */
          <div className="flex-1 overflow-hidden">
            <ShidneyAIChat
              currentUser={currentUser}
              selectedBank={selectedBank}
              activePolicy={activePolicy}
              selectedProduct={selectedProduct}
              policies={policies}
              onSelectPolicy={onSelectPolicy}
              onSelectProduct={onSelectProduct}
              onSwitchToRequestMode={() => {
                setActiveFilter('REVIEW');
                setComposerMode('CHANGE_REQUEST');
              }}
              onQuickToggleUserRole={onQuickToggleUserRole}
              onOpenEditModal={onOpenEditModal}
              onOpenExportModal={onOpenExportModal}
            />
          </div>
        ) : (
          /* Classic Feed Cards List & Note/Change-Request Composer */
          <>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 bg-slate-50/40">
              {filteredComments.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs space-y-2">
                  <div>No entries under this category yet.</div>
                  <button
                    onClick={() => setActiveFilter('SHIDNEY')}
                    className="text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>Ask Shidney AI</span>
                  </button>
                </div>
              ) : (
                filteredComments.map((c) => {
                  const isChangeRequest = c.type === 'CHANGE_REQUEST' || Boolean(c.proposedTimeout);
                  const isIssue = c.category === 'Issues';
                  const isNote = c.category === 'Notes';
                  const isMinutes = c.category === 'Minutes';

                  // Change Request Card
                  if (isChangeRequest) {
                    const isPending = c.status === 'PENDING';
                    const isApproved = c.status === 'APPROVED';
                    const isRejected = c.status === 'REJECTED';

                    return (
                      <div
                        key={c.id}
                        className={`bg-white border rounded-xl p-3 space-y-2.5 shadow-2xs transition ${
                          isPending
                            ? 'border-amber-300 ring-1 ring-amber-300/40 bg-amber-50/15'
                            : isApproved
                            ? 'border-emerald-300 bg-emerald-50/10'
                            : 'border-slate-200'
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                              {c.avatar || 'EM'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-xs leading-tight">{c.author}</div>
                              <div className="text-[10px] text-slate-400">{c.time} • {c.targetProduct || 'Credit Cards'}</div>
                            </div>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            isPending
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : isApproved
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-rose-100 text-rose-900 border-rose-300'
                          }`}>
                            {isPending && '🟡 Pending Review'}
                            {isApproved && '🟢 Approved'}
                            {isRejected && '🔴 Rejected'}
                          </span>
                        </div>

                        {/* Proposal Details */}
                        <div className="space-y-1.5">
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>{c.title}</span>
                          </div>
                          <p className="text-slate-600 text-[11.5px] leading-relaxed">
                            {c.content}
                          </p>

                          {c.proposedTimeout && (
                            <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100 text-[10.5px] space-y-0.5">
                              <div className="text-blue-950 font-mono">
                                Timeout: <strong>{c.proposedTimeout}</strong>
                              </div>
                              {c.proposedMfaRule && (
                                <div className="text-slate-700">
                                  Trigger: <strong>{c.proposedMfaRule}</strong>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Manager Approval / Rejection Actions */}
                        {isPending && (
                          <div className="pt-1">
                            {isManager ? (
                              <div className="space-y-2">
                                {signingId === c.id ? (
                                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg space-y-2 animate-in fade-in duration-100">
                                    <div className="text-[11px] font-bold text-emerald-900">
                                      Enter Approval Sign-Off Note:
                                    </div>
                                    <input
                                      type="text"
                                      value={signNote}
                                      onChange={(e) => setSignNote(e.target.value)}
                                      placeholder="e.g. Approved under APRA CPS 234 Section 14 waiver."
                                      className="w-full bg-white border border-emerald-300 rounded px-2 py-1 text-xs text-slate-900 outline-none"
                                    />
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => setSigningId(null)}
                                        className="px-2 py-1 rounded text-slate-600 hover:bg-slate-200 text-[10.5px] cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (onAcceptRequest) onAcceptRequest(c.id, signNote, c);
                                          setSigningId(null);
                                        }}
                                        className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10.5px] cursor-pointer shadow-2xs"
                                      >
                                        Confirm & Enforce
                                      </button>
                                    </div>
                                  </div>
                                ) : rejectingId === c.id ? (
                                  <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-lg space-y-2 animate-in fade-in duration-100">
                                    <div className="text-[11px] font-bold text-rose-900">
                                      Enter Rejection Reason:
                                    </div>
                                    <input
                                      type="text"
                                      value={rejectReason}
                                      onChange={(e) => setRejectReason(e.target.value)}
                                      placeholder="e.g. Inactivity window exceeds 15-minute APRA CPS 234 threshold."
                                      className="w-full bg-white border border-rose-300 rounded px-2 py-1 text-xs text-slate-900 outline-none"
                                    />
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => setRejectingId(null)}
                                        className="px-2 py-1 rounded text-slate-600 hover:bg-slate-200 text-[10.5px] cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (onRejectRequest) onRejectRequest(c.id, rejectReason);
                                          setRejectingId(null);
                                        }}
                                        className="px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-800 text-white font-bold text-[10.5px] cursor-pointer shadow-2xs"
                                      >
                                        Confirm Rejection
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        setSigningId(c.id);
                                        setRejectingId(null);
                                      }}
                                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs text-[11px]"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Accept & Enforce</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setRejectingId(c.id);
                                        setSigningId(null);
                                      }}
                                      className="flex-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold py-1.5 px-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs text-[11px]"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      <span>Reject</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="p-2 bg-amber-50/80 border border-amber-200 rounded-md text-[10.5px] text-amber-900 flex items-center justify-between">
                                <span>⏳ Awaiting Risk Manager Sign-off</span>
                                <span className="text-[9.5px] text-amber-700 font-semibold">(Switch role to Approve)</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Approved Banner */}
                        {isApproved && (
                          <div className="p-2 bg-emerald-50/80 border border-emerald-200 rounded-md text-[10.5px] text-emerald-950 space-y-0.5">
                            <div className="font-bold flex items-center gap-1 text-emerald-900">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Approved & Enforced by {c.reviewerName || 'Marcus Vance'}</span>
                            </div>
                            {c.reviewNote && (
                              <div className="italic text-emerald-800">
                                "{c.reviewNote}"
                              </div>
                            )}
                          </div>
                        )}

                        {/* Rejection Banner */}
                        {isRejected && (
                          <div className="p-2 bg-rose-50 border border-rose-200 rounded-md text-[10.5px] text-rose-950 space-y-0.5">
                            <div className="font-bold flex items-center gap-1 text-rose-900">
                              <XCircle className="w-3.5 h-3.5 text-rose-700" />
                              <span>Rejected by {c.reviewerName || 'Risk Manager'}</span>
                            </div>
                            {c.reviewNote && (
                              <div className="italic text-rose-800">
                                Reason: "{c.reviewNote}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Regular Note / Minutes / Issue Card
                  return (
                    <div
                      key={c.id}
                      className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                            {c.avatar || 'JD'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs leading-tight">{c.author}</div>
                            <div className="text-[10px] text-slate-400">{c.time}</div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                          isIssue
                            ? 'bg-amber-50 text-amber-900 border-amber-200'
                            : isNote
                            ? 'bg-sky-50 text-sky-900 border-sky-200'
                            : isMinutes
                            ? 'bg-purple-50 text-purple-900 border-purple-200'
                            : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}>
                          {isIssue && '⚠️ '}
                          {isNote && '🎓 '}
                          {isMinutes && '📝 '}
                          {c.badge || c.category}
                        </span>
                      </div>

                      <p className="text-slate-700 text-[11.5px] leading-relaxed">
                        {c.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Interactive Composer Pane */}
            <div className="p-3 bg-white border-t border-slate-200 space-y-2">
              {/* Mode Switcher */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px]">
                  <button
                    onClick={() => setComposerMode('NOTE')}
                    className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                      composerMode === 'NOTE' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    📝 Post Note
                  </button>
                  <button
                    onClick={() => setComposerMode('CHANGE_REQUEST')}
                    className={`px-2 py-0.5 rounded font-bold transition cursor-pointer flex items-center gap-1 ${
                      composerMode === 'CHANGE_REQUEST' ? 'bg-blue-600 text-white shadow-2xs' : 'text-blue-700'
                    }`}
                  >
                    <span>⚡ Request Change</span>
                  </button>
                </div>

                <span className="text-[10px] text-slate-400 font-medium">
                  {currentUser?.name?.split(' ')[0]}
                </span>
              </div>

              {composerMode === 'NOTE' ? (
                /* Simple Note Form */
                <form onSubmit={handlePostNote} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600">Category:</span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-800 outline-none"
                    >
                      <option value="General">💬 General Review</option>
                      <option value="Notes">🎓 Architecture Note</option>
                      <option value="Issues">⚠️ Compliance Issue</option>
                      <option value="Minutes">📝 Risk Minutes</option>
                    </select>
                  </div>

                  <textarea
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Write a note or regulatory response..."
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg p-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition resize-none"
                  />

                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate max-w-[170px]">
                      <Link className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{activePolicyTitle}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={!newText.trim()}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post Note</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Structured Change Request Form with Sender & Recipient */
                <form onSubmit={handleSubmitRequest} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="font-bold text-slate-700">Target Product:</span>
                      <select
                        value={reqProduct}
                        onChange={(e) => setReqProduct(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-800 outline-none font-semibold mt-0.5"
                      >
                        <option value="Credit Cards">Credit Cards</option>
                        <option value="Personal Loans">Personal Loans</option>
                        <option value="Mortgages">Mortgages</option>
                        <option value="Deposits">Deposits</option>
                      </select>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700">Send To:</span>
                      <select
                        value={reqRecipient}
                        onChange={(e) => setReqRecipient(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-800 outline-none font-semibold mt-0.5"
                      >
                        <option value="Risk Committee (Manager Approver)">Risk Committee</option>
                        <option value="Lead Security Architect">Lead Architect</option>
                        <option value="APRA Delegate">APRA Delegate</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={reqTitle}
                      onChange={(e) => setReqTitle(e.target.value)}
                      placeholder="Request title (e.g. 20m timeout for Credit Cards)..."
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded px-2 py-1 text-xs text-slate-900 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <div className="text-[9.5px] font-bold text-slate-500 uppercase">Proposed Timeout</div>
                      <input
                        type="text"
                        value={reqTimeout}
                        onChange={(e) => setReqTimeout(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-mono text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <div className="text-[9.5px] font-bold text-slate-500 uppercase">MFA Trigger</div>
                      <input
                        type="text"
                        value={reqMfaRule}
                        onChange={(e) => setReqMfaRule(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[11px] text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <textarea
                      value={reqJustification}
                      onChange={(e) => setReqJustification(e.target.value)}
                      placeholder="Regulatory justification & customer impact..."
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded p-1.5 text-xs text-slate-900 outline-none resize-none"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setComposerMode('NOTE')}
                      className="px-2 py-1 rounded text-slate-600 hover:bg-slate-100 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!reqTitle.trim() || !reqJustification.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <SendHorizontal className="w-3 h-3" />
                      <span>Send Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
