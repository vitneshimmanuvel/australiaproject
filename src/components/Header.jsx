import React from 'react';
import { 
  Search, 
  Settings, 
  Layers,
  Menu,
  MessageSquare,
  Crown,
  Building2,
  ChevronDown,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  ShieldAlert
} from 'lucide-react';

export default function Header({ 
  currentUser, 
  onOpenRoleModal,
  searchQuery, 
  setSearchQuery,
  onToggleMobileLeft,
  onToggleMobileRight,
  isLeftOpen,
  onToggleLeft,
  isRightOpen,
  onToggleRight,
  commentsCount,
  selectedBank,
  selectedProduct
}) {
  const isManager = currentUser?.roleType === 'manager';
  const isAdmin = currentUser?.type === 'admin';

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-3 sm:px-4 flex items-center justify-between select-none z-30 shadow-2xs">
      {/* Left: Mobile Hierarchy Menu Button + Desktop Sidebar Toggle + Brand */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Left Sidebar Toggle */}
        <button
          onClick={onToggleMobileLeft}
          title="Toggle Architecture Hierarchy"
          className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Desktop Left Sidebar Toggle */}
        {onToggleLeft && (
          <button
            onClick={onToggleLeft}
            title={isLeftOpen ? "Collapse Left Hierarchy Tree" : "Expand Left Hierarchy Tree"}
            className={`hidden md:flex p-1.5 rounded-lg border transition cursor-pointer ${
              isLeftOpen 
                ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900' 
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            {isLeftOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white flex-shrink-0">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight hidden xs:inline">
            LibTrak OmniSpec Hub
          </span>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 hidden sm:inline">
            v2.4.0
          </span>
        </div>

        {/* Selected Bank Badge */}
        {selectedBank && (
          <div className="hidden lg:flex items-center gap-1.5 bg-blue-50/80 border border-blue-200 px-2.5 py-1 rounded-lg text-xs">
            <Building2 className="w-3.5 h-3.5 text-blue-700" />
            <span className="font-bold text-blue-950 truncate max-w-[180px]">
              {selectedBank.id.toUpperCase()} • Retail Standards
            </span>
          </div>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search APRA clauses, CPS 234, CDR tokens, AML rules..."
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md pl-7.5 sm:pl-8 pr-2.5 py-1 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
          />
        </div>
      </div>

      {/* Right: Feed Toggle & User Profile Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Desktop Feed Toggle Button */}
        {onToggleRight && (
          <button
            onClick={onToggleRight}
            title={isRightOpen ? "Collapse Contextual Feed" : "Expand Contextual Feed"}
            className={`hidden lg:flex items-center gap-1.5 border px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              isRightOpen 
                ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100' 
                : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Feed</span>
            <span className="text-[10px] font-mono bg-slate-200 px-1 rounded-full font-bold">
              {commentsCount}
            </span>
          </button>
        )}

        {/* Mobile Feed Toggle Button */}
        <button
          onClick={onToggleMobileRight}
          title="Toggle Contextual Feed"
          className="lg:hidden flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded text-xs text-slate-700 font-medium transition cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[10px] font-mono bg-slate-200 px-1 rounded-full font-bold">
            {commentsCount}
          </span>
        </button>

        {/* User Account / Role Switcher Pill */}
        <button
          onClick={onOpenRoleModal}
          className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg p-1.5 sm:px-2.5 sm:py-1 transition cursor-pointer text-left shadow-2xs group"
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-2xs ${
            isAdmin ? 'bg-amber-600' : isManager ? 'bg-indigo-700' : 'bg-slate-800'
          }`}>
            {currentUser?.avatar || 'DM'}
          </div>

          <div className="hidden sm:block text-left truncate max-w-[130px]">
            <div className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-blue-600 transition">
              {currentUser?.name || 'David Miller'}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {isAdmin ? 'Master Admin' : isManager ? 'Risk Approver' : 'Submitter (Employee)'}
            </div>
          </div>

          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
