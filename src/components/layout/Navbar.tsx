import React from 'react';
import {
  Cloud,
  MapPin,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Menu,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { Badge } from '../common/Badge';

interface NavbarProps {
  onToggleSidebar?: () => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, currentPage }) => {
  const { state, progressPercentage, failedValidationChecks, exportProjectJson } = useProject();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile hamburger & Logo & Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-black text-sm">
              <Cloud className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">
                  CloudBridge: AWS VPC Peering Lab
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Cloud Edition
                </span>
              </div>
              <p className="text-[11px] text-amber-400 font-medium">
                Architect. Connect. Empower. • <span className="text-slate-400">AWS Networking Project Workbook</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick metadata & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* AWS Region Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px]">{state.profile.awsRegion}</span>
          </div>

          {/* Validation Warnings Indicator */}
          {failedValidationChecks.length > 0 ? (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="font-medium">{failedValidationChecks.length} Alert{failedValidationChecks.length > 1 ? 's' : ''}</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium">Config Valid</span>
            </div>
          )}

          {/* Overall Progress Pill */}
          <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <span className="text-slate-400 hidden sm:inline">Progress:</span>
            <span className="font-bold text-amber-400">{progressPercentage}%</span>
            <div className="w-12 bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Student Profile snippet */}
          <div className="hidden md:flex flex-col text-right text-xs">
            <span className="font-semibold text-slate-200">{state.profile.studentName || 'Student'}</span>
            <span className="text-[10px] text-slate-400">{state.profile.batch || 'Batch 2026'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
