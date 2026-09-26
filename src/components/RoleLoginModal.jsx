import React from 'react';
import { X, ShieldCheck, UserCheck, Building2, Crown, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';
import { userRoles } from '../data/mockData';

export default function RoleLoginModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onSelectUser 
}) {
  if (!isOpen) return null;

  const employees = userRoles.filter(u => u.roleType === 'employee');
  const managers = userRoles.filter(u => u.roleType === 'manager');
  const admins = userRoles.filter(u => u.roleType === 'admin');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-xs animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
              <UserCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Switch User Account & Role</h3>
              <p className="text-[11px] text-slate-500">Test Employee Change Requests vs Risk Manager Sign-off & Approvals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Options */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* 1. Bank Employees (Submitters) */}
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-blue-800 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Bank Compliance Employees & Architects (Submitters)</span>
            </div>

            <div className="space-y-2">
              {employees.map((user) => {
                const isSelected = currentUser.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-xs text-blue-900 shadow-2xs">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{user.name}</span>
                          <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2 py-0.2 rounded border border-blue-200">
                            {user.bankId?.toUpperCase()} Submitter
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">{user.role}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Bank Risk Managers (Approvers) */}
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-amber-800 mb-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>Bank Risk Managers & Committee Chairs (Approvers)</span>
            </div>

            <div className="space-y-2">
              {managers.map((user) => {
                const isSelected = currentUser.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-xs text-amber-900 shadow-2xs">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{user.name}</span>
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.2 rounded border border-amber-300">
                            {user.bankId?.toUpperCase()} Approver
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">{user.role}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-amber-700' : 'text-slate-400'}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Central Master Authority */}
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-purple-800 mb-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-purple-700" />
              <span>Central Library Master Authority</span>
            </div>

            <div className="space-y-2">
              {admins.map((user) => {
                const isSelected = currentUser.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 border border-purple-300 flex items-center justify-center font-bold text-xs text-purple-900 shadow-2xs">
                        <Crown className="w-4 h-4 text-purple-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{user.name}</span>
                          <span className="text-[10px] font-bold bg-purple-100 text-purple-900 px-2 py-0.2 rounded border border-purple-300">
                            {user.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">{user.role}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-purple-700' : 'text-slate-400'}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Switch between Submitter (Employee) & Approver (Manager) to test workflows</span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
