import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Check,
  AlertTriangle,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const SettingsPage: React.FC = () => {
  const {
    state,
    resetToDefault,
    resetToBlank,
    exportProjectJson,
    importProjectJson,
  } = useProject();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const success = importProjectJson(content);
        if (success) {
          setImportStatus('Successfully imported project backup!');
        } else {
          setImportStatus('Error: Invalid JSON project backup format.');
        }
        setTimeout(() => setImportStatus(null), 3000);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>Application State & Data Management</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Lab Workspace Settings & Data Portability
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Export your complete laboratory configuration, evidence references, and test logs as an offline JSON snapshot, or load a completed reference project.
        </p>
      </div>

      {/* Backup and Export Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">Project Backup & Export</h3>
        <p className="text-xs text-slate-500">
          Save a complete copy of your project state to your computer. This includes your student profile, actual resource IDs, test outputs, and evidence metadata.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportProjectJson}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center space-x-2 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download Project JSON Backup</span>
          </button>

          <label className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center space-x-2 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Restore From JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium">
            {importStatus}
          </div>
        )}
      </div>

      {/* Demo Presets & Workspace Reset */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">Demo Presets & Lab Reset</h3>
        <p className="text-xs text-slate-500">
          Quickly switch between a pre-populated comprehensive project demonstration (ideal for instructor grading and viva rehearsal) and a blank workbook (for fresh student completion).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-bold text-sm text-amber-950 block">Load Reference Project</span>
              <p className="text-xs text-amber-900 mt-1">
                Loads complete, validated lab data with 100% test passes, full resource IDs, and Stage 11 controlled failure evidence.
              </p>
            </div>
            <button
              onClick={resetToDefault}
              className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Reference Demo Data</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-bold text-sm text-slate-900 block">Initialize Blank Workbook</span>
              <p className="text-xs text-slate-500 mt-1">
                Clears all actual AWS resource IDs and test outputs so a student can perform the lab from scratch.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to initialize a blank student workbook? All current data will be cleared.')) {
                  resetToBlank();
                }
              }}
              className="w-full py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Blank Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Storage and Security Architecture Info */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 space-y-3 text-xs">
        <h4 className="font-bold text-sm text-amber-400 flex items-center">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Offline-First Storage Architecture
        </h4>
        <p className="text-slate-300 leading-relaxed">
          This educational application operates completely client-side in your web browser. All state is automatically mirrored to HTML5 LocalStorage under key <code className="text-amber-400 font-mono">ewb_vpc_peering_lab_state_v2</code>. No cloud credentials are ever transmitted or requested.
        </p>
      </div>
    </div>
  );
};
