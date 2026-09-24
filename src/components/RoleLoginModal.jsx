import React from 'react';
import { X, ShieldCheck, UserCheck, Building2, Crown, ArrowRight } from 'lucide-react';
import { userRoles } from '../data/mockData';

export default function RoleLoginModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onSelectUser 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-xs animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
              <UserCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Switch User Account & Role</h3>
              <p className="text-[11px] text-slate-500">Switch between Central Library Staff Admin and Subscribed Bank Tenants</p>
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
        <div className="p-6 space-y-3 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Central Library Authority (Master Staff)
          </div>

          {/* Admin Role */}
          {userRoles.filter(u => u.type === 'admin').map((user) => {
            const isSelected = currentUser.id === user.id;
            return (
              <div
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-xs text-amber-900 shadow-2xs">
                    <Crown className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{user.name}</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                        {user.badge}
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

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-4 mb-1 pt-2 border-t border-slate-100">
            Subscribed Member Banks (Institutional Policy Tenants)
          </div>

          {/* Bank Roles */}
          {userRoles.filter(u => u.type === 'bank').map((user) => {
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
                    ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shadow-2xs">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{user.name}</span>
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                        {user.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">{user.bankName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                  </div>
                </div>

                <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Switch roles to test staff governance vs banking customer views</span>
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
