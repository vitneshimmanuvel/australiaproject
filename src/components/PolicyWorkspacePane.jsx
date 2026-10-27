import React, { useState, useEffect } from 'react';
import { 
  FileEdit, 
  Clock, 
  Lock, 
  Unlock, 
  History, 
  User, 
  Building2, 
  FileText,
  GraduationCap,
  FileCheck,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Layers,
  ChevronRight,
  Calculator,
  DollarSign,
  CheckCircle,
  Plus,
  Users,
  Award,
  TrendingUp,
  Filter,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { DEFAULT_POLICIES } from '../data/defaultPolicies';

export default function PolicyWorkspacePane({
  policy,
  currentUser,
  onOpenConfigureModal,
  onToggleStatus,
  onToggleMasking,
  onOpenExportModal,
  refreshTrigger = 0,
  canEditPolicy = true,
  canCreateDocument = true
}) {
  const [detailedPolicy, setDetailedPolicy] = useState(policy || DEFAULT_POLICIES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSupplementaryTab, setActiveSupplementaryTab] = useState('parameters'); // 'parameters' | 'training' | 'reports' | 'incidents' | 'faqs' | 'reg_reference'

  const isBankOwner = currentUser?.roleType === 'manager' || currentUser?.roleType === 'admin';
  const isEmployee = currentUser?.roleType === 'employee';

  // Training users, modules tracking, and notes per user
  const [trainingUsers, setTrainingUsers] = useState([
    {
      id: 'sarah_jenkins',
      name: 'Sarah Jenkins',
      role: 'Bank Employee',
      department: 'Credit Operations Squad',
      modules: [
        { id: 'm1', name: 'APRA CPS 234 & Credit Verification', status: 'Completed', score: '98%', completedDate: '12 Oct 2026' },
        { id: 'm2', name: 'AML/CTF Customer Due Diligence (CDD)', status: 'Completed', score: '96%', completedDate: '15 Oct 2026' },
        { id: 'm3', name: 'High-Value Escalations & Sign-Off', status: 'In Progress', score: '--', dueDate: '15 Nov 2026' },
        { id: 'm4', name: 'Digital Lending SOP & Consumer Credit Act', status: 'Certified', score: '100%', completedDate: '20 Oct 2026' }
      ],
      notes: [
        { id: 'tn1', author: 'Marcus Vance (Bank Owner)', date: '16 Oct 2026', text: 'Sarah demonstrated flawless command of Equifax automated checks with zero false positives.' },
        { id: 'tn2', author: 'Sarah Jenkins (Bank Employee)', date: '18 Oct 2026', text: 'Completed practice scenarios on Tier-1 credit card limit overrides exceeding $25k.' }
      ],
      certifiedCount: 3,
      onboardingCompleted: true,
      userCost: 450
    },
    {
      id: 'emma_watson',
      name: 'Emma Watson',
      role: 'Bank Employee',
      department: 'Retail Lending Associate',
      modules: [
        { id: 'm1', name: 'APRA CPS 234 & Credit Verification', status: 'Completed', score: '92%', completedDate: '08 Oct 2026' },
        { id: 'm2', name: 'AML/CTF Customer Due Diligence (CDD)', status: 'In Progress', score: '--', dueDate: '28 Oct 2026' },
        { id: 'm3', name: 'High-Value Escalations & Sign-Off', status: 'Pending', score: '--', dueDate: '30 Nov 2026' },
        { id: 'm4', name: 'Digital Lending SOP & Consumer Credit Act', status: 'Certified', score: '95%', completedDate: '14 Oct 2026' }
      ],
      notes: [
        { id: 'tn3', author: 'Marcus Vance (Bank Owner)', date: '14 Oct 2026', text: 'On track for full operational delegation sign-off once Module 2 completes.' }
      ],
      certifiedCount: 2,
      onboardingCompleted: false,
      userCost: 450
    },
    {
      id: 'david_miller',
      name: 'David Miller',
      role: 'Bank Employee',
      department: 'Security Operations Specialist',
      modules: [
        { id: 'm1', name: 'APRA CPS 234 & Credit Verification', status: 'Completed', score: '99%', completedDate: '05 Oct 2026' },
        { id: 'm2', name: 'AML/CTF Customer Due Diligence (CDD)', status: 'Completed', score: '100%', completedDate: '09 Oct 2026' },
        { id: 'm3', name: 'High-Value Escalations & Sign-Off', status: 'Certified', score: '98%', completedDate: '17 Oct 2026' },
        { id: 'm4', name: 'Digital Lending SOP & Consumer Credit Act', status: 'Certified', score: '97%', completedDate: '19 Oct 2026' }
      ],
      notes: [
        { id: 'tn4', author: 'Marcus Vance (Bank Owner)', date: '20 Oct 2026', text: 'Full 100% accreditation achieved across all 4 mandatory operational modules.' }
      ],
      certifiedCount: 4,
      onboardingCompleted: true,
      userCost: 450
    },
    {
      id: 'liam_chen',
      name: 'Liam Chen',
      role: 'Bank Employee',
      department: 'Compliance Oversight',
      modules: [
        { id: 'm1', name: 'APRA CPS 234 & Credit Verification', status: 'Completed', score: '94%', completedDate: '11 Oct 2026' },
        { id: 'm2', name: 'AML/CTF Customer Due Diligence (CDD)', status: 'In Progress', score: '--', dueDate: '02 Nov 2026' },
        { id: 'm3', name: 'High-Value Escalations & Sign-Off', status: 'Pending', score: '--', dueDate: '25 Nov 2026' },
        { id: 'm4', name: 'Digital Lending SOP & Consumer Credit Act', status: 'In Progress', score: '--', dueDate: '10 Nov 2026' }
      ],
      notes: [
        { id: 'tn5', author: 'Marcus Vance (Bank Owner)', date: '21 Oct 2026', text: 'Enrolled in expedited onboarding path.' }
      ],
      certifiedCount: 1,
      onboardingCompleted: false,
      userCost: 450
    },
    {
      id: 'marcus_vance',
      name: 'Marcus Vance',
      role: 'Bank Owner',
      department: 'Executive Governance & Sign-Off Authority',
      modules: [
        { id: 'm1', name: 'APRA CPS 234 & Credit Verification', status: 'Certified', score: '100%', completedDate: '01 Oct 2026' },
        { id: 'm2', name: 'AML/CTF Customer Due Diligence (CDD)', status: 'Certified', score: '100%', completedDate: '01 Oct 2026' },
        { id: 'm3', name: 'High-Value Escalations & Sign-Off', status: 'Certified', score: '100%', completedDate: '02 Oct 2026' },
        { id: 'm4', name: 'Digital Lending SOP & Consumer Credit Act', status: 'Certified', score: '100%', completedDate: '02 Oct 2026' }
      ],
      notes: [
        { id: 'tn6', author: 'Executive Risk Committee', date: '03 Oct 2026', text: 'Bank Owner governance certification validated for Commonwealth Bank credit policies.' }
      ],
      certifiedCount: 4,
      onboardingCompleted: true,
      userCost: 450
    }
  ]);

  const [selectedUserFilter, setSelectedUserFilter] = useState('all'); // 'all' or userId
  const [newTrainingNoteText, setNewTrainingNoteText] = useState('');
  const [selectedUserForNote, setSelectedUserForNote] = useState('sarah_jenkins');
  const [enrolledStaffCount, setEnrolledStaffCount] = useState(42);

  const handleAddTrainingNote = (e) => {
    e.preventDefault();
    if (!newTrainingNoteText.trim()) return;
    const authorRole = currentUser?.roleType === 'manager' ? 'Bank Owner' : 'Bank Employee';
    const newNote = {
      id: `tn-${Date.now()}`,
      author: `${currentUser?.name || 'Marcus Vance'} (${authorRole})`,
      date: 'Today',
      text: newTrainingNoteText.trim()
    };
    setTrainingUsers(prev => prev.map(u => {
      if (u.id === selectedUserForNote) {
        return { ...u, notes: [newNote, ...u.notes] };
      }
      return u;
    }));
    setNewTrainingNoteText('');
  };

  // Immediately sync prop when available
  useEffect(() => {
    if (policy) {
      setDetailedPolicy(prev => prev?.id === policy.id ? prev : policy);
    }
  }, [policy]);

  // Fetch full policy details with versions & artifacts
  useEffect(() => {
    if (!policy?.id) return;
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const full = await apiService.getPolicyDetails(policy.id, currentUser?.roleType || 'employee');
        if (full) {
          setDetailedPolicy(full);
        } else {
          setDetailedPolicy(policy);
        }
      } catch (err) {
        console.error('Failed to load policy details:', err);
        setDetailedPolicy(policy);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [policy?.id, currentUser?.roleType, refreshTrigger]);

  const activeDoc = detailedPolicy || DEFAULT_POLICIES[0];
  const isActive = activeDoc.status === 'active';

  const parameters = typeof activeDoc.parameters === 'string' 
    ? JSON.parse(activeDoc.parameters || '{}') 
    : (activeDoc.parameters || {});

  const artifacts = activeDoc.artifacts || [];
  const trainingItems = artifacts.filter(a => a.tab_type === 'training');
  const reportItems = artifacts.filter(a => a.tab_type === 'reports');
  const incidentItems = artifacts.filter(a => a.tab_type === 'incidents');
  const faqItems = artifacts.filter(a => a.tab_type === 'faqs');

  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f0f4f9] custom-scrollbar select-none text-slate-800">
      
      {/* ----------------- SECTION 1: DETAILED LIBRARY INFO (TOP) ----------------- */}
      <div className="p-6 sm:p-8 border-b border-[#dbe4ef] bg-white space-y-5">
        
        {/* Breadcrumb & Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb path */}
          <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500 font-medium">
            <span className="hover:text-blue-600 cursor-pointer">Library Group</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-700 font-semibold">{detailedPolicy.department_name || 'Retail Banking'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[11px] font-bold">
              v{detailedPolicy.version || '1.0'}
            </span>
          </div>

          {/* Direct Lifecycle Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Configure / Update Button (Controlled by canEditPolicy) */}
            {canEditPolicy ? (
              <button
                onClick={() => onOpenConfigureModal(detailedPolicy)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium bg-[#0057B8] hover:bg-[#004EA6] text-white shadow-primary-sm transition cursor-pointer"
                title={isEmployee ? "Submit Proposed Amendments (Bank Employee)" : "Configure Clauses & Thresholds directly"}
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Configure / Update</span>
              </button>
            ) : (
              <div 
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed" 
                title="Read Only: Edit permissions not granted for your role"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Read Only</span>
              </div>
            )}

            {/* [Active / Inactive] Toggle Button (Safe Archiving) */}
            <button
              onClick={() => onToggleStatus(detailedPolicy.id, isActive ? 'inactive' : 'active')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium border transition cursor-pointer ${
                isActive
                  ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
              }`}
              title="Toggle between Active enforcement and Safe Archive"
            >
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              <span>{isActive ? 'Active' : 'Archived'}</span>
            </button>
          </div>
        </div>

        {/* Policy Document Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
            {detailedPolicy.title}
          </h1>
          <p className="text-[14.5px] text-[#4b5563] mt-1.5 font-normal leading-relaxed">
            {detailedPolicy.summary}
          </p>
          <div className="flex flex-wrap items-center gap-5 text-[12px] text-slate-500 pt-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Updated: {new Date(detailedPolicy.updated_at || Date.now()).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" /> Author: {detailedPolicy.created_by || 'Department Authority'}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> Institution: Commonwealth Bank of Australia
            </span>
          </div>
        </div>

        {/* Detailed Clauses Content Box */}
        <div className="p-6 rounded-xl border border-[#e5e7eb] bg-white space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
            <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Detailed Library Info (in the context of library group)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">CORE SPECIFICATION</span>
          </div>

            <div className="text-[13.5px] text-slate-700 leading-relaxed space-y-3 font-normal whitespace-pre-line pt-1">
              {detailedPolicy.content}
            </div>

            {/* DIRECT IN-SYSTEM DOCUMENTS (IF THIS IS A MASTER PRODUCT POLICY) */}
            {activeDoc.direct_documents && activeDoc.direct_documents.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-200/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <h4 className="text-[13.5px] font-bold text-slate-900 tracking-tight">
                      Direct In-System Documents in this Product ({activeDoc.direct_documents.length})
                    </h4>
                  </div>
                  <span className="text-[11px] font-medium text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    Operational Product Specifications
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeDoc.direct_documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition shadow-2xs space-y-2 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                          {doc.code}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {doc.version}
                        </span>
                      </div>
                      <h5 className="text-[12px] font-bold text-slate-800 group-hover:text-blue-700 transition leading-snug">
                        {doc.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {doc.summary}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10.5px]">
                        <span className="text-slate-400">{doc.type}</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MANDATORY TRAINING, STAFF ACCREDITATION & ONBOARDING COST TRACKING */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 space-y-5">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-slate-800" />
                  <div>
                    <h4 className="text-[14.5px] font-bold text-slate-900 tracking-tight">
                      Mandatory Training, Staff Accreditation & Onboarding Cost Tracking
                    </h4>
                    <p className="text-[11.5px] text-slate-500">
                      Track individual employee training notes, accreditation progress, and institutional onboarding expenditure.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  APRA CPS 234 Verified • 98.4% Branch Staff Certified
                </span>
              </div>

              {/* 1. ONBOARDING TRAINING COST CALCULATION (FOR USER & FOR BANK OWNER) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                {/* CARD 1: Cost to the User / Bank Employee */}
                <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/50 to-white shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        👤
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Staff Onboarding Cost</span>
                        <h5 className="text-[13px] font-bold text-slate-900">Cost to the User (Bank Employee)</h5>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      100% Subsidized
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-blue-100">
                    <div>
                      <span className="text-2xl font-black text-slate-900 font-mono">$450 AUD</span>
                      <span className="text-[11px] text-slate-500 ml-1.5">per employee accreditation pack</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-emerald-600 block">Out of Pocket: $0 AUD</span>
                      <span className="text-[10px] text-slate-400">Paid by Commonwealth Bank</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-blue-100 space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-600">
                      <span>• APRA Regulatory Compliance License:</span>
                      <span className="font-semibold text-slate-800">$150 AUD</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>• DVS Simulator & Identity Sandbox:</span>
                      <span className="font-semibold text-slate-800">$120 AUD</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>• Delegation Exam & Officer Certification:</span>
                      <span className="font-semibold text-slate-800">$180 AUD</span>
                    </div>
                  </div>
                </div>

                {/* CARD 2: Cost to the Bank Owner */}
                <div className="p-4 rounded-xl border border-slate-300 bg-gradient-to-br from-slate-50 to-white shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        🏦
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Institutional Investment</span>
                        <h5 className="text-[13px] font-bold text-slate-900">Cost to the Bank Owner</h5>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10.5px] text-slate-500">Enrolled Staff:</span>
                      <div className="flex items-center border border-slate-200 rounded bg-white">
                        <button
                          onClick={() => setEnrolledStaffCount(prev => Math.max(1, prev - 1))}
                          className="px-1.5 py-0.5 text-xs font-bold hover:bg-slate-100 text-slate-600"
                        >
                          -
                        </button>
                        <span className="px-1.5 text-xs font-bold font-mono text-slate-800">{enrolledStaffCount}</span>
                        <button
                          onClick={() => setEnrolledStaffCount(prev => prev + 1)}
                          className="px-1.5 py-0.5 text-xs font-bold hover:bg-slate-100 text-slate-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-2xl font-black text-slate-900 font-mono">
                        ${(enrolledStaffCount * 450).toLocaleString()} AUD
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1.5">total training expenditure</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-slate-700 block">Budget: $25,000 AUD</span>
                      <span className="text-[10px] text-emerald-600 font-medium">
                        ${(25000 - enrolledStaffCount * 450).toLocaleString()} AUD remaining
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-600">
                      <span>• Calculated Allocation:</span>
                      <span className="font-semibold text-slate-800">{enrolledStaffCount} Staff × $450 AUD</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>• APRA Breach Penalties Avoided:</span>
                      <span className="font-semibold text-emerald-600">~$250,000 AUD</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>• Net Compliance ROI:</span>
                      <span className="font-semibold text-slate-900">13.2x Return on Investment</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* 2. USER FILTER FOR TRAINING OPTIONS & NOTES ("jest make tiflreto o") */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Filter Training by Bank User:
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-400">
                    Viewing {selectedUserFilter === 'all' ? 'All Staff Members' : trainingUsers.find(u => u.id === selectedUserFilter)?.name}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setSelectedUserFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedUserFilter === 'all'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    All Staff ({trainingUsers.length})
                  </button>

                  {trainingUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setSelectedUserFilter(u.id);
                        setSelectedUserForNote(u.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                        selectedUserFilter === u.id
                          ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{u.name}</span>
                      <span className={`text-[10px] px-1 rounded ${
                        selectedUserFilter === u.id
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {u.role === 'Bank Owner' ? 'Owner' : 'Employee'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. TRAINING OPTIONS & MODULES TRACKING PER USER */}
              <div className="space-y-3">
                {trainingUsers
                  .filter(u => selectedUserFilter === 'all' || u.id === selectedUserFilter)
                  .map(u => (
                    <div key={u.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                      
                      {/* User Title & Accreditation Status */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-bold text-xs">
                            {u.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-[13px]">{u.name}</span>
                              <span className="text-[10.5px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                {u.role}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">{u.department}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500 font-medium">
                            {u.certifiedCount} of {u.modules.length} Modules Completed
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            u.onboardingCompleted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {u.onboardingCompleted ? '✓ Accredited' : '● Onboarding in Progress'}
                          </span>
                        </div>
                      </div>

                      {/* Modules Grid for this user */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                        {u.modules.map(mod => (
                          <div key={mod.id} className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/60 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                mod.status === 'Completed' || mod.status === 'Certified'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : mod.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}>
                                {mod.status}
                              </span>
                              <span className="text-[10px] font-bold font-mono text-slate-700">
                                {mod.score !== '--' ? `Score: ${mod.score}` : ''}
                              </span>
                            </div>
                            <h6 className="font-bold text-slate-800 text-[11.5px] leading-snug">{mod.name}</h6>
                            <span className="text-[10px] text-slate-400 block pt-0.5">
                              {mod.completedDate ? `Passed: ${mod.completedDate}` : `Due: ${mod.dueDate}`}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Training Notes for this user */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                          Training & Supervisor Coaching Notes ({u.notes.length})
                        </span>
                        <div className="space-y-1.5">
                          {u.notes.map(note => (
                            <div key={note.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-[11.5px] flex items-start justify-between gap-2">
                              <div>
                                <span className="font-semibold text-slate-800">{note.author}: </span>
                                <span className="text-slate-600">{note.text}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">{note.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
              </div>

              {/* 4. FORM TO ADD A TRAINING NOTE FOR A USER */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Add Training / Coaching Note for Employee
                </span>
                <form onSubmit={handleAddTrainingNote} className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="text-xs font-semibold text-slate-600">Select Employee:</label>
                    <select
                      value={selectedUserForNote}
                      onChange={(e) => setSelectedUserForNote(e.target.value)}
                      className="p-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                    >
                      {trainingUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={newTrainingNoteText}
                      onChange={(e) => setNewTrainingNoteText(e.target.value)}
                      placeholder="Add coaching note, accreditation sign-off, or practical exam feedback..."
                      className="flex-1 text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-slate-500"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Note</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => alert("SOP Acknowledgment Recorded: Signed by " + (currentUser?.name || "Staff Reviewer") + " on " + new Date().toLocaleDateString())}
                    className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition cursor-pointer"
                  >
                    ✓ Acknowledge & Sign-Off SOP
                  </button>
                  <button 
                    onClick={() => alert("Launching 5-question staff accreditation quiz...")}
                    className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition cursor-pointer"
                  >
                    Take Accreditation Quiz (5 mins)
                  </button>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="text-[12px] font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 hover:underline cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Training Pack (.PDF)</span>
                </button>
              </div>
            </div>
          </div>
      </div>

      {/* ----------------- SECTION 2: SUPPLEMENTARY SECTION (BOTTOM) ----------------- */}
      <div className="p-5 sm:p-6 bg-[#f0f4f9] space-y-4">
        
        {/* Supplementary Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dbe4ef] pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-600" />
            <h3 className="text-[14px] font-bold text-slate-900">Supplementary Section</h3>
            <span className="text-[11px] text-slate-500 font-medium">Operational Parameters & Contextual Linkages</span>
          </div>

          {/* Contextual Linkage Tabs - Highlighted when active docs exist, inactive button when 0 */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveSupplementaryTab('parameters')}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition cursor-pointer ${
                activeSupplementaryTab === 'parameters'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Thresholds & Charts
            </button>

            {/* Training Tab */}
            <button
              onClick={() => setActiveSupplementaryTab('training')}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium flex items-center gap-1.5 transition cursor-pointer ${
                activeSupplementaryTab === 'training'
                  ? 'bg-[#0057B8] text-white shadow-primary-sm font-semibold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
              title="Staff Training & Onboarding Cost Tracking"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Training ({trainingUsers.length} Staff)</span>
            </button>

            {/* Reports Tab */}
            <button
              onClick={() => reportItems.length > 0 && setActiveSupplementaryTab('reports')}
              disabled={reportItems.length === 0}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium flex items-center gap-1.5 transition ${
                activeSupplementaryTab === 'reports'
                  ? 'bg-[#0057B8] text-white shadow-primary-sm font-semibold'
                  : reportItems.length > 0
                  ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-60'
              }`}
              title={reportItems.length > 0 ? "Active Control Reports" : "No reports"}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Reports ({reportItems.length})</span>
            </button>

            {/* Incidents Tab */}
            <button
              onClick={() => incidentItems.length > 0 && setActiveSupplementaryTab('incidents')}
              disabled={incidentItems.length === 0}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium flex items-center gap-1.5 transition ${
                activeSupplementaryTab === 'incidents'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : incidentItems.length > 0
                  ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-60'
              }`}
              title={incidentItems.length > 0 ? "Active Incidents & Issues" : "No incidents"}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Issues ({incidentItems.length})</span>
            </button>

            {/* FAQs Tab */}
            <button
              onClick={() => faqItems.length > 0 && setActiveSupplementaryTab('faqs')}
              disabled={faqItems.length === 0}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium flex items-center gap-1.5 transition ${
                activeSupplementaryTab === 'faqs'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : faqItems.length > 0
                  ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-60'
              }`}
              title={faqItems.length > 0 ? "Active FAQs" : "No FAQs"}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQs ({faqItems.length})</span>
            </button>

            {/* Regulatory Reference Tab */}
            <button
              onClick={() => setActiveSupplementaryTab('reg_reference')}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium flex items-center gap-1.5 transition cursor-pointer ${
                activeSupplementaryTab === 'reg_reference'
                  ? 'bg-[#0057B8] text-white shadow-primary-sm font-semibold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
              title="Optional Regulatory Reference Linkage"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Reg Reference</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Operational Parameters Grid & SLA Trendline Chart */}
        {activeSupplementaryTab === 'parameters' && (
          <div className="space-y-4">
            {/* SUBTLE, COMPACT PARAMETER CARDS (Correct sizes, subtle colors, no huge fonts) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Turnaround SLA</span>
                <p className="text-[14px] font-bold text-slate-800 mt-0.5">
                  {parameters.turnaround_sla || '24 Hours'}
                </p>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Target: 99.4% adherence</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daily Limit</span>
                <p className="text-[14px] font-bold text-slate-800 mt-0.5">
                  {parameters.daily_limit || '$25,000 AUD'}
                </p>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Customer ceiling</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Officer Approval Cap</span>
                <p className="text-[14px] font-bold text-slate-800 mt-0.5">
                  {parameters.approval_limits?.officer_cap || '$100,000 AUD'}
                </p>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Delegate approval cap</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Identity Check</span>
                <p className="text-[14px] font-bold text-slate-800 mt-0.5">
                  {parameters.mandatory_dvs ? 'Mandatory DVS' : 'Equifax + DVS'}
                </p>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Automated verification</span>
              </div>
            </div>

            {/* SLA TURNAROUND TRENDLINE & TARGET VS ACTUAL CHART */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div>
                  <h4 className="text-[13px] font-bold text-slate-800">
                    SLA Turnaround Trendline: Operational Targets vs. Actuals
                  </h4>
                  <p className="text-[11.5px] text-slate-500">
                    6-Month Historical Resolution Trend (Commonwealth Bank Credit Adjudication)
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-medium text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-slate-400 border-b border-dashed border-slate-500"></span>
                    <span>Target Benchmark (24.0h)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                    <span>Actual Adjudication (Avg: 14.2h)</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold border border-emerald-200">
                    99.4% SLA Adhered
                  </span>
                </div>
              </div>

              {/* Clean Interactive SVG Chart */}
              <div className="w-full h-44 relative pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 130">
                  {/* Grid lines */}
                  <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="55" x2="580" y2="55" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="90" x2="580" y2="90" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Axis Y Labels */}
                  <text x="32" y="24" textAnchor="end" className="text-[9.5px] fill-slate-400 font-mono">24h</text>
                  <text x="32" y="59" textAnchor="end" className="text-[9.5px] fill-slate-400 font-mono">18h</text>
                  <text x="32" y="94" textAnchor="end" className="text-[9.5px] fill-slate-400 font-mono">12h</text>

                  {/* Benchmark Target Line (24h) */}
                  <line 
                    x1="45" 
                    y1="20" 
                    x2="575" 
                    y2="20" 
                    stroke="#94a3b8" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4" 
                  />

                  {/* Actual Trend Area Gradient & Path */}
                  <defs>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#334155" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#334155" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Shaded Area */}
                  <polygon 
                    points="60,110 60,35 160,45 260,52 360,56 460,68 560,82 560,110" 
                    fill="url(#actualGradient)" 
                  />

                  {/* Actual Trend Line */}
                  <polyline
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="60,35 160,45 260,52 360,56 460,68 560,82"
                  />

                  {/* Month Data Points & Hover Tooltips */}
                  {/* May */}
                  <circle cx="60" cy="35" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                  <text x="60" y="30" textAnchor="middle" className="text-[9px] fill-slate-700 font-semibold font-mono">21.8h</text>
                  <text x="60" y="124" textAnchor="middle" className="text-[10px] fill-slate-500 font-medium">May</text>

                  {/* Jun */}
                  <circle cx="160" cy="45" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                  <text x="160" y="40" textAnchor="middle" className="text-[9px] fill-slate-700 font-semibold font-mono">20.1h</text>
                  <text x="160" y="124" textAnchor="middle" className="text-[10px] fill-slate-500 font-medium">Jun</text>

                  {/* Jul */}
                  <circle cx="260" cy="52" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                  <text x="260" y="47" textAnchor="middle" className="text-[9px] fill-slate-700 font-semibold font-mono">19.0h</text>
                  <text x="260" y="124" textAnchor="middle" className="text-[10px] fill-slate-500 font-medium">Jul</text>

                  {/* Aug */}
                  <circle cx="360" cy="56" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                  <text x="360" y="51" textAnchor="middle" className="text-[9px] fill-slate-700 font-semibold font-mono">18.4h</text>
                  <text x="360" y="124" textAnchor="middle" className="text-[10px] fill-slate-500 font-medium">Aug</text>

                  {/* Sep */}
                  <circle cx="460" cy="68" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                  <text x="460" y="63" textAnchor="middle" className="text-[9px] fill-slate-700 font-semibold font-mono">16.5h</text>
                  <text x="460" y="124" textAnchor="middle" className="text-[10px] fill-slate-500 font-medium">Sep</text>

                  {/* Oct */}
                  <circle cx="560" cy="82" r="5" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
                  <text x="560" y="76" textAnchor="middle" className="text-[10px] fill-slate-900 font-bold font-mono">14.2h</text>
                  <text x="560" y="124" textAnchor="middle" className="text-[10px] fill-slate-900 font-bold">Oct (Now)</text>
                </svg>
              </div>

              {/* Operational Insights bar */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-[11.5px]">
                <div className="p-1.5 rounded bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Fast-Track Automation</span>
                  <span className="font-bold text-slate-800">92.6% within 4 hours</span>
                </div>
                <div className="p-1.5 rounded bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Supervisor Sign-off</span>
                  <span className="font-bold text-slate-800">100% Dual Approval</span>
                </div>
                <div className="p-1.5 rounded bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Breach Rate</span>
                  <span className="font-bold text-emerald-600">0.06% (Well within APRA target)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Training Materials & Staff Onboarding Progress */}
        {activeSupplementaryTab === 'training' && (
          <div className="space-y-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
              <div>
                <h4 className="text-[13px] font-bold text-slate-900">Branch Onboarding & Accreditation Summary</h4>
                <p className="text-[11.5px] text-slate-500">
                  {trainingUsers.filter(u => u.onboardingCompleted).length} of {trainingUsers.length} Staff fully accredited • Total Cost: ${(enrolledStaffCount * 450).toLocaleString()} AUD
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                APRA CPS 234 Verified
              </span>
            </div>

            {trainingItems.map(item => (
              <div key={item.id} className="p-3 bg-white rounded-xl border border-[#e5e7eb] flex items-center justify-between">
                <div>
                  <h4 className="text-[13.5px] font-semibold text-slate-800">{item.title}</h4>
                  <span className="text-[11px] text-slate-500">{item.file_type} • Updated for v{detailedPolicy.version}</span>
                </div>
                <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer">
                  Open Guide
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Control Reports */}
        {activeSupplementaryTab === 'reports' && (
          <div className="space-y-2.5">
            {reportItems.map(item => (
              <div key={item.id} className="p-3 bg-white rounded-xl border border-[#e5e7eb] flex items-center justify-between">
                <div>
                  <h4 className="text-[13.5px] font-semibold text-slate-800">{item.title}</h4>
                  <span className="text-[11px] text-slate-500">{item.file_type} • Verified Control Log</span>
                </div>
                <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium">
                  View Report
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Issues & Incidents */}
        {activeSupplementaryTab === 'incidents' && (
          <div className="space-y-2.5">
            {incidentItems.map(item => (
              <div key={item.id} className="p-3 bg-white rounded-xl border border-amber-200 bg-amber-50/30 flex items-center justify-between">
                <div>
                  <h4 className="text-[13.5px] font-semibold text-slate-800">{item.title}</h4>
                  <span className="text-[11px] text-amber-700 font-medium">Resolution Confirmed</span>
                </div>
                <button className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium">
                  Audit Notes
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: FAQs */}
        {activeSupplementaryTab === 'faqs' && (
          <div className="space-y-2.5">
            {faqItems.map(item => (
              <div key={item.id} className="p-3.5 bg-white rounded-xl border border-[#e5e7eb]">
                <h4 className="text-[13px] font-bold text-slate-800">{item.title}</h4>
                <p className="text-[12.5px] text-slate-600 mt-1">
                  Personal credit lines are subject to standard verification. Escalations exceeding $50,000 AUD mandate Level 3 Department Manager sign-off.
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 6: Regulatory Reference */}
        {activeSupplementaryTab === 'reg_reference' && (
          <div className="p-4 bg-white rounded-xl border border-[#e5e7eb] space-y-2 text-[13px]">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Optional Regulatory Reference Mapping
            </span>
            <p className="text-slate-700">
              Correlating Framework: <strong>National Credit Code / Banking Code of Practice 2026</strong>
            </p>
            <p className="text-[12px] text-slate-500">
              Note: As agreed, regulatory standards are contextual reference linkages only and are not a mandatory enforcement requirement for every internal bank policy.
            </p>
          </div>
        )}

        {/* Audit & Revision History */}
        <div className="p-5 rounded-xl border border-[#e5e7eb] bg-white space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[12px] font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-slate-500" />
              Version Control Timeline
            </h4>
            <span className="text-[11.5px] text-slate-400">
              {(detailedPolicy.versions || []).length} Recorded Revisions
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-[12.5px]">
            {(detailedPolicy.versions || []).length === 0 ? (
              <p className="py-2 text-slate-400 text-xs">Initial baseline version 1.0 active.</p>
            ) : (
              (detailedPolicy.versions || []).map((ver) => (
                <div key={ver.id || ver.version_number} className="py-2.5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 text-[11px]">
                        v{ver.version_number}
                      </span>
                      <span className="font-semibold text-slate-800">{ver.changed_by}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5 text-[12px]">{ver.change_summary}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(ver.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
