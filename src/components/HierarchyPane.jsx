import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  ChevronUp,
  Folder, 
  FileText, 
  Database,
  ArrowLeft,
  X,
  ShieldCheck,
  Lock,
  Landmark,
  CreditCard
} from 'lucide-react';
import { bankingHierarchy } from '../data/mockData';

export default function HierarchyPane({ 
  selectedItemId, 
  onSelectItem,
  isMobileOpen,
  onCloseMobile
}) {
  const [expandedNodes, setExpandedNodes] = useState({
    'prudential-standards': true,
    'cps-234-group': true,
    'cps-230-group': false,
    'privacy-data-governance': true,
    'app-privacy-group': true,
    'financial-crime-aml': false,
    'payment-rails-gateway': false,
  });

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const getDomainIcon = (id) => {
    switch (id) {
      case 'prudential-standards': return <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />;
      case 'privacy-data-governance': return <Lock className="w-3.5 h-3.5 text-emerald-600" />;
      case 'financial-crime-aml': return <Landmark className="w-3.5 h-3.5 text-purple-600" />;
      case 'payment-rails-gateway': return <CreditCard className="w-3.5 h-3.5 text-amber-600" />;
      default: return <Database className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
        ></div>
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col h-full shadow-xl transition-transform duration-200 select-none text-xs
        md:relative md:inset-auto md:z-auto md:w-68 md:shadow-none md:translate-x-0 md:h-[calc(100vh-3.5rem)]
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="h-12 md:h-10 px-3 border-b border-slate-200 flex items-center justify-between text-slate-700 bg-slate-50/50">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Banking Regulatory Library
          </span>
          <div className="flex items-center gap-1 text-slate-400">
            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 rounded hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tree List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {bankingHierarchy.map((domain) => {
            const isDomainExpanded = expandedNodes[domain.id];
            return (
              <div key={domain.id} className="space-y-0.5">
                {/* Domain Header */}
                <div 
                  onClick={() => toggleNode(domain.id)}
                  className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer transition text-slate-800"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">
                      {isDomainExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                    {getDomainIcon(domain.id)}
                    <span className="text-[11px] font-bold tracking-wide uppercase text-slate-800 truncate">
                      {domain.label}
                    </span>
                  </div>
                </div>

                {/* Sub-Folders */}
                {isDomainExpanded && domain.children && (
                  <div className="pl-3 ml-2 border-l border-slate-200 space-y-1">
                    {domain.children.map((folder) => {
                      const isFolderExpanded = expandedNodes[folder.id];
                      return (
                        <div key={folder.id} className="space-y-0.5">
                          <div 
                            onClick={() => toggleNode(folder.id)}
                            className="flex items-center justify-between px-2 py-1 text-slate-700 hover:bg-slate-100 rounded cursor-pointer transition"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-slate-400">
                                {isFolderExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              </span>
                              <Folder className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                              <span className="text-xs font-semibold truncate">{folder.label}</span>
                            </div>
                          </div>

                          {/* Leaf Policies */}
                          {isFolderExpanded && folder.children && (
                            <div className="pl-3 ml-2 border-l border-slate-200 space-y-0.5">
                              {folder.children.map((leaf) => {
                                const isSelected = selectedItemId === leaf.id;
                                return (
                                  <div
                                    key={leaf.id}
                                    onClick={() => {
                                      onSelectItem(leaf.id);
                                      if (onCloseMobile) onCloseMobile();
                                    }}
                                    className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition text-xs ${
                                      isSelected
                                        ? 'bg-blue-50 text-blue-900 border border-blue-200 font-bold shadow-2xs'
                                        : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 truncate">
                                      <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                                      <span className="truncate">{leaf.label}</span>
                                    </div>

                                    {leaf.version && (
                                      <span className={`text-[10px] font-mono px-1 py-0.2 rounded border ${
                                        isSelected ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-slate-100 text-slate-500 border-slate-200'
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

        {/* Footer */}
        <div className="h-9 px-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
          <span className="truncate">APRA Prudential Standards</span>
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-1" />
        </div>
      </aside>
    </>
  );
}
