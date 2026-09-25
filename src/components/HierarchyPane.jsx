import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  FileText, 
  Database,
  X,
  Shield,
  Lock,
  Landmark,
  CreditCard,
  PanelLeftClose,
  Search,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { bankingHierarchy as defaultBankingHierarchy } from '../data/mockData';

export default function HierarchyPane({ 
  hierarchy = defaultBankingHierarchy,
  selectedItemId, 
  onSelectItem,
  isMobileOpen,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  width = 270,
  selectedBank,
  policies = {},
  onOpenAddPolicyModal,
  onDeletePolicy
}) {
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  
  const [expandedNodes, setExpandedNodes] = useState({
    'prudential-standards': true,
    'cps-234-group': true,
    'cps-230-group': true,
    'privacy-data-governance': true,
    'app-privacy-group': true,
    'financial-crime-aml': true,
    'aml-transaction-monitoring': true,
    'payment-rails-gateway': true,
    'payment-gateways-group': true,
  });

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Clean, subtle monochrome domain icons
  const getDomainIcon = (id) => {
    switch (id) {
      case 'prudential-standards': return <Shield className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />;
      case 'privacy-data-governance': return <Lock className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />;
      case 'financial-crime-aml': return <Landmark className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />;
      case 'payment-rails-gateway': return <CreditCard className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />;
      default: return <Database className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />;
    }
  };

  // Calculate active and inactive counts for this bank
  const { totalCount, activeCount, inactiveCount } = useMemo(() => {
    const policyList = Object.values(policies);
    const active = policyList.filter(p => {
      const addenda = p.bankCustomAddenda?.[selectedBank?.id];
      return addenda && addenda.status !== 'INACTIVE';
    }).length;
    return {
      totalCount: policyList.length,
      activeCount: active,
      inactiveCount: policyList.length - active
    };
  }, [policies, selectedBank]);

  // Filter hierarchy tree based on search query and status filter
  const filteredHierarchy = useMemo(() => {
    const q = filterQuery.toLowerCase().trim();

    return hierarchy
      .map(domain => {
        const matchingGroups = (domain.children || [])
          .map(group => {
            const matchingLeaves = (group.children || []).filter(leaf => {
              const pol = policies[leaf.id];
              const isBankActive = Boolean(
                pol?.bankCustomAddenda?.[selectedBank?.id] &&
                pol.bankCustomAddenda[selectedBank.id].status !== 'INACTIVE'
              );

              // Status filter check
              if (statusFilter === 'ACTIVE' && !isBankActive) return false;
              if (statusFilter === 'INACTIVE' && isBankActive) return false;

              // Search query check
              if (!q) return true;
              return (
                leaf.label.toLowerCase().includes(q) || 
                leaf.id.toLowerCase().includes(q) ||
                (leaf.version && leaf.version.toLowerCase().includes(q))
              );
            });

            if (matchingLeaves.length > 0) {
              return {
                ...group,
                children: matchingLeaves,
              };
            }
            return null;
          })
          .filter(Boolean);

        if (matchingGroups.length > 0) {
          return {
            ...domain,
            children: matchingGroups,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [hierarchy, filterQuery, statusFilter, policies, selectedBank]);

  if (isCollapsed) return null;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
        ></div>
      )}

      <aside 
        style={{ width: `${width}px` }}
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col h-full shadow-xl transition-transform duration-200 select-none text-xs
          md:relative md:inset-auto md:z-auto md:shadow-none md:translate-x-0 md:h-[calc(100vh-3.5rem)]
          ${isMobileOpen ? 'translate-x-0 !w-72' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="h-11 px-3 border-b border-slate-200 flex items-center justify-between text-slate-800 bg-slate-50/70">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 truncate">
              Banking Regulatory Library
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            {/* Desktop Collapse Button */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                title="Collapse hierarchy sidebar"
                className="hidden md:flex p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 rounded hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Search Bar + Add Policy Trigger */}
        <div className="p-2 border-b border-slate-200 bg-slate-50/50 flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter standards (CPS, PII, AML)..."
              className="w-full bg-white border border-slate-300 rounded pl-7 pr-6 py-1 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 transition"
            />
            {filterQuery && (
              <button 
                onClick={() => setFilterQuery('')} 
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {onOpenAddPolicyModal && (
            <button
              onClick={onOpenAddPolicyModal}
              title="Add New Master Policy Specification"
              className="p-1 rounded bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer flex-shrink-0 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Active / Inactive Status Filter Pills */}
        <div className="px-2.5 py-1.5 border-b border-slate-200 bg-slate-50/80 flex items-center gap-1 text-[10.5px]">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2 py-0.5 rounded font-semibold transition cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-2 py-0.5 rounded font-semibold transition cursor-pointer flex items-center gap-1 ${
              statusFilter === 'ACTIVE'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('INACTIVE')}
            className={`px-2 py-0.5 rounded font-semibold transition cursor-pointer flex items-center gap-1 ${
              statusFilter === 'INACTIVE'
                ? 'bg-slate-700 text-white shadow-2xs'
                : 'text-slate-600 bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Inactive ({inactiveCount})
          </button>
        </div>

        {/* Tree List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5 space-y-1.5 bg-white">
          {filteredHierarchy.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-[11px] space-y-1">
              <div>No standards match your filter.</div>
              {statusFilter !== 'ALL' && (
                <button 
                  onClick={() => setStatusFilter('ALL')} 
                  className="text-blue-600 hover:underline text-[10.5px] cursor-pointer"
                >
                  Show all standards
                </button>
              )}
            </div>
          ) : (
            filteredHierarchy.map((domain) => {
              const isDomainExpanded = filterQuery ? true : (expandedNodes[domain.id] !== false);
              return (
                <div key={domain.id} className="space-y-0.5">
                  {/* Domain Header */}
                  <div 
                    onClick={() => toggleNode(domain.id)}
                    className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-100 cursor-pointer transition text-slate-800"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-slate-400">
                        {isDomainExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </span>
                      {getDomainIcon(domain.id)}
                      <span className="text-[11px] font-bold tracking-tight uppercase text-slate-800 truncate">
                        {domain.label}
                      </span>
                    </div>
                  </div>

                  {/* Sub-Folders */}
                  {isDomainExpanded && domain.children && (
                    <div className="pl-3 ml-2 border-l border-slate-200 space-y-1">
                      {domain.children.map((folder) => {
                        const isFolderExpanded = filterQuery ? true : expandedNodes[folder.id];
                        return (
                          <div key={folder.id} className="space-y-0.5">
                            <div 
                              onClick={() => toggleNode(folder.id)}
                              className="flex items-center justify-between px-2 py-1 text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer transition"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="text-slate-400">
                                  {isFolderExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                </span>
                                <Folder className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                <span className="text-xs font-semibold text-slate-700 truncate">{folder.label}</span>
                              </div>
                            </div>

                            {/* Leaf Policies */}
                            {isFolderExpanded && folder.children && (
                              <div className="pl-3 ml-2 border-l border-slate-200 space-y-0.5">
                                {folder.children.map((leaf) => {
                                  const isSelected = selectedItemId === leaf.id;
                                  
                                  // Check if active bank has a configured/active addendum for this policy
                                  const policyObj = policies[leaf.id];
                                  const addenda = policyObj?.bankCustomAddenda?.[selectedBank?.id];
                                  const isBankActive = Boolean(addenda && addenda.status !== 'INACTIVE');

                                  return (
                                    <div
                                      key={leaf.id}
                                      onClick={() => {
                                        onSelectItem(leaf.id);
                                        if (onCloseMobile) onCloseMobile();
                                      }}
                                      className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition text-xs ${
                                        isSelected
                                          ? 'bg-blue-50 text-blue-900 border border-blue-200 font-bold shadow-2xs'
                                          : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 truncate">
                                        {/* Green Active Indicator Dot vs Grey Inactive Dot */}
                                        {isBankActive ? (
                                          <span 
                                            className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 flex-shrink-0" 
                                            title={`🟢 Active & Enforced for ${selectedBank?.name || 'Bank'}`}
                                          />
                                        ) : (
                                          <span 
                                            className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" 
                                            title="⚪ Inactive for this Bank"
                                          />
                                        )}

                                        <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                                        <span className="truncate">{leaf.label}</span>
                                      </div>

                                      <div className="flex items-center gap-1">
                                        {leaf.version && (
                                          <span className={`text-[10px] font-mono px-1 py-0.2 rounded border ${
                                            isSelected 
                                              ? 'bg-blue-100 text-blue-800 border-blue-300' 
                                              : isBankActive
                                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                              : 'bg-slate-100 text-slate-500 border-slate-200'
                                          }`}>
                                            {leaf.version}
                                          </span>
                                        )}

                                        {/* Optional Delete/Remove Policy Trigger */}
                                        {onDeletePolicy && (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (window.confirm(`Are you sure you want to remove ${leaf.label}?`)) {
                                                onDeletePolicy(leaf.id);
                                              }
                                            }}
                                            title="Delete specification"
                                            className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info showing active bank status */}
        <div className="h-9 px-3 bg-slate-50 border-t border-slate-200 text-[10.5px] text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="truncate font-semibold text-slate-700">
              {selectedBank?.name?.split(' ')[0] || 'Bank'}: {activeCount}/{totalCount} Active
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {totalCount} Total
          </span>
        </div>
      </aside>
    </>
  );
}
