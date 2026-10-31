import React from 'react';
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Camera,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SecurityWarning } from '../components/common/SecurityWarning';

interface CleanupPageProps {
  onNavigate: (page: string) => void;
}

export const CleanupPage: React.FC<CleanupPageProps> = ({ onNavigate }) => {
  const { state, toggleCleanupStep } = useProject();

  const completedCount = state.cleanupSteps.filter((c) => c.completed).length;
  const totalCount = state.cleanupSteps.length;
  const isAllComplete = completedCount === totalCount;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-rose-600 uppercase tracking-wider">
            <Trash2 className="w-4 h-4" />
            <span>Stage 15 Resource Teardown</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            AWS Resource Teardown & Cost Safety Checklist
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Systematic 13-step teardown procedure to eliminate running cloud resources and prevent ongoing billing charges.
          </p>
        </div>

        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-800 text-xs flex items-center space-x-3 shrink-0 self-start sm:self-auto">
          <span className="text-slate-400">Teardown Progress:</span>
          <span className="font-bold text-amber-400 text-sm">
            {completedCount} / {totalCount} Steps
          </span>
        </div>
      </div>

      {/* Prominent AWS Cost Warning */}
      <SecurityWarning
        type="cost"
        message="MANDATORY COST ADVISORY: AWS resources can incur charges. Complete cleanup immediately after saving your project screenshots and evidence. Terminate all EC2 instances first; then delete peering connections, subnets, and VPCs. This application does NOT automatically delete cloud resources; you must execute teardown manually in your AWS Management Console."
      />

      {/* 13 Cleanup Steps Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">Sequential Teardown Checklist</h3>
            <span className="text-xs text-slate-500">
              Follow this exact dependency order to avoid resource-in-use AWS errors.
            </span>
          </div>

          <button
            onClick={() => onNavigate('evidence')}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center space-x-1"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Upload Cleanup Screenshot</span>
          </button>
        </div>

        <div className="space-y-3">
          {state.cleanupSteps.map((step) => (
            <div
              key={step.stepNumber}
              onClick={() => toggleCleanupStep(step.stepNumber)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                step.completed
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
              >
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </button>

              <div className="flex-1 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-slate-400 font-bold">Step {step.stepNumber}:</span>
                    <span className={`font-bold ${step.completed ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                      {step.action}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {step.targetResource}
                  </span>
                </div>

                {step.notes && (
                  <p className="text-slate-600 text-[11px] font-mono pt-1">
                    Notes: {step.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Completion Banner */}
        {isAllComplete && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="block text-emerald-950 text-sm">All 13 Teardown Steps Verified!</strong>
              <span>
                Your AWS account is confirmed clear of laboratory compute and network resources. Check the AWS Cost and Usage Dashboard over the next 24 hours to confirm zero ongoing charges.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
