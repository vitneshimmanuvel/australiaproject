import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Link,
  X,
  PanelRightClose
} from 'lucide-react';

export default function ContextualFeedPane({ 
  comments = [], 
  onAddComment,
  isMobileOpen,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  width = 300
}) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [newText, setNewText] = useState('');
  const [category, setCategory] = useState('General');

  const filteredComments = activeFilter === 'ALL'
    ? comments
    : comments.filter(c => c.category?.toUpperCase() === activeFilter.toUpperCase());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    onAddComment({
      id: `c-${Date.now()}`,
      author: 'Reviewer (Logged In)',
      avatar: 'RV',
      time: 'Just now',
      category: category,
      badge: category,
      content: newText.trim(),
    });
    setNewText('');
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
        <div className="h-12 lg:h-10 px-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-slate-800 truncate">
            <MessageSquare className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <span className="truncate">Contextual Feed ({comments.length})</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse Button */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                title="Collapse Contextual Feed"
                className="hidden lg:flex p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <PanelRightClose className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-2.5 py-1.5 border-b border-slate-200 flex items-center gap-1 overflow-x-auto custom-scrollbar bg-white">
          {['ALL', 'NOTES', 'REVIEW', 'ISSUES', 'MINUTES'].map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-2 py-0.5 rounded text-[10.5px] font-semibold transition cursor-pointer whitespace-nowrap ${
                activeFilter === key
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {key === 'ALL' && 'All'}
              {key === 'NOTES' && '🎓 Notes'}
              {key === 'REVIEW' && '💬 Review'}
              {key === 'ISSUES' && '⚠️ Issues'}
              {key === 'MINUTES' && '📝 Minutes'}
            </button>
          ))}
        </div>

        {/* Comment Cards */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2.5 bg-slate-50/40">
          {filteredComments.map((c) => {
            const isIssue = c.category === 'Issues';
            const isNote = c.category === 'Notes';
            return (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-1.5 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center">
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
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    {isIssue && '⚠️ '}
                    {isNote && '🎓 '}
                    {c.badge || c.category}
                  </span>
                </div>

                <p className="text-slate-700 text-[11.5px] leading-relaxed">
                  {c.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interactive Composer */}
        <div className="p-2.5 bg-white border-t border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-600">Post Comment / Log:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10.5px] outline-none cursor-pointer"
            >
              <option value="General">💬 General</option>
              <option value="Issues">⚠️ Issue</option>
              <option value="Notes">🎓 Note</option>
              <option value="Minutes">📝 Minutes</option>
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-1.5">
            <textarea
              rows={2}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Write a note or regulatory response..."
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-400 resize-none transition"
            />

            <div className="flex items-center justify-between">
              <span className="text-[10.5px] text-slate-400 flex items-center gap-1">
                <Link className="w-3 h-3 text-slate-400" /> Linked to active selection
              </span>

              <button
                type="submit"
                className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1 rounded text-xs transition cursor-pointer shadow-2xs"
              >
                <Send className="w-3 h-3" />
                <span>Post Note</span>
              </button>
            </div>
          </form>
        </div>
      </aside>
    </>
  );
}
