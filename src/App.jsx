import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HierarchyPane from './components/HierarchyPane';
import PolicyWorkspacePane from './components/PolicyWorkspacePane';
import ContextualFeedPane from './components/ContextualFeedPane';
import AdminDashboard from './components/AdminDashboard';
import RoleLoginModal from './components/RoleLoginModal';
import EditSpecModal from './components/EditSpecModal';
import EditMasterCoreModal from './components/EditMasterCoreModal';
import AddPolicyModal from './components/AddPolicyModal';
import ExportModal from './components/ExportModal';
import { PanelLeftOpen, PanelRightOpen, MessageSquare } from 'lucide-react';

import { banksList, bankingHierarchy, policiesDatabase, userRoles, auditHistoryLogs } from './data/mockData';

export default function App() {
  // Current user role (Library Staff Admin or Bank Representative)
  const [currentUser, setCurrentUser] = useState(userRoles[0]); // Sarah Jenkins (Master Admin)
  const [currentView, setCurrentView] = useState('LIBRARY'); // 'LIBRARY' | 'ADMIN'

  // Data states
  const [banks, setBanks] = useState(banksList);
  const [selectedBank, setSelectedBank] = useState(banksList[0]); // Commonwealth Bank by default
  const [selectedPolicyId, setSelectedPolicyId] = useState('oauth-sso');
  const [policies, setPolicies] = useState(policiesDatabase);
  const [hierarchy, setHierarchy] = useState(bankingHierarchy);
  const [searchQuery, setSearchQuery] = useState('');

  // Desktop sidebar collapse / open states
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  // Desktop draggable widths
  const [leftWidth, setLeftWidth] = useState(270);
  const [rightWidth, setRightWidth] = useState(300);

  // Dragging active states
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  // Mobile drawer states
  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);

  // Modals state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);
  const [isEditMasterModalOpen, setIsEditMasterModalOpen] = useState(false);
  const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [targetMasterPolicyId, setTargetMasterPolicyId] = useState('oauth-sso');

  // Mouse drag handler for resizable sidebars
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingLeft) {
        // Constrain left hierarchy pane between 180px and 480px
        const newLeftWidth = Math.min(Math.max(e.clientX, 180), 480);
        setLeftWidth(newLeftWidth);
      } else if (isDraggingRight) {
        // Constrain right feed pane between 220px and 480px
        const newRightWidth = Math.min(Math.max(window.innerWidth - e.clientX, 220), 480);
        setRightWidth(newRightWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingLeft) setIsDraggingLeft(false);
      if (isDraggingRight) setIsDraggingRight(false);
    };

    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDraggingLeft, isDraggingRight]);

  // Handle switching user roles
  const handleSelectUser = (user) => {
    setCurrentUser(user);
    if (user.type === 'bank') {
      const matchingBank = banks.find(b => b.id === user.bankId) || banks[0];
      setSelectedBank(matchingBank);
      setCurrentView('LIBRARY');
    } else {
      setCurrentView('ADMIN');
    }
  };

  // Active policy
  const activePolicy = policies[selectedPolicyId] || policies['oauth-sso'] || Object.values(policies)[0];

  // Handle saving bank-specific addenda
  const handleSaveBankCustomization = (policyId, bankId, customData) => {
    setPolicies(prev => {
      const target = prev[policyId] || prev['oauth-sso'];
      return {
        ...prev,
        [policyId]: {
          ...target,
          bankCustomAddenda: {
            ...target.bankCustomAddenda,
            [bankId]: {
              ...customData,
              status: 'ACTIVE',
            },
          },
        }
      };
    });

    // Add audit log
    auditHistoryLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      actor: `${currentUser.name} (${selectedBank.name})`,
      action: 'Updated Bank Policy Addendum',
      target: activePolicy?.title || policyId,
      detail: `Timeout: ${customData.sessionTimeout || 'N/A'} | Trigger: ${customData.mfaRule || 'N/A'}`,
    });
  };

  // Handle toggling Active / Inactive status of a policy for a bank
  const handleTogglePolicyActive = (policyId, bankId) => {
    setPolicies(prev => {
      const target = prev[policyId];
      if (!target) return prev;

      const currentAddenda = target.bankCustomAddenda?.[bankId] || {
        sessionTimeout: '15 Minutes Inactivity / 8h Absolute',
        mfaRule: 'Transfers > $5,000 AUD or Novel IP',
        customClause: 'Institutional operational baseline active.',
        lastModifiedBy: currentUser.name,
      };

      const isCurrentlyActive = currentAddenda.status !== 'INACTIVE';
      const newStatus = isCurrentlyActive ? 'INACTIVE' : 'ACTIVE';

      // Add audit log
      auditHistoryLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        actor: `${currentUser.name} (${selectedBank.name})`,
        action: isCurrentlyActive ? 'Deactivated Policy (Set Inactive)' : 'Activated Policy (Enforced)',
        target: target.title,
        detail: isCurrentlyActive 
          ? `Policy deactivated for ${selectedBank.name}. Statutory baseline applies.` 
          : `Custom operational addenda enabled for ${selectedBank.name}.`,
      });

      return {
        ...prev,
        [policyId]: {
          ...target,
          bankCustomAddenda: {
            ...target.bankCustomAddenda,
            [bankId]: {
              ...currentAddenda,
              status: newStatus,
              lastModifiedBy: `${currentUser.name} (${newStatus === 'ACTIVE' ? 'Activated' : 'Deactivated'})`,
            },
          },
        },
      };
    });
  };

  // Handle saving 90% master core framework (Admin only)
  const handleSaveMasterPolicy = (policyId, updatedFields) => {
    setPolicies(prev => {
      const target = prev[policyId] || prev['oauth-sso'];
      return {
        ...prev,
        [policyId]: {
          ...target,
          ...updatedFields,
        }
      };
    });

    auditHistoryLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      actor: `${currentUser.name} (Master Admin)`,
      action: `Published Master Baseline Revision`,
      target: (policies[policyId] || activePolicy).title,
      detail: `Statutory baseline updated for all connected member banks.`,
    });
  };

  // Handle adding new master policy from Admin Panel or Hierarchy Sidebar
  const handleAddNewPolicy = ({
    domainId,
    domainLabel,
    isCustomDomain,
    groupId,
    groupLabel,
    isCustomGroup,
    policy,
  }) => {
    // 1. Update policies database dictionary
    setPolicies((prev) => ({
      ...prev,
      [policy.id]: policy,
    }));

    // 2. Update Hierarchy Tree
    setHierarchy((prevHierarchy) => {
      const nextHierarchy = JSON.parse(JSON.stringify(prevHierarchy));
      let targetDomain = nextHierarchy.find((d) => d.id === domainId);

      if (!targetDomain) {
        // Create new domain
        targetDomain = {
          id: domainId,
          label: domainLabel,
          children: [],
        };
        nextHierarchy.push(targetDomain);
      }

      let targetGroup = targetDomain.children?.find((g) => g.id === groupId);
      if (!targetGroup) {
        // Create new group inside domain
        targetGroup = {
          id: groupId,
          label: groupLabel,
          children: [],
        };
        if (!targetDomain.children) targetDomain.children = [];
        targetDomain.children.push(targetGroup);
      }

      // Add the new leaf node
      if (!targetGroup.children) targetGroup.children = [];
      targetGroup.children.push({
        id: policy.id,
        label: policy.title,
        version: policy.latestVersion,
      });

      return nextHierarchy;
    });

    // 3. Log Audit Record
    auditHistoryLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      actor: `${currentUser.name} (Master Admin)`,
      action: `Published Master Standard ${policy.latestVersion}`,
      target: policy.title,
      detail: `Statutory baseline added to ${domainLabel} / ${groupLabel}.`,
    });

    // 4. Select newly created policy
    setSelectedPolicyId(policy.id);
  };

  // Handle deleting/removing a policy specification
  const handleDeletePolicy = (policyIdToDelete) => {
    // 1. Remove from policies state
    setPolicies(prev => {
      const copy = { ...prev };
      delete copy[policyIdToDelete];
      return copy;
    });

    // 2. Remove from hierarchy state
    setHierarchy(prevHierarchy => {
      return prevHierarchy.map(domain => ({
        ...domain,
        children: (domain.children || []).map(group => ({
          ...group,
          children: (group.children || []).filter(leaf => leaf.id !== policyIdToDelete)
        })).filter(group => group.children && group.children.length > 0)
      })).filter(domain => domain.children && domain.children.length > 0);
    });

    // 3. Log audit
    auditHistoryLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      actor: `${currentUser.name} (Master Admin)`,
      action: 'Removed Regulatory Specification',
      target: policyIdToDelete,
      detail: 'Standard deleted from the central library reference baseline.',
    });

    // 4. Update selection if currently selected
    if (selectedPolicyId === policyIdToDelete) {
      setSelectedPolicyId('oauth-sso');
    }
  };

  // Handle adding comment
  const handleAddComment = (newComment) => {
    if (!activePolicy) return;
    setPolicies(prev => {
      const current = prev[activePolicy.id] || activePolicy;
      return {
        ...prev,
        [activePolicy.id]: {
          ...current,
          comments: [newComment, ...(current.comments || [])],
        }
      };
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      {/* Top Application Bar */}
      <Header
        currentUser={currentUser}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onToggleMobileLeft={() => setIsMobileLeftOpen(!isMobileLeftOpen)}
        onToggleMobileRight={() => setIsMobileRightOpen(!isMobileRightOpen)}
        isLeftOpen={isLeftOpen}
        onToggleLeft={() => setIsLeftOpen(!isLeftOpen)}
        isRightOpen={isRightOpen}
        onToggleRight={() => setIsRightOpen(!isRightOpen)}
        commentsCount={(activePolicy?.comments || []).length}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main Workspace: 3-Pane Reference Library OR Staff Admin Panel */}
      {currentView === 'ADMIN' && currentUser.type === 'admin' ? (
        <AdminDashboard
          banks={banks}
          policies={policies}
          onSelectBank={(b) => setSelectedBank(b)}
          onOpenEditMasterModal={(polId) => {
            setTargetMasterPolicyId(polId);
            setIsEditMasterModalOpen(true);
          }}
          onOpenBankCustomModal={(polId, b) => {
            setSelectedPolicyId(polId);
            setSelectedBank(b);
            setIsEditBankModalOpen(true);
          }}
          onOpenAddPolicyModal={() => setIsAddPolicyModalOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onSwitchToLibraryView={() => setCurrentView('LIBRARY')}
          onSelectPolicy={(polId) => setSelectedPolicyId(polId)}
        />
      ) : (
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Expand Pill when Left Sidebar is Collapsed on Desktop */}
          {!isLeftOpen && (
            <button
              onClick={() => setIsLeftOpen(true)}
              title="Expand Hierarchy Tree"
              className="hidden md:flex absolute left-2 top-3 z-20 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 p-1.5 rounded-lg shadow-sm transition cursor-pointer"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}

          {/* Pane 1: Banking Regulatory Architecture Hierarchy (Collapsible & Draggable) */}
          <HierarchyPane
            hierarchy={hierarchy}
            selectedItemId={selectedPolicyId}
            onSelectItem={(id) => {
              if (policies[id]) {
                setSelectedPolicyId(id);
              } else {
                setSelectedPolicyId('oauth-sso');
              }
            }}
            isMobileOpen={isMobileLeftOpen}
            onCloseMobile={() => setIsMobileLeftOpen(false)}
            isCollapsed={!isLeftOpen}
            onToggleCollapse={() => setIsLeftOpen(false)}
            width={leftWidth}
            selectedBank={selectedBank}
            policies={policies}
            onOpenAddPolicyModal={() => setIsAddPolicyModalOpen(true)}
            onDeletePolicy={handleDeletePolicy}
          />

          {/* Draggable Divider Handle (Left Sidebar <-> Center Workspace) */}
          {isLeftOpen && (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDraggingLeft(true);
              }}
              onDoubleClick={() => setLeftWidth(270)}
              title="Drag to resize hierarchy sidebar (Double-click to reset width)"
              className={`hidden md:flex w-1.5 hover:w-2 bg-transparent hover:bg-blue-500/20 active:bg-blue-600 transition-colors cursor-col-resize z-20 flex-col items-center justify-center select-none group ${
                isDraggingLeft ? 'bg-blue-600 !w-2' : ''
              }`}
            >
              <div className="h-8 w-1 bg-slate-300 group-hover:bg-blue-500 rounded-full transition-colors" />
            </div>
          )}

          {/* Pane 2: Detailed Policy Workspace (Responsive, Expands to fill available width) */}
          <PolicyWorkspacePane
            policy={activePolicy}
            selectedBank={selectedBank}
            onOpenEditModal={() => setIsEditBankModalOpen(true)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onTogglePolicyActive={handleTogglePolicyActive}
          />

          {/* Draggable Divider Handle (Center Workspace <-> Right Feed) */}
          {isRightOpen && (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDraggingRight(true);
              }}
              onDoubleClick={() => setRightWidth(300)}
              title="Drag to resize Contextual Feed (Double-click to reset width)"
              className={`hidden lg:flex w-1.5 hover:w-2 bg-transparent hover:bg-blue-500/20 active:bg-blue-600 transition-colors cursor-col-resize z-20 flex-col items-center justify-center select-none group ${
                isDraggingRight ? 'bg-blue-600 !w-2' : ''
              }`}
            >
              <div className="h-8 w-1 bg-slate-300 group-hover:bg-blue-500 rounded-full transition-colors" />
            </div>
          )}

          {/* Right Expand Pill when Right Feed is Collapsed on Desktop */}
          {!isRightOpen && (
            <button
              onClick={() => setIsRightOpen(true)}
              title="Expand Contextual Feed"
              className="hidden lg:flex absolute right-2 top-3 z-20 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 px-2 py-1 rounded-lg shadow-sm transition items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <PanelRightOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Feed</span>
              <span className="text-[10px] font-mono bg-slate-100 px-1 rounded-full font-bold">
                {(activePolicy?.comments || []).length}
              </span>
            </button>
          )}

          {/* Pane 3: Contextual Review Feed (Collapsible & Draggable) */}
          <ContextualFeedPane
            comments={activePolicy?.comments || []}
            onAddComment={handleAddComment}
            isMobileOpen={isMobileRightOpen}
            onCloseMobile={() => setIsMobileRightOpen(false)}
            isCollapsed={!isRightOpen}
            onToggleCollapse={() => setIsRightOpen(false)}
            width={rightWidth}
          />
        </div>
      )}

      {/* User Account / Role Switcher Modal */}
      <RoleLoginModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
      />

      {/* Bank Custom Addenda Editor Modal */}
      <EditSpecModal
        isOpen={isEditBankModalOpen}
        onClose={() => setIsEditBankModalOpen(false)}
        policy={activePolicy}
        selectedBank={selectedBank}
        onSaveCustomization={handleSaveBankCustomization}
      />

      {/* Staff Admin: Master Core Framework Editor */}
      <EditMasterCoreModal
        isOpen={isEditMasterModalOpen}
        onClose={() => setIsEditMasterModalOpen(false)}
        policy={policies[targetMasterPolicyId] || activePolicy}
        onSaveMasterPolicy={handleSaveMasterPolicy}
      />

      {/* Staff Admin: Add New Policy Framework Modal */}
      <AddPolicyModal
        isOpen={isAddPolicyModalOpen}
        onClose={() => setIsAddPolicyModalOpen(false)}
        hierarchy={hierarchy}
        onAddPolicy={handleAddNewPolicy}
      />

      {/* Export Specification Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        policy={activePolicy}
        selectedBank={selectedBank}
      />
    </div>
  );
}
