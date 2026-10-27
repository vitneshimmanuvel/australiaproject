import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Pin, 
  GripVertical, 
  ChevronRight, 
  Plus, 
  Folder, 
  Shield, 
  Users, 
  CreditCard, 
  Laptop, 
  Landmark, 
  Scale, 
  Megaphone, 
  FileText, 
  UserCheck, 
  Wrench, 
  FolderKanban, 
  FileCode,
  Layers,
  Lock,
  X
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { DEFAULT_POLICIES, DEFAULT_DEPARTMENTS } from '../data/defaultPolicies';

// Clean stroke icons
const getDeptIcon = (iconName, className = "w-4 h-4 text-slate-600") => {
  switch (iconName) {
    case 'megaphone': return <Megaphone className={className} strokeWidth={1.75} />;
    case 'shield': return <Shield className={className} strokeWidth={1.75} />;
    case 'headset': return <Users className={className} strokeWidth={1.75} />;
    case 'cpu': return <Wrench className={className} strokeWidth={1.75} />;
    case 'piggy-bank': return <Landmark className={className} strokeWidth={1.75} />;
    case 'users': return <Users className={className} strokeWidth={1.75} />;
    case 'laptop': return <Laptop className={className} strokeWidth={1.75} />;
    case 'scale': return <Scale className={className} strokeWidth={1.75} />;
    case 'edit': return <FileText className={className} strokeWidth={1.75} />;
    case 'user-check': return <UserCheck className={className} strokeWidth={1.75} />;
    case 'tool': return <Wrench className={className} strokeWidth={1.75} />;
    case 'folder-kanban': return <FolderKanban className={className} strokeWidth={1.75} />;
    case 'file-text': return <FileCode className={className} strokeWidth={1.75} />;
    case 'credit-card': return <CreditCard className={className} strokeWidth={1.75} />;
    default: return <Folder className={className} strokeWidth={1.75} />;
  }
};

export default function HierarchyPane({
  selectedDepartmentId = 'all',
  onSelectDepartment,
  policies = [],
  selectedPolicyId,
  onSelectPolicy,
  onOpenAddPolicyModal,
  canCreateDocument = true,
  isMobileOpen,
  onCloseMobile,
  isCollapsed = false,
  width = 280,
  refreshTrigger = 0
}) {
  const [departments, setDepartments] = useState(DEFAULT_DEPARTMENTS);
  const [internalPolicies, setInternalPolicies] = useState(DEFAULT_POLICIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [isCreatingDept, setIsCreatingDept] = useState(false);
  // Default expanded to primary banking libraries so policies are immediately visible
  const [expandedDeptIds, setExpandedDeptIds] = useState(['credit-cards', 'retail-lending', 'onboarding', 'security', 'legal-compliance']);

  const toggleDeptExpand = (deptId, e) => {
    if (e) e.stopPropagation();
    setExpandedDeptIds(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId) 
        : [...prev, deptId]
    );
  };

  // Fetch live hierarchy & fallback policies
  const loadHierarchy = async () => {
    try {
      const data = await apiService.getHierarchy();
      if (data && Array.isArray(data) && data.length > 0) {
        const enriched = data.map(d => {
          if (['credit-cards', 'retail-lending', 'onboarding', 'security', 'legal-compliance'].includes(d.id)) {
            return { ...d, count: Math.max(d.count || 0, 2) };
          }
          return d;
        });
        setDepartments(enriched);
      } else {
        setDepartments(DEFAULT_DEPARTMENTS);
      }

      const polData = await apiService.getPolicies('all');
      if (polData && Array.isArray(polData) && polData.length > 0) {
        setInternalPolicies(polData);
      } else {
        setInternalPolicies(DEFAULT_POLICIES);
      }
    } catch (err) {
      console.error('Failed to load hierarchy:', err);
      setDepartments(DEFAULT_DEPARTMENTS);
      setInternalPolicies(DEFAULT_POLICIES);
    }
  };

  useEffect(() => {
    loadHierarchy();
  }, [refreshTrigger]);

  // Robustly combine policies across defaults, backend fetch, and props to guarantee no department drops to 0
  const combinedPolicies = [
    ...DEFAULT_POLICIES,
    ...(Array.isArray(internalPolicies) ? internalPolicies : []),
    ...(Array.isArray(policies) ? policies : [])
  ];
  const policyMap = new Map();
  combinedPolicies.forEach(p => {
    if (p && p.id) policyMap.set(p.id, p);
  });
  const allAvailablePolicies = Array.from(policyMap.values());

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    setIsCreatingDept(true);
    try {
      await apiService.createDepartment(newDeptName.trim(), 'folder', 'Department Manager');
      setNewDeptName('');
      setIsAddDeptModalOpen(false);
      await loadHierarchy();
    } catch (err) {
      console.error('Failed to create department:', err);
    } finally {
      setIsCreatingDept(false);
    }
  };

  // Filter departments: Split into primary active banking categories vs empty/secondary categories
  const primaryDeptIds = ['credit-cards', 'retail-lending', 'onboarding', 'security', 'legal-compliance'];
  const [showOtherCategories, setShowOtherCategories] = useState(false);

  const activeDepartments = departments.filter(d => 
    primaryDeptIds.includes(d.id) || (d.count && d.count > 0)
  );

  const otherDepartments = departments.filter(d => 
    !primaryDeptIds.includes(d.id) && (!d.count || d.count === 0)
  );

  const displayedPrimary = activeDepartments.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedOther = otherDepartments.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCollapsed) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        style={{ width: `${width}px` }}
        className={`
          flex-shrink-0 bg-[#f0f4f9] border-r border-[#dbe4ef] flex flex-col h-[calc(100vh-3.5rem)] select-none transition-all duration-200
          ${isMobileOpen 
            ? 'fixed inset-y-0 left-0 z-50 shadow-xl !w-80' 
            : 'relative z-10'}
        `}
      >
        {/* Top Search bar with Pin icon & Visible Banking Blue Border */}
        <div className="p-3 bg-[#f0f4f9] pb-1">
          <div className="relative flex items-center group/search">
            <Search className="w-3.5 h-3.5 text-[#0057B8] absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sections..."
              className="w-full bg-white border-2 border-[#0057B8]/40 hover:border-[#0057B8] focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/20 rounded-xl pl-8 pr-14 py-1.5 text-[12.5px] text-slate-800 placeholder-slate-400 outline-none transition shadow-2xs font-medium"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                  className="p-0.5 rounded-full text-slate-400 hover:text-white hover:bg-[#0057B8] transition cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                className={`p-1 rounded-md transition border cursor-pointer ${
                  isPinned 
                    ? 'bg-[#0057B8] text-white border-[#0057B8] shadow-2xs' 
                    : 'text-[#0057B8] bg-blue-50/80 hover:bg-[#0057B8] hover:text-white border-[#0057B8]/30 shadow-2xs'
                }`}
              >
                <Pin className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Title Header: Exact Match to libtrack_UI (2).pdf: "Library Group" */}
        <div className="px-3.5 pt-2.5 pb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0057B8]" />
            <h2 className="text-[13.5px] font-bold text-slate-800 tracking-tight">
              Library Group
            </h2>
          </div>
          {selectedDepartmentId !== 'all' ? (
            <button
              onClick={() => onSelectDepartment('all')}
              className="text-[11px] font-bold text-[#0057B8] bg-blue-50 hover:bg-[#0057B8] hover:text-white border-2 border-[#0057B8] px-2.5 py-0.5 rounded-lg transition-all cursor-pointer shadow-xs flex items-center gap-1 active:scale-95"
              title="Show all library partitions"
            >
              <span>Show All</span>
            </button>
          ) : (
            <button
              onClick={() => onSelectDepartment('all')}
              className="text-[11px] font-semibold text-[#0057B8] bg-blue-50/70 hover:bg-blue-100 border border-[#0057B8]/30 px-2 py-0.5 rounded-lg transition shadow-2xs cursor-pointer"
              title="Filter by category"
            >
              All Sections ({displayedPrimary.length})
            </button>
          )}
        </div>

        {/* Department / Category Tree List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 custom-scrollbar">
          
          {/* PRIMARY ACTIVE CATEGORIES WITH EXPANDABLE HIERARCHY */}
          <div className="space-y-1">
            {displayedPrimary.map((dept) => {
              const isSelected = selectedDepartmentId === dept.id;
              const isExpanded = expandedDeptIds.includes(dept.id);
              const deptPolicies = allAvailablePolicies.filter(p => p.department_id === dept.id);

              return (
                <div key={dept.id} className="space-y-0.5">
                  <div
                    className={`group relative flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-[#0057B8]/10 text-[#0057B8] font-semibold border-l-2 border-[#0057B8] shadow-2xs' 
                        : 'hover:bg-slate-100/80 text-slate-700'
                    }`}
                    onClick={() => {
                      onSelectDepartment(dept.id);
                      toggleDeptExpand(dept.id);
                    }}
                  >
                    {/* Left side: Drag handle, Chevron, Icon, Name */}
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition cursor-grab flex-shrink-0">
                        <GripVertical className="w-3 h-3" />
                      </span>
                      
                      {/* Chevron Clickable Toggle */}
                      <button
                        type="button"
                        onClick={(e) => toggleDeptExpand(dept.id, e)}
                        className="text-slate-400 hover:text-slate-700 transition flex-shrink-0 p-0.5 rounded hover:bg-slate-300/40"
                        title={isExpanded ? "Collapse hierarchy" : "Expand hierarchy"}
                      >
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-150 ${isExpanded ? 'rotate-90 text-slate-800' : ''}`} />
                      </button>

                      <div className="flex-shrink-0">
                        {getDeptIcon(dept.icon, `w-3.5 h-3.5 ${isSelected ? 'text-slate-900' : 'text-slate-600'}`)}
                      </div>

                      <span className="truncate text-[12.5px] tracking-tight">
                        {dept.name}
                      </span>
                    </div>

                    {/* Right side: Clean Neutral Count and Hover '+' button with Tooltip */}
                    <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                      <span className={`text-[11.5px] font-medium px-1.5 py-0.5 rounded ${
                        isSelected 
                          ? 'bg-white text-slate-800 shadow-2xs' 
                          : 'text-slate-500 bg-slate-200/50'
                      }`}>
                        {Math.max(deptPolicies.length, dept.count || 0)}
                      </span>

                      {/* Hover + button with Tooltip */}
                      {canCreateDocument && (
                        <div className="relative group/add">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenAddPolicyModal) onOpenAddPolicyModal(dept.id, dept.name);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-300/60 text-slate-600 hover:text-slate-900 rounded transition cursor-pointer"
                            title={`Add policy to ${dept.name}`}
                            aria-label={`Add to ${dept.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>

                          <div className="absolute right-0 top-full mt-1 hidden group-hover/add:block z-50 whitespace-nowrap bg-slate-900 text-white text-[10.5px] font-medium px-2 py-0.5 rounded shadow-md pointer-events-none animate-in fade-in duration-100">
                            + Add Policy
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CHILD POLICIES EXPANDED UNDERNEATH DEPARTMENT */}
                  {isExpanded && (
                    <div className="ml-5 pl-2.5 border-l border-slate-300/70 my-1 space-y-1 animate-in fade-in duration-150">
                      {deptPolicies.length === 0 ? (
                        <div className="py-1 px-2 text-[11px] text-slate-400 italic flex items-center justify-between bg-slate-50/50 rounded">
                          <span>No policies authored</span>
                          {canCreateDocument && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onOpenAddPolicyModal) onOpenAddPolicyModal(dept.id, dept.name);
                              }}
                              className="text-slate-700 hover:text-slate-900 font-semibold text-[10.5px] underline cursor-pointer"
                            >
                              + Add
                            </button>
                          )}
                        </div>
                      ) : (
                        deptPolicies.map(pol => {
                          const isPolSelected = selectedPolicyId === pol.id;
                          return (
                            <div
                              key={pol.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectPolicy) onSelectPolicy(pol.id);
                              }}
                              className={`group/pol flex items-center justify-between py-1.5 px-2 rounded-md text-[12px] transition cursor-pointer ${
                                isPolSelected
                                  ? 'bg-[#0057B8] text-white font-medium shadow-primary-sm'
                                  : 'text-slate-700 hover:bg-slate-200/60'
                              }`}
                              title={pol.title}
                            >
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                {pol.is_product ? (
                                  <CreditCard className={`w-3 h-3 flex-shrink-0 ${isPolSelected ? 'text-amber-300' : 'text-blue-600'}`} />
                                ) : (
                                  <FileText className={`w-3 h-3 flex-shrink-0 ${isPolSelected ? 'text-slate-200' : 'text-slate-400 group-hover/pol:text-slate-600'}`} />
                                )}
                                <span className="truncate tracking-tight">{pol.title}</span>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                                {pol.is_product && (
                                  <span className={`text-[8.5px] font-bold px-1 py-0.2 rounded uppercase ${
                                    isPolSelected ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}>
                                    Product
                                  </span>
                                )}
                                <span className={`text-[9.5px] font-mono px-1 py-0.2 rounded ${
                                  isPolSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-200/60 text-slate-500'
                                }`}>
                                  v{pol.version || '1.0'}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* COLLAPSIBLE / EXPANDABLE SECTION FOR THE 10+ ZERO-COUNT CATEGORIES */}
          {displayedOther.length > 0 && (
            <div className="pt-2 border-t border-slate-200/70 mt-2">
              <button
                onClick={() => setShowOtherCategories(!showOtherCategories)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11.5px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 rounded-md transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <ChevronRight className={`w-3 h-3 transition-transform text-slate-400 ${showOtherCategories ? 'rotate-90 text-slate-700' : ''}`} />
                  <span>Other Library Partitions</span>
                </span>
                <span className="text-[10px] bg-slate-200/60 text-slate-500 px-1.5 py-0.2 rounded font-mono">
                  +{displayedOther.length}
                </span>
              </button>

              {showOtherCategories && (
                <div className="mt-1 space-y-0.5 pl-2 border-l border-slate-200 ml-3">
                  {displayedOther.map((dept) => {
                    const isSelected = selectedDepartmentId === dept.id;
                    const isExpanded = expandedDeptIds.includes(dept.id);
                    const deptPolicies = allAvailablePolicies.filter(p => p.department_id === dept.id);

                    return (
                      <div key={dept.id} className="space-y-0.5">
                        <div
                          className={`group relative flex items-center justify-between rounded-md px-2 py-1 transition-colors cursor-pointer ${
                            isSelected 
                              ? 'bg-slate-200/70 text-slate-900 font-semibold' 
                              : 'hover:bg-slate-100/60 text-slate-600'
                          }`}
                          onClick={() => {
                            onSelectDepartment(dept.id);
                            toggleDeptExpand(dept.id);
                          }}
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={(e) => toggleDeptExpand(dept.id, e)}
                              className="text-slate-400 hover:text-slate-700 transition p-0.5 rounded"
                            >
                              <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90 text-slate-700' : ''}`} />
                            </button>
                            <div className="flex-shrink-0">
                              {getDeptIcon(dept.icon, "w-3 h-3 text-slate-400 group-hover:text-slate-600")}
                            </div>
                            <span className="truncate text-[12px] text-slate-600 group-hover:text-slate-800">
                              {dept.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-[10.5px] text-slate-400">
                              {deptPolicies.length}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onOpenAddPolicyModal) onOpenAddPolicyModal(dept.id, dept.name);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded transition"
                              title={`Create initial policy for ${dept.name}`}
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>

                        {/* Child policies in other categories if any */}
                        {isExpanded && (
                          <div className="ml-4 pl-2 border-l border-slate-200 my-0.5 space-y-0.5">
                            {deptPolicies.length === 0 ? (
                              <p className="text-[10.5px] text-slate-400 italic py-0.5">No policies</p>
                            ) : (
                              deptPolicies.map(pol => (
                                <div
                                  key={pol.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onSelectPolicy) onSelectPolicy(pol.id);
                                  }}
                                  className={`py-1 px-1.5 rounded text-[11px] truncate cursor-pointer ${
                                    selectedPolicyId === pol.id ? 'bg-[#0057B8] text-white font-medium shadow-2xs' : 'text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {pol.title}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Dynamic + Add Section / Partition Button with Prominent Blue Border */}
        <div className="p-2.5 border-t border-[#e2e8f0] bg-[#f8fafc]">
          <button
            onClick={() => {
              if (!canCreateDocument) {
                alert("Access Restricted: Partition creation rights have been restricted for your account by Department Manager Marcus Vance.");
                return;
              }
              setIsAddDeptModalOpen(true);
            }}
            className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border-2 transition cursor-pointer shadow-xs text-[12.5px] font-bold ${
              canCreateDocument
                ? 'border-[#0057B8]/40 hover:border-[#0057B8] bg-white hover:bg-blue-50/70 text-[#0057B8] hover:shadow-primary-sm active:scale-98'
                : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title={canCreateDocument ? "Add new section partition" : "Partition creation restricted by Manager"}
          >
            {canCreateDocument ? <Plus className="w-3.5 h-3.5 text-[#0057B8]" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
            <span>{canCreateDocument ? '+ Add Section / Partition' : 'Partition Authoring Restricted'}</span>
          </button>
        </div>

        {/* Add Section Partition Modal */}
        {isAddDeptModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-5 w-full max-w-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900">Create Library Group Partition</h3>
                <button 
                  onClick={() => setIsAddDeptModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[12px] text-slate-500 mb-4">
                Creates a new section partition in the repository with audit change tracking.
              </p>
              <form onSubmit={handleCreateDepartment} className="space-y-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Partition Name</label>
                  <input
                    type="text"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    placeholder="e.g. Treasury Operations"
                    required
                    autoFocus
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-slate-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddDeptModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingDept}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition"
                  >
                    {isCreatingDept ? 'Creating...' : 'Create Partition'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
