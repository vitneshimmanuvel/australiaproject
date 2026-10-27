import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HierarchyPane from './components/HierarchyPane';
import PolicyWorkspacePane from './components/PolicyWorkspacePane';
import ContextualFeedPane from './components/ContextualFeedPane';
import AdminDashboard from './components/AdminDashboard';
import MakerCheckerModal from './components/MakerCheckerModal';
import ConfigurePolicyModal from './components/ConfigurePolicyModal';
import AddPolicyModal from './components/AddPolicyModal';
import ExportModal from './components/ExportModal';
import SplashScreen from './components/SplashScreen';
import NotificationsModal from './components/NotificationsModal';
import BankUserManagerModal from './components/BankUserManagerModal';
import SuperAdminLoginModal from './components/SuperAdminLoginModal';
import { apiService } from './services/apiService';
import { banksList, policiesDatabase } from './data/mockData';
import { DEFAULT_POLICIES, DEFAULT_DEPARTMENTS } from './data/defaultPolicies';

export default function App() {
  // Initial loading splash screen
  const [showSplash, setShowSplash] = useState(true);

  // Current active user persona (Default: Marcus Vance, CBA Bank Owner)
  const [currentUser, setCurrentUser] = useState({
    id: 'marcus_vance',
    name: 'Marcus Vance',
    role: 'Bank Owner',
    roleType: 'manager',
    department: 'Executive Governance & Retail Operations',
    bankName: 'Commonwealth Bank of Australia',
    avatar: 'MV'
  });

  // Current view: 'WORKSPACE' (3-pane layout from libtrack_UI) vs 'SUPER_ADMIN' (Platform Owner portal)
  const [currentView, setCurrentView] = useState('WORKSPACE');

  // Banks & Institutions
  const [banks, setBanks] = useState(banksList);
  const [selectedBank, setSelectedBank] = useState(banksList[0]); // CBA by default

  // Data states - Initialize with 2 policies per department and Credit Card policy first
  // Data states - Initialize with 2 policies per department and Credit Card policy first
  const [departments, setDepartments] = useState(DEFAULT_DEPARTMENTS);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('all');
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);
  const [allPolicies, setAllPolicies] = useState(DEFAULT_POLICIES);
  const [selectedPolicyId, setSelectedPolicyId] = useState('credit-card-limits-policy');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Maker-Checker state
  const [makerCheckerData, setMakerCheckerData] = useState({
    pendingCount: 0,
    pending: [],
    history: []
  });

  // Desktop sidebars layout
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [leftWidth, setLeftWidth] = useState(280);
  const [rightWidth, setRightWidth] = useState(340);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  // Mobile drawer states
  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);

  // Modal open states
  const [isMakerCheckerOpen, setIsMakerCheckerOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isBankUserManagerOpen, setIsBankUserManagerOpen] = useState(false);
  const [isSuperAdminModalOpen, setIsSuperAdminModalOpen] = useState(false);
  const [preselectedDept, setPreselectedDept] = useState({ id: null, name: '' });

  // Bank Users & Role-Based Access Control State (Bank Owner Governance)
  const [bankUsers, setBankUsers] = useState([
    {
      id: 'sarah_jenkins',
      name: 'Sarah Jenkins',
      role: 'Bank Employee',
      roleType: 'employee',
      department: 'Credit Operations Squad',
      canView: true,
      canCreate: true,
      canEdit: true,
      policyPermissions: {
        'credit-card-limits-policy': { canView: true, canEdit: true },
        'credit-card-rewards-sop': { canView: true, canEdit: true },
        'personal-loans-assessment-sop': { canView: true, canEdit: true },
        'mortgage-underwriting-standard': { canView: true, canEdit: true },
        'customer-onboarding-sop': { canView: true, canEdit: true },
        'commercial-kyc-sop': { canView: true, canEdit: true },
        'remote-access-security-policy': { canView: true, canEdit: true },
        'privileged-access-sop': { canView: true, canEdit: false },
        'aml-ctf-screening-policy': { canView: true, canEdit: true },
        'cdr-privacy-policy': { canView: true, canEdit: false }
      },
      allowedPolicyIds: [
        'credit-card-limits-policy',
        'credit-card-rewards-sop',
        'personal-loans-assessment-sop',
        'mortgage-underwriting-standard',
        'customer-onboarding-sop',
        'commercial-kyc-sop',
        'remote-access-security-policy',
        'privileged-access-sop',
        'aml-ctf-screening-policy',
        'cdr-privacy-policy'
      ],
      lastActive: 'Today, 11:20 AM'
    },
    {
      id: 'david_miller',
      name: 'David Miller',
      role: 'Bank Employee',
      roleType: 'employee',
      department: 'InfoSec & Cyber Defense',
      canView: true,
      canCreate: false,
      canEdit: false,
      policyPermissions: {
        'credit-card-limits-policy': { canView: false, canEdit: false },
        'credit-card-rewards-sop': { canView: false, canEdit: false },
        'personal-loans-assessment-sop': { canView: false, canEdit: false },
        'mortgage-underwriting-standard': { canView: false, canEdit: false },
        'customer-onboarding-sop': { canView: true, canEdit: false },
        'commercial-kyc-sop': { canView: false, canEdit: false },
        'remote-access-security-policy': { canView: true, canEdit: true },
        'privileged-access-sop': { canView: true, canEdit: true },
        'aml-ctf-screening-policy': { canView: false, canEdit: false },
        'cdr-privacy-policy': { canView: false, canEdit: false }
      },
      allowedPolicyIds: ['remote-access-security-policy', 'privileged-access-sop', 'customer-onboarding-sop'],
      lastActive: 'Today, 9:15 AM'
    },
    {
      id: 'emma_watson',
      name: 'Emma Watson',
      role: 'Bank Employee',
      roleType: 'employee',
      department: 'Consumer Lending Desk',
      canView: true,
      canCreate: true,
      canEdit: true,
      policyPermissions: {
        'credit-card-limits-policy': { canView: true, canEdit: true },
        'credit-card-rewards-sop': { canView: true, canEdit: true },
        'personal-loans-assessment-sop': { canView: true, canEdit: true },
        'mortgage-underwriting-standard': { canView: true, canEdit: true },
        'customer-onboarding-sop': { canView: false, canEdit: false },
        'commercial-kyc-sop': { canView: false, canEdit: false },
        'remote-access-security-policy': { canView: false, canEdit: false },
        'privileged-access-sop': { canView: false, canEdit: false },
        'aml-ctf-screening-policy': { canView: false, canEdit: false },
        'cdr-privacy-policy': { canView: false, canEdit: false }
      },
      allowedPolicyIds: ['credit-card-limits-policy', 'credit-card-rewards-sop', 'personal-loans-assessment-sop', 'mortgage-underwriting-standard'],
      lastActive: 'Yesterday, 4:50 PM'
    },
    {
      id: 'marcus_vance',
      name: 'Marcus Vance',
      role: 'Bank Owner & Sign-Off Authority',
      roleType: 'manager',
      department: 'Executive Governance & Retail Lending',
      canView: true,
      canCreate: true,
      canEdit: true,
      policyPermissions: {
        'credit-card-limits-policy': { canView: true, canEdit: true },
        'credit-card-rewards-sop': { canView: true, canEdit: true },
        'personal-loans-assessment-sop': { canView: true, canEdit: true },
        'mortgage-underwriting-standard': { canView: true, canEdit: true },
        'customer-onboarding-sop': { canView: true, canEdit: true },
        'commercial-kyc-sop': { canView: true, canEdit: true },
        'remote-access-security-policy': { canView: true, canEdit: true },
        'privileged-access-sop': { canView: true, canEdit: true },
        'aml-ctf-screening-policy': { canView: true, canEdit: true },
        'cdr-privacy-policy': { canView: true, canEdit: true }
      },
      allowedPolicyIds: [
        'credit-card-limits-policy',
        'credit-card-rewards-sop',
        'personal-loans-assessment-sop',
        'mortgage-underwriting-standard',
        'customer-onboarding-sop',
        'commercial-kyc-sop',
        'remote-access-security-policy',
        'privileged-access-sop',
        'aml-ctf-screening-policy',
        'cdr-privacy-policy'
      ],
      lastActive: 'Now'
    }
  ]);

  // Direct endpoint listener for Super Admin (/super-admin or #admin)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('super-admin') || hash.includes('admin')) {
        setCurrentView('SUPER_ADMIN');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Compute direct permissions for currently active persona
  const currentStaffConfig = bankUsers.find(u => u.id === currentUser.id);
  const canCurrentUserCreateDocument = currentUser.roleType === 'manager' || currentUser.roleType === 'admin' 
    ? true 
    : (currentStaffConfig ? currentStaffConfig.canCreate !== false : true);

  const canCurrentUserEditSelectedPolicy = (policyId) => {
    if (currentUser.roleType === 'manager' || currentUser.roleType === 'admin') return true;
    if (!currentStaffConfig) return true;
    if (currentStaffConfig.canEdit === false) return false;
    if (policyId && currentStaffConfig.policyPermissions && currentStaffConfig.policyPermissions[policyId]) {
      return currentStaffConfig.policyPermissions[policyId].canEdit === true;
    }
    return true;
  };

  // 1. Fetch Hierarchy & Departments
  const loadHierarchy = useCallback(async () => {
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
    } catch (err) {
      console.error('Failed to load hierarchy:', err);
      setDepartments(DEFAULT_DEPARTMENTS);
    }
  }, []);

  // 2. Fetch Policies with Bank User Access Control Filtering (Completely hides blocked policies)
  const loadPolicies = useCallback(async () => {
    try {
      const data = await apiService.getPolicies('all', '', currentUser.roleType);
      const rawList = (data && Array.isArray(data) && data.length > 0) ? data : DEFAULT_POLICIES;

      // Robustly combine with DEFAULT_POLICIES to guarantee 2 policies per primary department
      const map = new Map();
      DEFAULT_POLICIES.forEach(p => map.set(p.id, p));
      rawList.forEach(p => map.set(p.id, p));
      const fullList = Array.from(map.values());

      setAllPolicies(fullList);

      // Enforce employee policy access permissions set by the Bank Owner
      let baseData = fullList;
      if (currentUser.roleType === 'employee' && currentStaffConfig) {
        if (currentStaffConfig.canView === false) {
          baseData = [];
        } else {
          baseData = fullList.filter(pol => {
            if (currentStaffConfig.policyPermissions && currentStaffConfig.policyPermissions[pol.id]) {
              return currentStaffConfig.policyPermissions[pol.id].canView === true;
            }
            if (currentStaffConfig.allowedPolicyIds) {
              return currentStaffConfig.allowedPolicyIds.includes(pol.id) || !DEFAULT_POLICIES.some(dp => dp.id === pol.id);
            }
            return true;
          });
        }
      }

      setPolicies(baseData);

      setSelectedPolicyId(prev => {
        if (prev && baseData.some(p => p.id === prev)) {
          return prev;
        }
        if (baseData.length > 0) {
          const creditCard = baseData.find(p => p.id === 'credit-card-limits-policy');
          return creditCard ? creditCard.id : baseData[0].id;
        }
        return null;
      });
    } catch (err) {
      console.error('Failed to load policies:', err);
      setAllPolicies(DEFAULT_POLICIES);
      setPolicies(DEFAULT_POLICIES);
    }
  }, [currentUser.roleType, currentStaffConfig]);

  // 3. Fetch Maker-Checker items & Notification count
  const loadMakerChecker = useCallback(async () => {
    try {
      const data = await apiService.getMakerCheckerItems();
      if (data) {
        setMakerCheckerData(data);
      }
    } catch (err) {
      console.error('Failed to load maker checker data:', err);
    }
  }, []);

  // Trigger loads on mount and when filter dependencies change
  useEffect(() => {
    loadHierarchy();
    loadMakerChecker();
  }, [loadHierarchy, loadMakerChecker, refreshTrigger]);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  // Switch role and automatically set view if admin
  const handleSelectUser = (user) => {
    setCurrentUser(user);
    if (user.roleType === 'admin') {
      setCurrentView('SUPER_ADMIN');
    } else {
      setCurrentView('WORKSPACE');
    }
  };

  // Toggle view between Super Admin Portal and 3-Pane Workspace
  const handleToggleSuperAdminView = () => {
    setCurrentView(prev => prev === 'SUPER_ADMIN' ? 'WORKSPACE' : 'SUPER_ADMIN');
  };

  // Super Admin action: Select bank and jump directly into that bank's 3-pane workspace
  const handleAccessBankWorkspace = (bank) => {
    setSelectedBank(bank);
    setCurrentView('WORKSPACE');
  };

  // Resizable Draggable Sidebars
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingLeft) {
        const newWidth = Math.min(Math.max(e.clientX, 220), 450);
        setLeftWidth(newWidth);
      } else if (isDraggingRight) {
        const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 260), 500);
        setRightWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
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

  // Action: Toggle Policy Active / Inactive (Safe Archiving)
  const handleTogglePolicyStatus = async (policyId, newStatus) => {
    try {
      await apiService.togglePolicyStatus(policyId, newStatus, currentUser.name);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Action: Toggle Document Masking
  const handleTogglePolicyMasking = async (policyId, isMasked) => {
    try {
      await apiService.togglePolicyMasking(policyId, isMasked, currentUser.name);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to toggle masking:', err);
    }
  };

  // Action: Maker-Checker Approve / Reject
  const handleMakerCheckerAction = async (requestId, action, checkerName, comments) => {
    try {
      await apiService.actionMakerChecker(requestId, action, checkerName, comments);
      await loadMakerChecker();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to action maker checker request:', err);
    }
  };

  // Action: Close Maker-Checker item
  const handleCloseMakerCheckerItem = async (requestId) => {
    try {
      await apiService.closeMakerCheckerItem(requestId);
      await loadMakerChecker();
    } catch (err) {
      console.error('Failed to close item:', err);
    }
  };

  // Open Add Policy Modal pre-populated with Department from hover '+'
  const handleOpenAddPolicyModal = (deptId, deptName) => {
    if (!canCurrentUserCreateDocument) {
      alert("Access Restricted: Policy authoring permission has been revoked for your account by Department Manager Marcus Vance.");
      return;
    }
    setPreselectedDept({ id: deptId, name: deptName });
    setIsAddPolicyModalOpen(true);
  };

  // Active selected policy - Defaults to Credit Card Issuance policy
  const activePolicy = allPolicies.find(p => p.id === selectedPolicyId) 
    || policies.find(p => p.id === selectedPolicyId) 
    || allPolicies[0] 
    || DEFAULT_POLICIES[0];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#eef4fa] font-sans text-slate-800">
      
      {/* Initial Institutional Loading Screen */}
      {showSplash && (
        <SplashScreen
          onFinish={() => setShowSplash(false)}
          selectedBank={selectedBank}
          onSelectBank={setSelectedBank}
          banks={banks}
        />
      )}

      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        pendingReviewCount={makerCheckerData.pendingCount}
        onOpenMakerChecker={() => setIsMakerCheckerOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenBankUserManagerModal={() => setIsBankUserManagerOpen(true)}
        onOpenSuperAdminModal={() => setIsSuperAdminModalOpen(true)}
        isLeftOpen={isLeftOpen}
        onToggleLeft={() => setIsLeftOpen(!isLeftOpen)}
        isRightOpen={isRightOpen}
        onToggleRight={() => setIsRightOpen(!isRightOpen)}
        onToggleMobileLeft={() => setIsMobileLeftOpen(true)}
        onToggleMobileRight={() => setIsMobileRightOpen(true)}
        currentView={currentView}
        onToggleSuperAdminView={handleToggleSuperAdminView}
        selectedBank={selectedBank}
      />

      {/* Main View Area */}
      {currentView === 'SUPER_ADMIN' ? (
        /* SUPER ADMIN PORTAL (Platform Owner: Banks list + Master Library Management) */
        <AdminDashboard
          banks={banks}
          policies={policiesDatabase}
          onSelectBank={handleAccessBankWorkspace}
          onOpenEditMasterModal={() => setIsConfigureModalOpen(true)}
          onOpenBankCustomModal={() => setIsConfigureModalOpen(true)}
          onOpenAddPolicyModal={handleOpenAddPolicyModal}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onSwitchToLibraryView={() => setCurrentView('WORKSPACE')}
          onSelectPolicy={(id) => {
            setSelectedPolicyId(id);
            setCurrentView('WORKSPACE');
          }}
        />
      ) : (
        /* EXACT 3-PANE WORKSPACE STRUCTURE (libtrack_UI wireframe) */
        <div className="flex-1 flex overflow-hidden relative bg-[#eef4fa]">
          
          {/* Pane 1: Left - Library Group (Group → Functional → LOB Hierarchy) */}
          {isLeftOpen && (
            <>
              <HierarchyPane
                selectedDepartmentId={selectedDepartmentId}
                onSelectDepartment={(id) => {
                  setSelectedDepartmentId(id);
                  if (id !== 'all') {
                    const currentSelected = allPolicies.find(p => p.id === selectedPolicyId);
                    if (!currentSelected || currentSelected.department_id !== id) {
                      const firstInDept = allPolicies.find(p => p.department_id === id);
                      if (firstInDept) setSelectedPolicyId(firstInDept.id);
                    }
                  }
                }}
                policies={allPolicies}
                selectedPolicyId={selectedPolicyId}
                onSelectPolicy={(id) => {
                  setSelectedPolicyId(id);
                  const pol = allPolicies.find(p => p.id === id);
                  if (pol && pol.department_id) {
                    setSelectedDepartmentId(pol.department_id);
                  }
                }}
                onOpenAddPolicyModal={handleOpenAddPolicyModal}
                canCreateDocument={canCurrentUserCreateDocument}
                isMobileOpen={isMobileLeftOpen}
                onCloseMobile={() => setIsMobileLeftOpen(false)}
                isCollapsed={!isLeftOpen}
                width={leftWidth}
                refreshTrigger={refreshTrigger}
              />

              {/* Left Draggable Resizer Bar */}
              <div
                onMouseDown={() => setIsDraggingLeft(true)}
                className="hidden md:block w-1 hover:w-1.5 bg-transparent hover:bg-slate-400 active:bg-slate-600 cursor-col-resize transition-all z-20"
                title="Drag to resize sidebar"
              />
            </>
          )}

          {/* Pane 2: Center - Detailed Library Info (Top) + Supplementary section (Bottom) */}
          <PolicyWorkspacePane
            policy={activePolicy}
            currentUser={currentUser}
            canEditPolicy={canCurrentUserEditSelectedPolicy(selectedPolicyId)}
            canCreateDocument={canCurrentUserCreateDocument}
            onOpenConfigureModal={() => setIsConfigureModalOpen(true)}
            onToggleStatus={handleTogglePolicyStatus}
            onToggleMasking={handleTogglePolicyMasking}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            refreshTrigger={refreshTrigger}
          />

          {/* Pane 3: Right - Comments/Queries with Chat option */}
          {isRightOpen && (
            <>
              {/* Right Draggable Resizer Bar */}
              <div
                onMouseDown={() => setIsDraggingRight(true)}
                className="hidden lg:block w-1 hover:w-1.5 bg-transparent hover:bg-slate-400 active:bg-slate-600 cursor-col-resize transition-all z-20"
                title="Drag to resize feed"
              />

              <ContextualFeedPane
                activePolicy={activePolicy}
                currentUser={currentUser}
                isMobileOpen={isMobileRightOpen}
                onCloseMobile={() => setIsMobileRightOpen(false)}
                isCollapsed={!isRightOpen}
                width={rightWidth}
                refreshTrigger={refreshTrigger}
                onOpenMakerChecker={() => setIsMakerCheckerOpen(true)}
                onSelectPolicy={(id) => setSelectedPolicyId(id)}
                policies={allPolicies}
              />
            </>
          )}
        </div>
      )}

      {/* ----------------- MODALS ----------------- */}

      {/* 1. Maker-Checker Governance & Review Modal */}
      <MakerCheckerModal
        isOpen={isMakerCheckerOpen}
        onClose={() => setIsMakerCheckerOpen(false)}
        items={makerCheckerData.pending}
        history={makerCheckerData.history}
        currentUser={currentUser}
        onAction={handleMakerCheckerAction}
        onCloseItem={handleCloseMakerCheckerItem}
      />

      {/* 2. Configure Operational Policy Modal (In-System Parameter Editor) */}
      <ConfigurePolicyModal
        isOpen={isConfigureModalOpen}
        onClose={() => setIsConfigureModalOpen(false)}
        policy={activePolicy}
        currentUser={currentUser}
        onPolicyUpdated={() => setRefreshTrigger(prev => prev + 1)}
      />

      {/* 3. Add Policy Modal (3 Creation Modes with AI Thinking Ingestion) */}
      <AddPolicyModal
        isOpen={isAddPolicyModalOpen}
        onClose={() => setIsAddPolicyModalOpen(false)}
        preselectedDepartmentId={preselectedDept.id}
        preselectedDepartmentName={preselectedDept.name}
        departments={departments}
        currentUser={currentUser}
        onPolicyCreated={(newId) => {
          setSelectedPolicyId(newId);
          setRefreshTrigger(prev => prev + 1);
        }}
      />

      {/* 4. Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        activePolicy={activePolicy}
        selectedBank={selectedBank}
      />

      {/* 5. Notifications & Compliance Codes Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        onOpenPolicy={(id) => {
          setSelectedPolicyId(id);
          setRefreshTrigger(prev => prev + 1);
        }}
      />

      {/* 6. Bank User Management & Access Control Matrix (Checker Controller) */}
      <BankUserManagerModal
        isOpen={isBankUserManagerOpen}
        onClose={() => setIsBankUserManagerOpen(false)}
        currentUser={currentUser}
        bankUsers={bankUsers}
        onUpdateBankUsers={(updated) => {
          setBankUsers(updated);
          setRefreshTrigger(prev => prev + 1);
        }}
        policies={allPolicies}
      />

      {/* 7. Super Admin Direct Gateway Login Modal */}
      <SuperAdminLoginModal
        isOpen={isSuperAdminModalOpen}
        onClose={() => setIsSuperAdminModalOpen(false)}
        onLoginAsSuperAdmin={(adminUser) => handleSelectUser(adminUser)}
      />
    </div>
  );
}
