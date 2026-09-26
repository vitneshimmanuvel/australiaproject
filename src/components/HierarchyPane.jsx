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
  Layers
} from 'lucide-react';
import { 
  bankingHierarchy as defaultBankingHierarchy, 
  banksList as defaultBanksList,
  bankingProducts as defaultBankingProducts 
} from '../data/mockData';

export default function HierarchyPane({ 
  hierarchy = defaultBankingHierarchy,
  banks = defaultBanksList,
  selectedBank,
  onSelectBank,
  selectedProduct = 'credit-cards',
  onSelectProduct,
  products = defaultBankingProducts,
  selectedItemId, 
  onSelectItem,
  isMobileOpen,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  width = 280,
  policies = {},
  onOpenAddPolicyModal,
  onDeletePolicy
}) {
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  
  // Initially only CBA is open, everything else collapsed
  const [expandedBanks, setExpandedBanks] = useState({
    'cba': true,
    'nab': false,
    'wbc': false,
    'anz': false,
  });

  // Initially Credit Cards under CBA is open, other products collapsed
  const [expandedProducts, setExpandedProducts] = useState({
    'cba-credit-cards': true,
  });

  // Statutory folders start collapsed so user can manually expand what they need
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleBank = (bankId) => {
    setExpandedBanks(prev => ({
      ...prev,
      [bankId]: !prev[bankId]
    }));
  };

  const toggleProduct = (prodKey) => {
    setExpandedProducts(prev => ({
      ...prev,
      [prodKey]: !prev[prodKey]
    }));
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Clean, subtle domain icons
  const getDomainIcon = (id) => {
    switch (id) {
      case 'prudential-standards': return <Shield className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />;
      case 'privacy-data-governance': return <Lock className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />;
      case 'financial-crime-aml': return <Landmark className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />;
      case 'payment-rails-gateway': return <CreditCard className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />;
      default: return <Folder className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />;
    }
  };

  // Product categories in order requested: Credit Cards first, All Retail Standards at the end
  const productNodes = [
    { id: 'credit-cards', label: 'Credit Cards', short: 'Cards' },
    { id: 'personal-loans', label: 'Personal Loans', short: 'Loans' },
    { id: 'mortgages', label: 'Mortgages & Home Loans', short: 'Mortgages' },
    { id: 'deposits', label: 'Deposits & Savings', short: 'Deposits' },
    { id: 'all', label: 'All Retail Standards', short: 'All' },
  ];

  // Calculate active and inactive counts for active bank & product
  const { totalCount, activeCount, inactiveCount } = useMemo(() => {
    const policyList = Object.values(policies);
    const filteredByProduct = selectedProduct === 'all' 
      ? policyList 
      : policyList.filter(p => !p.applicableProducts || p.applicableProducts.includes(selectedProduct));

    const active = filteredByProduct.filter(p => {
      const addenda = p.bankCustomAddenda?.[selectedBank?.id];
      return addenda && addenda.status !== 'INACTIVE';
    }).length;

    return {
      totalCount: filteredByProduct.length,
      activeCount: active,
      inactiveCount: filteredByProduct.length - active
    };
  }, [policies, selectedBank, selectedProduct]);

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
          ${isMobileOpen ? 'translate-x-0 !w-80' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Top Header with Collapse Button */}
        <div className="h-10 px-3 border-b border-slate-200 flex items-center justify-between text-slate-800 bg-slate-50/70">
          <div className="flex items-center gap-1.5 truncate">
            <Layers className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 truncate">
              Banking Regulatory Hub
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                title="Collapse hierarchy sidebar"
                className="hidden md:flex p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 rounded hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar + Add Policy */}
        <div className="p-2 border-b border-slate-200 bg-slate-50/50 flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search standards (CPS, PII, AML)..."
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

        {/* Active / Inactive Filter Tabs */}
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

        {/* Hierarchy Tree: 4 Banks ➔ Products (Credit Cards 1st, All at end) ➔ Folders ➔ Policies */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 bg-white">
          {banks.map((b) => {
            const isBankSelected = selectedBank?.id === b.id;
            const isBankExpanded = filterQuery ? true : Boolean(expandedBanks[b.id]);

            return (
              <div key={b.id} className="space-y-0.5">
                {/* Level 1: Bank Node */}
                <div 
                  onClick={() => {
                    toggleBank(b.id);
                    if (onSelectBank) onSelectBank(b);
                  }}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition ${
                    isBankSelected 
                      ? 'bg-slate-100 text-slate-900 font-bold border border-slate-300 shadow-2xs' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">
                      {isBankExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                    <div className="w-5 h-5 rounded bg-slate-900 text-white font-bold text-[9.5px] flex items-center justify-center flex-shrink-0">
                      {b.id.toUpperCase()}
                    </div>
                    <span className="text-[11.5px] font-bold truncate">
                      {b.id.toUpperCase()} - Retail Standards
                    </span>
                  </div>

                  <span className="text-[9.5px] font-mono font-bold bg-white text-slate-600 px-1.5 py-0.2 rounded border border-slate-200 flex-shrink-0">
                    4 Products
                  </span>
                </div>

                {/* Level 2: Product Folders under Bank (Credit Cards 1st, All Retail Standards at end) */}
                {isBankExpanded && (
                  <div className="pl-3 ml-2 border-l border-slate-200 space-y-1">
                    {productNodes.map((prod) => {
                      const prodKey = `${b.id}-${prod.id}`;
                      const isProdSelected = isBankSelected && selectedProduct === prod.id;
                      const isProdExpanded = filterQuery ? true : Boolean(expandedProducts[prodKey]);

                      return (
                        <div key={prod.id} className="space-y-0.5">
                          {/* Product Folder Node with Outline Folder Icon */}
                          <div 
                            onClick={() => {
                              toggleProduct(prodKey);
                              if (onSelectBank) onSelectBank(b);
                              if (onSelectProduct) onSelectProduct(prod.id);
                            }}
                            className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer transition ${
                              isProdSelected 
                                ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200 shadow-2xs' 
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-slate-400">
                                {isProdExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              </span>
                              <Folder className={`w-3.5 h-3.5 flex-shrink-0 ${isProdSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                              <span className="text-xs font-semibold truncate">{prod.label}</span>
                            </div>
                          </div>

                          {/* Level 3 & 4: Statutory Folders & Policy Leaves */}
                          {isProdExpanded && (
                            <div className="pl-3 ml-2 border-l border-slate-200 space-y-1">
                              {hierarchy.map((domain) => {
                                const isDomainExpanded = filterQuery ? true : Boolean(expandedFolders[domain.id]);

                                // Filter domain leaves matching product and active status
                                const matchingGroups = (domain.children || []).map(group => {
                                  const matchingLeaves = (group.children || []).filter(leaf => {
                                    const pol = policies[leaf.id];
                                    
                                    // Product check
                                    if (prod.id !== 'all' && pol?.applicableProducts && !pol.applicableProducts.includes(prod.id)) {
                                      return false;
                                    }

                                    // Active / Inactive check
                                    const isBankActive = Boolean(
                                      pol?.bankCustomAddenda?.[b.id] &&
                                      pol.bankCustomAddenda[b.id].status !== 'INACTIVE'
                                    );

                                    if (statusFilter === 'ACTIVE' && !isBankActive) return false;
                                    if (statusFilter === 'INACTIVE' && isBankActive) return false;

                                    if (!filterQuery) return true;
                                    const q = filterQuery.toLowerCase().trim();
                                    return (
                                      leaf.label.toLowerCase().includes(q) || 
                                      leaf.id.toLowerCase().includes(q) ||
                                      (leaf.version && leaf.version.toLowerCase().includes(q))
                                    );
                                  });

                                  if (matchingLeaves.length > 0) {
                                    return { ...group, children: matchingLeaves };
                                  }
                                  return null;
                                }).filter(Boolean);

                                if (matchingGroups.length === 0) return null;

                                return (
                                  <div key={domain.id} className="space-y-0.5">
                                    {/* Domain Folder Node */}
                                    <div 
                                      onClick={() => toggleFolder(domain.id)}
                                      className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-slate-100 cursor-pointer transition text-slate-800"
                                    >
                                      <div className="flex items-center gap-1.5 truncate">
                                        <span className="text-slate-400">
                                          {isDomainExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                        </span>
                                        {getDomainIcon(domain.id)}
                                        <span className="text-[10.5px] font-bold uppercase tracking-tight text-slate-800 truncate">
                                          {domain.label}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Sub-group folders & leaves */}
                                    {isDomainExpanded && (
                                      <div className="pl-3 ml-1.5 border-l border-slate-200 space-y-0.5">
                                        {matchingGroups.map((group) => {
                                          const isGroupExpanded = filterQuery ? true : Boolean(expandedFolders[group.id]);

                                          return (
                                            <div key={group.id} className="space-y-0.5">
                                              <div 
                                                onClick={() => toggleFolder(group.id)}
                                                className="flex items-center justify-between px-1.5 py-0.5 rounded hover:bg-slate-100 cursor-pointer transition text-slate-700"
                                              >
                                                <div className="flex items-center gap-1 truncate">
                                                  <span className="text-slate-400">
                                                    {isGroupExpanded ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                                                  </span>
                                                  <Folder className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                                  <span className="text-[11px] font-medium text-slate-700 truncate">{group.label}</span>
                                                </div>
                                              </div>

                                              {/* Policy Leaves with Green Active Dot */}
                                              {isGroupExpanded && (
                                                <div className="pl-3 ml-1.5 border-l border-slate-200 space-y-0.5">
                                                  {group.children.map((leaf) => {
                                                    const isLeafSelected = selectedItemId === leaf.id && selectedBank?.id === b.id;
                                                    const policyObj = policies[leaf.id];
                                                    const addenda = policyObj?.bankCustomAddenda?.[b.id];
                                                    const isBankActive = Boolean(addenda && addenda.status !== 'INACTIVE');

                                                    return (
                                                      <div
                                                        key={leaf.id}
                                                        onClick={() => {
                                                          if (onSelectBank) onSelectBank(b);
                                                          if (onSelectProduct) onSelectProduct(prod.id);
                                                          onSelectItem(leaf.id);
                                                          if (onCloseMobile) onCloseMobile();
                                                        }}
                                                        className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition text-xs ${
                                                          isLeafSelected
                                                            ? 'bg-blue-600 text-white font-bold shadow-2xs'
                                                            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                                                        }`}
                                                      >
                                                        <div className="flex items-center gap-1.5 truncate">
                                                          {/* Green Active Dot vs Grey Inactive Dot */}
                                                          {isBankActive ? (
                                                            <span 
                                                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                                                isLeafSelected ? 'bg-emerald-300 ring-2 ring-emerald-200/50' : 'bg-emerald-500'
                                                              }`} 
                                                              title={`🟢 Active for ${b.id.toUpperCase()}`}
                                                            />
                                                          ) : (
                                                            <span 
                                                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                                                isLeafSelected ? 'bg-slate-300' : 'bg-slate-300'
                                                              }`} 
                                                              title="⚪ Inactive"
                                                            />
                                                          )}

                                                          <FileText className={`w-3 h-3 flex-shrink-0 ${isLeafSelected ? 'text-white' : 'text-slate-400'}`} />
                                                          <span className="truncate text-[11px]">{leaf.label}</span>
                                                        </div>

                                                        {leaf.version && (
                                                          <span className={`text-[9px] font-mono px-1 rounded ${
                                                            isLeafSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
                                                          }`}>
                                                            {leaf.version}
                                                          </span>
                                                        )}
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
          })}
        </div>
      </aside>
    </>
  );
}
