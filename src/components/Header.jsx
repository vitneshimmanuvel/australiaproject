import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Settings, 
  Layers, 
  Library,
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
  ShieldAlert,
  FileText,
  ArrowUpRight,
  X
} from 'lucide-react';

export default function Header({ 
  currentUser, 
  onOpenRoleModal, 
  searchQuery = '', 
  setSearchQuery, 
  policies = {},
  selectedPolicyId,
  onSelectPolicy,
  onSelectProduct,
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter policies matching search query
  const searchResults = React.useMemo(() => {
    const query = (searchQuery || '').trim().toLowerCase();
    if (!query) return [];

    const allPolicies = Object.values(policies);
    return allPolicies.filter((p) => {
      const matchTitle = (p.title || '').toLowerCase().includes(query);
      const matchBreadcrumb = (p.breadcrumb || '').toLowerCase().includes(query);
      const matchId = (p.id || '').toLowerCase().includes(query);
      const matchVision = (p.visionStatement || '').toLowerCase().includes(query);
      const matchCompliance = (p.complianceLevel || '').toLowerCase().includes(query);
      
      const matchClauses = (p.coreFrameworkClauses || []).some(c => 
        (c.clauseId || '').toLowerCase().includes(query) ||
        (c.title || '').toLowerCase().includes(query) ||
        (c.content || '').toLowerCase().includes(query)
      );

      const matchAddenda = Object.values(p.bankCustomAddenda || {}).some(a => 
        (a.sessionTimeout || '').toLowerCase().includes(query) ||
        (a.mfaRule || '').toLowerCase().includes(query) ||
        (a.customClause || '').toLowerCase().includes(query)
      );

      const matchProducts = (p.applicableProducts || []).some(prod => 
        prod.toLowerCase().includes(query)
      );

      return matchTitle || matchBreadcrumb || matchId || matchVision || matchCompliance || matchClauses || matchAddenda || matchProducts;
    });
  }, [searchQuery, policies]);

  const handleSelectSearchResult = (policy) => {
    if (onSelectPolicy) onSelectPolicy(policy.id);
    if (policy.applicableProducts?.[0] && onSelectProduct) {
      onSelectProduct(policy.applicableProducts[0]);
    }
    setSearchQuery('');
    setIsSearchOpen(false);
  };

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

        {/* Interactive Library Brand Pill with Smooth Hover Expansion */}
        <div 
          title="LibTrak OmniSpec Regulatory Library v2.4.0"
          className="group relative flex items-center bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-lg p-1 transition-all duration-300 cursor-pointer shadow-2xs"
        >
          <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white flex-shrink-0 shadow-2xs transition-transform duration-300 group-hover:scale-105">
            <Library className="w-3.5 h-3.5 text-blue-400" />
          </div>

          <div className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out flex items-center whitespace-nowrap">
            <span className="font-bold text-slate-900 text-xs tracking-tight pl-2 pr-1.5">
              LibTrak OmniSpec Hub
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-800 bg-white px-1.5 py-0.2 rounded border border-slate-300 mr-1 shadow-2xs">
              v2.4.0
            </span>
          </div>
        </div>

        {/* Selected Bank Badge */}
        {selectedBank && (
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-lg text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-700" />
            <span className="font-bold text-slate-900 truncate max-w-[180px]">
              {selectedBank.id.toUpperCase()} • Retail Standards
            </span>
          </div>
        )}
      </div>

      {/* Center: Search Bar with Interactive Dropdown Results */}
      <div ref={searchContainerRef} className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4 relative">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => {
              if (searchQuery.trim()) setIsSearchOpen(true);
            }}
            placeholder="Search APRA clauses, CPS 234, CDR tokens, loan limits..."
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-md pl-7.5 sm:pl-8 pr-7 py-1 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto custom-scrollbar animate-in fade-in duration-150">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
              <span>Matching Standards ({searchResults.length})</span>
              <span className="text-[9.5px] text-slate-500 font-normal">Click to navigate</span>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching banking regulations or clauses found for "<strong className="text-slate-800">{searchQuery}</strong>".
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectSearchResult(p)}
                    className="p-2.5 hover:bg-slate-50 transition cursor-pointer group flex items-start justify-between gap-3 text-left"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition">
                          {p.title}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-900 px-1.5 py-0.2 rounded border border-slate-300">
                          {p.latestVersion}
                        </span>
                      </div>
                      <div className="text-[10.5px] text-slate-600 truncate max-w-[280px] sm:max-w-[360px]">
                        {p.breadcrumb}
                      </div>
                      <div className="text-[10.5px] text-slate-700 line-clamp-1 italic font-medium">
                        "{p.visionStatement}"
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0 mt-1">
                      <span className="text-[9.5px] font-bold bg-slate-100 text-slate-900 px-1.5 py-0.2 rounded border border-slate-300">
                        {p.complianceLevel}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 transition" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
