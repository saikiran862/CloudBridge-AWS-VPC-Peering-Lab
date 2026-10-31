import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Search,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  GitBranch,
  HelpCircle,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const TroubleshootingPage: React.FC = () => {
  const { state, updateTroubleshootingItem } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssueId, setSelectedIssueId] = useState<string>('tb-1');
  const [activeDecisionNode, setActiveDecisionNode] = useState<string>('start');

  const filteredItems = useMemo(() => {
    return state.troubleshooting.filter(
      (item) =>
        item.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.symptoms.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.possibleCauses.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [state.troubleshooting, searchTerm]);

  const activeItem = state.troubleshooting.find((t) => t.id === selectedIssueId) || state.troubleshooting[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
          <Wrench className="w-4 h-4" />
          <span>Stage 12 Diagnostic Procedures</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Troubleshooting Decision Tree & Issue Matrix
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Systematic diagnosis and remediation workflows for the 7 standard AWS VPC Peering failure modes detailed in the student workbook.
        </p>
      </div>

      {/* Interactive Decision Tree Widget */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-2.5 text-amber-400 font-bold text-sm">
          <GitBranch className="w-5 h-5" />
          <span>Interactive Connectivity Diagnostic Decision Tree</span>
        </div>
        <p className="text-xs text-slate-300">
          Where is connectivity failing? Follow the tree below to isolate the responsible networking layer:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
          <button
            onClick={() => {
              setActiveDecisionNode('bastion');
              setSelectedIssueId('tb-1');
            }}
            className={`p-3 rounded-lg border text-left transition-all ${
              activeDecisionNode === 'bastion'
                ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold block text-amber-400">Node 1: Laptop → Bastion</span>
            <span className="text-[11px] text-slate-400 block mt-1">Timeout on port 22?</span>
          </button>

          <button
            onClick={() => {
              setActiveDecisionNode('appa');
              setSelectedIssueId('tb-2');
            }}
            className={`p-3 rounded-lg border text-left transition-all ${
              activeDecisionNode === 'appa'
                ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold block text-blue-400">Node 2: Bastion → App-A</span>
            <span className="text-[11px] text-slate-400 block mt-1">Jump to 10.10.2.10 failing?</span>
          </button>

          <button
            onClick={() => {
              setActiveDecisionNode('appb');
              setSelectedIssueId('tb-3');
            }}
            className={`p-3 rounded-lg border text-left transition-all ${
              activeDecisionNode === 'appb'
                ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold block text-purple-400">Node 3: Bastion → App-B</span>
            <span className="text-[11px] text-slate-400 block mt-1">Jump across peering failing?</span>
          </button>

          <button
            onClick={() => {
              setActiveDecisionNode('ping');
              setSelectedIssueId('tb-4');
            }}
            className={`p-3 rounded-lg border text-left transition-all ${
              activeDecisionNode === 'ping'
                ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="font-bold block text-emerald-400">Node 4: App-A ↔ App-B Ping</span>
            <span className="text-[11px] text-slate-400 block mt-1">100% ICMP packet loss?</span>
          </button>
        </div>
      </div>

      {/* Search & Issue Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Issues List */}
        <div className="md:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search troubleshooting issues..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            />
          </div>

          <div className="space-y-2">
            {filteredItems.map((item) => {
              const isSelected = selectedIssueId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedIssueId(item.id)}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-500 shadow-xs ring-1 ring-amber-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.issue}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTroubleshootingItem(item.id, { resolved: !item.resolved });
                      }}
                      className="p-1 rounded text-slate-400 hover:text-emerald-600"
                    >
                      {item.resolved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1 truncate">
                    {item.symptoms[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Diagnostic Card */}
        <div className="md:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">{activeItem.issue}</h3>
              <span className="text-xs text-slate-500">Root-Cause Remediation Guide</span>
            </div>
            <button
              onClick={() => updateTroubleshootingItem(activeItem.id, { resolved: !activeItem.resolved })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                activeItem.resolved
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {activeItem.resolved ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{activeItem.resolved ? 'Marked as Resolved' : 'Mark as Resolved'}</span>
            </button>
          </div>

          {/* Symptoms */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Reported Symptoms & Error Messages:
            </span>
            <div className="space-y-1.5">
              {activeItem.symptoms.map((s, idx) => (
                <div key={idx} className="bg-rose-50 text-rose-900 font-mono text-[11px] p-2 rounded border border-rose-200">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Possible Causes */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Probable Root Causes:
            </span>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              {activeItem.possibleCauses.map((cause, idx) => (
                <li key={idx} className="leading-relaxed">
                  {cause}
                </li>
              ))}
            </ul>
          </div>

          {/* Remediation Steps */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Standard AWS Remediation Steps:
            </span>
            <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside bg-slate-50 p-4 rounded-xl border border-slate-200">
              {activeItem.remediationSteps.map((step, idx) => (
                <li key={idx} className="leading-relaxed font-medium">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Student Resolution Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Student Lab Remediation Log / Notes:
            </label>
            <textarea
              rows={2}
              value={activeItem.studentNotes}
              onChange={(e) =>
                updateTroubleshootingItem(activeItem.id, { studentNotes: e.target.value })
              }
              placeholder="Record the specific fix applied in your AWS Console..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
