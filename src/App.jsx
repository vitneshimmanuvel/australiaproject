import React, { useState } from 'react';
import Header from './components/Header';
import HierarchyPane from './components/HierarchyPane';
import PolicyWorkspacePane from './components/PolicyWorkspacePane';
import ContextualFeedPane from './components/ContextualFeedPane';
import AdminDashboard from './components/AdminDashboard';
import RoleLoginModal from './components/RoleLoginModal';
import EditSpecModal from './components/EditSpecModal';
import EditMasterCoreModal from './components/EditMasterCoreModal';
import ExportModal from './components/ExportModal';

import { banksList, bankingHierarchy, policiesDatabase, userRoles } from './data/mockData';

export default function App() {
  // Current user role (Library Staff Admin or Bank Representative)
  const [currentUser, setCurrentUser] = useState(userRoles[0]); // Sarah Jenkins (Master Admin)
  const [currentView, setCurrentView] = useState('LIBRARY'); // 'LIBRARY' | 'ADMIN'

  // Data states
  const [banks, setBanks] = useState(banksList);
  const [selectedBank, setSelectedBank] = useState(banksList[0]); // Commonwealth Bank by default
  const [selectedPolicyId, setSelectedPolicyId] = useState('oauth-sso');
  const [policies, setPolicies] = useState(policiesDatabase);
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile drawer states
  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);

  // Modals state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);
  const [isEditMasterModalOpen, setIsEditMasterModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [targetMasterPolicyId, setTargetMasterPolicyId] = useState('oauth-sso');

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
  const activePolicy = policies[selectedPolicyId] || policies['oauth-sso'];

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
            [bankId]: customData,
          },
        }
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
  };

  // Handle adding comment
  const handleAddComment = (newComment) => {
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
        commentsCount={(activePolicy.comments || []).length}
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
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onSwitchToLibraryView={() => setCurrentView('LIBRARY')}
        />
      ) : (
        <div className="flex flex-1 overflow-hidden relative">
          {/* Pane 1: Banking Regulatory Architecture Hierarchy (Responsive Drawer on Mobile) */}
          <HierarchyPane
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
          />

          {/* Pane 2: Detailed Policy Workspace (Responsive, Full Width) */}
          <PolicyWorkspacePane
            policy={activePolicy}
            selectedBank={selectedBank}
            onOpenEditModal={() => setIsEditBankModalOpen(true)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />

          {/* Pane 3: Contextual Review Feed (Responsive Drawer on Mobile) */}
          <ContextualFeedPane
            comments={activePolicy.comments || []}
            onAddComment={handleAddComment}
            isMobileOpen={isMobileRightOpen}
            onCloseMobile={() => setIsMobileRightOpen(false)}
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
