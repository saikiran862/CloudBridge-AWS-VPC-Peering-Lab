import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  Shield,
  Layers,
  Camera,
  AlertTriangle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Badge } from '../components/common/Badge';

interface WorkflowPageProps {
  onNavigate: (page: string) => void;
}

export const WorkflowPage: React.FC<WorkflowPageProps> = ({ onNavigate }) => {
  const { state, toggleWorkflowTask, progressPercentage } = useProject();
  const [expandedStage, setExpandedStage] = useState<number>(1);

  const getStageNavTarget = (stageId: number): string | null => {
    switch (stageId) {
      case 1:
        return 'network-setup';
      case 2:
      case 3:
        return 'network-setup';
      case 4:
        return 'security-groups';
      case 5:
        return 'ec2-instances';
      case 6:
        return 'ssh-config';
      case 7:
        return 'connectivity-tests';
      case 8:
        return 'vpc-peering';
      case 9:
        return 'route-tables';
      case 10:
        return 'connectivity-tests';
      case 11:
        return 'controlled-failure';
      case 12:
        return 'troubleshooting';
      case 13:
        return 'final-report';
      case 14:
        return 'evaluation';
      case 15:
        return 'cleanup';
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Guided Execution Workflow</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            15 Guided Laboratory Stages
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Follow the authoritative CloudBridge Cloud Labs workbook step-by-step. Each checkpoint records your actual console progress and calculates your project completion percentage.
          </p>
        </div>

        {/* Progress Display */}
        <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 min-w-[200px] text-center shrink-0">
          <span className="text-xs text-slate-400 block font-medium">Overall Lab Completion</span>
          <span className="text-3xl font-extrabold text-amber-400 block mt-0.5">{progressPercentage}%</span>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Accordion Stages List */}
      <div className="space-y-4">
        {state.workflowStages.map((stage) => {
          const isExpanded = expandedStage === stage.id;
          const completedCount = stage.tasks.filter((t) => t.completed).length;
          const totalCount = stage.tasks.length;
          const isFullyComplete = completedCount === totalCount;
          const navTarget = getStageNavTarget(stage.id);

          return (
            <div
              key={stage.id}
              className={`rounded-xl border transition-all overflow-hidden ${
                isFullyComplete
                  ? 'border-emerald-300 bg-white shadow-xs'
                  : isExpanded
                  ? 'border-amber-500 bg-white shadow-md ring-1 ring-amber-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Stage Header */}
              <div
                onClick={() => setExpandedStage(isExpanded ? 0 : stage.id)}
                className="p-5 flex items-center justify-between cursor-pointer select-none bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isFullyComplete
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-900 text-amber-400'
                    }`}
                  >
                    {isFullyComplete ? '✓' : stage.id}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h3 className="font-bold text-slate-900 text-sm">{stage.title}</h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {stage.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{stage.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 ml-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-semibold text-slate-700 block">
                      {completedCount} / {totalCount} Done
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {Math.round((completedCount / totalCount) * 100)}%
                    </span>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Stage Body */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 space-y-4">
                  {/* Task checklist */}
                  <div className="space-y-2.5">
                    {stage.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleWorkflowTask(stage.id, task.id)}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start space-x-3 ${
                          task.completed
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-semibold ${
                                task.completed
                                  ? 'text-emerald-950 line-through opacity-85'
                                  : 'text-slate-900'
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.requiredEvidenceCategory && (
                              <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center ml-2">
                                <Camera className="w-3 h-3 mr-1" />
                                {task.requiredEvidenceCategory} Evidence
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 mt-1 leading-relaxed">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stage Quick Actions */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-slate-500 text-[11px]">
                      Check off items as you perform actions in your AWS Management Console.
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onNavigate('evidence')}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium flex items-center space-x-1.5"
                      >
                        <Camera className="w-3.5 h-3.5 text-slate-500" />
                        <span>Upload Screenshot</span>
                      </button>

                      {navTarget && (
                        <button
                          onClick={() => onNavigate(navTarget)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center space-x-1.5"
                        >
                          <span>Open Dedicated Tool</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
